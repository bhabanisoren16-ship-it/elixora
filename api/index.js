import express from 'express';
import cors from 'cors';
import apiRouter from '../server/routes.js';
import { initDb } from '../server/db.js';

const app = express();

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

try {
  initDb();
} catch (e) {
  // Silent fallback for read-only serverless filesystems
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Strip '/api' prefix if Vercel routes into /api directly, or mount at /api
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
