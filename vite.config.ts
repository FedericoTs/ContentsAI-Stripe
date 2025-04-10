import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base:
    process.env.NODE_ENV === "development"
      ? "/"
      : process.env.VITE_BASE_PATH || "/",
  plugins: [react(), tempo()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
    hmr: {
      // Prevent multiple server instances during hot module replacement
      clientPort: process.env.TEMPO === "true" ? undefined : null,
    },
    watch: {
      // Use polling for more reliable file watching
      usePolling: process.env.TEMPO === "true" ? true : false,
    },
  },
});
