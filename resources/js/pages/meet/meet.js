import wsHandler from "./wsHandler";
import controllerHandler from "./controllerHandler";
import containerHandler from "./containerHandler";

document.addEventListener("alpine:init", () => {
    Alpine.data("alpineMeet", () => ({
        room,
        my: {
            video_enabled: true,
            audio_enabled: true,
            cameraDeviceId: undefined,
            microphoneDeviceId: undefined,
            cameras: [],
            mics: [],
            stream: undefined,
            ...participant,
        },
        config: {
            "1:1": {
                maxBigParticipants: 2,
            },
            gallery: {
                maxBigParticipants: 0,
            },
            speaker: {
                maxBigParticipants: 4,
            },
        },
        _init() {
            
            this.wsHandlerInit();
            this.controllerHandlerInit();
            this.containerHandlerInit();
        },
        ...wsHandler(),
        ...controllerHandler(),
        ...containerHandler(),
    }));
});
