import { Request, Response, NextFunction } from 'express';

/**
 * Single-Server In-Memory Rate Limiter.
 *
 * NOTE: This in-memory store is designed for single-instance deployments.
 * If deploying across multiple load-balanced container instances (e.g. Kubernetes, AWS ECS, Multi-Region),
 * a distributed store such as Redis or Memcached should be utilized.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipStore = new Map<string, RateLimitRecord>();

// Periodic memory cleanup for stale records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipStore.entries()) {
    if (now > record.resetTime) {
      ipStore.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

export function createRateLimiter(options: { windowMs: number; max: number; message?: string }) {
  const { windowMs, max, message = 'Too many requests. Please try again later.' } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    // Rely exclusively on Express's configured IP resolution (respecting trust proxy)
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const record = ipStore.get(ip);

    if (!record || now > record.resetTime) {
      ipStore.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }

    if (record.count >= max) {
      res.status(429).json({
        success: false,
        error: message,
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
      });
      return;
    }

    record.count++;
    next();
  };
}

export const adminLoginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: 'Too many admin login attempts from this IP address. Please wait 15 minutes before trying again.',
});

export const inquiryLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: 'Inquiry submission limit reached. Please wait a few minutes before submitting another brief.',
});

export const newsletterLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: 'Too many subscription attempts. Please try again later.',
});

export const userAuthLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: 'Too many authentication attempts from this IP. Please wait a few minutes before trying again.',
});


