import { Router } from 'express';
import { subscribeNewsletter, subscribeSchema } from '../controllers/newsletter.controller.js';
import { validateBody } from '../middleware/validate.js';
import { newsletterLimiter } from '../middleware/rateLimiter.js';

export const newsletterRouter = Router();

newsletterRouter.post('/subscribe', newsletterLimiter, validateBody(subscribeSchema), subscribeNewsletter);

