// Database layer. Three options, chosen by environment variables:
//   SQLITE_PATH   a SQLite database file, for example on a Render disk (/var/data/andreou.db)
//   DATABASE_URL  a PostgreSQL database
//   neither       an in memory database (pg-mem), handy for local testing; data resets on restart
// The queries are written for PostgreSQL; for SQLite they are translated below.
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
export let dbKind = 'memory';

// Columns stored as 0/1 in SQLite that the app expects as true/false.
const BOOLEAN_COLUMNS = new Set(['published', 'featured']);

// Translates the PostgreSQL flavoured SQL used by the app to SQLite.
function toSqlite(text) {
  return text
    .replace(/\bSERIAL PRIMARY KEY\b/g, 'INTEGER PRIMARY KEY AUTOINCREMENT')
    .replace(/\bTIMESTAMPTZ\b/g, 'TEXT')
    .replace(/DEFAULT NOW\(\)/g, "DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))")
    .replace(/\bNOW\(\)/g, "strftime('%Y-%m-%dT%H:%M:%fZ', 'now')")
    .replace(/::int\b/g, '')
    .replace(/\$(\d+)/g, '?$1');
}

async function createSqlite(file) {
  const { default: Database } = await import('better-sqlite3');
  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  const db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  const cache = new Map();
  return {
    async query(text, params = []) {
      let stmt = cache.get(text);
      if (!stmt) {
        stmt = db.prepare(toSqlite(text));
        cache.set(text, stmt);
      }
      // numbered placeholders (?1, ?2 ...) are bound by number
      const args = {};
      params.forEach((v, i) => {
        args[i + 1] = v === true ? 1 : v === false ? 0 : v === undefined ? null : v;
      });
      const bind = params.length ? [args] : [];
      if (!stmt.reader) {
        stmt.run(...bind);
        return { rows: [] };
      }
      const rows = stmt.all(...bind);
      for (const r of rows) for (const k of BOOLEAN_COLUMNS) if (k in r && r[k] !== null) r[k] = Boolean(r[k]);
      return { rows };
    }
  };
}

async function createPool() {
  if (process.env.SQLITE_PATH) {
    dbKind = 'sqlite';
    return createSqlite(process.env.SQLITE_PATH);
  }
  if (process.env.DATABASE_URL) {
    dbKind = 'postgres';
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
    featured BOOLEAN NOT NULL DEFAULT FALSE,
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
  `CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    published_on TEXT NOT NULL DEFAULT '',
    published BOOLEAN NOT NULL DEFAULT TRUE,
    i18n TEXT NOT NULL DEFAULT '{}',
    image TEXT,
    image_type TEXT,
    image_version INTEGER NOT NULL DEFAULT 0,
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
  email: 'info@andreou.law',
  phone: '+357 24 433070',
  fax: '',
  address_line1: '23-25 Piliou Street, Giorgos Mattheou Building, Office 501',
  address_line2: '6037 Larnaca, Cyprus',
  address_line1_el: 'Πηλίου 23-25, Μέγαρο Γιώργος Ματθαίου, Διαμ./Γραφείο 501',
  address_line2_el: '6037 Λάρνακα, Κύπρος',
  map_location: '34.9156651,33.6030268',
  hours: 'Monday to Thursday, 8:00 to 18:00\nFriday, 8:00 to 14:30',
  // Opening hours used by the live chat (Cyprus time), per day. Days: 1 Monday ... 7 Sunday.
  office_schedule: '{"1":["08:00","18:00"],"2":["08:00","18:00"],"3":["08:00","18:00"],"4":["08:00","18:00"],"5":["08:00","14:30"]}',
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
  facebook: '',
  instagram: '',
  linkedin: '',
  careers_intro: 'We are always pleased to hear from talented, motivated people who share our commitment to clients. Explore our open positions below or send us a general application.',
  hours_el: 'Δευτέρα έως Πέμπτη, 8:00 έως 18:00\nΠαρασκευή, 8:00 έως 14:30',
  chat_welcome_el: 'Καλώς ήρθατε στο H.A. Andreou & Co. Πώς μπορούμε να σας βοηθήσουμε; Ένα μέλος της ομάδας μας θα σας απαντήσει εδώ το συντομότερο.',
  chat_offline_el: 'Η ομάδα μας δεν είναι διαθέσιμη αυτή τη στιγμή. Αφήστε το μήνυμα και το email σας και θα επικοινωνήσουμε μαζί σας.',
  careers_intro_el: 'Χαιρόμαστε πάντα να γνωρίζουμε ταλαντούχους και φιλόδοξους ανθρώπους που μοιράζονται τη δέσμευσή μας προς τους πελάτες. Δείτε τις ανοιχτές θέσεις ή στείλτε μας μια γενική αίτηση.'
};

export const LANGS = ['en', 'el'];
export const HOME_AREAS_MAX = 6;

export async function initDb() {
  pool = await createPool();
  for (const stmt of SCHEMA) await pool.query(stmt);
  if (dbKind !== 'memory') await pool.query('CREATE INDEX IF NOT EXISTS chat_messages_session_idx ON chat_messages (session_id, id)');
  if (dbKind === 'postgres') {
    for (const t of ['lawyers', 'practice_areas', 'jobs']) {
      await pool.query(`ALTER TABLE ${t} ADD COLUMN IF NOT EXISTS i18n TEXT NOT NULL DEFAULT '{}'`);
    }
    await pool.query("ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS lang TEXT NOT NULL DEFAULT 'en'");
    await pool.query('ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS image TEXT');
    await pool.query('ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE');
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

  // Expertise areas added to the starter content after a database was created are added once.
  // An area the firm later deletes in the admin console is not added back.
  for (const slug of []) {
    const flag = `area_added_${slug}`;
    if (await one('SELECT value FROM settings WHERE key = $1', [flag])) continue;
    const a = seedPracticeAreas.find((x) => x.slug === slug);
    const exists = await one('SELECT id FROM practice_areas WHERE slug = $1', [slug]);
    if (a && !exists) {
      const pos = seedPracticeAreas.indexOf(a);
      await query('UPDATE practice_areas SET sort_order = sort_order + 1 WHERE sort_order >= $1', [pos]);
      const img = a.image ? seedImage(a.image) : null;
      await query(
        'INSERT INTO practice_areas (slug, name, summary, body, sort_order, i18n, image, image_type, image_version) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [a.slug, a.name, a.summary, a.body, pos, JSON.stringify(a.i18n || {}), img, img ? 'image/jpeg' : null, img ? 1 : 0]
      );
    }
    await query('INSERT INTO settings (key, value) VALUES ($1, $2)', [flag, '1']);
  }

  // The homepage shows up to HOME_AREAS_MAX expertise areas chosen in the admin console.
  // The first time, the first six areas in the list are selected.
  if (!(await one("SELECT value FROM settings WHERE key = 'home_areas_initialised'"))) {
    const [{ count: featuredCount }] = await query('SELECT COUNT(*)::int AS count FROM practice_areas WHERE featured = TRUE');
    if (Number(featuredCount) === 0) {
      const first = await query('SELECT id FROM practice_areas ORDER BY sort_order, id LIMIT $1', [HOME_AREAS_MAX]);
      for (const r of first) await query('UPDATE practice_areas SET featured = TRUE WHERE id = $1', [r.id]);
    }
    await query("INSERT INTO settings (key, value) VALUES ('home_areas_initialised', '1')");
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
  await applyContentUpdates();
}

async function setSetting(key, value) {
  const existing = await one('SELECT key FROM settings WHERE key = $1', [key]);
  if (existing) await query('UPDATE settings SET value = $1 WHERE key = $2', [value, key]);
  else await query('INSERT INTO settings (key, value) VALUES ($1, $2)', [key, value]);
}

// One time updates requested by the firm, applied once to databases that already exist
// (a new database gets them from the starter content). Each runs only once.
const CONTENT_UPDATES = [
  {
    id: 'content_update_2026_11_17',
    settings: ['email', 'phone', 'fax', 'facebook', 'instagram', 'linkedin', 'hours', 'hours_el', 'office_schedule'],
    lawyers: ['kyriakos-georgiou', 'maria-hadjisavva', 'anastasis-mytidis', 'antonis-neofytou']
  },
  // the firm's new list of ten areas of expertise replaces the previous list
  { id: 'areas_update_2026_11_17', replaceAreas: true },
  // detailed descriptions for each area (the detail pages), keeping images and homepage choices
  { id: 'areas_text_2026_11_18', refreshAreaText: true }
];

async function applyContentUpdates() {
  for (const u of CONTENT_UPDATES) {
    if (await one('SELECT value FROM settings WHERE key = $1', [u.id])) continue;
    if (u.replaceAreas) {
      await query('DELETE FROM practice_areas');
      for (const [i, a] of seedPracticeAreas.entries()) {
        const img = a.image ? seedImage(a.image) : null;
        await query(
          'INSERT INTO practice_areas (slug, name, summary, body, sort_order, i18n, image, image_type, image_version, featured) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
          [a.slug, a.name, a.summary, a.body, i, JSON.stringify(a.i18n || {}), img, img ? 'image/jpeg' : null, img ? 1 : 0, i < HOME_AREAS_MAX]
        );
      }
      await query("UPDATE lawyers SET practice_areas = ''");
    }
    if (u.refreshAreaText) {
      for (const a of seedPracticeAreas) {
        await query('UPDATE practice_areas SET name = $1, summary = $2, body = $3, i18n = $4 WHERE slug = $5', [a.name, a.summary, a.body, JSON.stringify(a.i18n || {}), a.slug]);
      }
    }
    for (const key of u.settings || []) await setSetting(key, DEFAULT_SETTINGS[key]);
    for (const slug of u.lawyers || []) {
      const l = seedLawyers.find((x) => x.slug === slug);
      const row = await one('SELECT id, i18n FROM lawyers WHERE slug = $1', [slug]);
      if (!l || !row) continue;
      let tr = {};
      try {
        tr = JSON.parse(row.i18n || '{}');
      } catch {}
      tr.el = { ...(tr.el || {}), title: l.i18n.el.title };
      await query('UPDATE lawyers SET title = $1, i18n = $2, sort_order = $3 WHERE id = $4', [l.title, JSON.stringify(tr), seedLawyers.indexOf(l), row.id]);
    }
    // the office number replaces the old firm's numbers on lawyer profiles
    if (u.settings) await query("UPDATE lawyers SET phone = $1 WHERE phone IN ('+357 24 656765', '+357 24 828373', '+357 24 828393', '+357 24 656705', '+357 24 656717')", [DEFAULT_SETTINGS.phone]);
    await query('INSERT INTO settings (key, value) VALUES ($1, $2)', [u.id, '1']);
  }
}

export async function getSettings() {
  const rows = await query('SELECT key, value FROM settings');
  const out = { ...DEFAULT_SETTINGS };
  for (const r of rows) out[r.key] = r.value;
  return out;
}
