import { mediaLibs } from "./libs/media-device";
import { wsLibs } from "./libs/ws";
import { getIceServers } from "./libs/stunServers";
import { moveKeyWithinObject } from "../../helpers/object";
import { obj_to_array } from "../../helpers/array";

export default function wsHandler() {
    return {
        ...mediaLibs(),
        ...wsLibs(),
        constraints: {
            video: {
                width: { ideal: 160, max: 320 },
                height: { ideal: 90, max: 180 },
                frameRate: { ideal: 10, max: 15 },
            },
            facingMode: {
                ideal: "user",
            },
        },
        iceServers: undefined,
        ws: undefined,
        bigparticipants: {},
        peers: {},
        participants: {},
        apiUrl: undefined,
        wsUrl: undefined,
        async wsHandlerInit() {
            await this.$nextTick();
            this.peers[user_uuid] = {
                stream: null,
                peer: null,
            };

            this.addParticipant(user_uuid, {
                uuid: user_uuid,
                name: participant.name,
                approved: Boolean(
                    !room.lobby_enabled || room.creator_uuid === user_uuid
                ),
                creator: Boolean(room.creator_uuid === user_uuid),
                video_enabled: room.video_enabled,
                audio_enabled: room.audio_enabled,
                pinned: false,
                lastSoundTimestamp: null,
            });

            try {
                await this.generateIceServers();
                await this.mediaLibsInit();
                this._wsInit();
                this.watchParticipants();
            } catch (error) {
                console.error("Gagal mengambil perangkat:", error);
            }
        },
        watchParticipants() {
            this.$watch("participants", () => {
                obj_to_array(this.participants).forEach(
                    (participant, index) => {
                        this.resizeCards();
                    }
                );
            });
            // this.$watch("peers", () => {
            //     obj_to_array(this.peers).forEach((peer, index) => {
            //         document.querySelector(
            //             `.small-videos .card-participant[data-user-id="${peer.key}"] video`
            //         ).srcObject = peer.stream;
            //     });
            // });
        },

        getApiDomain() {
            const api_order = room.uuid[0];
            return `https://roommeet-${api_order}.deno.dev`;
        },
        async _joinRoom() {
            await this.$nextTick();
            const api_domain = this.getApiDomain();
            const url = `${api_domain}/api/join-or-create`;
            const data = {
                room_uuid: room.uuid,
                room_name: room.name,
                password: room.password,
                creator_uuid: room.creator_uuid,
                user_uuid: participant.uuid,
                user_name: participant.name,
                approved: true,
                is_creator: true,
                video_enabled: true,
                audio_enabled: true,
                participant_timeline_enabled: false,
                cam_timeline_enabled: false,
                face_timeline_enabled: false,
                lobby_enabled: false,
                started_at: "2023-08-30T07:51:39.000000Z",
            };

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                return response.json();
            }
        },
        async _wsInit() {
            await this.$nextTick();

            const { token } = await this._joinRoom();
            const api_domain = this.getApiDomain();

            this.peers[user_uuid].stream = this.my.stream;
            const elVideo = document.querySelector(
                `.small-videos .card-participant[data-user-id="${user_uuid}"] video`
            )
            elVideo.muted = true
            elVideo.srcObject = this.my.stream;

            this.apiUrl = api_domain;
            const protoWs = api_domain.startsWith("https") ? "wss" : "ws";
            const domain = api_domain.split("://")[1];
            this.wsUrl = `${protoWs}://${domain}`;

            this.ws = new WebSocket(this.wsUrl + "/ws/" + token);

            this.ws.onopen = async (event) => {
                console.info("WebSocket Connected:", event);
            };

            this.ws.onerror = (event) => {
                console.error("WebSocket Error:", event);
            };

            this.pendingOffer = false;
            this.ws.onmessage = async (e) => {
                const { type, data } = JSON.parse(e.data);
                if (!["signal"].includes(type)) {
                    console.info(`WS MESSAGE => ${type} : `, data);
                }

                if (type === "opening") {
                    Object.keys(data).forEach((key) => {
                        if (
                            [
                                "creator",
                                "video_enabled",
                                "audio_enabled",
                                "lobby_enabled",
                                "password",
                                "trackParticipantTimeline_enabled",
                                "trackParticipantFaceTimeline_enabled",
                                "trackParticipantCamTimeline_enabled",
                            ].includes(key)
                        ) {
                            this[key] = data[key];
                        }
                    });
                } else if (type === "initSend") {
                    // initiator bersiap untuk megirim
                    this.addPeer(data, true);
                } else if (type === "initReceive") {
                    // partiscipant yang bukan initiator bersiap untuk menerima
                    if (this.my.uuid === this.creator) {
                        await this.addPeer(this.my, false);
                    }
                    await this.addPeer(data, false);
                    this.ws.send(
                        JSON.stringify({
                            type: "initSend",
                            data,
                        })
                    );
                } else if (type === "signal") {
                    if (
                        this.participants[data.user_uuid].peer &&
                        this.participants[data.user_uuid].peer
                            .signalingState !== "stable"
                    ) {
                        this.participants[data.user_uuid].peer.signal(
                            data.signal
                        );
                    }
                } else if (type === "userStatus") {
                    // TODO: update user status
                    if (data.status === "left") {
                        this.removePeer(data.user_uuid);
                    } else {
                        this.participants[data.user_uuid].status = data.status;
                        this.my.status = data.status;
                    }
                } else if (type === "removePeer")
                    this.removePeer(data.user_uuid);
                else if (type === "full") alert("Room FULL");
                else if (type === "errorToken") fork.logout();
                // else if (type === "errorPassword") fork.logout();
                else if (type === "closeRoom") fork.logout();
                else if (type === "toggleVideo") {
                    const { user_uuid, video_enabled } = data;
                    this.participants[user_uuid].video_enabled = video_enabled;
                    // this.my.video_enabled = video_enabled;
                    document
                        .querySelectorAll(`[data-user-id="${user_uuid}"]`)
                        .forEach((card) => {
                            card.querySelector("video").style.display =
                                video_enabled ? "block" : "none";
                        });
                } else if (type === "toggleAudio") {
                    const { user_uuid, audio_enabled } = data;
                    this.participants[user_uuid].audio_enabled = audio_enabled;
                    // this.my.audio_enabled = audio_enabled;
                } else if (type === "chat") {
                    // TODO: chat
                }
            };
        },
    };
}
