import { createApp } from "vue";
import { createPinia } from "pinia";
import vSelect from "vue-select";

import App from "./App.vue";
import router from "./router";

import "./assets/input.css";
import "material-icons/iconfont/material-icons.css";
import "vue-toast-notification/dist/theme-sugar.css";
import "vue-select/dist/vue-select.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("v-select", vSelect);

app.mount("#app");
