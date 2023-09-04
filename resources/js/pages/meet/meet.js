import wsHandler from "./wsHandler";
import controllerHandler from "./controllerHandler";
import containerHandler from "./containerHandler";

document.addEventListener("alpine:init", () => {
    Alpine.data("alpineMeet", () => ({
        room,
        my: {
            video_enabled: room.video_enabled,
            audio_enabled: room.audio_enabled,
            cameraDeviceId: undefined,
            microphoneDeviceId: undefined,
            cameras: [],
            mics: [],
            stream: undefined,
            screenStream: undefined,
            onShareScreen: false,
            internet: {
                download: "0 KB/s",
                upload: "0 KB/s",
            },
            ...participant,
        },
        config: {
            "1:1": {
                maxBigParticipants: 2,
            },
            gallery: {
                maxBigParticipants: 0,
            },
            speakers: {
                maxBigParticipants: 6,
            },
        },
        constraints: {
            video: {
                width: { ideal: 160, max: 320 },
                height: { ideal: 90, max: 180 },
                frameRate: { ideal: 10, max: 15 },
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
            facingMode: {
                ideal: "user",
            },
        },
        big_participants: [],
        participants: {},
        _init() {
            this.wsHandlerInit();
            this.controllerHandlerInit();
            this.containerHandlerInit();
        },
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        ...wsHandler(),
        ...controllerHandler(),
        ...containerHandler(),
    }));
});
