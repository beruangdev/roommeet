export default function dom() {
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
        _small: null,
        _smallGallery: null,
        _bigWrapper: null,
        showSmallParticipants: false,
        toggleSmallParticipants(value) {
            this.showSmallParticipants = value;
            this.setForceHideController(this.showSmallParticipants);
            if (value) {
                this._small.style.transform = "translateX(0)";
            } else {
                this._small.style.transform = "translateX(100%)";
            }
        },
        async resizeCards() {
            await this.$nextTick();
            this._small = document.querySelector(`[viewtype] .small-videos`);
            this._smallGallery = this._small.querySelector(`.gallery`);
            this._smallCards =
                this._small.querySelectorAll(".card-participant");

            this._big = document.querySelector(`[viewtype] .big-videos`);
            this._bigWrapper = this._big.querySelector(`.wrapper-videos`);
            this._bigCards = this._big.querySelectorAll(".card-participant");

            this.resetResizeCardsStyle();
            if (this.viewType === "1:1") {
                this.resize1by1();
            } else if (this.viewType === "speaker") {
                this.resizeSpeaker();
            } else if (this.viewType === "gallery") {
                this.resizeGallery();
            }
            return;
        },

        resetResizeCardsStyle() {
            this._small.style = {};
            this._smallCards.forEach((el) => (el.style = {}));

            this._bigWrapper.style = {};
            this._bigCards.forEach((el) => (el.style = {}));
        },

        resize1by1() {
            // change this._bigWrapper style
            // this._bigWrapper.style.height = `${window.innerHeight}px`;
            this._bigWrapper.style.height = `${
                window.innerHeight - this._small.clientHeight
            }px`;
        },
        resizeSpeaker() {
            // change this._bigCards style
            this._resizeGalleryCards(this._bigCards);
        },
        resizeGallery() {
            // change this._smallCards style
            this._resizeGalleryCards(this._smallCards);
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
            console.log("elCards", elCards.length, elCards);
            elCards.forEach((element, index) => {
                element.style.flexBasis = `${basis}%`;
            });
        },
    };
}
