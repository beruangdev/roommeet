import { getIceServers } from "./stunServers";

// ./libs/media-device.js
export function mediaLibs() {
    return {
        async mediaLibsInit() {
            if (navigator.connection) {
                navigator.connection.addEventListener("change", () => {
                    this.handleConnectionChange();
                });
            }
            await this.updateConstraints();
            await this.getMediaDevices(true);
            await this.mediaDevicesInit();
        },
        constraints: {},

        updateConstraints() {
            const MAX_BANDWIDTH = 12;
            const DEFAULT_DOWNLINK = 10;
            const downlink = navigator.connection
                ? navigator.connection.downlink
                : DEFAULT_DOWNLINK;
            const participants = Math.max(this.participants.length, 1);

            const availableBandwidth = Math.min(
                downlink / participants,
                MAX_BANDWIDTH
            );

            const settings = [
                // { limit: 2, video: { quality: "low", frameRate: 15, resolution: { width: 320, height: 240 }, bitrate: 300 }, audio: { quality: "low", bitrate: 64 } },
                {
                    limit: 2,
                    video: {
                        quality: "medium",
                        frameRate: 20,
                        resolution: { width: 320, height: 240 },
                        bitrate: 700,
                    },
                    audio: { quality: "high", bitrate: 128 },
                },
                {
                    limit: 5,
                    video: {
                        quality: "medium",
                        frameRate: 24,
                        resolution: { width: 640, height: 480 },
                        bitrate: 700,
                    },
                    audio: { quality: "high", bitrate: 128 },
                },
                {
                    limit: Infinity,
                    video: {
                        quality: "high",
                        frameRate: 30,
                        resolution: { width: 1280, height: 720 },
                        bitrate: 2500,
                    },
                    audio: { quality: "high", bitrate: 128 },
                },
            ];

            for (let setting of settings) {
                if (availableBandwidth < setting.limit) {
                    return (this.constraints = {
                        video: setting.video,
                        audio: setting.audio,
                    });
                }
            }
        },

        async updateConstraints2() {
            const videoConfigurations = [
                // { min: 2, width: 1920, height: 1080, frameRate: 30 },
                // { min: 1.5, width: 1280, height: 720, frameRate: 30 },
                // { min: 1, width: 640, height: 360, frameRate: 26 },
                // { min: 0.5, width: 640, height: 360, frameRate: 24 },
                // { min: 0.2, width: 480, height: 270, frameRate: 20 },
                // { min: 0, width: 320, height: 180, frameRate: 15 },
                { min: 0.5, width: 480, height: 270, frameRate: 24 },
                { min: 0.2, width: 240, height: 135, frameRate: 20 },
                { min: 0, width: 120, height: 90, frameRate: 15 },
            ];

            const downlinkMbps = navigator.connection.downlink / 8;

            if (this.my.video_enabled) {
                for (let config of videoConfigurations) {
                    if (downlinkMbps >= config.min) {
                        this.constraints.video = {
                            width: { ideal: config.width, max: config.width },
                            height: {
                                ideal: config.height,
                                max: config.height,
                            },
                            frameRate: {
                                ideal: config.frameRate,
                                max: config.frameRate,
                            },
                        };
                        break;
                    }
                }
                if (this.my.cameraDeviceId) {
                    this.constraints.video.deviceId = {
                        exact: this.my.cameraDeviceId,
                    };
                }
            } else {
                this.constraints.video = false;
            }

            if (this.my.audio_enabled) {
                this.constraints.audio = {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: { ideal: 48000 },
                    sampleSize: { ideal: 24 },
                };

                if (downlinkMbps < 0.5) {
                    this.constraints.audio.sampleRate = { ideal: 32000 };
                } else if (downlinkMbps < 0.2) {
                    // this.constraints.audio.echoCancellation = false;
                    this.constraints.audio.sampleRate = { ideal: 16000 };
                    this.constraints.audio.sampleSize = { ideal: 16 };
                }

                if (this.my.microphoneDeviceId) {
                    this.constraints.audio.deviceId = {
                        exact: this.my.microphoneDeviceId,
                    };
                }
            } else {
                this.constraints.audio = false;
            }

            console.log("UPDATE constraints : ", this.constraints);
        },

        async generateIceServers() {
            this.iceServers = await getIceServers();
        },
        ...mediaDevices(),
    };
}

export function mediaDevices() {
    return {
        async mediaDevicesInit() {},

        isValidCameraDevice(deviceId) {
            return (
                this.my.cameras?.some(
                    (device) => device.deviceId === deviceId
                ) || false
            );
        },

        isValidMicDevice(deviceId) {
            return (
                this.my.mics?.some((device) => device.deviceId === deviceId) ||
                false
            );
        },

        async shareScreen() {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia(
                    this.constraints
                );
                this.replaceStream(stream);
            } catch (error) {
                console.error("Gagal berbagi layar:", error);
                throw error;
            }
        },

        stopShareScreen() {
            if (this.my.stream) {
                this.my.stream.getVideoTracks().forEach((track) => {
                    if (track.label.includes("screen")) {
                        this.my.stream.removeTrack(track);
                        track.stop();
                    }
                });
            }
        },

        async handleConnectionChange() {
            if (this.my.video_enabled || this.my.audio_enabled) {
                await this.updateConstraints();
                this.replaceStreamWithUpdatedConstraints();
            }
        },

        async replaceStreamWithUpdatedConstraints() {
            console.warn(
                "replaceStreamWithUpdatedConstraints",
                this.constraints
            );
            const newStream = await this.getStream();
            this.replaceStream(newStream);
        },

        async selectCamera(deviceId) {
            if (!this.isValidCameraDevice(deviceId)) {
                throw new Error("Device ID kamera tidak valid");
            }
            this.my.cameraDeviceId = deviceId;
            await this.updateConstraints();
            const newStream = await this.getStream();
            this.replaceStream(newStream);
        },
        async selectMicrophone(deviceId) {
            if (!this.isValidMicDevice(deviceId)) {
                throw new Error("Device ID mikrofon tidak valid");
            }
            this.my.microphoneDeviceId = deviceId;
            await this.updateConstraints();
            const newStream = await this.getStream();
            this.replaceStream(newStream);
        },

        toggleVideo() {
            // action tombol toggle video
            this.my.video_enabled = !this.my.video_enabled;
            this.participants[user_uuid].video_enabled = this.my.video_enabled;
            this.toggleMedia("Video", this.my.video_enabled);

            this.ws.send(
                JSON.stringify({
                    type: "toggleVideo",
                    data: {
                        user_uuid: this.my.uuid,
                        video_enabled: this.my.video_enabled,
                    },
                })
            );
        },
        toggleAudio() {
            // action tombol toggle audio
            this.my.audio_enabled = !this.my.audio_enabled;
            this.participants[user_uuid].audio_enabled = this.my.audio_enabled;
            this.toggleMedia("Audio", this.my.audio_enabled);

            this.ws.send(
                JSON.stringify({
                    type: "toggleAudio",
                    data: {
                        user_uuid: this.my.uuid,
                        audio_enabled: this.my.audio_enabled,
                    },
                })
            );
        },
        async getMediaDevices(withCamerasAndMics = false) {
            // dijalankan saat page pertama kali di load
            try {
                if (!this.my.stream) {
                    this.my.stream = await this.getStream();
                }

                await this.toggleMedia("Video", this.room.video_enabled);
                await this.toggleMedia("Audio", this.room.audio_enabled);

                if (withCamerasAndMics) {
                    const devices =
                        await navigator.mediaDevices.enumerateDevices();

                    this.my.cameras = devices.filter(
                        (device) => device.kind === "videoinput"
                    );
                    this.my.mics = devices.filter(
                        (device) => device.kind === "audioinput"
                    );

                    if (this.my.cameras.length > 0) {
                        this.my.cameraDeviceId = this.my.cameras[0].deviceId;
                    } else {
                        console.warn("Tidak ada kamera yang terdeteksi");
                    }

                    if (this.my.mics.length > 0) {
                        this.my.microphoneDeviceId = this.my.mics[0].deviceId;
                    } else {
                        console.warn("Tidak ada mikrofon yang terdeteksi");
                    }
                }
            } catch (error) {
                console.error("Ada kesalahan:", error);
                throw error;
            }
        },
        async getStream() {
            try {
                if (
                    !navigator.mediaDevices ||
                    !navigator.mediaDevices.getUserMedia
                ) {
                    throw new Error(
                        "Perangkat media tidak didukung di browser ini"
                    );
                }
                const stream = await navigator.mediaDevices.getUserMedia(
                    this.constraints
                );
                // console.log("Received stream tracks:", stream.getTracks());
                return stream;
            } catch (error) {
                console.error("Gagal mengambil stream:", error);
                throw error;
            }
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
                    const tracks = newStream.getTracks();
                    tracks.forEach((track) => {
                        let sender = senders.find(
                            (s) => s.track && s.track.kind === track.kind
                        );
                        if (sender) sender.replaceTrack(track);
                        else if (
                            !senders.some(
                                (s) => s.track && s.track.id === track.id
                            )
                        ) {
                            participant.peer._pc.addTrack(
                                track,
                                this.my.stream
                            );
                        } else {
                            console.error(
                                `Sender sudah ada untuk track ${track.id}`
                            );
                        }
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
    };
}
