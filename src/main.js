import "./assets/main.css";

import { ViteSSG } from "vite-ssg";
import { createPinia } from "pinia";
import { createHead } from "@vueuse/head";

import App from "./App.vue";
import { routes } from "./router";

export const createApp = ViteSSG(App, { routes }, ({ app, routes }) => {
  app.use(createPinia());
  app.use(createHead());
});
