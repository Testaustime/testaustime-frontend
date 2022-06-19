import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import visualizer from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    visualizer()
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://api.testaustime.fi",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})