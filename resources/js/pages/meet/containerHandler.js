import dom from './libs/dom';

export default function containerHandler() {
    return {
        viewType: undefined,
        containerHandlerInit() {
            const viewType = localStorage.getItem("viewType") || "gallery";
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
    };
}
