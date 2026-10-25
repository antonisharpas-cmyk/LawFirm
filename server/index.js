import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { initDb, query, one, getSettings, usingMemoryDb, DEFAULT_SETTINGS } from './db.js';
import { signToken, checkCredentials, requireAdmin, rateLimit } from './auth.js';
import { notify } from './mail.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(express.json({ limit: '8mb' }));

// ---------- helpers ----------
const clean = (v, max = 5000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `item-${Date.now()}`;

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

let adminLastSeen = 0;
const adminOnline = () => Date.now() - adminLastSeen < 2 * 60 * 1000;

const LAWYER_FIELDS = ['name', 'title', 'email', 'phone', 'languages', 'education', 'admissions', 'practice_areas', 'summary', 'bio', 'linkedin'];

function publicLawyer(l) {
  if (!l) return null;
  const { photo, photo_type, ...rest } = l;
  return {
    ...rest,
    photo_url: photo ? `/api/lawyers/${l.id}/photo?v=${l.photo_version}` : null
  };
}

async function uniqueSlug(table, base, excludeId = null) {
  let slug = slugify(base);
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const row = await one(`SELECT id FROM ${table} WHERE slug = $1`, [slug]);
    if (!row || row.id === excludeId) return slug;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
}

// ---------- public API ----------
app.get('/api/health', (req, res) => res.json({ ok: true, memoryDb: usingMemoryDb }));

app.get('/api/settings', wrap(async (req, res) => {
  const s = await getSettings();
  res.json({ ...s, admin_online: adminOnline() });
}));

app.get('/api/lawyers', wrap(async (req, res) => {
  const rows = await query('SELECT * FROM lawyers WHERE published = TRUE ORDER BY sort_order, id');
  res.json(rows.map(publicLawyer));
}));

app.get('/api/lawyers/:slug', wrap(async (req, res) => {
  const row = await one('SELECT * FROM lawyers WHERE slug = $1 AND published = TRUE', [req.params.slug]);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(publicLawyer(row));
}));

app.get('/api/lawyers/:id/photo', wrap(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(404).end();
  const row = await one('SELECT photo, photo_type FROM lawyers WHERE id = $1', [id]);
  if (!row || !row.photo) return res.status(404).end();
  res.set('Content-Type', row.photo_type || 'image/jpeg');
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(Buffer.from(row.photo, 'base64'));
}));

app.get('/api/practice-areas', wrap(async (req, res) => {
  res.json(await query('SELECT * FROM practice_areas WHERE published = TRUE ORDER BY sort_order, id'));
}));

app.post('/api/inquiries', rateLimit({ windowMs: 10 * 60 * 1000, max: 8 }), wrap(async (req, res) => {
  const b = req.body || {};
  if (clean(b.website)) return res.json({ ok: true }); // honeypot
  const data = {
    kind: b.kind === 'appointment' ? 'appointment' : 'contact',
    name: clean(b.name, 200),
    email: clean(b.email, 200),
    phone: clean(b.phone, 60),
    subject: clean(b.subject, 300),
    practice_area: clean(b.practice_area, 200),
    preferred_date: clean(b.preferred_date, 40),
    preferred_time: clean(b.preferred_time, 40),
    message: clean(b.message, 8000)
  };
  if (!data.name || !isEmail(data.email) || !data.message) {
    return res.status(400).json({ error: 'Please fill in your name, a valid email and your message.' });
  }
  if (!b.consent) return res.status(400).json({ error: 'Please accept the privacy notice to continue.' });
  const row = await one(
    `INSERT INTO inquiries (kind, name, email, phone, subject, practice_area, preferred_date, preferred_time, message)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
    [data.kind, data.name, data.email, data.phone, data.subject, data.practice_area, data.preferred_date, data.preferred_time, data.message]
  );
  notify(
    data.kind === 'appointment' ? `New appointment request from ${data.name}` : `New website enquiry from ${data.name}`,
    {
      Name: data.name,
      Email: data.email,
      Phone: data.phone,
      Subject: data.subject,
      'Practice area': data.practice_area,
      'Preferred date': data.preferred_date,
      'Preferred time': data.preferred_time,
      Message: data.message
    },
    data.email
  );
  res.json({ ok: true, id: row.id });
}));

// ---------- live chat (visitor side) ----------
async function sessionByToken(token) {
  if (!token || typeof token !== 'string' || token.length < 20) return null;
  return one('SELECT * FROM chat_sessions WHERE token = $1', [token]);
}

app.post('/api/chat/start', rateLimit({ windowMs: 10 * 60 * 1000, max: 10 }), wrap(async (req, res) => {
  const b = req.body || {};
  const name = clean(b.name, 120);
  const email = clean(b.email, 200);
  const phone = clean(b.phone, 60);
  const first = clean(b.message, 4000);
  if (!name) return res.status(400).json({ error: 'Please tell us your name.' });
  if (email && !isEmail(email)) return res.status(400).json({ error: 'Please check your email address.' });
  const token = crypto.randomBytes(24).toString('hex');
  const session = await one(
    `INSERT INTO chat_sessions (token, visitor_name, visitor_email, visitor_phone, page, unread_admin)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [token, name, email, phone, clean(b.page, 300), first ? 1 : 0]
  );
  const settings = await getSettings();
  await query('INSERT INTO chat_messages (session_id, sender, body) VALUES ($1, $2, $3)', [
    session.id,
    'system',
    adminOnline() ? settings.chat_welcome : settings.chat_offline
  ]);
  if (first) await query('INSERT INTO chat_messages (session_id, sender, body) VALUES ($1, $2, $3)', [session.id, 'visitor', first]);
  notify(`New live chat from ${name}`, { Name: name, Email: email, Phone: phone, Message: first }, email || undefined);
  res.json({ token });
}));

app.get('/api/chat/:token', wrap(async (req, res) => {
  const s = await sessionByToken(req.params.token);
  if (!s) return res.status(404).json({ error: 'Chat not found' });
  const after = Number(req.query.after) || 0;
  const messages = await query(
    'SELECT id, sender, body, created_at FROM chat_messages WHERE session_id = $1 AND id > $2 ORDER BY id',
    [s.id, after]
  );
  if (s.unread_visitor > 0) await query('UPDATE chat_sessions SET unread_visitor = 0 WHERE id = $1', [s.id]);
  res.json({ status: s.status, name: s.visitor_name, admin_online: adminOnline(), messages });
}));

app.post('/api/chat/:token/messages', rateLimit({ windowMs: 60 * 1000, max: 30 }), wrap(async (req, res) => {
  const s = await sessionByToken(req.params.token);
  if (!s) return res.status(404).json({ error: 'Chat not found' });
  const body = clean(req.body?.body, 4000);
  if (!body) return res.status(400).json({ error: 'Message is empty' });
  const msg = await one(
    'INSERT INTO chat_messages (session_id, sender, body) VALUES ($1, $2, $3) RETURNING id, sender, body, created_at',
    [s.id, 'visitor', body]
  );
  await query(
    "UPDATE chat_sessions SET unread_admin = unread_admin + 1, last_message_at = NOW(), status = 'open' WHERE id = $1",
    [s.id]
  );
  res.json(msg);
}));

// ---------- admin API ----------
app.post('/api/admin/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }), (req, res) => {
  const { username, password } = req.body || {};
  if (!checkCredentials(username, password)) return res.status(401).json({ error: 'Incorrect username or password' });
  adminLastSeen = Date.now();
  res.json({ token: signToken({ role: 'admin', username }) });
});

const admin = express.Router();
admin.use(requireAdmin, (req, res, next) => {
  adminLastSeen = Date.now();
  next();
});

admin.get('/me', (req, res) => res.json({ username: req.admin.username, memoryDb: usingMemoryDb }));

admin.get('/stats', wrap(async (req, res) => {
  const [inq] = await query("SELECT COUNT(*)::int AS count FROM inquiries WHERE status = 'new'");
  const [chats] = await query('SELECT COUNT(*)::int AS count FROM chat_sessions WHERE unread_admin > 0');
  const [lawyers] = await query('SELECT COUNT(*)::int AS count FROM lawyers');
  res.json({ newInquiries: Number(inq.count), unreadChats: Number(chats.count), lawyers: Number(lawyers.count) });
}));

// inquiries
admin.get('/inquiries', wrap(async (req, res) => {
  const params = [];
  const where = [];
  if (req.query.status && req.query.status !== 'all') {
    params.push(req.query.status);
    where.push(`status = $${params.length}`);
  }
  if (req.query.kind && req.query.kind !== 'all') {
    params.push(req.query.kind);
    where.push(`kind = $${params.length}`);
  }
  if (req.query.q) {
    params.push(`%${String(req.query.q).toLowerCase()}%`);
    const p = `$${params.length}`;
    where.push(`(LOWER(name) LIKE ${p} OR LOWER(email) LIKE ${p} OR LOWER(message) LIKE ${p} OR LOWER(subject) LIKE ${p})`);
  }
  const rows = await query(
    `SELECT * FROM inquiries ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC, id DESC LIMIT 500`,
    params
  );
  res.json(rows);
}));

admin.patch('/inquiries/:id', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const cur = await one('SELECT * FROM inquiries WHERE id = $1', [id]);
  if (!cur) return res.status(404).json({ error: 'Not found' });
  const statuses = ['new', 'in_progress', 'closed'];
  const status = statuses.includes(req.body?.status) ? req.body.status : cur.status;
  const notes = req.body?.notes !== undefined ? clean(req.body.notes, 8000) : cur.notes;
  const row = await one('UPDATE inquiries SET status = $1, notes = $2, updated_at = NOW() WHERE id = $3 RETURNING *', [status, notes, id]);
  res.json(row);
}));

admin.delete('/inquiries/:id', wrap(async (req, res) => {
  await query('DELETE FROM inquiries WHERE id = $1', [Number(req.params.id)]);
  res.json({ ok: true });
}));

// chats
admin.get('/chats', wrap(async (req, res) => {
  const sessions = await query('SELECT * FROM chat_sessions ORDER BY last_message_at DESC, id DESC LIMIT 300');
  const out = [];
  for (const s of sessions) {
    const last = await one(
      "SELECT body, sender, created_at FROM chat_messages WHERE session_id = $1 AND sender <> 'system' ORDER BY id DESC LIMIT 1",
      [s.id]
    );
    const { token, ...rest } = s;
    out.push({ ...rest, last_message: last });
  }
  res.json(out);
}));

admin.get('/chats/:id/messages', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const after = Number(req.query.after) || 0;
  const messages = await query(
    'SELECT id, sender, body, created_at FROM chat_messages WHERE session_id = $1 AND id > $2 ORDER BY id',
    [id, after]
  );
  await query('UPDATE chat_sessions SET unread_admin = 0 WHERE id = $1', [id]);
  res.json(messages);
}));

admin.post('/chats/:id/messages', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const s = await one('SELECT id FROM chat_sessions WHERE id = $1', [id]);
  if (!s) return res.status(404).json({ error: 'Not found' });
  const body = clean(req.body?.body, 4000);
  if (!body) return res.status(400).json({ error: 'Message is empty' });
  const msg = await one(
    'INSERT INTO chat_messages (session_id, sender, body) VALUES ($1, $2, $3) RETURNING id, sender, body, created_at',
    [id, 'admin', body]
  );
  await query(
    "UPDATE chat_sessions SET unread_visitor = unread_visitor + 1, unread_admin = 0, last_message_at = NOW(), status = 'open' WHERE id = $1",
    [id]
  );
  res.json(msg);
}));

admin.patch('/chats/:id', wrap(async (req, res) => {
  const status = req.body?.status === 'closed' ? 'closed' : 'open';
  const row = await one('UPDATE chat_sessions SET status = $1 WHERE id = $2 RETURNING id, status', [status, Number(req.params.id)]);
  res.json(row);
}));

admin.delete('/chats/:id', wrap(async (req, res) => {
  const id = Number(req.params.id);
  await query('DELETE FROM chat_messages WHERE session_id = $1', [id]);
  await query('DELETE FROM chat_sessions WHERE id = $1', [id]);
  res.json({ ok: true });
}));

// lawyers
admin.get('/lawyers', wrap(async (req, res) => {
  const rows = await query('SELECT * FROM lawyers ORDER BY sort_order, id');
  res.json(rows.map(publicLawyer));
}));

admin.post('/lawyers', wrap(async (req, res) => {
  const b = req.body || {};
  const name = clean(b.name, 200);
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const slug = await uniqueSlug('lawyers', name);
  const [{ max }] = await query('SELECT COALESCE(MAX(sort_order), 0) AS max FROM lawyers');
  const values = LAWYER_FIELDS.map((f) => clean(b[f], f === 'bio' ? 20000 : 2000));
  const row = await one(
    `INSERT INTO lawyers (slug, ${LAWYER_FIELDS.join(', ')}, published, sort_order)
     VALUES ($1, ${LAWYER_FIELDS.map((_, i) => `$${i + 2}`).join(', ')}, $${LAWYER_FIELDS.length + 2}, $${LAWYER_FIELDS.length + 3}) RETURNING *`,
    [slug, ...values, b.published !== false, Number(max) + 1]
  );
  res.json(publicLawyer(row));
}));

admin.put('/lawyers/:id', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const cur = await one('SELECT * FROM lawyers WHERE id = $1', [id]);
  if (!cur) return res.status(404).json({ error: 'Not found' });
  const b = req.body || {};
  const name = clean(b.name, 200) || cur.name;
  const slug = name !== cur.name ? await uniqueSlug('lawyers', name, id) : cur.slug;
  const values = LAWYER_FIELDS.map((f) => (f === 'name' ? name : b[f] !== undefined ? clean(b[f], f === 'bio' ? 20000 : 2000) : cur[f]));
  const published = b.published !== undefined ? Boolean(b.published) : cur.published;
  const row = await one(
    `UPDATE lawyers SET slug = $1, ${LAWYER_FIELDS.map((f, i) => `${f} = $${i + 2}`).join(', ')},
       published = $${LAWYER_FIELDS.length + 2}, updated_at = NOW()
     WHERE id = $${LAWYER_FIELDS.length + 3} RETURNING *`,
    [slug, ...values, published, id]
  );
  res.json(publicLawyer(row));
}));

admin.delete('/lawyers/:id', wrap(async (req, res) => {
  await query('DELETE FROM lawyers WHERE id = $1', [Number(req.params.id)]);
  res.json({ ok: true });
}));

admin.put('/lawyers/:id/photo', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const m = /^data:(image\/(jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(req.body?.dataUrl || '');
  if (!m) return res.status(400).json({ error: 'Please upload a JPG, PNG or WEBP image.' });
  if (m[3].length > 6 * 1024 * 1024) return res.status(400).json({ error: 'Image is too large.' });
  const row = await one(
    'UPDATE lawyers SET photo = $1, photo_type = $2, photo_version = photo_version + 1, updated_at = NOW() WHERE id = $3 RETURNING *',
    [m[3], m[1], id]
  );
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(publicLawyer(row));
}));

admin.delete('/lawyers/:id/photo', wrap(async (req, res) => {
  const row = await one(
    'UPDATE lawyers SET photo = NULL, photo_type = NULL, photo_version = photo_version + 1 WHERE id = $1 RETURNING *',
    [Number(req.params.id)]
  );
  res.json(publicLawyer(row));
}));

admin.post('/lawyers/reorder', wrap(async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(Number) : [];
  for (const [i, id] of ids.entries()) await query('UPDATE lawyers SET sort_order = $1 WHERE id = $2', [i, id]);
  res.json({ ok: true });
}));

// practice areas
admin.get('/practice-areas', wrap(async (req, res) => {
  res.json(await query('SELECT * FROM practice_areas ORDER BY sort_order, id'));
}));

admin.post('/practice-areas', wrap(async (req, res) => {
  const b = req.body || {};
  const name = clean(b.name, 200);
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const slug = await uniqueSlug('practice_areas', name);
  const [{ max }] = await query('SELECT COALESCE(MAX(sort_order), 0) AS max FROM practice_areas');
  const row = await one(
    'INSERT INTO practice_areas (slug, name, summary, body, published, sort_order) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [slug, name, clean(b.summary, 1000), clean(b.body, 10000), b.published !== false, Number(max) + 1]
  );
  res.json(row);
}));

admin.put('/practice-areas/:id', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const cur = await one('SELECT * FROM practice_areas WHERE id = $1', [id]);
  if (!cur) return res.status(404).json({ error: 'Not found' });
  const b = req.body || {};
  const name = clean(b.name, 200) || cur.name;
  const slug = name !== cur.name ? await uniqueSlug('practice_areas', name, id) : cur.slug;
  const row = await one(
    'UPDATE practice_areas SET slug=$1, name=$2, summary=$3, body=$4, published=$5 WHERE id=$6 RETURNING *',
    [
      slug,
      name,
      b.summary !== undefined ? clean(b.summary, 1000) : cur.summary,
      b.body !== undefined ? clean(b.body, 10000) : cur.body,
      b.published !== undefined ? Boolean(b.published) : cur.published,
      id
    ]
  );
  res.json(row);
}));

admin.delete('/practice-areas/:id', wrap(async (req, res) => {
  await query('DELETE FROM practice_areas WHERE id = $1', [Number(req.params.id)]);
  res.json({ ok: true });
}));

admin.post('/practice-areas/reorder', wrap(async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(Number) : [];
  for (const [i, id] of ids.entries()) await query('UPDATE practice_areas SET sort_order = $1 WHERE id = $2', [i, id]);
  res.json({ ok: true });
}));

// settings
admin.get('/settings', wrap(async (req, res) => res.json(await getSettings())));

admin.put('/settings', wrap(async (req, res) => {
  const b = req.body || {};
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (b[key] === undefined) continue;
    const value = clean(b[key], 2000);
    const existing = await one('SELECT key FROM settings WHERE key = $1', [key]);
    if (existing) await query('UPDATE settings SET value = $1 WHERE key = $2', [value, key]);
    else await query('INSERT INTO settings (key, value) VALUES ($1, $2)', [key, value]);
  }
  res.json(await getSettings());
}));

app.use('/api/admin', admin);

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// ---------- static client ----------
const dist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist, { index: false, maxAge: '7d' }));
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// errors
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong, please try again.' });
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Athanasiadou Law server running on http://localhost:${PORT}`);
      if (usingMemoryDb) console.log('No DATABASE_URL set: using an in memory database (data resets on restart).');
      if (!process.env.ADMIN_PASSWORD) console.log('ADMIN_PASSWORD not set: default admin login is admin / change-me');
    });
  })
  .catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
