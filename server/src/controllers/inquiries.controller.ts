import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getDatabase } from '../db/database.js';
import { emailService } from '../services/email.service.js';
import { Inquiry } from '../types/index.js';

export const createInquirySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Please provide a valid email address').max(254, 'Email cannot exceed 254 characters'),
  phone: z.string().trim().max(30, 'Phone cannot exceed 30 characters').optional().nullable(),
  company: z.string().trim().max(150, 'Company cannot exceed 150 characters').optional().nullable(),
  services: z.array(z.string().trim().max(100, 'Service name cannot exceed 100 characters')).max(20, 'Maximum of 20 services allowed').default([]),
  budget: z.string().trim().max(100, 'Budget length invalid').default('$5,000 – $10,000'),
  timeline: z.string().trim().max(100, 'Timeline length invalid').default('Within 4 weeks'),
  message: z.string().trim().min(5, 'Please provide more details about your project (minimum 5 characters)').max(5000, 'Message cannot exceed 5000 characters'),
});

export async function submitInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = req.body;
    const db = getDatabase();

    const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    const insertStmt = db.prepare(`
      INSERT INTO inquiries (
        id, name, email, company, services, budget, timeline, message, status, ip_address, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?)
    `);

    insertStmt.run(
      id,
      data.name,
      data.email,
      data.company || null,
      JSON.stringify(data.services || []),
      data.budget,
      data.timeline,
      data.message,
      ip,
      now,
      now
    );

    const inquiry: Inquiry = {
      id,
      name: data.name,
      email: data.email,
      company: data.company || null,
      services: data.services || [],
      budget: data.budget,
      timeline: data.timeline,
      message: data.message,
      status: 'new',
      ip_address: ip,
      created_at: now,
      updated_at: now,
    };

    // Asynchronously dispatch emails without blocking client response
    emailService.sendClientConfirmation(inquiry).catch((err) => {
      console.error('[EmailService] Client confirmation failed:', err?.message || err);
    });
    emailService.sendAgencyTeamNotification(inquiry).catch((err) => {
      console.error('[EmailService] Team notification failed:', err?.message || err);
    });

    res.status(201).json({
      success: true,
      message: 'Project inquiry received successfully. A team architect will respond within 12 business hours.',
      data: {
        inquiryId: id,
        email: data.email,
        name: data.name,
        receivedAt: now,
      },
    });
  } catch (error) {
    next(error);
  }
}

