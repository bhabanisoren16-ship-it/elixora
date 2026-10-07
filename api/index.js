import express from 'express';
import cors from 'cors';
import apiRouter from '../server/routes.js';
import { initDb } from '../server/db.js';

const app = express();

initDb();

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Strip '/api' prefix if Vercel routes into /api directly, or mount at /api
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
