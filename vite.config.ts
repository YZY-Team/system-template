import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite"
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: "http://192.168.1.158:8080",
        changeOrigin: true,
      },
    },
  },
});
