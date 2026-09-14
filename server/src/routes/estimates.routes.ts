import { Router } from 'express';
import { createEstimate, getEstimateByRef, createEstimateSchema } from '../controllers/estimates.controller.js';
import { validateBody } from '../middleware/validate.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

export const estimatesRouter = Router();

const estimateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
});

estimatesRouter.post('/', estimateLimiter, validateBody(createEstimateSchema), createEstimate);
estimatesRouter.get('/:referenceCode', getEstimateByRef);
