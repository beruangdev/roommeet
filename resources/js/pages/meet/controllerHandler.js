import participantList from "./libs/participant-lists";

export default function controllerHandler() {
    return {
        _forceHideController: false,
        showControllers: true,
        autoHideControllerEnabled: true,
        timeout: undefined,
        showSmallParticipants: false,
        showParticipantLists: false,
        controllerHandlerInit() {
            if (this.autoHideControllerEnabled) {
                this.autoHideControllers();
            }
        },

        setForceHideController(value) {
            clearTimeout(this.timeout);
            this.showControllers = !value;
            this._forceHideController = value;
        },

        toggleShowController(value = !this.showControllers) {
            if (!value && !this._forceHideController) {
                this.setForceHideController(true);
                setTimeout(() => {
                    this.setForceHideController(false);
                }, 1000);
            }
        },

        autoHideControllers() {
            const clearAndSetTimeout = (delay) => {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.showControllers = false;
                }, delay);
            };

            const startTimeout = () => {
                if (!this._forceHideController) {
                    clearAndSetTimeout(5000);
                    this.showControllers = true;
                }
            };

            const hasAncestorWithAttributeValue = (el, attribute, value) => {
                while (el) {
                    if (el.getAttribute(attribute) === value) return true;
                    el = el.parentElement;
                }
                return false;
            };

            const bindControllerShowEvents = (el) => {
                el.ontouchstart = () => clearTimeout(this.timeout);
                el.onmouseover = () => clearTimeout(this.timeout);
                el.onmouseout = () => clearAndSetTimeout(1000);
            };

            const bindWindowEvents = (event) => {
                if (
                    !hasAncestorWithAttributeValue(
                        event.target,
                        "x-show",
                        "showControllers"
                    )
                ) {
                    if (event.type === "mouseout") {
                        clearAndSetTimeout(1000);
                    } else {
                        startTimeout();
                    }
                }
            };

            const elements = document.querySelectorAll(
                `[x-show="showControllers"]`
            );
            for (let i = 0; i < elements.length; i++) {
                bindControllerShowEvents(elements[i]);
            }

            window.ontouchstart = bindWindowEvents;
            window.onmouseover = bindWindowEvents;
            window.onmouseout = bindWindowEvents;
        },
        ...participantList(),
    };
}
