import { Router } from 'express';
import { getDatabase } from '../db/database.js';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  let isHealthy = true;

  try {
    const db = getDatabase();
    db.prepare('SELECT 1').get();
  } catch {
    isHealthy = false;
  }

  const statusCode = isHealthy ? 200 : 503;

  res.status(statusCode).json({
    status: isHealthy ? 'ok' : 'unhealthy',
    success: isHealthy,
  });
});


