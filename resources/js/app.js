// import './bootstrap';

import "./dark-mode";
import "./helpers/array";

import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';
window.Alpine = Alpine;

Alpine.plugin(focus);

document.addEventListener("DOMContentLoaded", () => {
  Alpine.start();
})

// import "flowbite"
