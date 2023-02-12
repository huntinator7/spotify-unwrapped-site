import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueFire, VueFireAuth } from "vuefire";
import VueSidebarMenu from "vue-sidebar-menu";
import Vue3Toasity from "vue3-toastify";

import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "vue-slider-component/theme/default.css";

import App from "./App.vue";
import router from "./router";
import { firebaseApp } from "./firebase";

import "./assets/main.css";
import "swiper/css";
import "vue3-toastify/dist/index.css";

const app = createApp(App);

app.use(Vue3Toasity, { autoClose: 3000 });
app.use(createPinia());
app.use(router);
app.use(VueSidebarMenu);

app.use(VueFire, {
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
});

app.mount("#app");
