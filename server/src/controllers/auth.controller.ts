import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../db/database.js';
import { config } from '../config/env.js';
import { AppUser, AuthTokenPayload, UserProfileResponse } from '../types/index.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeName(name?: string, email?: string): string {
  if (name && name.trim().length > 0) {
    return name.trim().slice(0, 80);
  }
  if (email) {
    const prefix = email.split('@')[0];
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  return 'Client User';
}

/**
 * Register a new User account
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name } = req.body;

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      res.status(400).json({
        success: false,
        code: 'INVALID_EMAIL',
        error: 'Please provide a valid email address.',
      });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({
        success: false,
        code: 'INVALID_PASSWORD',
        error: 'Password must be at least 6 characters in length.',
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = getDatabase();

    // Check if user already exists
    const existingStmt = db.prepare('SELECT id FROM users WHERE email = ?');
    const existing = existingStmt.get(normalizedEmail) as { id: string } | undefined;

    if (existing) {
      res.status(409).json({
        success: false,
        code: 'USER_ALREADY_EXISTS',
        error: 'An account with this email already exists. Please sign in instead.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const displayName = sanitizeName(name, normalizedEmail);
    const now = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO users (id, email, name, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(id, normalizedEmail, displayName, passwordHash, now, now);

    const payload: AuthTokenPayload = {
      sub: id,
      userId: id,
      email: normalizedEmail,
      name: displayName,
      role: 'user',
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });

    const userProfile: UserProfileResponse = {
      id,
      email: normalizedEmail,
      name: displayName,
      role: 'user',
      created_at: now,
    };

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: userProfile,
    });
  } catch (error) {
    console.error('[AuthController.register] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user account. Please try again.',
    });
  }
}

/**
 * Log in an existing User account
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      res.status(400).json({
        success: false,
        code: 'INVALID_EMAIL',
        error: 'Please enter a valid email address.',
      });
      return;
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      res.status(400).json({
        success: false,
        code: 'MISSING_PASSWORD',
        error: 'Please enter your password.',
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = getDatabase();

    const stmt = db.prepare('SELECT id, email, name, password_hash, created_at, updated_at FROM users WHERE email = ?');
    const user = stmt.get(normalizedEmail) as AppUser | undefined;

    if (!user) {
      // Return distinctive signal so frontend can smoothly suggest or auto-switch to Sign Up
      res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        notFound: true,
        error: 'No account found with this email. Please sign up to create your account.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        code: 'INVALID_CREDENTIALS',
        error: 'Incorrect password. Please verify your credentials and try again.',
      });
      return;
    }

    const payload: AuthTokenPayload = {
      sub: user.id,
      userId: user.id,
      email: user.email,
      name: user.name,
      role: 'user',
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });

    const userProfile: UserProfileResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'user',
      created_at: user.created_at,
    };

    res.status(200).json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: userProfile,
    });
  } catch (error) {
    console.error('[AuthController.login] Error:', error);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred during sign in. Please try again.',
    });
  }
}

/**
 * Get current authenticated user profile
 */
export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user || !req.user.sub) {
      res.status(401).json({
        success: false,
        error: 'Authentication required.',
      });
      return;
    }

    const db = getDatabase();

    // Check users table
    const stmt = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?');
    const user = stmt.get(req.user.sub) as { id: string; email: string; name: string; created_at: string } | undefined;

    if (user) {
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'user',
          created_at: user.created_at,
        },
      });
      return;
    }

    // Check if it is an admin user
    const adminStmt = db.prepare('SELECT id, email, name, role, created_at FROM admin_users WHERE id = ?');
    const admin = adminStmt.get(req.user.sub) as { id: string; email: string; name: string; role: string; created_at: string } | undefined;

    if (admin) {
      res.status(200).json({
        success: true,
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          created_at: admin.created_at,
        },
      });
      return;
    }

    res.status(404).json({
      success: false,
      error: 'User profile not found.',
    });
  } catch (error) {
    console.error('[AuthController.getMe] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve profile.',
    });
  }
}

/**
 * Sign out endpoint
 */
export function logout(req: Request, res: Response): void {
  res.status(200).json({
    success: true,
    message: 'Signed out successfully.',
  });
}
