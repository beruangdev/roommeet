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
        constraints: {
            video: {
                quality: "minimal",
                frameRate: 5,
                resolution: { width: 90, height: 90 },
                bitrate: 80,
            },
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
        },

        updateConstraints() {
            const MAX_BANDWIDTH = 1 * 8;
            const DEFAULT_DOWNLINK = 0.6 * 8;
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
                        frameRate: { ideal: 30, min: 25, max: 60 },
                        resolution: {
                            width: { ideal: 1280, min: 1024, max: 1920 },
                            height: { ideal: 720, min: 600, max: 1080 },
                        },
                        bitrate: { ideal: 2500, min: 2000, max: 3000 },
                    },
                },
                {
                    limit: 5,
                    video: {
                        frameRate: { ideal: 24, min: 20, max: 30 },
                        resolution: {
                            width: { ideal: 640, min: 480, max: 800 },
                            height: { ideal: 480, min: 360, max: 600 },
                        },
                        bitrate: { ideal: 700, min: 500, max: 1000 },
                    },
                },
                {
                    limit: 2,
                    video: {
                        frameRate: { ideal: 20, min: 15, max: 25 },
                        resolution: {
                            width: { ideal: 320, min: 240, max: 480 },
                            height: { ideal: 320, min: 240, max: 480 },
                        },
                        bitrate: { ideal: 700, min: 500, max: 900 },
                    },
                },
                {
                    limit: 1.5,
                    video: {
                        frameRate: { ideal: 15, min: 10, max: 20 },
                        resolution: {
                            width: { ideal: 240, min: 180, max: 360 },
                            height: { ideal: 240, min: 180, max: 360 },
                        },
                        bitrate: { ideal: 500, min: 300, max: 700 },
                    },
                },
                {
                    limit: 1,
                    video: {
                        frameRate: { ideal: 15, min: 10, max: 20 },
                        resolution: {
                            width: { ideal: 240, min: 180, max: 360 },
                            height: { ideal: 240, min: 180, max: 360 },
                        },
                        bitrate: { ideal: 400, min: 200, max: 600 },
                    },
                },
                {
                    limit: 0.75,
                    video: {
                        frameRate: { ideal: 15, min: 10, max: 20 },
                        resolution: {
                            width: { ideal: 180, min: 160, max: 240 },
                            height: { ideal: 180, min: 160, max: 240 },
                        },
                        bitrate: { ideal: 300, min: 200, max: 400 },
                    },
                },
                {
                    limit: 0.5,
                    video: {
                        frameRate: { ideal: 15, min: 10, max: 20 },
                        resolution: {
                            width: { ideal: 160, min: 120, max: 240 },
                            height: { ideal: 160, min: 120, max: 240 },
                        },
                        bitrate: { ideal: 200, min: 100, max: 300 },
                    },
                },
                {
                    limit: 0.3,
                    video: {
                        frameRate: { ideal: 15, min: 10, max: 20 },
                        resolution: {
                            width: { ideal: 120, min: 90, max: 180 },
                            height: { ideal: 120, min: 90, max: 180 },
                        },
                        bitrate: { ideal: 100, min: 80, max: 200 },
                    },
                },
                {
                    limit: 0.2,
                    video: {
                        frameRate: { ideal: 15, min: 10, max: 20 },
                        resolution: {
                            width: { ideal: 90, min: 60, max: 120 },
                            height: { ideal: 90, min: 60, max: 120 },
                        },
                        bitrate: { ideal: 80, min: 50, max: 100 },
                    },
                },
            ];

            for (let setting of settings) {
                if (availableBandwidth < setting.limit) {
                    this.constraints = {
                        ...this.constraints,
                        video: {
                            ...setting.video,
                            contentHint: "detail",
                        },
                    };
                    return;
                }
            }

            this.constraints = {
                ...this.constraints,
                video: settings[settings.length - 1].video,
            };
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
            this.my.video_enabled = !this.my.video_enabled;
            this.updateVideo();
        },
        updateVideo() {
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
            this.my.audio_enabled = !this.my.audio_enabled;
            this.updateAudio();
        },
        updateAudio() {
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
                    return;
                }

                if (this.my.stream) {
                    const propertiesExist = [
                        "audioSource",
                        "audioAnalyser",
                        "audioContext",
                    ].every((prop) => this.my[prop] && this.my[prop]);
                    console.log("propertiesExist", propertiesExist);
                    if (propertiesExist) {
                        try {
                            this.my.audioSource.disconnect(
                                this.my.audioAnalyser
                            );
                        } catch (error) {
                            console.warn(
                                "Tidak bisa memutuskan audioSource sambungan dari audioAnalyser:",
                                error
                            );
                        }

                        try {
                            this.my.audioAnalyser.disconnect(
                                this.my.audioContext.destination
                            );
                        } catch (error) {
                            console.warn(
                                "Tidak bisa memutuskan sambungan audioAnalyser dari audioContext:",
                                error
                            );
                        }

                        try {
                            this.my.audioContext.close();
                        } catch (error) {}
                    }

                    const tracks = this.my.stream.getTracks();
                    for (let index = 0; index < tracks.length; index++) {
                        tracks[index].stop();
                    }
                }

                const stream = await navigator.mediaDevices.getUserMedia(
                    this.constraints
                );

                this.my.audioContext = new AudioContext();
                this.my.audioSource =
                    this.my.audioContext.createMediaStreamSource(stream);
                this.my.audioAnalyser = this.my.audioContext.createAnalyser();
                this.my.audioAnalyser.fftSize = 256; // Anda dapat menyesuaikan ini sesuai kebutuhan

                const bufferLength = this.my.audioAnalyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                this.my.audioSource.connect(this.my.audioAnalyser);

                const checkForAudio = async () => {
                    this.my.audioAnalyser.getByteFrequencyData(dataArray);
                    this.my.audioAmplitudeAverage =
                        dataArray.reduce((a, b) => a + b) / bufferLength;
                    this.my.audioAplitudePercentage =
                        (this.my.audioAmplitudeAverage / 255) * 100;

                    if (this.my.audioAmplitudeAverage > 5) {
                        this.my.lastTimeAudioWasHeard = Date.now();
                    }

                    // TODO: kirim kapan terakhir kali audio terdengar ke semua participant agar participant yang lain dapat sort data
                    if (this.checkAudioTimeout)
                        clearTimeout(this.checkAudioTimeout);
                    this.checkAudioTimeout = setTimeout(() => {
                        checkForAudio();
                    }, 50);
                };

                checkForAudio();

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
                    for (let index = 0; index < oldTracks.length; index++) {
                        this.my.stream.removeTrack(oldTracks[index]);
                        oldTracks[index].stop();
                    }

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

                    for (let index = 0; index < tracks.length; index++) {
                        const track = tracks[index];
                        let sender = senders.find(
                            (s) => s.track && s.track.kind === track.kind
                        );
                        if (sender) {
                            sender.replaceTrack(track);
                        } else if (
                            !senders.some(
                                (s) => s.track && s.track.id === track.id
                            ) &&
                            this.my.stream
                        ) {
                            participant.peer.addTrack(track, this.my.stream);
                        } else {
                            console.error(
                                `Sender sudah ada untuk track ${track.id}`
                            );
                        }
                    }
                }
            }
        },
        async toggleMedia(mediaType, enable) {
            if (enable) {
                await this.updateConstraints();
                const newStream = await this.getStream();
                this.replaceStream(newStream);
            } else if (this.my.stream) {
                const tracks = this.my.stream[`get${mediaType}Tracks`]();
                for (let i = 0; i < tracks.length; i++) {
                    tracks[i].stop();
                    this.my.stream.removeTrack(tracks[i]);
                }
            }
        },
    };
}
