// Email: notifications to the office and automatic replies to visitors.
// Configure SMTP_* (and optionally MAIL_FROM) in .env. Without SMTP_HOST, nothing is sent.
// Office notifications go to the "Notification email" setting in the admin console,
// falling back to NOTIFY_EMAIL in .env and then to the firm's main email.
import nodemailer from 'nodemailer';

let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });
}

export const mailConfigured = () => Boolean(transporter);

const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const fill = (text, vars) => text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
const siteUrl = () => (process.env.PUBLIC_URL || '').replace(/\/$/, '');

export function officeEmail(settings) {
  return settings.notify_email || process.env.NOTIFY_EMAIL || settings.email;
}

function fromAddress(settings) {
  return process.env.MAIL_FROM || `${settings.firm_name || 'Website'} <${process.env.SMTP_USER || settings.email}>`;
}

// ---------- layout ----------
function layout(settings, inner, dir = 'ltr') {
  const site = siteUrl();
  const logo = site
    ? `<img src="${site}/logo-full.png" alt="${esc(settings.firm_name)}" width="220" style="display:block;margin:0 auto;max-width:220px;height:auto" />`
    : `<div style="font-family:Georgia,serif;font-size:22px;letter-spacing:2px;color:#ffffff;text-align:center">${esc(settings.firm_name)}</div>`;
  const address = [settings.address_line1, settings.address_line2].filter(Boolean).join(', ');
  return `<!doctype html><html><body style="margin:0;padding:0;background:#F7F6F2">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6F2;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="background:#0E1A30;padding:28px 24px;border-bottom:3px solid #B08B4F">${logo}</td></tr>
<tr><td dir="${dir}" style="padding:32px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#0E1A30;text-align:${dir === 'rtl' ? 'right' : 'left'}">${inner}</td></tr>
<tr><td style="padding:20px 28px;background:#EEEBE4;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#5b6474;text-align:center">
${esc(settings.legal_name || settings.firm_name)}<br />${esc(address)}<br />${esc(settings.phone)}${settings.email ? ` &nbsp;|&nbsp; <a href="mailto:${esc(settings.email)}" style="color:#8C6C38">${esc(settings.email)}</a>` : ''}${site ? `<br /><a href="${site}" style="color:#8C6C38">${esc(site.replace(/^https?:\/\//, ''))}</a>` : ''}
</td></tr></table></td></tr></table></body></html>`;
}

const para = (t) => `<p style="margin:0 0 16px">${t}</p>`;
const quote = (label, text) =>
  `<div style="margin:8px 0 20px;padding:16px 18px;background:#F7F6F2;border-inline-start:3px solid #B08B4F;border-radius:6px">${label ? `<div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8C6C38;margin-bottom:6px">${esc(label)}</div>` : ''}<div style="white-space:pre-wrap">${esc(text)}</div></div>`;

function table(fields) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:8px 0 20px">${Object.entries(fields)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:#5b6474;vertical-align:top;white-space:nowrap;border-bottom:1px solid #EEEBE4">${esc(k)}</td><td style="padding:8px 0;white-space:pre-wrap;border-bottom:1px solid #EEEBE4">${esc(v)}</td></tr>`
    )
    .join('')}</table>`;
}

async function send(settings, { to, subject, html, replyTo, attachments }) {
  if (!transporter || !to) return false;
  try {
    await transporter.sendMail({ from: fromAddress(settings), to, replyTo, subject, html, attachments });
    return true;
  } catch (err) {
    console.error(`Email "${subject}" failed:`, err.message);
    return false;
  }
}

// ---------- office notifications (English) ----------
export function notifyOffice(settings, { subject, intro, fields, message, replyTo, attachments, adminPath = '' }) {
  const site = siteUrl();
  const inner =
    `<h2 style="font-family:Georgia,serif;font-weight:normal;font-size:22px;margin:0 0 12px">${esc(subject)}</h2>` +
    (intro ? para(esc(intro)) : '') +
    table(fields) +
    (message ? quote('Message', message) : '') +
    (site
      ? `<p style="margin:24px 0 0"><a href="${site}/admin${adminPath}" style="display:inline-block;background:#B08B4F;color:#0E1A30;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:13px;letter-spacing:1.5px;text-transform:uppercase">Open the admin console</a></p>`
      : '') +
    (replyTo ? `<p style="margin:16px 0 0;font-size:13px;color:#5b6474">You can reply to this email to answer ${esc(replyTo)} directly.</p>` : '');
  return send(settings, { to: officeEmail(settings), subject, html: layout(settings, inner), replyTo, attachments });
}

// ---------- automatic replies to visitors (in their language, English or Greek) ----------
const T = {
  en: {
    dir: 'ltr',
    dear: 'Dear {name},',
    regards: 'Kind regards,',
    auto: 'This is an automatic message. If you would like to add anything, simply reply to this email.',
    urgent: 'If your matter is urgent, please call us on {phone}.',
    yourMessage: 'Your message',
    general: 'General application',
    inquirySubject: 'We have received your enquiry',
    inquiryBody: 'Thank you for contacting {firm}. We have received your enquiry and a member of our team will reply within {days} working days at the latest.',
    inquiryCopy: 'For your records, a copy of your message is below.',
    appSubject: 'We have received your application',
    appBody: 'Thank you for your interest in joining {firm}. We have received your application for the position of {position}, together with your CV. Our team will review it carefully and will contact you if your profile matches our needs.',
    appBodyGeneral: 'Thank you for your interest in joining {firm}. We have received your application and your CV. Our team will review it carefully and will contact you if your profile matches our needs.',
    chatSubject: 'New reply from {firm}',
    chatBody: 'Our team has replied to your message on our website chat:',
    chatContinue: 'You can continue the conversation on our website, or simply reply to this email.',
    visit: 'Visit our website'
  },
  el: {
    dir: 'ltr',
    dear: 'Αγαπητέ/ή {name},',
    regards: 'Με εκτίμηση,',
    auto: 'Αυτό είναι ένα αυτόματο μήνυμα. Αν θέλετε να προσθέσετε κάτι, απλώς απαντήστε σε αυτό το email.',
    urgent: 'Αν το θέμα σας είναι επείγον, καλέστε μας στο {phone}.',
    yourMessage: 'Το μήνυμά σας',
    general: 'Γενική αίτηση',
    inquirySubject: 'Λάβαμε το αίτημά σας',
    inquiryBody: 'Σας ευχαριστούμε που επικοινωνήσατε με την {firm}. Λάβαμε το αίτημά σας και ένα μέλος της ομάδας μας θα σας απαντήσει το αργότερο εντός {days} εργάσιμων ημερών.',
    inquiryCopy: 'Για το αρχείο σας, ακολουθεί αντίγραφο του μηνύματός σας.',
    appSubject: 'Λάβαμε την αίτησή σας',
    appBody: 'Σας ευχαριστούμε για το ενδιαφέρον σας να ενταχθείτε στην {firm}. Λάβαμε την αίτησή σας για τη θέση {position} μαζί με το βιογραφικό σας. Η ομάδα μας θα την εξετάσει προσεκτικά και θα επικοινωνήσει μαζί σας εάν το προφίλ σας ανταποκρίνεται στις ανάγκες μας.',
    appBodyGeneral: 'Σας ευχαριστούμε για το ενδιαφέρον σας να ενταχθείτε στην {firm}. Λάβαμε την αίτησή σας και το βιογραφικό σας. Η ομάδα μας θα την εξετάσει προσεκτικά και θα επικοινωνήσει μαζί σας εάν το προφίλ σας ανταποκρίνεται στις ανάγκες μας.',
    chatSubject: 'Νέα απάντηση από την {firm}',
    chatBody: 'Η ομάδα μας απάντησε στο μήνυμά σας στη συνομιλία της ιστοσελίδας μας:',
    chatContinue: 'Μπορείτε να συνεχίσετε τη συζήτηση στην ιστοσελίδα μας ή απλώς να απαντήσετε σε αυτό το email.',
    visit: 'Επισκεφθείτε την ιστοσελίδα μας'
  }
};


function visitorMail(settings, lang, { to, subjectKey, name, paragraphs, after = [], quoteLabel, quoteText, extraVars = {}, showVisit = false }) {
  const t = T[lang] || T.en;
  const vars = { name, firm: settings.firm_name, phone: settings.phone, days: settings.reply_days || '2', ...extraVars };
  const site = siteUrl();
  const inner =
    para(esc(fill(t.dear, vars))) +
    paragraphs.map((p) => para(esc(fill(t[p], vars)))).join('') +
    (quoteText ? quote(quoteLabel, quoteText) : '') +
    after.map((p) => para(esc(fill(t[p], vars)))).join('') +
    (showVisit && site
      ? `<p style="margin:8px 0 24px"><a href="${site}" style="display:inline-block;background:#B08B4F;color:#0E1A30;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:13px;letter-spacing:1.5px;text-transform:uppercase">${esc(t.visit)}</a></p>`
      : '') +
    para(`${esc(t.regards)}<br />${esc(settings.firm_name)}`) +
    `<p style="margin:24px 0 0;font-size:12px;color:#5b6474">${esc(t.auto)}</p>`;
  return send(settings, {
    to,
    subject: fill(t[subjectKey], vars),
    html: layout(settings, inner, t.dir),
    replyTo: settings.email || undefined
  });
}

export function sendInquiryReceipt(settings, lang, { name, email, message }) {
  return visitorMail(settings, lang, {
    to: email,
    subjectKey: 'inquirySubject',
    name,
    paragraphs: ['inquiryBody', 'urgent', 'inquiryCopy'],
    quoteLabel: (T[lang] || T.en).yourMessage,
    quoteText: message
  });
}

export function sendApplicationReceipt(settings, lang, { name, email, position }) {
  return visitorMail(settings, lang, {
    to: email,
    subjectKey: 'appSubject',
    name,
    paragraphs: [position ? 'appBody' : 'appBodyGeneral'],
    extraVars: { position }
  });
}

export function sendChatReplyToVisitor(settings, lang, { name, email, reply }) {
  return visitorMail(settings, lang, {
    to: email,
    subjectKey: 'chatSubject',
    name,
    paragraphs: ['chatBody'],
    quoteText: reply,
    after: ['chatContinue'],
    showVisit: true
  });
}

export function sendTestEmail(settings) {
  return notifyOffice(settings, {
    subject: 'Test email from your website',
    intro: 'Email is set up correctly. Enquiries, job applications and live chat messages from the website will be sent to this address.',
    fields: { 'Sent to': officeEmail(settings), 'Sent at': new Date().toLocaleString('en-GB', { timeZone: 'Europe/Nicosia' }) }
  });
}
