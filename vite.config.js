import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { elixoraBackendPlugin } from './server/vitePlugin.js';

export default defineConfig({
  plugins: [react(), elixoraBackendPlugin()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
