import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@components": path.resolve(__dirname, "src/components"),
      "@typings": path.resolve(__dirname, "src/typings"),
    },
  },
  plugins: [react()],
  server: {
    port: 3095,
    proxy: {
      "/api/": {
        target: "http://localhost:3095",
        changeOrigin: true,
      },
    },
  },
});
