# RoomMeet API Documentation

This documentation provides an overview of the RoomMeet API, with a focus on the `create` and `join` methods.

## Methods

### `create(Request $request) "/room-create" POST`

#### Description:
This method is responsible for creating a new room and participant. It performs the following steps:
1. Validates the incoming request.
2. Determines the next API order.
3. Stores the room and participant entities in the database.
4. Calls an external creation API.
5. Returns a success or error response.

#### Parameters:
- `$request`: The incoming HTTP request.

#### Usage:
To create a room, make a POST request with the following parameters:
- `room_name`: Name of the room (required).
- `name`: Name of the participant (required).
- `password`: Password for the room (optional).
- `room_id`: ID of the room (required).
- `videoEnabled`: Enable video (optional, boolean).
- `audioEnabled`: Enable audio (optional, boolean).
- `trackParticipantTimelineEnabled`: Track participant timeline (optional, boolean).
- `trackParticipantCamTimelineEnabled`: Track participant camera timeline (optional, boolean).
- `trackParticipantFaceTimelineEnabled`: Track participant face timeline (optional, boolean).
- `lobbyEnabled`: Enable lobby (optional, boolean).

### `join(Request $request) "/room-join" GET`

#### Description:
This method allows a participant to join an existing room. It performs the following steps:
1. Finds the room based on the provided room ID.
2. Finds or creates a participant.
3. Calls an external join API.
4. Updates the participant's information.
5. Returns a success or error response.

#### Parameters:
- `$request`: The incoming HTTP request.

#### Usage:
To join a room, make a POST request with the following parameters:
- `room_id`: ID of the room (required).
- `name`: Name of the participant (required).
- `password`: Password for the room (if set).

## Helper Methods

The API also contains several helper methods that assist in the functionality of the main methods. These include:
- `validateRequest($request)`: Validates the incoming request based on predefined rules.
- `getNextApiOrder()`: Determines the next API order.
- `storeEntities($request, $apiOrder)`: Stores the room and participant entities in the database.
- `createRoom($request, $room_id, $apiOrder)`: Creates a new room entity.
- `createParticipant($request, $room)`: Creates a new participant entity.
- `getOrCreateParticipantUuidFromCookie()`: Retrieves the participant UUID from a cookie or creates one if it doesn't exist.
- `callCreationApi($apiOrder, $room, $participant)`: Calls an external creation API.
- `generateSuccessResponse($response)`: Generates a success response.
- `generateErrorResponse($exception)`: Generates an error response.
- `findRoom($roomId)`: Finds a room based on its ID.
- `findOrCreateParticipant($room, $request)`: Finds or creates a participant.
- `getParticipantUuidFromCookie()`: Retrieves the participant UUID from a cookie.
- `callJoinApi($apiOrder, $room, $participant, $password)`: Calls an external join API.

## Error Handling

Both the `create` and `join` methods have built-in error handling mechanisms. If any exception occurs during the execution, the methods will return an appropriate error response.

