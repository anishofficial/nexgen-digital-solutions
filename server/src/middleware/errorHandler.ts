import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction): void {
  if (config.nodeEnv === 'development') {
    console.error(`[ServerError] ${req.method} ${req.originalUrl}:`, err?.message || err);
  }

  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred';

  if (err.message && err.message.startsWith('CORS blocked')) {
    statusCode = 403;
    message = 'Cross-Origin request forbidden by security policy';
  } else if (statusCode === 500 && config.isProduction) {
    message = 'Internal server error';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(config.nodeEnv === 'development' ? { stack: err.stack } : {}),
  });
}


