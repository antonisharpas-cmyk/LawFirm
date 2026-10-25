// Optional email notifications. Configure SMTP_* and NOTIFY_EMAIL in .env
// (for example Amazon SES SMTP credentials). Without them, nothing is sent.
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

const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export async function notify(subject, fields, replyTo) {
  if (!transporter || !process.env.NOTIFY_EMAIL) return;
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#777;vertical-align:top">${esc(k)}</td><td style="padding:6px 12px;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('');
  const adminUrl = process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL.replace(/\/$/, '')}/admin` : '';
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.NOTIFY_EMAIL,
      to: process.env.NOTIFY_EMAIL,
      replyTo,
      subject,
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111"><h2 style="font-weight:normal">${esc(subject)}</h2><table>${rows}</table>${adminUrl ? `<p><a href="${adminUrl}">Open the admin console</a></p>` : ''}</div>`
    });
  } catch (err) {
    console.error('Email notification failed:', err.message);
  }
}
