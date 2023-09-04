// import './bootstrap';

import "./dark-mode";
import "./helpers/array";

import Alpine from 'alpinejs';
import Focus from '@alpinejs/focus';
window.Alpine = Alpine;

Alpine.plugin(Focus);

document.addEventListener("DOMContentLoaded", () => {
  Alpine.start();
})

// import "flowbite"
