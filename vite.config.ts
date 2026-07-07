import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Minimal Vite config — the bug lives in clerk-js, not the bundler.
export default defineConfig({
  plugins: [react()],
});
