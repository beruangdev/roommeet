// ./libs/ws.js
export function wsLibs() {
    return {
        addParticipant(
            user_uuid,
            {
                uuid,
                name,
                approved,
                creator,
                video_enabled,
                audio_enabled,
                pinned,
                lastSoundTimestamp,
            }
        ) {
            return (this.participants[user_uuid] = {
                uuid,
                name,
                approved,
                creator,
                video_enabled,
                audio_enabled,
                pinned,
                lastSoundTimestamp,
            });
        },
        async addPeer(data, am_initiator) {
            const { user_uuid, name, approved, creator } = data;

            const configuration = {
                iceServers: this.iceServers,
            };
            if (!this.participants[user_uuid]) {
                this.addParticipant(user_uuid, {
                    uuid: user_uuid,
                    name,
                    approved: Boolean(
                        !room.lobby_enabled || room.creator_uuid === user_uuid
                    ),
                    creator: Boolean(room.creator_uuid === user_uuid),
                    video_enabled: room.video_enabled,
                    audio_enabled: room.audio_enabled,
                    pinned: false,
                    lastSoundTimestamp: null,
                });

                this.peers[user_uuid] = {
                    stream: null,
                    peer: null,
                }
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
                this.peers[user_uuid].stream = stream;
                document.querySelector(
                    `.small-videos .card-participant[data-user-id="${user_uuid}"] video`
                ).srcObject = stream;
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
        removePeer(user_uuid) {
            // const videoEl = document.getElementById(user_uuid);
            // const colEl = document.getElementById("col-" + user_uuid);
            // if (colEl && videoEl) {
            //     const tracks = videoEl.srcObject.getTracks();
            //     tracks.forEach(function (track) {
            //         track.stop();
            //     });
            //     videoEl.srcObject = null;
            //     videos.removeChild(colEl);
            // }
            // if (this.participants[user_uuid]) this.participants[user_uuid].peer.destroy();

            // document.querySelector(`[data-user_uuid="${user_uuid}"]`).remove();
            delete this.participants[user_uuid];
        },
    };
}
