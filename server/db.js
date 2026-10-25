// Database layer.
// Uses PostgreSQL when DATABASE_URL is set (production on Render).
// Without DATABASE_URL it runs an in memory Postgres (pg-mem) so the
// project works locally straight away. In memory data resets on restart.
import pg from 'pg';
import { seedLawyers, seedPracticeAreas } from './seed.js';

let pool;
export let usingMemoryDb = false;

async function createPool() {
  if (process.env.DATABASE_URL) {
    const ssl = process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false };
    return new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl, max: 10 });
  }
  usingMemoryDb = true;
  const { newDb } = await import('pg-mem');
  const mem = newDb();
  const { Pool } = mem.adapters.createPg();
  return new Pool();
}

export async function query(text, params = []) {
  const res = await pool.query(text, params);
  return res.rows;
}

export async function one(text, params = []) {
  const rows = await query(text, params);
  return rows[0] || null;
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS lawyers (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    languages TEXT NOT NULL DEFAULT '',
    education TEXT NOT NULL DEFAULT '',
    admissions TEXT NOT NULL DEFAULT '',
    practice_areas TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    linkedin TEXT NOT NULL DEFAULT '',
    photo TEXT,
    photo_type TEXT,
    photo_version INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS practice_areas (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT TRUE
  )`,
  `CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    kind TEXT NOT NULL DEFAULT 'contact',
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    subject TEXT NOT NULL DEFAULT '',
    practice_area TEXT NOT NULL DEFAULT '',
    preferred_date TEXT NOT NULL DEFAULT '',
    preferred_time TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS chat_sessions (
    id SERIAL PRIMARY KEY,
    token TEXT UNIQUE NOT NULL,
    visitor_name TEXT NOT NULL DEFAULT '',
    visitor_email TEXT NOT NULL DEFAULT '',
    visitor_phone TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'open',
    unread_admin INTEGER NOT NULL DEFAULT 0,
    unread_visitor INTEGER NOT NULL DEFAULT 0,
    page TEXT NOT NULL DEFAULT '',
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    sender TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT ''
  )`
];

export const DEFAULT_SETTINGS = {
  firm_name: 'Athanasiadou Law Firm',
  email: 'info@athanasiadoulaw.com',
  phone: '+357 24 044835',
  address_line1: 'Panagioti Kanellopoulou 18, Sakkas Court 3, Office 102',
  address_line2: '6057 Larnaca, Cyprus',
  hours: 'Monday to Friday, 9:00 to 17:00',
  chat_welcome: 'Welcome to Athanasiadou Law Firm. How can we help you today? A member of our team will reply here as soon as possible.',
  chat_offline: 'Our team is currently away. Leave your message and your email, and we will get back to you.',
  facebook: '',
  instagram: '',
  linkedin: ''
};

export async function initDb() {
  pool = await createPool();
  for (const stmt of SCHEMA) await pool.query(stmt);
  if (!usingMemoryDb) {
    await pool.query('CREATE INDEX IF NOT EXISTS chat_messages_session_idx ON chat_messages (session_id, id)');
  }

  const [{ count: lawyerCount }] = await query('SELECT COUNT(*)::int AS count FROM lawyers');
  if (Number(lawyerCount) === 0) {
    for (const [i, l] of seedLawyers.entries()) {
      await query(
        `INSERT INTO lawyers (slug, name, title, email, phone, languages, education, admissions, practice_areas, summary, bio, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [l.slug, l.name, l.title, l.email, l.phone, l.languages, l.education, l.admissions, l.practice_areas, l.summary, l.bio, i]
      );
    }
  }

  const [{ count: areaCount }] = await query('SELECT COUNT(*)::int AS count FROM practice_areas');
  if (Number(areaCount) === 0) {
    for (const [i, a] of seedPracticeAreas.entries()) {
      await query(
        'INSERT INTO practice_areas (slug, name, summary, body, sort_order) VALUES ($1,$2,$3,$4,$5)',
        [a.slug, a.name, a.summary, a.body, i]
      );
    }
  }

  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    const existing = await one('SELECT key FROM settings WHERE key = $1', [key]);
    if (!existing) await query('INSERT INTO settings (key, value) VALUES ($1, $2)', [key, value]);
  }
}

export async function getSettings() {
  const rows = await query('SELECT key, value FROM settings');
  const out = { ...DEFAULT_SETTINGS };
  for (const r of rows) out[r.key] = r.value;
  return out;
}
