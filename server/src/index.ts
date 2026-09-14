import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { getDatabase } from './db/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRouter } from './routes/health.routes.js';
import { inquiriesRouter } from './routes/inquiries.routes.js';
import { estimatesRouter } from './routes/estimates.routes.js';
import { newsletterRouter } from './routes/newsletter.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { authRouter } from './routes/auth.routes.js';

const app = express();

// Trust proxy if configured behind a reverse proxy (e.g. Nginx, Cloudflare, Fly, Railway, AWS ALB)
app.set('trust proxy', config.trustProxy ? 1 : false);

// Build strict CORS & CSP connect-src allowlist
const rawAllowed = [
  ...config.clientUrl.split(','),
  ...config.corsOrigins.split(','),
  ...(config.isProduction ? [] : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173']),
];

const allowedOrigins = Array.from(
  new Set(
    rawAllowed
      .map(origin => origin.trim().replace(/\/+$/, ''))
      .filter(Boolean)
  )
);

// Security Headers with Content-Security-Policy supporting Google Fonts, assets & configured API connections
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  frameguard: { action: 'deny' },
  xContentTypeOptions: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: config.isProduction ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  } : false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: [
        "'self'",
        ...allowedOrigins,
        ...(config.isProduction ? [] : ['http://localhost:*', 'ws://localhost:*', 'http://127.0.0.1:*'])
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: config.isProduction ? [] : null,
    },
  },
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests with no origin header (mobile apps, server-to-server, curl, health checks)
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = origin.trim().replace(/\/+$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: Origin ${origin} is not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  maxAge: 86400, // 24 hours preflight cache
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logger in development
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms) [IP: ${req.ip}]`);
    });
    next();
  });
}

// Health check endpoints (available at both /health and /api/health)
app.use('/health', healthRouter);
app.use('/api/health', healthRouter);

// Application API Routes
app.use('/api/auth', authRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/estimates', estimatesRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/admin', adminRouter);

// 404 Route Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Initialize DB and start server
try {
  getDatabase();
  console.log(`[Database] SQLite initialized successfully.`);

  const server = app.listen(config.port, () => {
    console.log(`=============================================`);
    console.log(`⚡ NexGen Studio Backend API is live!`);
    console.log(`🌐 Environment: ${config.nodeEnv}`);
    console.log(`🩺 Health: http://localhost:${config.port}/health`);
    console.log(`🔐 Admin authentication: Active`);
    console.log(`=============================================`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('\n[Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
} catch (error) {
  console.error('[FatalError] Failed to bootstrap NexGen backend:', error);
  process.exit(1);
}


