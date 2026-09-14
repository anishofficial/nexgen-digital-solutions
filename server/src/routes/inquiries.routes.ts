import { Router } from 'express';
import { submitInquiry, createInquirySchema } from '../controllers/inquiries.controller.js';
import { validateBody } from '../middleware/validate.js';
import { inquiryLimiter } from '../middleware/rateLimiter.js';

export const inquiriesRouter = Router();

// Rate limit lead submissions: max 10 submissions per 15 minutes per IP
inquiriesRouter.post('/', inquiryLimiter, validateBody(createInquirySchema), submitInquiry);

