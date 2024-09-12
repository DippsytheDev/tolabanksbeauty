import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import 'react-calendar/dist/Calendar.css';`,
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
