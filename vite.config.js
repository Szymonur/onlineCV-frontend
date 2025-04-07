import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["cms.jakubisanski.pl"],
  },
  server: {
    proxy: {
      "/admin": {
        target: "https://cms.jakubisanski.pl",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
