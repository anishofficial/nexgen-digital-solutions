# NexGen Studio — Production Digital Product Agency Platform

A modern, high-performance web agency platform engineered with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and an **Express + SQLite (`node:sqlite`)** backend API.

---

## 🏗️ Architecture Overview

- **Frontend (`/src`)**:
  - React 19 + TypeScript + Vite with smooth scroll navigation and reactive theme switching (Dark, Light, System).
  - High-converting lead capture form, interactive scope/pricing estimator, and 8-discipline agency portfolio.
  - Authenticated Admin Console (`/admin`) backed by JWT session tokens in `sessionStorage` (zero client-side bypasses).
- **Backend (`/server`)**:
  - Express + TypeScript REST API with strict CORS allowlist and Helmet Content Security Policy.
  - Zero-config embedded SQLite persistence via Node.js native `DatabaseSync` (`node:sqlite`) with Write-Ahead Logging (WAL) and foreign keys enabled.
  - Salting & bcrypt hashing for admin authentication.
  - Built-in rate limiting on authentication, inquiry submissions, and newsletters.
  - Asynchronous transactional email dispatch via Nodemailer (with safe non-blocking fallback and HTML escaping).

---

## 📋 Prerequisites

- **Node.js**: `v22.0.0+` (Required for native `node:sqlite` support)
- **npm**: `v10.0.0+`

---

## 💻 DEVELOPMENT SETUP

### 1. Install Dependencies

```bash
# Install root/frontend dependencies
npm ci

# Install backend dependencies
cd server
npm ci
cd ..
```

### 2. Configure Local Development Environment

**Frontend (`.env`):**
```bash
cp .env.example .env
```
Default contents:
```env
VITE_API_URL=http://localhost:5000
```

**Backend (`server/.env`):**
```bash
cp server/.env.example server/.env
```
Configure your local development variables in `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
TRUST_PROXY=false

# In development, fallback credentials are provided if omitted
JWT_SECRET=dev_only_jwt_secret_must_be_configured_in_production_32chars
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=DevAdminPass123!
```

### 3. Start Development Servers

Run backend and frontend concurrently in separate terminal windows:

```bash
# Terminal 1: Backend API (Live reload on http://localhost:5000)
npm run dev:server

# Terminal 2: Frontend Client (Vite on http://localhost:5173)
npm run dev
```

---

## 🚀 PRODUCTION DEPLOYMENT

### 1. Pre-Deployment Configuration

1. Replace `https://YOUR_PRODUCTION_DOMAIN.example` in:
   - `index.html` (canonical and Open Graph URLs)
   - `public/robots.txt`
   - `public/sitemap.xml`
2. Generate a secure, cryptographically random JWT secret (at least 32 characters):
   ```bash
   openssl rand -base64 32
   ```
3. Choose a strong, unique administrator password (minimum 12 characters).

### 2. Set Production Environment Variables

Configure the following environment variables on your production hosting platform (e.g. Railway, Render, Fly.io, AWS, Docker):

| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | **Yes** | Must be set to `production` | `production` |
| `PORT` | **Yes** | HTTP listen port | `5000` |
| `CLIENT_URL` | **Yes** | Primary frontend domain | `https://YOUR_PRODUCTION_DOMAIN.example` |
| `CORS_ORIGINS` | No | Additional allowed origins (comma-separated) | `https://admin.YOUR_PRODUCTION_DOMAIN.example` |
| `JWT_SECRET` | **Yes** | Signing secret for admin JWT tokens (min 32 chars) | *(32+ random characters)* |
| `ADMIN_EMAIL` | **Yes** | Initial administrator email address | `admin@YOUR_PRODUCTION_DOMAIN.example` |
| `ADMIN_PASSWORD` | **Yes** | Initial administrator password (min 12 chars) | *(Strong unique password)* |
| `ADMIN_NAME` | No | Administrator display name | `"NexGen Lead Architect"` |
| `DATABASE_PATH` | No | SQLite database file location | `./data/nexgen.db` |
| `TRUST_PROXY` | No | Set to `true` if behind reverse proxy / Cloudflare / ALB | `true` |
| `SMTP_HOST` | No | Outbound SMTP server hostname | `smtp.mailgun.org` |
| `SMTP_PORT` | No | SMTP port (587 for TLS, 465 for SSL) | `587` |
| `SMTP_USER` | No | SMTP authentication username | `postmaster@YOUR_PRODUCTION_DOMAIN.example` |
| `SMTP_PASSWORD` | No | SMTP authentication password | *(SMTP password)* |
| `AGENCY_NOTIFICATION_EMAIL` | No | Recipient email for inbound brief alerts | `leads@YOUR_PRODUCTION_DOMAIN.example` |
| `FROM_EMAIL` | No | Sender address on automated confirmations | `"NexGen Studio" <hello@YOUR_PRODUCTION_DOMAIN.example>` |

### 3. Build & Validate

```bash
# 1. Verify TypeScript & build frontend + backend
npm run build:all

# 2. Run release hygiene and prepublish check
npm run check:release
```

### 4. Start Production Server

```bash
cd server
npm run start
```

---

## 🔒 Security Architecture

1. **Authentication Boundary**:
   - The Admin Portal (`/admin`) requires verification via `POST /api/admin/login`.
   - Admin passwords are verified using `bcrypt` (10 salt rounds).
   - Bearer JWT tokens are stored in `sessionStorage` and cleared upon sign out or 401 session expiration.
   - Zero hardcoded passwords, demo bypasses, or client-side authentication booleans exist in the bundle.
2. **CORS & Headers**:
   - Helmet enforces strict HTTP headers including Content-Security-Policy (CSP) with dynamic connect-src and HSTS in production.
   - CORS strictly permits only origins defined in `CLIENT_URL` / `CORS_ORIGINS`.
3. **Database Integrity**:
   - Automatic database schema and admin initialization on deployment.
   - Database binaries and temporary WAL files are excluded from source control and release archives.
   - Foreign key constraints enabled (`PRAGMA foreign_keys = ON;`).
   - Write-Ahead Logging (`PRAGMA journal_mode = WAL;`) for high concurrency.
4. **Email Security**:
   - All user-controlled parameters (`name`, `email`, `company`, `services`, `budget`, `timeline`, `message`) are escaped using a robust `escapeHtml()` utility before injection into email templates.
5. **Rate Limiting**:
   - In-memory rate limiting applied to login (5/15min), inquiries (10/15min), and newsletter subscriptions (5/15min).

---

## 📡 Key API Endpoints

- `GET /health` & `GET /api/health` — System health probe
- `POST /api/inquiries` — Public client brief submission
- `POST /api/estimates` — Interactive scope calculator save
- `POST /api/newsletter/subscribe` — Newsletter subscription
- `POST /api/admin/login` — Administrator authentication
- `POST /api/admin/logout` — Administrator session termination
- `GET /api/admin/metrics` — Dashboard KPI metrics & pipeline revenue (Auth required)
- `GET /api/admin/inquiries` — Lead triage and brief management with pagination (Auth required)
- `PATCH /api/admin/inquiries/:id` — Inquiry status & internal notes update (Auth required)

---

## 📄 License

Proprietary © NexGen Solutions. All rights reserved.

