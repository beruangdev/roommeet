export default function speakerHandler() {
    return {
        showSpeakerParticipants: false,
        speakerHandlerInit() {
            if (this.viewType === "speaker") {
                this.setSmallVideosTranslate();
            } else {
                this.resetSetSmallVideosTranslate();
            }
        },
        toggleSpeakerParticipants(value) {
            this.showSpeakerParticipants = value;
            this.setForceHideController(this.showSpeakerParticipants);
            this.setSmallVideosTranslate();
        },
        async setSmallVideosTranslate() {
            if (document.body.clientWidth < 768) {
                await this.$nextTick();
                const value = this.showSpeakerParticipants;
                const elSmallVideos = document.querySelector(
                    `[viewtype="speaker"] .small-videos`
                );
                if (elSmallVideos) {
                    if (value) {
                        // elSmallVideos.classList.add("!translate-x-0");
                        // elSmallVideos.classList.remove("!translate-x-full");
                        elSmallVideos.style.transform = "translateX(0)";
                    } else {
                        // elSmallVideos.classList.remove("!translate-x-0");
                        // elSmallVideos.classList.add("!translate-x-full");
                        elSmallVideos.style.transform = "translateX(100%)";
                    }
                }
            }
        },

        async resetSetSmallVideosTranslate() {
            await this.$nextTick();
            const elSmallVideos = document.querySelector(
                `[viewtype] .small-videos`
            );
            elSmallVideos.style = {};
        },
    };
}
