import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getDatabase } from '../db/database.js';

export const subscribeSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(254, 'Email too long'),
  source: z.string().trim().max(100, 'Source too long').default('website_footer'),
});

export async function subscribeNewsletter(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, source } = req.body;
    const db = getDatabase();

    // Check existing
    const checkStmt = db.prepare('SELECT id FROM newsletter_subscribers WHERE email = ?');
    const existing = checkStmt.get(email);

    if (existing) {
      res.json({
        success: true,
        message: 'You are already subscribed to the NexGen dispatch!',
      });
      return;
    }

    const id = `sub_${Date.now()}`;
    const now = new Date().toISOString();

    const insertStmt = db.prepare('INSERT INTO newsletter_subscribers (id, email, source, created_at) VALUES (?, ?, ?, ?)');
    insertStmt.run(id, email, source || 'website_footer', now);

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to NexGen insights and tech architecture breakdowns.',
    });
  } catch (error) {
    next(error);
  }
}
