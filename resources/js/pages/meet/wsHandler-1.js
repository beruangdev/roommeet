import { mediaLibs } from "./libs/media-device";
import { wsLibs } from "./libs/ws";
import { getIceServers } from "./libs/stunServers";
import { moveKeyWithinObject } from "../../helpers/object";
import { obj_to_array } from "../../helpers/array";
import { uploadSpeed } from "./libs/upload-speed";

export default function wsHandler() {
    return {
        ...mediaLibs(),
        ...wsLibs(),
        uploadSpeed: 1,
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
                        // this.participants[participant.uuid].order = index;
                        const elCard = document.querySelector(
                            `.small-videos .card-participant[data-user-id="${participant.uuid}"]`
                        );
                        const elVideo = elCard.querySelector("video");
                        const stream = participant.stream;
                        elVideo.srcObject = stream;
                    }
                );
            });
        },
        orderParticipants() {
            obj_to_array(this.participants).forEach(
                (participant, index, array) => {
                    document.querySelector(
                        `.small-videos .card-participant[data-user-id="${participant.uuid}"]`
                    ).style.order =
                        this.participants[participant.uuid].order %
                        array.length;
                }
            );
        },

        makeBigParticipants() {
            const max = this.config[this.viewType].maxBigParticipants;
            if (max > 0) {
            } else {
                this.bigparticipants = {};
            }
        },
        lastTimeCheckUploadSpeed: undefined,
        async updateUploadSpeed() {
            if (this.apiUrl) {
                if (
                    !this.lastTimeCheckUploadSpeed ||
                    Date.now() - this.lastTimeCheckUploadSpeed > 1000 * 5
                ) {
                    this.lastTimeCheckUploadSpeed = Date.now();

                    const speed = await uploadSpeed(this.apiUrl);
                    this.uploadSpeed = speed / 1024;
                    console.log(`Kecepatan upload ${this.uploadSpeed} Mb/s`);
                }
            } else {
                return 1;
            }
        },
        async _joinRoom() {
            let res, data;
            const urlParams = new URLSearchParams(window.location.search);

            try {
                res = await fetch(`${location.origin}/room-join`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        "X-CSRF-TOKEN": csrf,
                    },
                    body: JSON.stringify({
                        user_name: urlParams.get("user_name"),
                        room_uuid: urlParams.get("room"),
                        password: this.room.password,
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    console.error(
                        "Error response from server:",
                        errorData || "Unknown error"
                    );
                } else {
                    data = await res.json();
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }

            return data;
        },
        async _wsInit() {
            this.updateUploadSpeed();
            await this.$nextTick();

            const data = await this._joinRoom();

            this.my = {
                ...this.my,
                ...data.participant,
            };
            this.room = {
                ...this.room,
                ...data.room,
            };

            // TODO: UBAH!
            this.participants[this.my.uuid] = {
                uuid: this.my.uuid,
                name: this.my.name,
                videoEnabled: true,
                audioEnabled: true,
                pinned: false,
                lastSoundTimestamp: null,
                stream: this.my.stream,
            };

            this.apiUrl = data.apiDomain;
            const protoWs = data.apiDomain.startsWith("https") ? "wss" : "ws";
            const domain = data.apiDomain.split("://")[1];
            this.wsUrl = `${protoWs}://${domain}`;

            this.ws = new WebSocket(this.wsUrl + "/ws/" + data.token);

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
                                "videoEnabled",
                                "soundEnabled",
                                "lobbyEnabled",
                                "password",
                                "trackParticipantTimelineEnabled",
                                "trackParticipantFaceTimelineEnabled",
                                "trackParticipantCamTimelineEnabled",
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
                } else if (type === "removePeer")
                    this.removePeer(data.user_uuid);
                else if (type === "full") alert("Room FULL");
                else if (type === "errorToken") fork.logout();
                // else if (type === "errorPassword") fork.logout();
                else if (type === "closeRoom") fork.logout();
                else if (type === "toggleVideo") {
                    const { user_uuid, videoEnabled } = data;
                    if (this.participants[user_uuid]) {
                        this.participants[user_uuid].videoEnabled =
                            videoEnabled;
                    }
                } else if (type === "toggleAudio") {
                    const { user_uuid, audioEnabled } = data;
                    if (this.participants[user_uuid]) {
                        this.participants[user_uuid].audioEnabled =
                            audioEnabled;
                    }
                    // TODO: toggle audio
                } else if (type === "chat") {
                    // TODO: chat
                }
            };
        },
        async addPeer(data, am_initiator) {
            const { user_uuid, name, approved, creator } = data;

            const configuration = {
                iceServers: this.iceServers,
            };
            if (!this.participants[user_uuid]) {
                this.participants[user_uuid] = {
                    uuid: user_uuid,
                    name: name,
                    approved: Boolean(approved),
                    creator: Boolean(creator),
                    videoEnabled: true,
                    audioEnabled: true,
                    pinned: false,
                    lastSoundTimestamp: null,
                };
            }

            this.participants[user_uuid].peer = new SimplePeer({
                initiator: am_initiator,
                stream: this.my.stream,
                config: configuration,
                debug: 3,
            });

            this.participants[user_uuid].peer.on("signal", (data) => {
                this.ws.send(
                    JSON.stringify({
                        type: "signal",
                        data: {
                            signal: data,
                            user_uuid,
                        },
                    })
                );
            });

            this.participants[user_uuid].peer.on("stream", (stream) => {
                this.participants[user_uuid].stream = stream;
            });

            this.participants[user_uuid].peer.on("error", (err) => {
                console.error("Error terjadi:", err);
            });

            this.participants[user_uuid].peer.on("close", () => {
                // Handle peer disconnection
                console.warn(`Peer ${user_uuid} disconnected.`);
                delete this.participants[user_uuid];
            });
        },
        toggleVideo() {
            // action tombol toggle video
            this.my.videoEnabled = !this.my.videoEnabled;
            this.participants[user_uuid].videoEnabled = this.my.videoEnabled
            this.toggleMedia("Video", this.my.videoEnabled);

            this.ws.send(
                JSON.stringify({
                    type: "toggleVideo",
                    data: {
                        user_uuid: this.my.uuid,
                        videoEnabled: this.my.videoEnabled,
                    },
                })
            );
        },
        toggleAudio() {
            // action tombol toggle audio
            this.my.audioEnabled = !this.my.audioEnabled;
            this.participants[user_uuid].audioEnabled = this.my.audioEnabled
            this.toggleMedia("Audio", this.my.audioEnabled);

            this.ws.send(
                JSON.stringify({
                    type: "toggleAudio",
                    data: {
                        user_uuid: this.my.uuid,
                        audioEnabled: this.my.audioEnabled,
                    },
                })
            );
        },
        async replaceStream(newStream) {
            if (this.my.stream) {
                ["Video", "Audio"].forEach((mediaType) => {
                    const oldTracks = this.my.stream[`get${mediaType}Tracks`]();
                    const newTracks = newStream[`get${mediaType}Tracks`]();
                    oldTracks.forEach((track) => {
                        this.my.stream.removeTrack(track);
                        track.stop();
                    });

                    if (newTracks.length > 0) {
                        this.my.stream.addTrack(newTracks[0]);
                    }
                });
            } else {
                this.my.stream = newStream;
            }

            // Update the stream in all the peer connections
            for (let uuid in this.participants) {
                const participant = this.participants[uuid];
                if (participant.peer) {
                    const senders = participant.peer._pc.getSenders();
                    const tracks = newStream[`getTracks`]();
                    tracks.forEach((track) => {
                        let sender = senders.find(
                            (s) => s.track.kind === track.kind
                        );
                        if (sender) sender.replaceTrack(track);
                        else
                            console.error(
                                `Tidak dapat menemukan sender untuk ${track.kind}`
                            );
                    });
                }
            }
        },
        async toggleMedia(mediaType, enable) {
            if (enable) {
                await this.updateConstraints();
                const newStream = await this.getStream();
                this.replaceStream(newStream);
            } else if (this.my.stream) {
                this.my.stream[`get${mediaType}Tracks`]().forEach((track) => {
                    track.stop();
                    this.my.stream.removeTrack(track);
                });
            }
        },
        async generateIceServers() {
            this.iceServers = await getIceServers();
        },
    };
}
