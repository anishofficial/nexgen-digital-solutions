import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller.js';
import { userAuthLimiter } from '../middleware/rateLimiter.js';
import { requireUserAuth } from '../middleware/auth.js';

export const authRouter = Router();

// User Registration & Login (Rate-limited against brute-force)
authRouter.post('/register', userAuthLimiter, register);
authRouter.post('/signup', userAuthLimiter, register);
authRouter.post('/login', userAuthLimiter, login);
authRouter.post('/signin', userAuthLimiter, login);

// Authenticated User Profile
authRouter.get('/me', requireUserAuth, getMe);

// Sign Out
authRouter.post('/logout', logout);
