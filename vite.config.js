import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the build works from any folder (e.g. example.com/zoo/).
  base: './',
  server: {
    // Same origin as the previous local copy, so existing saves in localStorage are kept.
    port: 8080,
    strictPort: true,
  },
  preview: {
    port: 8080,
  },
});
