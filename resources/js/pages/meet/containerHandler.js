// import _1by1Handler from "./containers/1by1";
// import speakerHandler from "./containers/speaker";
// import galleryHandlerInit from "./containers/gallery";
import dom from './libs/dom';

export default function containerHandler() {
    return {
        viewType: undefined,
        list: [],
        containerHandlerInit() {
            const viewType = localStorage.getItem("viewType") || "speaker";
            localStorage.setItem("viewType", viewType);
            this.setViewType(viewType);
            this.domInit();
        },
        async setViewType(type) {
            this.viewType = type;
            localStorage.setItem("viewType", type);
            this.resizeCards();
        },
        ...dom(),
        // ..._1by1Handler(),
        // ...speakerHandler(),
        // ...galleryHandlerInit(),
    };
}
