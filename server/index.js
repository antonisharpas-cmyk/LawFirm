import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { initDb, query, one, getSettings, usingMemoryDb, DEFAULT_SETTINGS, LANGS } from './db.js';
import { signToken, checkCredentials, requireAdmin, rateLimit } from './auth.js';
import { notifyOffice, sendInquiryReceipt, sendApplicationReceipt, sendChatReplyToVisitor, sendTestEmail, mailConfigured, officeEmail } from './mail.js';
import { isOfficeOpen } from './hours.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));

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

// Live chat shows the team as online during the office opening hours set in the admin console.
const officeOpenNow = async () => isOfficeOpen(await getSettings());
const pickLang = (l) => (LANGS.includes(l) ? l : 'en');
const fmtDate = () => new Date().toLocaleString('en-GB', { timeZone: 'Europe/Nicosia', dateStyle: 'medium', timeStyle: 'short' });
const LANG_NAMES = { en: 'English', el: 'Greek' };

// live chat email bookkeeping (in memory, resets on restart)
const visitorSeen = new Map(); // chat token -> last time the visitor's browser checked for messages
const officeChatMailAt = new Map(); // chat session id -> last office notification time
const visitorMailTimers = new Map(); // chat session id -> pending email to the visitor
const VISITOR_AWAY_MS = 2 * 60 * 1000;
const OFFICE_CHAT_MAIL_GAP_MS = 15 * 60 * 1000;

const LAWYER_FIELDS = ['name', 'title', 'email', 'phone', 'languages', 'education', 'admissions', 'practice_areas', 'summary', 'bio', 'linkedin'];

// translations are stored as JSON text: { el: { field: value } }
function parseI18n(row) {
  if (!row) return row;
  let i18n = {};
  try {
    i18n = JSON.parse(row.i18n || '{}');
  } catch {
    i18n = {};
  }
  return { ...row, i18n };
}
function cleanI18n(input, fields) {
  const out = {};
  if (!input || typeof input !== 'object') return out;
  for (const lang of LANGS.filter((l) => l !== 'en')) {
    const src = input[lang];
    if (!src || typeof src !== 'object') continue;
    const o = {};
    for (const f of fields) {
      const v = clean(src[f], 20000);
      if (v) o[f] = v;
    }
    if (Object.keys(o).length) out[lang] = o;
  }
  return JSON.stringify(out);
}
const I18N_FIELDS = {
  lawyers: ['title', 'summary', 'bio', 'languages', 'education', 'admissions'],
  practice_areas: ['name', 'summary', 'body'],
  jobs: ['title', 'location', 'employment_type', 'summary', 'description', 'requirements']
};

async function saveI18n(table, row, body) {
  if (!row || body?.i18n === undefined) return row;
  return one(`UPDATE ${table} SET i18n = $1 WHERE id = $2 RETURNING *`, [cleanI18n(body.i18n, I18N_FIELDS[table]), row.id]);
}

// Short content fingerprint added to image URLs, so a changed image never comes from an old browser cache.
const fingerprints = new Map();
function fingerprint(data) {
  if (!data) return '';
  const key = data.length + ':' + data.slice(0, 64) + data.slice(-64);
  let fp = fingerprints.get(key);
  if (!fp) {
    fp = crypto.createHash('sha1').update(data).digest('hex').slice(0, 10);
    fingerprints.set(key, fp);
  }
  return fp;
}

function publicArea(a) {
  if (!a) return null;
  const { image, image_type, ...rest } = parseI18n(a);
  return { ...rest, image_url: image ? `/api/practice-areas/${a.id}/image?v=${a.image_version}-${fingerprint(image)}` : null };
}

function publicLawyer(l) {
  if (!l) return null;
  const { photo, photo_type, ...rest } = parseI18n(l);
  return {
    ...rest,
    photo_url: photo ? `/api/lawyers/${l.id}/photo?v=${l.photo_version}-${fingerprint(photo)}` : null
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
  res.json({ ...s, admin_online: isOfficeOpen(s) });
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
  res.json((await query('SELECT * FROM practice_areas WHERE published = TRUE ORDER BY sort_order, id')).map(publicArea));
}));

app.get('/api/practice-areas/:id/image', wrap(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(404).end();
  const row = await one('SELECT image, image_type FROM practice_areas WHERE id = $1', [id]);
  if (!row || !row.image) return res.status(404).end();
  res.set('Content-Type', row.image_type || 'image/jpeg');
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(Buffer.from(row.image, 'base64'));
}));

app.post('/api/inquiries', rateLimit({ windowMs: 10 * 60 * 1000, max: 8 }), wrap(async (req, res) => {
  const b = req.body || {};
  if (clean(b.website)) return res.json({ ok: true }); // honeypot
  const data = {
    kind: 'contact',
    name: clean(b.name, 200),
    email: clean(b.email, 200),
    phone: clean(b.phone, 60),
    subject: clean(b.subject, 300),
    practice_area: clean(b.practice_area, 200),
    message: clean(b.message, 8000)
  };
  if (!data.name || !isEmail(data.email) || !data.message) {
    return res.status(400).json({ error: 'Please fill in your name, a valid email and your message.' });
  }
  if (!b.consent) return res.status(400).json({ error: 'Please accept the privacy notice to continue.' });
  const row = await one(
    `INSERT INTO inquiries (kind, name, email, phone, subject, practice_area, message)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
    [data.kind, data.name, data.email, data.phone, data.subject, data.practice_area, data.message]
  );
  res.json({ ok: true, id: row.id });
  const settings = await getSettings();
  const lang = pickLang(b.lang);
  notifyOffice(settings, {
    subject: `New website enquiry from ${data.name}`,
    intro: `A new enquiry was sent through the contact form on ${fmtDate()}. The sender has received an automatic confirmation that the firm will reply within ${settings.reply_days || 2} working days.`,
    fields: { Name: data.name, Email: data.email, Phone: data.phone, Subject: data.subject, 'Area of law': data.practice_area, 'Website language': LANG_NAMES[lang] },
    message: data.message,
    replyTo: data.email,
    adminPath: '/inquiries'
  });
  sendInquiryReceipt(settings, lang, { name: data.name, email: data.email, message: data.message.replace(/\n\n\[Website language: \w+\]$/, '') });
}));

// ---------- careers ----------
const CV_TYPES = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};
const JOB_FIELDS = ['title', 'location', 'employment_type', 'summary', 'description', 'requirements'];

app.get('/api/jobs', wrap(async (req, res) => {
  res.json((await query('SELECT * FROM jobs WHERE published = TRUE ORDER BY sort_order, id')).map(parseI18n));
}));

app.post('/api/applications', rateLimit({ windowMs: 30 * 60 * 1000, max: 6 }), wrap(async (req, res) => {
  const b = req.body || {};
  if (clean(b.website)) return res.json({ ok: true }); // honeypot
  const name = clean(b.name, 200);
  const email = clean(b.email, 200);
  const phone = clean(b.phone, 60);
  if (!name || !isEmail(email) || !phone) return res.status(400).json({ error: 'Please fill in your name, a valid email and your phone number.' });
  if (!b.consent) return res.status(400).json({ error: 'Please accept the privacy notice to continue.' });
  const m = /^data:([\w./+-]+);base64,([A-Za-z0-9+/=]+)$/.exec(b.cv?.dataUrl || '');
  if (!m || !CV_TYPES[m[1]]) return res.status(400).json({ error: 'Please attach your CV as a PDF or Word document.' });
  if (m[2].length > 7 * 1024 * 1024) return res.status(400).json({ error: 'Your CV must be smaller than 5 MB.' });
  let job = null;
  if (b.job_id) job = await one('SELECT id, title, i18n FROM jobs WHERE id = $1', [Number(b.job_id)]);
  const jobTitle = job ? job.title : 'General application';
  const cvName = clean(b.cv.name, 200).replace(/[^\w.\s()]/g, '_') || `cv.${CV_TYPES[m[1]]}`;
  const row = await one(
    `INSERT INTO applications (job_id, job_title, name, email, phone, linkedin, message, cv_name, cv_type, cv_data)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
    [job?.id || null, jobTitle, name, email, phone, clean(b.linkedin, 300), clean(b.message, 8000), cvName, m[1], m[2]]
  );
  res.json({ ok: true, id: row.id });
  const settings = await getSettings();
  const lang = pickLang(b.lang);
  let position = '';
  if (job) {
    let tr = {};
    try {
      tr = JSON.parse(job.i18n || '{}')[lang] || {};
    } catch {}
    position = tr.title || job.title;
  }
  notifyOffice(settings, {
    subject: `New job application: ${jobTitle}`,
    intro: `A new application was sent through the Careers page on ${fmtDate()}. The CV is attached to this email.`,
    fields: { Position: jobTitle, Name: name, Email: email, Phone: phone, LinkedIn: clean(b.linkedin, 300), CV: cvName, 'Website language': LANG_NAMES[lang] },
    message: clean(b.message, 8000),
    replyTo: email,
    adminPath: '/careers',
    attachments: [{ filename: cvName, content: Buffer.from(m[2], 'base64'), contentType: m[1] }]
  });
  sendApplicationReceipt(settings, lang, { name, email, position });
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
  const lang = pickLang(b.lang);
  const session = await one(
    `INSERT INTO chat_sessions (token, visitor_name, visitor_email, visitor_phone, page, unread_admin, lang)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [token, name, email, phone, clean(b.page, 300), first ? 1 : 0, lang]
  );
  const settings = await getSettings();
  const open = isOfficeOpen(settings);
  await query('INSERT INTO chat_messages (session_id, sender, body) VALUES ($1, $2, $3)', [
    session.id,
    'system',
    (() => {
      const suffix = lang !== 'en' ? `_${lang}` : '';
      const key = open ? 'chat_welcome' : 'chat_offline';
      return settings[key + suffix] || settings[key];
    })()
  ]);
  if (first) await query('INSERT INTO chat_messages (session_id, sender, body) VALUES ($1, $2, $3)', [session.id, 'visitor', first]);
  visitorSeen.set(token, Date.now());
  officeChatMailAt.set(session.id, Date.now());
  res.json({ token });
  notifyOffice(settings, {
    subject: `New live chat from ${name}`,
    intro: `${name} started a live chat on the website on ${fmtDate()}, ${open ? 'during office hours' : 'outside office hours, so they were told the team is away'}. Reply from the Live Chat page of the admin console.${email ? '' : ' The visitor did not leave an email address.'}`,
    fields: { Name: name, Email: email, Phone: phone, Page: clean(b.page, 300), 'Website language': LANG_NAMES[lang] },
    message: first,
    replyTo: email || undefined,
    adminPath: '/chats'
  });
}));

app.get('/api/chat/:token', wrap(async (req, res) => {
  const s = await sessionByToken(req.params.token);
  if (!s) return res.status(404).json({ error: 'Chat not found' });
  const after = Number(req.query.after) || 0;
  const messages = await query(
    'SELECT id, sender, body, created_at FROM chat_messages WHERE session_id = $1 AND id > $2 ORDER BY id',
    [s.id, after]
  );
  visitorSeen.set(s.token, Date.now());
  if (s.unread_visitor > 0) await query('UPDATE chat_sessions SET unread_visitor = 0 WHERE id = $1', [s.id]);
  res.json({ status: s.status, name: s.visitor_name, admin_online: await officeOpenNow(), messages });
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
  visitorSeen.set(s.token, Date.now());
  res.json(msg);
  // email the office about new messages in an ongoing chat, at most once every 15 minutes per chat
  if (Date.now() - (officeChatMailAt.get(s.id) || 0) > OFFICE_CHAT_MAIL_GAP_MS) {
    officeChatMailAt.set(s.id, Date.now());
    const settings = await getSettings();
    notifyOffice(settings, {
      subject: `New live chat message from ${s.visitor_name}`,
      intro: `${s.visitor_name} sent a new message in their live chat on ${fmtDate()}. Further messages in this chat within the next 15 minutes will not send another email.`,
      fields: { Name: s.visitor_name, Email: s.visitor_email, Phone: s.visitor_phone },
      message: body,
      replyTo: s.visitor_email || undefined,
      adminPath: '/chats'
    });
  }
}));

// If the visitor has left the website and gave an email, send them the team's replies by email.
// Waits one minute so that several quick replies go out together in one email.
function scheduleVisitorReplyEmail(session, fromMessageId) {
  if (!session.visitor_email || !isEmail(session.visitor_email)) return;
  const pending = visitorMailTimers.get(session.id);
  if (pending) return; // an email is already scheduled and will include this reply
  const timer = setTimeout(async () => {
    visitorMailTimers.delete(session.id);
    try {
      if (Date.now() - (visitorSeen.get(session.token) || 0) < VISITOR_AWAY_MS) return; // still on the website and will see it
      const replies = await query(
        "SELECT body FROM chat_messages WHERE session_id = $1 AND sender = 'admin' AND id >= $2 ORDER BY id",
        [session.id, fromMessageId]
      );
      if (!replies.length) return;
      const settings = await getSettings();
      await sendChatReplyToVisitor(settings, pickLang(session.lang), {
        name: session.visitor_name,
        email: session.visitor_email,
        reply: replies.map((r) => r.body).join('\n\n')
      });
    } catch (err) {
      console.error('Chat reply email failed:', err.message);
    }
  }, 60 * 1000);
  timer.unref?.();
  visitorMailTimers.set(session.id, timer);
}

// ---------- admin API ----------
app.post('/api/admin/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }), (req, res) => {
  const { username, password } = req.body || {};
  if (!checkCredentials(username, password)) return res.status(401).json({ error: 'Incorrect username or password' });
  res.json({ token: signToken({ role: 'admin', username }) });
});

const admin = express.Router();
admin.use(requireAdmin);

admin.get('/me', (req, res) => res.json({ username: req.admin.username, memoryDb: usingMemoryDb }));

admin.get('/stats', wrap(async (req, res) => {
  const [inq] = await query("SELECT COUNT(*)::int AS count FROM inquiries WHERE status = 'new'");
  const [chats] = await query('SELECT COUNT(*)::int AS count FROM chat_sessions WHERE unread_admin > 0');
  const [lawyers] = await query('SELECT COUNT(*)::int AS count FROM lawyers');
  const [apps] = await query("SELECT COUNT(*)::int AS count FROM applications WHERE status = 'new'");
  res.json({ newInquiries: Number(inq.count), unreadChats: Number(chats.count), lawyers: Number(lawyers.count), newApplications: Number(apps.count) });
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
  const s = await one('SELECT * FROM chat_sessions WHERE id = $1', [id]);
  if (!s) return res.status(404).json({ error: 'Not found' });
  const body = clean(req.body?.body, 4000);
  if (!body) return res.status(400).json({ error: 'Message is empty' });
  const msg = await one(
    'INSERT INTO chat_messages (session_id, sender, body) VALUES ($1, $2, $3) RETURNING id, sender, body, created_at',
    [id, 'admin', body]
  );
  scheduleVisitorReplyEmail(s, msg.id);
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
  res.json(publicLawyer(await saveI18n('lawyers', row, b)));
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
  res.json(publicLawyer(await saveI18n('lawyers', row, b)));
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
  res.json((await query('SELECT * FROM practice_areas ORDER BY sort_order, id')).map(publicArea));
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
  res.json(publicArea(await saveI18n('practice_areas', row, b)));
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
  res.json(publicArea(await saveI18n('practice_areas', row, b)));
}));

admin.put('/practice-areas/:id/image', wrap(async (req, res) => {
  const m = /^data:(image\/(jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(req.body?.dataUrl || '');
  if (!m) return res.status(400).json({ error: 'Please upload a JPG, PNG or WEBP image.' });
  if (m[3].length > 6 * 1024 * 1024) return res.status(400).json({ error: 'Image is too large.' });
  const row = await one(
    'UPDATE practice_areas SET image = $1, image_type = $2, image_version = image_version + 1 WHERE id = $3 RETURNING *',
    [m[3], m[1], Number(req.params.id)]
  );
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(publicArea(row));
}));

admin.delete('/practice-areas/:id/image', wrap(async (req, res) => {
  const row = await one('UPDATE practice_areas SET image = NULL, image_type = NULL, image_version = image_version + 1 WHERE id = $1 RETURNING *', [Number(req.params.id)]);
  res.json(publicArea(row));
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

// jobs
admin.get('/jobs', wrap(async (req, res) => {
  res.json((await query('SELECT * FROM jobs ORDER BY sort_order, id')).map(parseI18n));
}));

admin.post('/jobs', wrap(async (req, res) => {
  const b = req.body || {};
  const title = clean(b.title, 200);
  if (!title) return res.status(400).json({ error: 'Job title is required' });
  const slug = await uniqueSlug('jobs', title);
  const [{ max }] = await query('SELECT COALESCE(MAX(sort_order), 0) AS max FROM jobs');
  const vals = JOB_FIELDS.map((f) => (f === 'title' ? title : clean(b[f], 10000)));
  const row = await one(
    `INSERT INTO jobs (slug, ${JOB_FIELDS.join(', ')}, published, sort_order)
     VALUES ($1, ${JOB_FIELDS.map((_, i) => `$${i + 2}`).join(', ')}, $${JOB_FIELDS.length + 2}, $${JOB_FIELDS.length + 3}) RETURNING *`,
    [slug, ...vals, b.published !== false, Number(max) + 1]
  );
  res.json(parseI18n(await saveI18n('jobs', row, b)));
}));

admin.put('/jobs/:id', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const cur = await one('SELECT * FROM jobs WHERE id = $1', [id]);
  if (!cur) return res.status(404).json({ error: 'Not found' });
  const b = req.body || {};
  const title = clean(b.title, 200) || cur.title;
  const slug = title !== cur.title ? await uniqueSlug('jobs', title, id) : cur.slug;
  const vals = JOB_FIELDS.map((f) => (f === 'title' ? title : b[f] !== undefined ? clean(b[f], 10000) : cur[f]));
  const published = b.published !== undefined ? Boolean(b.published) : cur.published;
  const row = await one(
    `UPDATE jobs SET slug = $1, ${JOB_FIELDS.map((f, i) => `${f} = $${i + 2}`).join(', ')}, published = $${JOB_FIELDS.length + 2}
     WHERE id = $${JOB_FIELDS.length + 3} RETURNING *`,
    [slug, ...vals, published, id]
  );
  res.json(parseI18n(await saveI18n('jobs', row, b)));
}));

admin.delete('/jobs/:id', wrap(async (req, res) => {
  await query('DELETE FROM jobs WHERE id = $1', [Number(req.params.id)]);
  res.json({ ok: true });
}));

admin.post('/jobs/reorder', wrap(async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(Number) : [];
  for (const [i, id] of ids.entries()) await query('UPDATE jobs SET sort_order = $1 WHERE id = $2', [i, id]);
  res.json({ ok: true });
}));

// applications
const APP_COLS = 'id, job_id, job_title, name, email, phone, linkedin, message, cv_name, cv_type, status, notes, created_at';

admin.get('/applications', wrap(async (req, res) => {
  const params = [];
  const where = [];
  if (req.query.status && req.query.status !== 'all') {
    params.push(req.query.status);
    where.push(`status = $${params.length}`);
  }
  if (req.query.q) {
    params.push(`%${String(req.query.q).toLowerCase()}%`);
    const p = `$${params.length}`;
    where.push(`(LOWER(name) LIKE ${p} OR LOWER(email) LIKE ${p} OR LOWER(job_title) LIKE ${p})`);
  }
  res.json(await query(`SELECT ${APP_COLS} FROM applications ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC, id DESC LIMIT 500`, params));
}));

admin.patch('/applications/:id', wrap(async (req, res) => {
  const id = Number(req.params.id);
  const cur = await one(`SELECT ${APP_COLS} FROM applications WHERE id = $1`, [id]);
  if (!cur) return res.status(404).json({ error: 'Not found' });
  const statuses = ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'];
  const status = statuses.includes(req.body?.status) ? req.body.status : cur.status;
  const notes = req.body?.notes !== undefined ? clean(req.body.notes, 8000) : cur.notes;
  res.json(await one(`UPDATE applications SET status = $1, notes = $2 WHERE id = $3 RETURNING ${APP_COLS}`, [status, notes, id]));
}));

admin.get('/applications/:id/cv', wrap(async (req, res) => {
  const row = await one('SELECT cv_name, cv_type, cv_data FROM applications WHERE id = $1', [Number(req.params.id)]);
  if (!row || !row.cv_data) return res.status(404).json({ error: 'CV not found' });
  res.set('Content-Type', row.cv_type);
  res.set('Content-Disposition', `attachment; filename="${row.cv_name.replace(/"/g, '')}"`);
  res.send(Buffer.from(row.cv_data, 'base64'));
}));

admin.delete('/applications/:id', wrap(async (req, res) => {
  await query('DELETE FROM applications WHERE id = $1', [Number(req.params.id)]);
  res.json({ ok: true });
}));

// settings
admin.get('/settings', wrap(async (req, res) => res.json(await getSettings())));

admin.get('/email-status', wrap(async (req, res) => {
  const settings = await getSettings();
  res.json({ configured: mailConfigured(), to: officeEmail(settings), officeOpen: isOfficeOpen(settings) });
}));

admin.post('/email-test', wrap(async (req, res) => {
  if (!mailConfigured()) return res.status(400).json({ error: 'Email is not set up yet. Add the SMTP settings to the server environment first.' });
  const ok = await sendTestEmail(await getSettings());
  if (!ok) return res.status(500).json({ error: 'The email could not be sent. Check the SMTP settings and the server log.' });
  res.json({ ok: true });
}));

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
      console.log(`H.A. Andreou & Co server running on http://localhost:${PORT}`);
      if (usingMemoryDb) console.log('No DATABASE_URL set: using an in memory database (data resets on restart).');
      if (!process.env.ADMIN_PASSWORD) console.log('ADMIN_PASSWORD not set: default admin login is admin / change-me');
    });
  })
  .catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
