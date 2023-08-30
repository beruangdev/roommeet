// ./libs/ws.js
export function wsLibs() {
    return {
        observer: undefined,
        wsLibsInit() {
            this.observer = this._observerResumeOrPause();
        },
        _observerResumeOrPause() {
            return new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        const participant_uuid =
                            entry.target.getAttribute("data-user-id");
                        if (entry.isIntersecting) {
                            this.resumePeerStream(participant_uuid);
                        } else {
                            this.pausePeerStream(participant_uuid);
                        }
                    });
                },
                {
                    root: null,
                    rootMargin: "0px",
                    threshold: 0.1,
                }
            );
        },
        getObserverTracks(participant_uuid) {
            return this.participants[
                participant_uuid
            ].peer.streams[0].getTracks();
        },
        resumePeerStream(participant_uuid) {
            console.log("resumePeerStream", participant_uuid);

            // if (this.participants[participant_uuid].peer) {
            //     const tracks = this.getObserverTracks(participant_uuid);
            //     console.log("🚀 tracks:", tracks)
            //     tracks.forEach((track) => (track.enabled = true));
            // }
            // TODO: ketika element video participant lain tidak terlihat di layar kita maka minta si pengirim untuk menghentikan pengiriman ke kita
            this.ws.send(
                JSON.stringify({
                    type: "resumePeerStream",
                    data: {
                        user_uuid: participant_uuid,
                    },
                })
            );
        },
        pausePeerStream(participant_uuid) {
            if (!this.participants[participant_uuid]) return false;
            console.log(
                "pausePeerStream",
                this.participants[user_uuid].name,
                this.participants[participant_uuid].name
            );
            // if (this.participants[participant_uuid]) {
            //     const tracks = this.getObserverTracks(participant_uuid);
            //     console.log("🚀 tracks:", tracks)
            //     tracks.forEach((track) => (track.enabled = false));
            // }

            // TODO: ketika element video participant lain terlihat di layar kita maka minta si pengirim untuk melanjutkan pengiriman ke kita
            this.ws.send(
                JSON.stringify({
                    type: "pausePeerStream",
                    data: {
                        user_uuid: participant_uuid,
                    },
                })
            );
        },
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
            const { user_uuid, name } = data;
            console.log("🚀 ~ file: ws.js:99 ~ addPeer ~ data:", data);

            const configuration = {
                iceServers: this.iceServers,
            };
            this.my.video_enabled = data.video_enabled;
            this.my.audio_enabled = data.audio_enabled;
            this.my.approved = data.approved;
            this.my.name = data.name;
            this.my.status = data.status;
            this.my.is_creator = data.is_creator;

 
            
            if (!this.participants[user_uuid]) {
                this.addParticipant(user_uuid, {
                    uuid: user_uuid,
                    name,
                    approved: this.my.approved,
                    creator: Boolean(room.creator_uuid === user_uuid),
                    video_enabled: this.my.video_enabled,
                    audio_enabled: this.my.audio_enabled,
                    pinned: false,
                    lastSoundTimestamp: null,
                    status: this.my.status,
                    is_creator: this.my.is_creator,
                });

                this.peers[user_uuid] = {
                    stream: null,
                    peer: null,
                };
            }

            this.participants[user_uuid].video_enabled = data.video_enabled;
            this.participants[user_uuid].audio_enabled = data.audio_enabled;
            this.participants[user_uuid].approved = data.approved;
            this.participants[user_uuid].name = data.name;
            this.participants[user_uuid].status = data.status;
            this.participants[user_uuid].is_creator = data.is_creator;

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
                const elCard = document.querySelector(
                    `.small-videos .card-participant[data-user-id="${user_uuid}"]`
                );
                const elVideo = elCard.querySelector(`video`);
                elVideo.srcObject = stream;
                this.observer.observe(elCard);
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
            console.log("removePeer", user_uuid);

            const elCard = document.querySelector(
                `.small-videos .card-participant[data-user-id="${user_uuid}"]`
            );
            if (elCard) this.observer.unobserve(elCard);
            if (this.participants?.[user_uuid]?.peer)
                this.participants[user_uuid].peer.destroy();
            delete this.participants?.[user_uuid];
        },
    };
}
