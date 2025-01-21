import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "../yapi-request/out/webview",
    rollupOptions: {
      input: {
        sidebar: path.resolve(__dirname, "src/pages/sidebar/index.html"),
        panel: path.resolve(__dirname, "src/pages/panel/index.html"),
      },
    },
  },
  plugins: [react()],
});
