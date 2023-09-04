import { mediaLibs } from "./libs/media-device";
import { wsLibs } from "./libs/ws";
import { getIceServers } from "./libs/stunServers";
import { moveKeyWithinObject } from "../../helpers/object";
import { obj_to_array } from "../../helpers/array";

export default function wsHandler() {
    const internalLoopTime = 50;
    let internalLoopCounter = 0;
    function formatSpeed(speedInMB) {
        if (speedInMB < 1) {
            return `${(speedInMB * 1024).toFixed(2)} KB/s`;
        } else {
            return `${speedInMB.toFixed(2)} MB/s`;
        }
    }

    return {
        internalLoop() {
            if (internalLoopCounter % 500 === 0) {
                this.sendUpdateParticipantData();
            }

            if (internalLoopCounter % 1000 === 0) {
                this.updateInternetSpeed();
                internalLoopCounter = 0;
            }

            setTimeout(() => {
                internalLoopCounter += internalLoopTime;
                requestAnimationFrame(() => this.internalLoop());
            }, internalLoopTime);
        },
        updateInternetSpeed() {
            const downloads = [];
            const uploads = [];
            const values = Object.values(this.participants);
            for (let index = 0; index < values.length; index++) {
                const p = values[index];
                if (this.my.uuid !== p.uuid) {
                    downloads.push(p.internet.download);
                    uploads.push(p.internet.upload);
                }
            }
            let downloads_sum = 0
            let uploads_sum = 0
            for (let index = 0; index < downloads.length; index++) {
                downloads_sum += downloads[index]
                uploads_sum += uploads[index]
            }
            this.my.internet.download = formatSpeed(downloads_sum)
            this.my.internet.upload = formatSpeed(uploads_sum)
        },
        ...mediaLibs(),
        ...wsLibs(),

        async wsHandlerInit() {
            await this.$nextTick();
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
                this.wsLibsInit();
                this.watchParticipants();

                this.internalLoop();
            } catch (error) {
                console.error("Gagal mengambil perangkat:", error);
            }
        },

        sendUpdateParticipantData() {
            const participantsValues = Object.values(this.participants);
            for (let i = 0; i < participantsValues.length; i++) {
                const participant = participantsValues[i];
                const peer = participant?.peer;
                if (
                    peer &&
                    peer._channel &&
                    peer._channel.readyState === "open"
                ) {
                    peer.send(
                        JSON.stringify({
                            type: "updateParticipantData",
                            sender_uuid: this.my.uuid,
                            data: {
                                lastTimeAudioWasHeard:
                                    this.my.lastTimeAudioWasHeard,
                            },
                        })
                    );
                }
            }
        },

        cardClickHandler(participant) {},
        toggleSendMedia(uuid, can_receive) {
            const peerConnection = this.participants[uuid].peer._pc;
            const transceivers = peerConnection.getTransceivers();
            for (const transceiver of transceivers) {
                if (transceiver.receiver && transceiver.receiver.track) {
                    const localTrack = this.my.stream
                        .getTracks()
                        .find(
                            (track) =>
                                track.kind === transceiver.receiver.track.kind
                        );
                    if (!can_receive) {
                        transceiver.sender.replaceTrack(null);
                    } else {
                        transceiver.sender.replaceTrack(localTrack);
                    }
                }
            }
        },

        watchParticipants() {
            this.$watch("participants", () => {
                this.resizeCards();
            });
        },

        getApiDomain() {
            if(location.host.startsWith("localhost")){
                return `http://localhost:3000`;
            }
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
                approved: room.creator_uuid === participant.uuid,
                is_creator: room.creator_uuid === participant.uuid,
                video_enabled: room.video_enabled,
                audio_enabled: room.audio_enabled,
                participant_timeline_enabled: room.participant_timeline_enabled,
                cam_timeline_enabled: room.cam_timeline_enabled,
                face_timeline_enabled: room.face_timeline_enabled,
                lobby_enabled: room.lobby_enabled,
                started_at: new Date().toISOString(),
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

            const response = await this._joinRoom();
            this.token = response.token;

            const elVideo = document.querySelector(
                `.small-videos .card-participant[data-user-id="${user_uuid}"] video`
            );
            elVideo.muted = true;
            elVideo.srcObject = this.my.stream;

            this.initWebsocket();
        },

        initWebsocket() {
            const api_domain = this.getApiDomain();

            this.apiUrl = api_domain;
            const protoWs = api_domain.startsWith("https") ? "wss" : "ws";
            const domain = api_domain.split("://")[1];
            this.wsUrl = `${protoWs}://${domain}`;
            this.ws = new WebSocket(this.wsUrl + "/ws/" + this.token);

            this.ws.onopen = this.wsOpenHandler.bind(this);
            this.ws.onerror = this.wsErrorHandler.bind(this);
            this.ws.onmessage = this.wsMessageHandler.bind(this);
            this.ws.onclose = this.initWebsocket.bind(this);
        },
        async wsOpenHandler(event) {
            console.info("WebSocket Connected:", event);
        },
        async wsErrorHandler(event) {
            console.error("WebSocket Error:", event);
        },
        async wsMessageHandler(event) {
            const { type, data } = JSON.parse(event.data);
            if (!["signal"].includes(type)) {
                console.info(`WS MESSAGE => ${type} : `, data);
            }

            if (type === "opening") {
                this.participants[data.myy.uuid].video_enabled =
                    data.myy.video_enabled;
                this.participants[data.myy.uuid].audio_enabled =
                    data.myy.audio_enabled;
                this.participants[data.myy.uuid].approved = data.myy.approved;
                this.participants[data.myy.uuid].name = data.myy.name;
                this.participants[data.myy.uuid].status = data.myy.status;
                this.participants[data.myy.uuid].is_creator =
                    data.myy.is_creator;

                this.my.video_enabled = data.myy.video_enabled;
                this.my.audio_enabled = data.myy.audio_enabled;

                this.updateVideo();
                this.updateAudio();

                const keys = Object.keys(data);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    if (
                        [
                            "creator",
                            "video_enabled",
                            "audio_enabled",
                            "lobby_enabled",
                            "password",
                            "myy",
                        ].includes(key)
                    ) {
                        this[key] = data[key];
                    }
                }
            } else if (type === "initSend") {
                // initiator bersiap untuk megirim
                this.addPeer(data, true);
            } else if (type === "initReceive") {
                // partiscipant yang bukan initiator bersiap untuk menerima
                if (this.my.uuid === this.room.creator_uuid) {
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
                    this.participants[data.user_uuid].peer.signalingState !==
                        "stable"
                ) {
                    this.participants[data.user_uuid].peer.signal(data.signal);
                    this.participants[data.user_uuid].signal = data.signal;
                }
            } else if (type === "userStatus") {
                // TODO: update user status di database
                if (data.status === "left") {
                    this.removePeer(data.user_uuid);
                } else {
                    this.participants[data.user_uuid].status = data.status;
                    this.my.status = data.status;
                }
            } else if (type === "removePeer") this.removePeer(data.user_uuid);
            else if (type === "full") alert("Room FULL");
            else if (type === "errorToken") this.logout();
            else if (type === "errorPassword") this.logout();
            else if (type === "closeRoom") this.logout();
            else if (type === "toggleVideo") {
                const { user_uuid, video_enabled } = data;
                this.participants[user_uuid].video_enabled =
                    Boolean(video_enabled);
                const cards = document.querySelectorAll(
                    `[data-user-id="${user_uuid}"]`
                );
                for (let i = 0; i < cards.length; i++) {
                    const card = cards[i];
                    card.querySelector("video").style.display = video_enabled
                        ? "block"
                        : "none";
                }
            } else if (type === "toggleAudio") {
                const { user_uuid, audio_enabled } = data;
                this.participants[user_uuid].audio_enabled =
                    Boolean(audio_enabled);
            } else if (type === "requestResumePeerStream") {
                const { sender_uuid, receiver_uuid } = data;
                this.toggleSendMedia(receiver_uuid, true);
            } else if (type === "requestPausePeerStream") {
                const { sender_uuid, receiver_uuid } = data;
                const is_in_big = this.big_participants.filter(
                    (p) => p === sender_uuid
                );
                if (is_in_big.length === 0) {
                    this.toggleSendMedia(receiver_uuid, false);
                }
            } else if (type === "chat") {
                // TODO: chat
            }
        },
    };
}
