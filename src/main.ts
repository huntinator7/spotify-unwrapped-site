import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueFire, VueFireAuth } from "vuefire";
import VueSidebarMenu from "vue-sidebar-menu";
import { createVuetify } from "vuetify";
import { VBtn } from "vuetify/components";
import * as directives from "vuetify/directives";

import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "vuetify/styles";

import App from "./App.vue";
import router from "./router";
import { firebaseApp } from "./firebase";

import "./assets/main.css";

const components = { VBtn };
console.log(components);

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

// app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);
app.use(VueSidebarMenu);
app.use(vuetify);

app.use(VueFire, {
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
});

app.mount("#app");
