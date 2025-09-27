// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "@/axios"; // our config

const app = createApp(App);

// make axios available globally as this.$axios
app.config.globalProperties.$axios = axios;

app.use(router).mount("#app");
