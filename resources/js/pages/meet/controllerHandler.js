export default function controllerHandler() {
    return {
        _forceHideController: false,
        showControllers: true,
        autoHideControllerEnabled: true,
        timeout: undefined,
        showSmallParticipants: false,
        toggleShowController(value = !this.showControllers) {
            if (!value && !this._forceHideController) {
                this.setForceHideController(true);
                setTimeout(() => {
                    this.setForceHideController(false);
                }, 1000);
            }
        },
        
        setForceHideController(value) {
            clearTimeout(this.timeout);
            if (value) {
                this.showControllers = !value;
            }
            this._forceHideController = value;
        },
        
        controllerHandlerInit() {
            if (this.autoHideControllerEnabled) {
                this.autoHideControllers();
            }
        },
        
        autoHideControllers() {
            const startTimeout = () => {
                if (!this._forceHideController) {
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        this.showControllers = false;
                    }, 5000);
                    this.showControllers = true;
                }
            };

            const clearAndSetTimeout = (delay) => {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.showControllers = false;
                }, delay);
            };

            window.ontouchstart = startTimeout;
            window.onmouseover = startTimeout;
            window.onmouseout = () => clearAndSetTimeout(1000);
        },
    };
}
