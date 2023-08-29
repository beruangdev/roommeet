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
        getConstraints(uploadSpeed) {
            // kecepatan uploadSpeed dalam megabits
            const constraints = {
                video: {},
                audio: {},
            };

            if (uploadSpeed > 2) {
                constraints.video = {
                    width: { ideal: null, max: null },
                    height: { ideal: null, max: null },
                    frameRate: { ideal: null, max: null },
                };
            } else if (uploadSpeed > 1.5) {
                constraints.video = {
                    width: { ideal: null, max: null },
                    height: { ideal: null, max: null },
                    frameRate: { ideal: null, max: null },
                };
            } else if (uploadSpeed > 1) {
                constraints.video = {
                    width: { ideal: null, max: null },
                    height: { ideal: null, max: null },
                    frameRate: { ideal: null, max: null },
                };
            } else if (uploadSpeed > 0.5) {
                constraints.video = {
                    width: { ideal: null, max: null },
                    height: { ideal: null, max: null },
                    frameRate: { ideal: null, max: null },
                };
            } else if (uploadSpeed > 0.2) {
                constraints.video = {
                    width: { ideal: null, max: null },
                    height: { ideal: null, max: null },
                    frameRate: { ideal: null, max: null },
                };
            } else {
                constraints.video = {
                    width: { ideal: null, max: null },
                    height: { ideal: null, max: null },
                    frameRate: { ideal: null, max: null },
                };
            }

            return constraints;
        },

        async updateConstraints() {
            this.updateUploadSpeed();

            const videoConfigurations = [
                { min: 2, width: 1920, height: 1080, frameRate: 30 },
                { min: 1.5, width: 1280, height: 720, frameRate: 30 },
                { min: 1, width: 640, height: 360, frameRate: 25 },
                { min: 0.5, width: 640, height: 360, frameRate: 24 },
                { min: 0.2, width: 480, height: 270, frameRate: 20 },
                { min: 0, width: 320, height: 180, frameRate: 15 },
            ];

            // const downlinkMbps = navigator.connection.downlink;
            const downlinkMbps = this.uploadSpeed;

            if (this.my.videoEnabled) {
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

            if (this.my.audioEnabled) {
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
                    this.constraints.audio.echoCancellation = false;
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
        },
        async getMediaDevices(withCamerasAndMics = false) {
            try {
                if (!this.my.stream) {
                    this.my.stream = await this.getStream();
                }

                await this.toggleMedia("Video", this.room.videoEnabled);
                await this.toggleMedia("Audio", this.room.audioEnabled);

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
            console.log("handleConnectionChange");
            console.log(this.my.videoEnabled, this.my.audioEnabled);

            if (this.my.videoEnabled || this.my.audioEnabled) {
                await this.updateConstraints();
                this.replaceStreamWithUpdatedConstraints();
            }
        },

        async replaceStreamWithUpdatedConstraints() {
            console.log(
                "replaceStreamWithUpdatedConstraints",
                this.constraints
            );
            const newStream = await this.getStream();
            this.replaceStream(newStream);
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
                return await navigator.mediaDevices.getUserMedia(
                    this.constraints
                );
            } catch (error) {
                console.error("Gagal mengambil stream:", error);
                throw error;
            }
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
    };
}
