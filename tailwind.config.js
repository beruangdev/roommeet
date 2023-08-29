import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./vendor/laravel/jetstream/**/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        // "./node_modules/flowbite/**/*.js"
    ],
    safelist: ["!translate-x-0", "!translate-x-full"],

    theme: {
        extend: {
            fontFamily: {
                // sans: [...defaultTheme.fontFamily.sans],
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
        },
        colors: {
            ...colors,
            primary: colors.blue,
            background: {
                25: "#ffffff",
                50: "#f7f7f7",
                75: "#ededed",
                100: "#e3e3e3",
                150: "#d6d6d6",
                200: "#c8c8c8",
                250: "#b6b6b6",
                300: "#a4a4a4",
                350: "#939393",
                400: "#818181",
                450: "#747474",
                500: "#666666",
                550: "#5c5c5c",
                600: "#515151",
                650: "#4a4a4a",
                700: "#434343",
                750: "#3e3e3e",
                800: "#383838",
                850: "#353535",
                900: "#313131",
                925: "#292929",
                950: "#212121",
                975: "#1c1c1c",
                1000: "#171717",
            },
        },
    },

    plugins: [
        forms,
        typography,
        // require('flowbite/plugin')
    ],
};
