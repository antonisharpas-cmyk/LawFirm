// Database layer.
// Uses PostgreSQL when DATABASE_URL is set (production on Render).
// Without DATABASE_URL it runs an in memory Postgres (pg-mem) so the
// project works locally straight away. In memory data resets on restart.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { seedLawyers, seedPracticeAreas, seedJobs } from './seed.js';

const SEED_IMAGES = path.join(path.dirname(fileURLToPath(import.meta.url)), 'seed-images');
function seedImage(rel) {
  try {
    return fs.readFileSync(path.join(SEED_IMAGES, rel)).toString('base64');
  } catch {
    return null;
  }
}

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
    i18n TEXT NOT NULL DEFAULT '{}',
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
    published BOOLEAN NOT NULL DEFAULT TRUE,
    i18n TEXT NOT NULL DEFAULT '{}',
    image TEXT,
    image_type TEXT,
    image_version INTEGER NOT NULL DEFAULT 0
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
    lang TEXT NOT NULL DEFAULT 'en',
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
  `CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT '',
    employment_type TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    requirements TEXT NOT NULL DEFAULT '',
    i18n TEXT NOT NULL DEFAULT '{}',
    published BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    job_id INTEGER,
    job_title TEXT NOT NULL DEFAULT '',
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    linkedin TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    cv_name TEXT NOT NULL DEFAULT '',
    cv_type TEXT NOT NULL DEFAULT '',
    cv_data TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT ''
  )`
];

export const DEFAULT_SETTINGS = {
  firm_name: 'H.A. Andreou & Co',
  legal_name: 'Helena Antonis Andreou LLC',
  email: 'info@ahllc.com.cy',
  phone: '+357 24 656765',
  fax: '+357 24 824424',
  address_line1: '4 United Nations Street, Anastasia Building, 2nd & 3rd Floor',
  address_line2: '6042 Larnaca, Cyprus',
  map_location: 'Inomenon Ethnon 4, Larnaca 6042, Cyprus',
  hours: 'Monday to Friday, 9:00 to 17:00',
  // Opening hours used by the live chat (Cyprus time). Days: 1 Monday ... 7 Sunday.
  office_days: '1,2,3,4,5',
  office_open: '09:00',
  office_close: '17:00',
  // One date per line: YYYY-MM-DD for a single day, or MM-DD for every year. Text after # is a note.
  office_closed_dates: [
    '01-01 # New Year',
    '01-06 # Epiphany',
    '03-25 # Greek Independence Day',
    '04-01 # Cyprus National Day',
    '05-01 # Labour Day',
    '08-15 # Assumption',
    '10-01 # Cyprus Independence Day',
    '10-28 # Ochi Day',
    '12-25 # Christmas',
    '12-26 # Boxing Day'
  ].join('\n'),
  reply_days: '2',
  notify_email: '',
  chat_welcome: 'Welcome to H.A. Andreou & Co. How can we help you today? A member of our team will reply here as soon as possible.',
  chat_offline: 'Our team is currently away. Leave your message and your email, and we will get back to you.',
  facebook: 'https://www.facebook.com/Andreou-Hji-Christofis-Co-108736367518135',
  instagram: '',
  linkedin: 'https://www.linkedin.com/company/andreou-hji-christofis-co/',
  careers_intro: 'We are always pleased to hear from talented, motivated people who share our commitment to clients. Explore our open positions below or send us a general application.',
  hours_el: 'Δευτέρα έως Παρασκευή, 9:00 έως 17:00',
  hours_ru: 'С понедельника по пятницу, с 9:00 до 17:00',
  hours_he: 'ימים שני עד שישי, 9:00 עד 17:00',
  chat_welcome_el: 'Καλώς ήρθατε στο H.A. Andreou & Co. Πώς μπορούμε να σας βοηθήσουμε; Ένα μέλος της ομάδας μας θα σας απαντήσει εδώ το συντομότερο.',
  chat_welcome_ru: 'Добро пожаловать в H.A. Andreou & Co. Чем мы можем помочь? Сотрудник нашей команды ответит вам здесь в ближайшее время.',
  chat_welcome_he: 'ברוכים הבאים ל H.A. Andreou & Co. איך נוכל לעזור? נציג מהצוות שלנו יענה לכם כאן בהקדם.',
  chat_offline_el: 'Η ομάδα μας δεν είναι διαθέσιμη αυτή τη στιγμή. Αφήστε το μήνυμα και το email σας και θα επικοινωνήσουμε μαζί σας.',
  chat_offline_ru: 'Сейчас наша команда не в сети. Оставьте сообщение и ваш email, и мы свяжемся с вами.',
  chat_offline_he: 'הצוות שלנו אינו זמין כרגע. השאירו הודעה וכתובת אימייל ונחזור אליכם.',
  careers_intro_el: 'Χαιρόμαστε πάντα να γνωρίζουμε ταλαντούχους και φιλόδοξους ανθρώπους που μοιράζονται τη δέσμευσή μας προς τους πελάτες. Δείτε τις ανοιχτές θέσεις ή στείλτε μας μια γενική αίτηση.',
  careers_intro_ru: 'Мы всегда рады талантливым и целеустремлённым людям, которые разделяют нашу преданность клиентам. Ознакомьтесь с открытыми вакансиями или отправьте общую заявку.',
  careers_intro_he: 'אנו תמיד שמחים להכיר אנשים מוכשרים ובעלי מוטיבציה שחולקים את המחויבות שלנו ללקוחות. עיינו במשרות הפתוחות או שלחו לנו מועמדות כללית.'
};

export const LANGS = ['en', 'el', 'ru', 'he'];

export async function initDb() {
  pool = await createPool();
  for (const stmt of SCHEMA) await pool.query(stmt);
  if (!usingMemoryDb) {
    await pool.query('CREATE INDEX IF NOT EXISTS chat_messages_session_idx ON chat_messages (session_id, id)');
    for (const t of ['lawyers', 'practice_areas', 'jobs']) {
      await pool.query(`ALTER TABLE ${t} ADD COLUMN IF NOT EXISTS i18n TEXT NOT NULL DEFAULT '{}'`);
    }
    await pool.query("ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS lang TEXT NOT NULL DEFAULT 'en'");
    await pool.query('ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS image TEXT');
    await pool.query('ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS image_type TEXT');
    await pool.query('ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS image_version INTEGER NOT NULL DEFAULT 0');
  }

  const [{ count: lawyerCount }] = await query('SELECT COUNT(*)::int AS count FROM lawyers');
  if (Number(lawyerCount) === 0) {
    for (const [i, l] of seedLawyers.entries()) {
      await query(
        `INSERT INTO lawyers (slug, name, title, email, phone, languages, education, admissions, practice_areas, summary, bio, sort_order, i18n, published, photo, photo_type, photo_version)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        (() => {
          const photo = l.photo ? seedImage(l.photo) : null;
          return [l.slug, l.name, l.title, l.email, l.phone, l.languages, l.education, l.admissions, l.practice_areas, l.summary, l.bio, i,
            JSON.stringify(l.i18n || {}), l.published !== false, photo, photo ? 'image/jpeg' : null, photo ? 1 : 0];
        })()
      );
    }
  }

  const [{ count: areaCount }] = await query('SELECT COUNT(*)::int AS count FROM practice_areas');
  if (Number(areaCount) === 0) {
    for (const [i, a] of seedPracticeAreas.entries()) {
      await query(
        'INSERT INTO practice_areas (slug, name, summary, body, sort_order, i18n, image, image_type, image_version) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        (() => {
          const img = a.image ? seedImage(a.image) : null;
          return [a.slug, a.name, a.summary, a.body, i, JSON.stringify(a.i18n || {}), img, img ? 'image/jpeg' : null, img ? 1 : 0];
        })()
      );
    }
  }

  // Refresh expertise images that still use a starter image (never replaced in the admin console),
  // so updated starter photos also reach databases created before the update.
  for (const a of seedPracticeAreas) {
    if (!a.image) continue;
    const row = await one('SELECT id, image, image_version FROM practice_areas WHERE slug = $1', [a.slug]);
    if (!row || Number(row.image_version) !== 1) continue;
    const img = seedImage(a.image);
    if (img && img !== row.image) await query('UPDATE practice_areas SET image = $1, image_type = $2 WHERE id = $3', [img, 'image/jpeg', row.id]);
  }

  const [{ count: jobCount }] = await query('SELECT COUNT(*)::int AS count FROM jobs');
  const seeded = await one("SELECT value FROM settings WHERE key = 'jobs_seeded'");
  if (Number(jobCount) === 0 && !seeded) {
    for (const [i, j] of seedJobs.entries()) {
      await query(
        'INSERT INTO jobs (slug, title, location, employment_type, summary, description, requirements, sort_order, i18n) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [j.slug, j.title, j.location, j.employment_type, j.summary, j.description, j.requirements, i, JSON.stringify(j.i18n || {})]
      );
    }
    await query("INSERT INTO settings (key, value) VALUES ('jobs_seeded', '1')");
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
