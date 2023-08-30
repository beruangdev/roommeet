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

            const participants = Math.max(
                Object.keys(this.participants).length,
                1
            );

            const availableBandwidth = Math.min(
                downlink / participants,
                MAX_BANDWIDTH
            );

            const settings = [
                {
                    limit: 1000,
                    video: {
                        quality: "high",
                        frameRate: 30,
                        resolution: { width: 1280, height: 720 },
                        bitrate: 2500,
                        // aspectRatio: 1 / 1,
                    },
                    audio: { quality: "high", bitrate: 128 },
                },
                {
                    limit: 5,
                    video: {
                        quality: "high",
                        frameRate: 24,
                        resolution: { width: 640, height: 480 },
                        bitrate: 700,
                        // aspectRatio: 1 / 1,
                    },
                    audio: { quality: "high", bitrate: 128 },
                },
                {
                    limit: 2,
                    video: {
                        quality: "low",
                        frameRate: 20,
                        resolution: { width: 320, height: 320 },
                        bitrate: 700,
                        // aspectRatio: 1 / 1,
                    },
                    audio: { quality: "high", bitrate: 128 },
                },
                {
                    limit: 1.5,
                    video: {
                        quality: "low",
                        frameRate: 15,
                        resolution: { width: 240, height: 240 },
                        bitrate: 500,
                        // aspectRatio: 1 / 1,
                    },
                    audio: { quality: "medium", bitrate: 64 },
                },
                {
                    limit: 1,
                    video: {
                        quality: "low",
                        frameRate: 15,
                        resolution: { width: 240, height: 240 },
                        bitrate: 400,
                        // aspectRatio: 1 / 1,
                    },
                    audio: { quality: "low", bitrate: 48 },
                },
                {
                    limit: 0.75,
                    video: {
                        quality: "veryLow",
                        frameRate: 10,
                        resolution: { width: 180, height: 180 },
                        bitrate: 300,
                        // aspectRatio: 1 / 1,
                    },
                    audio: { quality: "low", bitrate: 36 },
                },
                {
                    limit: 0.5,
                    video: {
                        quality: "veryLow",
                        frameRate: 10,
                        resolution: { width: 160, height: 160 },
                        bitrate: 200,
                        // aspectRatio: 1 / 1,
                    },
                    audio: { quality: "veryLow", bitrate: 32 },
                },
                {
                    limit: 0.3,
                    video: {
                        quality: "minimal",
                        frameRate: 7,
                        resolution: { width: 120, height: 120 },
                        bitrate: 100,
                        // aspectRatio: 1 / 1,
                    },
                    audio: { quality: "veryLow", bitrate: 24 },
                },
                {
                    limit: 0.2,
                    video: {
                        quality: "minimal",
                        frameRate: 5,
                        resolution: { width: 90, height: 90 },
                        bitrate: 80,
                        // aspectRatio: 1 / 1,
                    },
                    audio: { quality: "minimal", bitrate: 16 },
                },
            ];

            for (let setting of settings) {
                if (availableBandwidth < setting.limit) {
                    this.constraints = {
                        video: setting.video,
                        audio: {
                            latency: 0,
                            channelCount: { ideal: 1 },
                            quality: "high",
                            bitrate: 128,
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true,
                            sampleRate: { ideal: 48000 },
                            sampleSize: { ideal: 24 },
                        },
                    };
                    break; // Keluar dari loop setelah menemukan setting yang sesuai
                }
            }

            // Jika tidak ada setting yang sesuai, gunakan pengaturan default
            if (!this.constraints) {
                this.constraints = {
                    video: settings[settings.length - 1].video,
                    audio: { quality: "high", bitrate: 128 },
                };
            }

            console.log("Available bandwidth:", availableBandwidth);
            console.log(
                "UPDATE constraints :",
                JSON.parse(JSON.stringify(this.constraints))
            );
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
                const screenStream =
                    await navigator.mediaDevices.getDisplayMedia(
                        this.constraints
                    );

                this.my.screenStream = screenStream;
                this.replaceStream(screenStream);
                this.my.onShareScreen = true;
            } catch (error) {
                console.error("Gagal berbagi layar:", error);
            }
        },

        async stopShareScreen() {
            await this.toggleMedia("Video", this.my.video_enabled);
            await this.toggleMedia("Audio", this.my.audio_enabled);
            this.my.onShareScreen = false;
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
                console.error(`Device ID kamera tidak valid : ${deviceId}`);
            }
            this.my.cameraDeviceId = deviceId;
            await this.updateConstraints();
            const newStream = await this.getStream();
            this.replaceStream(newStream);
        },
        async selectMicrophone(deviceId) {
            if (!this.isValidMicDevice(deviceId)) {
                console.error(`Device ID mikrofon tidak valid : ${deviceId}`);
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

                await this.toggleMedia("Video", this.my.video_enabled);
                await this.toggleMedia("Audio", this.my.audio_enabled);

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
                console.error("Ada kesalahan di getMediaDevices() : ", error);
            }
        },
        async getStream() {
            try {
                if (
                    !navigator.mediaDevices ||
                    !navigator.mediaDevices.getUserMedia
                ) {
                    console.error("Perangkat media tidak didukung");
                }
                const stream = await navigator.mediaDevices.getUserMedia(
                    this.constraints
                );
                // console.log("Received stream tracks:", stream.getTracks());
                return stream;
            } catch (error) {
                console.error("Gagal mengambil stream:", error);
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
