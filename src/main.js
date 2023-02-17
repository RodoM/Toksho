import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/input.css";
import "material-icons/iconfont/material-icons.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
