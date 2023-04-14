import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import vSelect from "vue-select";

import App from "./App.vue";
import router from "./router";

import "./assets/input.css";
import "material-icons/iconfont/material-icons.css";
import "vue-toast-notification/dist/theme-sugar.css";
import "vue-select/dist/vue-select.css";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.component("v-select", vSelect);

app.mount("#app");
