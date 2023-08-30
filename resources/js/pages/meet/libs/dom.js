export default function dom() {
    let _small, _bigWrapper, _smallCards, _big, _bigCards;
    return {
        async domInit() {
            await this.$nextTick();
            if (
                window.location.hostname === "localhost" ||
                window.location.hostname === "127.0.0.1"
            ) {
                window.addEventListener("resize", () => {
                    this.resizeCards();
                });
            }
            this.resizeCards();
        },
        toggleSmallParticipants(value) {
            this.showSmallParticipants = value;
            this.setForceHideController(this.showSmallParticipants);
            if (value) {
                _small.style.transform = "translateX(0)";
            } else {
                _small.style.transform = "translateX(100%)";
            }
        },
        async resizeCards() {
            if (this.$nextTick) await this.$nextTick();
            _small = document.querySelector(`[viewtype] .small-videos`);
            _smallCards = _small.querySelectorAll(".card-participant");
            _big = document.querySelector(`[viewtype] .big-videos`);
            _bigWrapper = _big.querySelector(`.wrapper-videos`);
            _bigCards = _big.querySelectorAll(".card-participant");
            this.resetResizeCardsStyle();
            if (this.viewType === "1:1") {
                this.resize1by1();
            } else if (this.viewType === "speaker") {
                this.resizeSpeaker();
            } else if (this.viewType === "gallery") {
                this.resizeGallery();
            }
        },
        resetResizeCardsStyle() {
            _small.removeAttribute("style");
            _smallCards.forEach((el) => el.removeAttribute("style"));
            _bigWrapper.removeAttribute("style");
            _bigCards.forEach((el) => el.removeAttribute("style"));
        },
        resize1by1() {
            _bigWrapper.style.height = `${
                window.innerHeight - _small.clientHeight
            }px`;
        },
        resizeSpeaker() {
            this._resizeGalleryCards(_bigCards);
        },
        resizeGallery() {
            this._resizeGalleryCards(_smallCards);
        },
        _resizeGalleryCards(elCards) {
            let basis;
            const bodyWidth = document.body.clientWidth;
            const orang = elCards.length;
            let maksimal_pembagian;
            if (bodyWidth < 450) {
                basis = orang <= 2 ? 100 : 50;
            } else {
                if (bodyWidth < 640) {
                    maksimal_pembagian = 3;
                } else if (bodyWidth < 1024) {
                    maksimal_pembagian = 4;
                } else if (bodyWidth < 1280) {
                    maksimal_pembagian = 4;
                } else {
                    maksimal_pembagian = 5;
                }
                basis = 100 / Math.min(orang, maksimal_pembagian);
            }
            basis -= 2;
            for (const element of elCards) {
                element.style.flexBasis = `${basis}%`;
            }
        },
    };
}
