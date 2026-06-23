import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ["**/*.glb"],
  build: {
    rollupOptions: {
      output: {
        // Split heavy vendors so three.js (only needed by the 3D product
        // viewer on the lazy product page) doesn't bloat the initial bundle.
        // Rolldown (Vite 8) requires manualChunks as a function.
        manualChunks(id) {
          if (
            id.includes("/three/") ||
            id.includes("@react-three") ||
            id.includes("/three-stdlib/")
          )
            return "three";
          if (id.includes("framer-motion") || id.includes("/motion-dom/"))
            return "motion";
          if (id.includes("/swiper/")) return "swiper";
          // Stable vendor chunks → long-term browser caching (these change far
          // less often than app code, and gives the shared chunk a real name).
          if (id.includes("react-hook-form")) return "forms";
          if (id.includes("react-icons") || id.includes("lucide-react"))
            return "icons";
          if (
            id.includes("/react-router/") ||
            id.includes("/react-router-dom/")
          )
            return "router";
        },
      },
    },
  },
});
