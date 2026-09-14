// Production Release Readiness & Prepublish Check Script for NexGen Studio

import fs from 'node:fs';
import path from 'node:path';

console.log('🔍 Running NexGen Studio Prepublish & Release Security Audit...\n');

let issuesFound = 0;
let checksPassed = 0;

function pass(msg) {
  console.log(`  ✅ PASS: ${msg}`);
  checksPassed++;
}

function fail(msg) {
  console.error(`  ❌ FAIL: ${msg}`);
  issuesFound++;
}

// 1. Check server/.env does NOT exist
if (fs.existsSync('server/.env')) {
  fail('server/.env exists! It must be removed before packaging for release.');
} else {
  pass('server/.env is not present in repository.');
}

// 2. Check root .env does NOT exist
if (fs.existsSync('.env')) {
  fail('Root .env exists! It must not be committed to release package.');
} else {
  pass('Root .env is not present in repository.');
}

// 3. Check no SQLite database files exist in server/data or root
const dataDir = 'server/data';
if (fs.existsSync(dataDir)) {
  const dbFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.db') || f.endsWith('.db-shm') || f.endsWith('.db-wal'));
  if (dbFiles.length > 0) {
    fail(`Found SQLite database artifacts in ${dataDir}: ${dbFiles.join(', ')}. Database must be generated on deployment.`);
  } else {
    pass('No SQLite database binaries or WAL files found in server/data.');
  }
} else {
  pass('server/data is clean.');
}

// 4. Verify template files exist
if (fs.existsSync('.env.example')) {
  pass('Root .env.example template exists.');
} else {
  fail('Root .env.example template is missing.');
}

if (fs.existsSync('server/.env.example')) {
  pass('server/.env.example template exists.');
} else {
  fail('server/.env.example template is missing.');
}

// 5. Verify package-lock.json files exist
if (fs.existsSync('package-lock.json')) {
  pass('Root package-lock.json exists.');
} else {
  fail('Root package-lock.json is missing.');
}

if (fs.existsSync('server/package-lock.json')) {
  pass('Server package-lock.json exists.');
} else {
  fail('Server package-lock.json is missing.');
}

// 6. Verify .gitignore rules
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  const requiredPatterns = ['node_modules', 'dist', 'server/dist', '.env', 'server/.env', '*.db'];
  const missingPatterns = requiredPatterns.filter(p => !gitignore.includes(p));
  if (missingPatterns.length > 0) {
    fail(`.gitignore is missing rules for: ${missingPatterns.join(', ')}`);
  } else {
    pass('.gitignore contains all required release ignore patterns.');
  }
} else {
  fail('.gitignore is missing.');
}

// 7. Scan source code for forbidden hardcoded secrets / credentials / bypasses
const forbiddenPatterns = [
  'NexGenStudio2026!',
  'admin@nexgenstudio.dev',
  'nexgen_super_secret',
  'nexgen_admin_auth',
  'nexgen2026',
  'localStorage.setItem(\'nexgen_admin_auth\'',
  'localStorage.setItem("nexgen_admin_auth"',
];

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      if (fullPath.endsWith('prepublish-check.mjs')) continue;
      if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.mjs') || entry.name.endsWith('.html')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const pattern of forbiddenPatterns) {
          if (content.includes(pattern)) {
            fail(`Forbidden pattern "${pattern}" detected in ${fullPath}`);
          }
        }
      }
    }
  }
}

scanDirectory('src');
scanDirectory('server/src');
scanDirectory('scripts');

if (issuesFound === 0) {
  pass('Source code scan detected zero hardcoded production credentials, secrets, or bypasses.');
}

console.log('\n=============================================');
if (issuesFound > 0) {
  console.error(`🚨 PREPUBLISH CHECK FAILED: ${issuesFound} critical issue(s) detected.`);
  console.error('=============================================');
  process.exit(1);
} else {
  console.log(`✨ ALL PREPUBLISH CHECKS PASSED (${checksPassed} checks verified).`);
  console.log('🚀 Repository is clean and production-ready.');
  console.log('=============================================');
  process.exit(0);
}
