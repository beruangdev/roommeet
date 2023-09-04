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
                    for (let i = 0; i < entries.length; i++) {
                        const entry = entries[i];
                        const sender_uuid =
                            entry.target.getAttribute("data-user-id");
                        if (entry.isIntersecting) {
                            this.requestResumePeerStream(sender_uuid);
                        } else {
                            this.requestPausePeerStream(sender_uuid);
                        }
                    }
                },
                {
                    root: null,
                    rootMargin: "0px",
                    threshold: 0.1,
                }
            );
        },
        getObserverTracks(sender_uuid) {
            return this.participants[sender_uuid].peer.streams[0].getTracks();
        },
        requestResumePeerStream(sender_uuid) {
            this.ws.send(
                JSON.stringify({
                    type: "requestResumePeerStream",
                    data: {
                        sender_uuid: sender_uuid,
                        receiver_uuid: user_uuid,
                    },
                })
            );
        },
        requestPausePeerStream(sender_uuid) {
            if (!this.participants[sender_uuid]) return false;
            console.log(
                "requestPausePeerStream",
                this.participants[user_uuid].name,
                this.participants[sender_uuid].name
            );
            this.ws.send(
                JSON.stringify({
                    type: "requestPausePeerStream",
                    data: {
                        sender_uuid,
                        receiver_uuid: user_uuid,
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
                video_enabled,
                audio_enabled,
                pinned,
                lastSoundTimestamp,
                status,
                is_creator,
            }
        ) {
            return (this.participants[user_uuid] = {
                uuid,
                name,
                approved,
                video_enabled,
                audio_enabled,
                pinned,
                lastSoundTimestamp,
                status,
                is_creator,
                internet: {
                    download: 0,
                    upload: 0,
                }
            });
        },
        async addPeer(data, am_initiator) {
            const { user_uuid, name } = data;
            console.log("🚀 addPeer ~ data:", data);

            const configuration = {
                iceServers: this.iceServers,
            };

            if (!this.participants[user_uuid]) {
                this.addParticipant(user_uuid, {
                    uuid: user_uuid,
                    name: data.name,
                    approved: data.approved,
                    video_enabled: data.video_enabled,
                    audio_enabled: data.audio_enabled,
                    pinned: false,
                    lastSoundTimestamp: null,
                    status: data.status,
                    is_creator: data.is_creator,
                });
            }

            this.participants[user_uuid].peer = new SimplePeer({
                initiator: am_initiator,
                stream: this.my.stream,
                config: configuration,
                debug: 3,
            });

            const peer = this.participants[user_uuid].peer;
            peer.on("connect", () => {
                let previousBytesReceived = 0;
                let previousBytesSent = 0;

                setInterval(() => {
                    const peer = this.participants[user_uuid]?.peer;
                    if (peer) {
                        peer.getStats((_, stats) => {
                            let currentBytesReceived = 0;
                            let currentBytesSent = 0;

                            for (let i = 0; i < stats.length; i++) {
                                const report = stats[i];
                                if (
                                    report.type === "inbound-rtp" &&
                                    report.bytesReceived
                                ) {
                                    currentBytesReceived += report.bytesReceived;
                                } else if (
                                    report.type === "outbound-rtp" &&
                                    report.bytesSent
                                ) {
                                    currentBytesSent += report.bytesSent;
                                }
                            }
                            

                            const downloadSpeed =
                                (currentBytesReceived - previousBytesReceived) /
                                (1024 * 1024);
                            const uploadSpeed =
                                (currentBytesSent - previousBytesSent) /
                                (1024 * 1024);

                            this.participants[user_uuid].internet.download =
                                downloadSpeed;
                            this.participants[user_uuid].internet.upload =
                                uploadSpeed;

                            previousBytesReceived = currentBytesReceived;
                            previousBytesSent = currentBytesSent;
                        });
                    }
                }, 1000);
            });

            peer.on("signal", async (signal) => {
                this.ws.send(
                    JSON.stringify({
                        type: "signal",
                        data: {
                            signal: signal,
                            user_uuid,
                        },
                    })
                );
            });

            peer.on("negotiate", () => {
                console.log("Negosiasi ulang diperlukan.");
            });

            peer.on("data", (receivedData) => {
                const { type, sender_uuid, data } = JSON.parse(receivedData);
                if (type === "updateParticipantData") {
                    const keys = Object.keys(data);
                    for (let index = 0; index < keys.length; index++) {
                        const key = keys[index];
                        this.participants[sender_uuid][key] = data[key];
                    }
                }
            });

            peer.on("stream", (stream) => {
                this.participants[user_uuid].stream = stream;
                const elCard = document.querySelector(
                    `.small-videos .card-participant[data-user-id="${user_uuid}"]`
                );
                const elVideo = elCard.querySelector(`video`);
                elVideo.srcObject = stream;
                this.observer.observe(elCard);
            });

            peer.on("error", (err) => {
                console.error("Error terjadi:", err);
            });

            peer.on("close", () => {
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
        logout() {},
    };
}
