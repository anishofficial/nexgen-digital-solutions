import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  // Ensure data directory exists
  const dataDir = path.dirname(config.dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = new DatabaseSync(config.dbPath);

  // Enable foreign keys and WAL mode for reliability and performance
  db.exec('PRAGMA foreign_keys = ON;');
  try {
    db.exec('PRAGMA journal_mode = WAL;');
  } catch {
    // WAL mode fallback for specific embedded container systems
  }

  // Run migrations / schema initialization
  initSchema(db);

  // Seed default admin if missing
  seedAdmin(db);

  dbInstance = db;
  return db;
}

function initSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      services TEXT NOT NULL, -- JSON array of requested disciplines
      budget TEXT NOT NULL,
      timeline TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'scoping', 'proposal_sent', 'won', 'archived'
      internal_notes TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
    CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
    CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);

    CREATE TABLE IF NOT EXISTS estimates (
      id TEXT PRIMARY KEY,
      reference_code TEXT UNIQUE NOT NULL,
      product_type TEXT NOT NULL,
      scope TEXT NOT NULL,
      features TEXT NOT NULL, -- JSON array
      timeline TEXT NOT NULL,
      estimated_cost TEXT NOT NULL,
      client_name TEXT,
      client_email TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_estimates_ref ON estimates(reference_code);

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      source TEXT NOT NULL DEFAULT 'website_footer',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'architect',
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);
}

function seedAdmin(db: DatabaseSync): void {
  if (!config.admin.email || !config.admin.password) {
    return;
  }

  const checkStmt = db.prepare('SELECT id FROM admin_users WHERE email = ?');
  const existing = checkStmt.get(config.admin.email.toLowerCase()) as { id: string } | undefined;

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(config.admin.password, salt);
  const now = new Date().toISOString();

  if (!existing) {
    const id = `admin_${Date.now()}`;
    const insertStmt = db.prepare(`
      INSERT INTO admin_users (id, email, name, role, password_hash, created_at)
      VALUES (?, ?, ?, 'superadmin', ?, ?)
    `);

    insertStmt.run(id, config.admin.email.toLowerCase(), config.admin.name, passwordHash, now);
    console.log(`[Database] Admin credentials configured for ${config.admin.email}.`);
  } else {
    const updateStmt = db.prepare(`
      UPDATE admin_users
      SET password_hash = ?, name = ?
      WHERE email = ?
    `);
    updateStmt.run(passwordHash, config.admin.name, config.admin.email.toLowerCase());
    console.log(`[Database] Admin credentials synchronized for ${config.admin.email}.`);
  }
}

