import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(async ({ command }) => {
  const plugins = [react()];

  // Only load the local Express backend plugin during development ('vite')
  // Never load it during production build ('vite build') to prevent serverless timers or backend files from interfering with Vercel builds
  if (command === 'serve') {
    const { elixoraBackendPlugin } = await import('./server/vitePlugin.js');
    plugins.push(elixoraBackendPlugin());
  }

  return {
    plugins,
    server: {
      host: '0.0.0.0',
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
  };
});
