export default function _1by1Handler() {
    return {
        _1by1HandlerInit() {
            if (this.viewType === "speaker") {
                this.draw1by1Heigth();
            } else {
                this.resetDraw1by1Heigth();
            }
        },
        getDistanceFromTop(element) {
            const rect = element.getBoundingClientRect();
            const totalDistanceFromTopOfPage = rect.top + window.pageYOffset;
            return totalDistanceFromTopOfPage;
        },
        async draw1by1Heigth() {
            await this.$nextTick();
            const elSmallVideos = document.querySelector(
                `[viewtype="1:1"] .small-videos`
            );
            const elSmallVideosWrapper = document.querySelector(
                `[viewtype="1:1"] .big-videos .wrapper-videos`
            );
            if (elSmallVideos) {
                const jarakDariAtas = elSmallVideos.clientHeight;
                elSmallVideosWrapper.style.height = `${
                    window.innerHeight - jarakDariAtas
                }px`;
            }
        },
        async resetDraw1by1Heigth() {
            await this.$nextTick();
            const elSmallVideosWrapper = document.querySelector(
                `[viewtype] .big-videos .wrapper-videos`
            );
            elSmallVideosWrapper.style = {};
        },
    };
}
