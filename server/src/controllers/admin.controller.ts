import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { getDatabase } from '../db/database.js';
import { config } from '../config/env.js';
import { getStudioMetrics } from '../services/analytics.service.js';
import { AuthTokenPayload, InquiryStatus } from '../types/index.js';

const VALID_STATUSES: InquiryStatus[] = ['new', 'contacted', 'scoping', 'proposal_sent', 'won', 'archived'];

export const adminLoginSchema = z.object({
  email: z.string().trim().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export const updateInquirySchema = z.object({
  status: z.enum(['new', 'contacted', 'scoping', 'proposal_sent', 'won', 'archived'] as const).optional(),
  internal_notes: z.string().max(5000, 'Internal notes cannot exceed 5000 characters').optional(),
});

export async function adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const db = getDatabase();

    const userStmt = db.prepare('SELECT * FROM admin_users WHERE email = ?');
    const user = userStmt.get(email.toLowerCase()) as any;

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password credentials',
      });
      return;
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password credentials',
      });
      return;
    }

    const payload: AuthTokenPayload = {
      sub: user.id,
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });

    res.json({
      success: true,
      message: 'Admin authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function adminLogout(_req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    message: 'Admin session logged out successfully',
  });
}

export async function listInquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const db = getDatabase();
    const { status, limit, offset, page } = req.query;

    // Validate status query parameter
    if (status !== undefined && status !== '') {
      if (typeof status !== 'string' || (!VALID_STATUSES.includes(status as InquiryStatus) && status !== 'all')) {
        res.status(400).json({
          success: false,
          error: `Invalid status parameter. Allowed values: ${VALID_STATUSES.join(', ')}, all`,
        });
        return;
      }
    }

    // Validate and clamp limit
    let parsedLimit = 50;
    if (limit !== undefined && limit !== '') {
      const num = Number(limit);
      if (isNaN(num) || !Number.isInteger(num) || num < 1) {
        res.status(400).json({
          success: false,
          error: 'Invalid limit parameter. Must be a positive integer between 1 and 100.',
        });
        return;
      }
      parsedLimit = Math.min(num, 100);
    }

    // Validate and clamp offset/page
    let parsedOffset = 0;
    if (offset !== undefined && offset !== '') {
      const num = Number(offset);
      if (isNaN(num) || !Number.isInteger(num) || num < 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid offset parameter. Must be a non-negative integer.',
        });
        return;
      }
      parsedOffset = num;
    } else if (page !== undefined && page !== '') {
      const num = Number(page);
      if (isNaN(num) || !Number.isInteger(num) || num < 1) {
        res.status(400).json({
          success: false,
          error: 'Invalid page parameter. Must be a positive integer (>= 1).',
        });
        return;
      }
      parsedOffset = (num - 1) * parsedLimit;
    }

    let sql = 'SELECT * FROM inquiries';
    let countSql = 'SELECT COUNT(*) as count FROM inquiries';
    const params: any[] = [];
    const countParams: any[] = [];

    if (status && typeof status === 'string' && status !== 'all' && VALID_STATUSES.includes(status as InquiryStatus)) {
      sql += ' WHERE status = ?';
      countSql += ' WHERE status = ?';
      params.push(status);
      countParams.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parsedLimit, parsedOffset);

    const rows = db.prepare(sql).all(...params) as any[];

    // Parse records safely
    const inquiries = rows.map((r) => {
      let parsedServices: string[] = [];
      try {
        parsedServices = JSON.parse(r.services || '[]');
        if (!Array.isArray(parsedServices)) parsedServices = [];
      } catch {
        parsedServices = [];
      }

      return {
        id: r.id,
        name: r.name,
        email: r.email,
        company: r.company || null,
        services: parsedServices,
        budget: r.budget,
        timeline: r.timeline,
        message: r.message,
        status: r.status as InquiryStatus,
        internalNotes: r.internal_notes || null,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    });

    const totalCountRow = db.prepare('SELECT COUNT(*) as count FROM inquiries').get() as { count: number };
    const filteredCountRow = db.prepare(countSql).get(...countParams) as { count: number };

    res.json({
      success: true,
      total: totalCountRow.count,
      filteredTotal: filteredCountRow.count,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);
    const { status, internal_notes } = req.body;
    const db = getDatabase();

    const existing = db.prepare('SELECT id FROM inquiries WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Inquiry not found' });
      return;
    }

    const now = new Date().toISOString();

    if (status && internal_notes !== undefined) {
      db.prepare('UPDATE inquiries SET status = ?, internal_notes = ?, updated_at = ? WHERE id = ?')
        .run(status, internal_notes, now, id);
    } else if (status) {
      db.prepare('UPDATE inquiries SET status = ?, updated_at = ? WHERE id = ?')
        .run(status, now, id);
    } else if (internal_notes !== undefined) {
      db.prepare('UPDATE inquiries SET internal_notes = ?, updated_at = ? WHERE id = ?')
        .run(internal_notes, now, id);
    }

    const updated = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id) as any;

    res.json({
      success: true,
      message: 'Inquiry updated successfully',
      data: {
        id: updated.id,
        status: updated.status,
        internalNotes: updated.internal_notes,
        updatedAt: updated.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getDashboardMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const metrics = getStudioMetrics();
    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
}


