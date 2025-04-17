import "./assets/main.css";

import { ViteSSG } from "vite-ssg";
import { createPinia } from "pinia";
import { createHead } from "@vueuse/head";

import App from "./App.vue";
import { routes } from "./router";

export const createApp = ViteSSG(App, { routes }, ({ app, router, isClient }) => {
  app.use(createPinia());
  app.use(createHead());

  // Generowanie sitemap tylko podczas SSR (czyli build)
  if (import.meta.env.SSR) {
    generateSitemap({
      hostname: "https://jakubisanski.pl",
      routes,
    });
  }
});
