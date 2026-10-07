import express from 'express';
import cors from 'cors';
import apiRouter from './routes.js';
import { initDb } from './db.js';

/**
 * Vite plugin that integrates the real-time ELIXORA backend API
 * directly into the Vite development server.
 * This allows "npm run dev" to provide the full real-time database backend
 * without needing to run a separate terminal or server process!
 */
export function elixoraBackendPlugin() {
  return {
    name: 'elixora-backend-api',
    configureServer(server) {
      initDb();
      const apiApp = express();
      apiApp.use(cors());
      apiApp.use(express.json({ limit: '25mb' }));
      apiApp.use(express.urlencoded({ extended: true, limit: '25mb' }));
      apiApp.use('/api', apiRouter);

      server.middlewares.use(apiApp);
      console.log('⚡ [ELIXORA Plugin] Integrated real-time backend API active on /api');
    },
  };
}

export default elixoraBackendPlugin;
