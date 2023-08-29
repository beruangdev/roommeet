export default function galleryHandler() {
    return {
        galleryHandlerInit() {
            this.drawGalleryCardBasis();
        },
        async drawGalleryCardBasis() {
            await this.$nextTick();

            document
                .querySelectorAll(
                    `[viewtype="gallery"] .small-videos .gallery, [viewtype="speaker"] .gallery`
                )
                .forEach((elementWG, index) => {
                    const elementCards =
                        elementWG.querySelectorAll(".card-participant");

                    let basis;
                    const bodyWidth = document.body.clientWidth;
                    const orang = elementCards.length;
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

                    elementCards.forEach((element, index, parent) => {
                        element.style.flexBasis = `${basis}%`;
                    });
                });
        },
    };
}
