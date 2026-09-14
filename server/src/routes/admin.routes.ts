import { Router } from 'express';
import { 
  adminLogin, 
  adminLoginSchema, 
  adminLogout,
  listInquiries, 
  updateInquiry, 
  updateInquirySchema, 
  getDashboardMetrics 
} from '../controllers/admin.controller.js';
import { validateBody } from '../middleware/validate.js';
import { requireAdminAuth } from '../middleware/auth.js';
import { adminLoginLimiter } from '../middleware/rateLimiter.js';

export const adminRouter = Router();

// Public admin login (Protected by strict rate limiter)
adminRouter.post('/login', adminLoginLimiter, validateBody(adminLoginSchema), adminLogin);

// Admin logout
adminRouter.post('/logout', adminLogout);

// Protected routes (Requires valid Bearer token)
adminRouter.get('/inquiries', requireAdminAuth, listInquiries);
adminRouter.patch('/inquiries/:id', requireAdminAuth, validateBody(updateInquirySchema), updateInquiry);
adminRouter.get('/metrics', requireAdminAuth, getDashboardMetrics);


