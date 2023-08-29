export default function controllerHandler() {
    return {
        _forceHideController: false,
        showControllers: true,
        autoHideControllerEnabled: !true,
        timeout: undefined,
        toggleShowController(value = !this.showControllers) {
            if (!value) {
                if (!this._forceHideController) {
                    // this.showControllers = value;
                    this.setForceHideController(true);
                    setTimeout(() => {
                        this.setForceHideController(false);
                    }, 1000);
                }
            }
        },
        setForceHideController(value) {
            if (value) {
                clearTimeout(this.timeout);
                this.showControllers = false;
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
                    if (this.timeout) clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        this.showControllers = false;
                    }, 5000);
                    this.showControllers = true;
                }
            };

            window.ontouchstart = () => {
                startTimeout();
            };
            window.onmouseover = () => {
                startTimeout();
            };

            window.onmouseout = () => {
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.showControllers = false;
                }, 1000);
            };
        },
    };
}
