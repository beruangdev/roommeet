import { setCookie, getCookie } from "./helpers/cookie";

const themeToggleBtn = document.querySelector(".theme-toggle");
// Change the icons inside the button based on previous settings
var colorTheme = getCookie("color-theme");
if (colorTheme === "dark" || (!colorTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.body.classList.add("dark");
    document.documentElement.classList.add("dark");
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
        var colorTheme = getCookie("color-theme");

        if (colorTheme) {
            if (colorTheme === "light") {
                document.body.classList.add("dark");
                document.documentElement.classList.add("dark");
                setCookie("color-theme", "dark", 365);
            } else {
                document.body.classList.remove("dark");
                document.documentElement.classList.remove("dark");
                setCookie("color-theme", "light", 365);
            }
        } else {
            if (document.body.classList.contains("dark")) {
                document.body.classList.remove("dark");
                document.documentElement.classList.remove("dark");
                setCookie("color-theme", "light", 365);
            } else {
                document.body.classList.add("dark");
                document.documentElement.classList.add("dark");
                setCookie("color-theme", "dark", 365);
            }
        }
    });
}
