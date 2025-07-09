import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import VCalendar from "v-calendar";
import "v-calendar/style.css";
import router from "./router";

const app = createApp(App);
app.use(createPinia());
app.use(VCalendar);
app.use(router);
app.mount("#app");
