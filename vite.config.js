import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:4000',  // Ensure this points to the backend port 4000
    },
  },
});
