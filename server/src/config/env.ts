import dotenv from 'dotenv';
import path from 'node:path';

// Load environment variables from .env in development
dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

// Strict validation helper for production deployments
function validateEnvironment(): void {
  const errors: string[] = [];

  if (isProduction) {
    const clientUrl = process.env.CLIENT_URL;
    if (!clientUrl || clientUrl.trim() === '') {
      errors.push('Missing required environment variable: CLIENT_URL');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret.trim() === '') {
      errors.push('Missing required environment variable: JWT_SECRET');
    } else if (jwtSecret.length < 32) {
      errors.push('JWT_SECRET must be at least 32 characters in production');
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail.trim())) {
      errors.push('Missing or invalid required environment variable: ADMIN_EMAIL');
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || adminPassword.length < 12) {
      errors.push('ADMIN_PASSWORD must be at least 12 characters in production');
    }
  }

  if (errors.length > 0) {
    console.error('====================================================');
    console.error('❌ CONFIGURATION ERROR: Server startup aborted.');
    errors.forEach((err) => console.error(`   • ${err}`));
    console.error('====================================================');
    throw new Error(`Production environment configuration validation failed: ${errors.join('; ')}`);
  }
}

// Run validation immediately during module import
validateEnvironment();

const rawDbPath = process.env.DATABASE_PATH || './data/nexgen.db';
const resolvedDbPath = path.isAbsolute(rawDbPath)
  ? rawDbPath
  : path.resolve(process.cwd(), rawDbPath);

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  isProduction,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  corsOrigins: process.env.CORS_ORIGINS || '',
  trustProxy: process.env.TRUST_PROXY === 'true' || process.env.TRUST_PROXY === '1',
  jwtSecret: process.env.JWT_SECRET || (isProduction ? '' : 'dev_only_jwt_secret_must_be_configured_in_production_32chars'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  admin: {
    email: (process.env.ADMIN_EMAIL || (isProduction ? '' : 'admin@example.com')).trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || (isProduction ? '' : 'DevAdminPass123!'),
    name: process.env.ADMIN_NAME || 'NexGen Lead Architect',
  },
  email: {
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
    smtpUser: process.env.SMTP_USER || '',
    smtpPassword: process.env.SMTP_PASSWORD || process.env.SMTP_PASS || '',
    agencyNotificationEmail: process.env.AGENCY_NOTIFICATION_EMAIL || (isProduction ? '' : 'leads@example.com'),
    fromEmail: process.env.FROM_EMAIL || (isProduction ? '' : '"NexGen Studio" <hello@example.com>'),
  },
  dbPath: resolvedDbPath,
};


