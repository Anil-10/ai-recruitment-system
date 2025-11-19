// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Proxy /api/* to backend (Flask) running on localhost:5001
 * Adjust the target if your Flask app uses a different host/port.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy all /api requests to Flask backend
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api")
      }
    }
  }
});
