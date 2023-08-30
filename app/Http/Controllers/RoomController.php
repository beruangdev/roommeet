<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public $api_domain = "http://localhost:3000";
    public $api_domain = "https://roommeet-[api-order].deno.dev";
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */

    private function getNextApiOrder()
    {
        $apiOrder = Cache::increment("api-order", 1) % 3;
        return $apiOrder === 0 ? 3 : $apiOrder;
    }

    private function validateRequest(Request $request)
    {
        $rules = [
            'room_name' => 'required|string|max:255',
            'user_name' => 'required|string|max:255',
            'password' => 'sometimes|string|max:255',
            'video_enabled' => 'sometimes|boolean',
            'audio_enabled' => 'sometimes|boolean',
            'participant_timeline_enabled' => 'sometimes|boolean',
            'cam_timeline_enabled' => 'sometimes|boolean',
            'face_timeline_enabled' => 'sometimes|boolean',
            'lobby_enabled' => 'sometimes|boolean',
            'started_at' => 'sometimes|date'
        ];

        return $request->validate($rules);
    }


    public function createRoom(Request $request, $room_uuid, $participant_uuid)
    {
        return Room::create([
            "uuid" => $room_uuid,
            "name" => $request->room_name,
            "password" => $request->password ?? null,
            "creator_uuid" => $participant_uuid,
            "video_enabled" => boolval($request->video_enabled),
            "audio_enabled" => boolval($request->audio_enabled),
            "participant_timeline_enabled" => boolval($request->participant_timeline_enabled),
            "cam_timeline_enabled" => boolval($request->cam_timeline_enabled),
            "face_timeline_enabled" => boolval($request->face_timeline_enabled),
            "lobby_enabled" => boolval($request->lobby_enabled),
            "timelines" => null, // json array default null
            "cam_timelines" => null, // json array default null
            "face_timelines" => null, // json array default null
            "started_at" => $request->started_at ?? now(), // timestamp
            "ended_at" => null // timestamp
        ]);
    }

    public function create(Request $request)
    {
        // $this->validateRequest($request);
        DB::beginTransaction();
        try {
            $user = auth()->user();

            $apiOrder = $this->getNextApiOrder();
            $room_uuid = $apiOrder . explode("-", Str::uuid())[0];
            $user_name = $request->user_name;
            $participant_uuid = $user ? $user->id : $this->getOrCreateParticipantUuidFromCookie();

            $room = $this->createRoom($request, $room_uuid, $participant_uuid);

            $participant = $this->getOrCreateParticipant($request, $room, $user, $user_name);
            DB::commit();

            $input = ["room" => $room_uuid];
            if ($room->password) {
                $input["password"] = $room->password;
            }
            $redirect = route("room.join", $input);
            return response()->json(compact("redirect", "room", "participant"));
        } catch (\Illuminate\Http\Client\RequestException $e) {
            DB::rollBack();
            return $this->generateErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function join(Request $request)
    {
        DB::beginTransaction();
        try {
            $room_uuid = $request->input("room");
            $password = $request->input("password", null);
            $user_name = $request->input("name", null);
            $user = auth()->user();

            $room = Room::where('uuid', $room_uuid)->whereNull("ended_at")->orderBy('id', 'DESC')->first();

            if (!$room) {
                return response()->json(["error" => "Room not found"], 404);
            }

            if ($room->password !== $password) {
                return redirect()->back()->with('error', 'Email atau password salah.');
            }

            $participant = $this->getOrCreateParticipant($request, $room, $user, $user_name);
            // [$api_domain, $response] = $this->callJoinApi($room, $participant);
            // dd(compact("api_domain", "response"));
            // $token = $response["token"];

            DB::commit();
            return view("meet.meet", compact("participant", "room"));
        } catch (\Illuminate\Http\Client\RequestException $e) {
            DB::rollBack();
            return $this->generateErrorResponse($e);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function callJoinApi($room, $participant)
    {
        $payload = [
            'room_uuid' => $room->uuid,
            'room_name' => $room->name,
            'user_uuid' => $participant->uuid,
            'user_name' => $participant->name,
            'password' => $room->password,
            'approved' => $room->approved,
            'creator_uuid' => $room->creator_uuid,
            'is_creator' => $room->creator_uuid === $participant->uuid,
            'video_enabled' => $room->video_enabled,
            'audio_enabled' => $room->audio_enabled,
            'participant_timeline_enabled' => $room->participant_timeline_enabled,
            'cam_timeline_enabled' => $room->cam_timeline_enabled,
            'face_timeline_enabled' => $room->face_timeline_enabled,
            'lobby_enabled' => $room->lobby_enabled,
            'started_at' => $room->started_at,
        ];

        $api_order = intval($room->uuid[0]);
        $endpoint = "join-or-create";
        if (str_contains($this->api_domain, "localhost")) {
            $api_domain = $this->api_domain;
            $response = Http::post("{$this->api_domain}/api/$endpoint", $payload)->throw();
        } else {
            $api_domain = str_replace("[api-order]", $api_order, $this->api_domain);
            $response = Http::post("$api_domain/api/$endpoint", $payload)->throw();
        }
        $response = $response->json();
        return [$api_domain, $response];
    }


    private function getOrCreateParticipant(Request $request, Room $room, User | null $user, $user_name)
    {
        $participant_uuid = $user ? $user->id : $this->getOrCreateParticipantUuidFromCookie();
        $participant = Participant::where('uuid', $participant_uuid)->where('room_id', $room->id)->orderBy('id', 'DESC')->first();
        if (!$participant) {
            $participant = new Participant();
            $participant->uuid = $participant_uuid;
            $participant->room_id = $room->id;
            $participant->user_id = $user ? $user->id : null;
            $participant->status = $room->lobby_enabled ? "in_lobby" : "in_room";
            $participant->approved = $room->lobby_enabled ? false : true;
            $participant->is_creator = boolval($room->creator_uuid == $participant_uuid);
        }
        if ($user_name) {
            $participant->name = $user_name ?? "Anonymous";
        }
        $participant->save();

        return $participant;
    }

    private function generateErrorResponse($exception)
    {
        $errorMessage = $exception->response->body();
        $errorCode = $exception->response->status();

        return response()->json(['error' => $errorMessage, "code" => $errorCode], $errorCode);
    }



    private function getOrCreateParticipantUuidFromCookie()
    {
        $cookieName = "uuid";
        $cookieLifetime = 5 * 365 * 24 * 60 * 60; // 5 years in seconds
        $uuid = $this->getDecryptedUuidFromCookie($cookieName);
        if (!$uuid) {
            $uuid = Str::uuid();
            $encryptedUuid = Crypt::encryptString($uuid);
            setcookie($cookieName, $encryptedUuid, time() + $cookieLifetime, "/", null, false, true);
        }
        return $uuid;
    }

    private function getDecryptedUuidFromCookie($cookieName)
    {
        if (!isset($_COOKIE[$cookieName])) {
            return null;
        }
        try {
            return Crypt::decryptString($_COOKIE[$cookieName]);
        } catch (DecryptException $e) {
            return null;
        }
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoomRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($room_uuid)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoomRequest $request, Room $room)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        //
    }
}
