import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getDatabase } from '../db/database.js';

export const createEstimateSchema = z.object({
  productType: z.string().trim().min(1, 'Product type is required').max(100, 'Product type too long'),
  scope: z.string().trim().min(1, 'Scope level is required').max(100, 'Scope level too long'),
  features: z.array(z.string().trim().max(100)).max(30, 'Maximum 30 features').default([]),
  timeline: z.string().trim().min(1, 'Timeline is required').max(100, 'Timeline too long'),
  estimatedCost: z.string().trim().min(1, 'Estimated cost is required').max(100, 'Estimated cost too long'),
  clientName: z.string().trim().max(100, 'Client name too long').optional().nullable(),
  clientEmail: z.string().trim().email('Invalid email').max(254, 'Email too long').optional().nullable(),
});

export async function createEstimate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = req.body;
    const db = getDatabase();

    const id = `est_${Date.now()}`;
    // Random readable reference code: EST-XXXXX
    const refCode = `EST-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO estimates (
        id, reference_code, product_type, scope, features, timeline, estimated_cost, client_name, client_email, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      id,
      refCode,
      data.productType,
      data.scope,
      JSON.stringify(data.features || []),
      data.timeline,
      data.estimatedCost,
      data.clientName || null,
      data.clientEmail || null,
      now
    );

    res.status(201).json({
      success: true,
      message: 'Scope estimate saved successfully',
      data: {
        referenceCode: refCode,
        estimateId: id,
        productType: data.productType,
        estimatedCost: data.estimatedCost,
        timeline: data.timeline,
        shareUrl: `${req.protocol}://${req.get('host')}/api/estimates/${refCode}`,
        createdAt: now,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getEstimateByRef(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const referenceCode = String(req.params.referenceCode);
    const db = getDatabase();

    const stmt = db.prepare('SELECT * FROM estimates WHERE reference_code = ?');
    const row = stmt.get(referenceCode) as any;

    if (!row) {
      res.status(404).json({
        success: false,
        error: 'Estimate not found with this reference code',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: row.id,
        referenceCode: row.reference_code,
        productType: row.product_type,
        scope: row.scope,
        features: JSON.parse(row.features || '[]'),
        timeline: row.timeline,
        estimatedCost: row.estimated_cost,
        clientName: row.client_name,
        clientEmail: row.client_email,
        createdAt: row.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
}
