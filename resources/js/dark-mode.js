import { setCookie, getCookie } from "./helpers/cookie";

const themeToggleBtn = document.querySelector(".theme-toggle");

function setTheme(theme) {
    const minutesIn100Years = 52560000 + (25 * 24 * 60);
    if (theme === "dark") {
        document.body.classList.add("dark");
        document.documentElement.classList.add("dark");
        setCookie("color-theme", "dark", minutesIn100Years);
    } else {
        document.body.classList.remove("dark");
        document.documentElement.classList.remove("dark");
        setCookie("color-theme", "light", minutesIn100Years);
    }
}

function getCurrentTheme() {
    const savedTheme = getCookie("color-theme");
    if (savedTheme) {
        return savedTheme;
    } else {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
}

function toggleTheme() {
    const currentTheme = getCurrentTheme();
    if (currentTheme === "dark") {
        setTheme("light");
    } else {
        setTheme("dark");
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
}

// Initialize theme
setTheme(getCurrentTheme());
