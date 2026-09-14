import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AuthTokenPayload } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: 'Authentication required. Authorization header is missing.',
    });
    return;
  }

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    res.status(401).json({
      success: false,
      error: 'Malformed Authorization header. Format must be: Bearer <token>',
    });
    return;
  }

  const token = parts[1];
  if (!token || token.trim() === '') {
    res.status(401).json({
      success: false,
      error: 'Authentication token is empty or missing.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthTokenPayload;
    const adminId = decoded.sub || decoded.userId;

    if (!decoded || !adminId || !decoded.email) {
      res.status(401).json({
        success: false,
        error: 'Invalid token payload',
      });
      return;
    }

    req.user = {
      ...decoded,
      sub: adminId,
      userId: adminId,
    };
    next();
  } catch (err: any) {
    const isExpired = err && err.name === 'TokenExpiredError';
    res.status(401).json({
      success: false,
      error: isExpired
        ? 'Session expired. Please sign in again.'
        : 'Invalid or revoked authentication token.',
    });
  }
}


