import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";
import apiPlugin from "./vite-plugin-api.js";

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 1500,
    target: 'es2019',
    cssCodeSplit: true,
    minify: 'esbuild',
  },
  plugins: [tsconfigPaths(), react(), tagger(), apiPlugin()],
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  server: {
    port: 4028,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
  }
});