# NexGen Studio — Backend API Architecture

High-performance, type-safe Express & TypeScript API backend with native SQLite persistence.

---

## ⚡ Technical Specifications

- **Runtime**: Node.js v22+
- **Database**: `node:sqlite` (`DatabaseSync`) with WAL mode & Foreign Keys
- **Authentication**: JWT Bearer Tokens with bcrypt password hashing
- **Security**: Helmet CSP & HSTS, strict origin CORS validation, IP rate limiting, input sanitization via Zod
- **Email Service**: Nodemailer with graceful fallback handling and HTML escaping

---

## 🚀 Development Setup

```bash
# Install dependencies
npm ci

# Copy configuration
cp .env.example .env

# Run development server with live watch
npm run dev

# Compile TypeScript
npm run build

# Start production server
npm run start
```

---

## ⚙️ Production Environment Variables

Configure the following variables in `.env` (or via your cloud container settings):

```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://YOUR_PRODUCTION_DOMAIN.example
CORS_ORIGINS=https://YOUR_PRODUCTION_DOMAIN.example,https://admin.YOUR_PRODUCTION_DOMAIN.example
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
JWT_EXPIRES_IN=1d
ADMIN_EMAIL=admin@YOUR_PRODUCTION_DOMAIN.example
ADMIN_PASSWORD=REPLACE_WITH_A_STRONG_UNIQUE_PASSWORD
ADMIN_NAME="NexGen Lead Architect"
DATABASE_PATH=./data/nexgen.db
TRUST_PROXY=true

# SMTP Email Configuration (Optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
AGENCY_NOTIFICATION_EMAIL=leads@YOUR_PRODUCTION_DOMAIN.example
FROM_EMAIL="NexGen Studio <hello@YOUR_PRODUCTION_DOMAIN.example>"
```

---

## 📡 API Reference

### Public Endpoints

- `GET /health` & `GET /api/health` — Returns status `200` and `{ "status": "ok" }`.
- `POST /api/inquiries` — Records customer project brief. Rate limited (10/15min).
- `POST /api/estimates` — Persists customized scope estimate & returns reference code.
- `POST /api/newsletter/subscribe` — Registers email subscriber. Rate limited (5/15min).

### Protected Endpoints (`Authorization: Bearer <token>`)

- `POST /api/admin/login` — Verifies email & password, returns JWT session token. Rate limited (5/15min).
- `POST /api/admin/logout` — Terminates administrator session context.
- `GET /api/admin/metrics` — Aggregated revenue, conversion rate, deals, and status distributions.
- `GET /api/admin/inquiries?status=new&limit=50&offset=0` — List briefs with pagination and status filtering (validated).
- `PATCH /api/admin/inquiries/:id` — Update lead status (`new`, `contacted`, `scoping`, `proposal_sent`, `won`, `archived`) and append internal notes.

