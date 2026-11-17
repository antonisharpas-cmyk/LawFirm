import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { PageTitle, Toast } from './common.jsx';

const GROUPS = [
  [
    'Firm details',
    [
      ['firm_name', 'Trade name'],
      ['legal_name', 'Company name (used in the footer and legal pages)'],
      ['email', 'Email'],
      ['phone', 'Phone'],
      ['fax', 'Fax'],
      ['address_line1', 'Address line 1'],
      ['address_line2', 'Address line 2'],
      ['map_location', 'Map pin (address or latitude,longitude as Google Maps finds it)'],
      ['hours', 'Office hours as shown on the website (English)', true]
    ]
  ],
  [
    'Live chat',
    [
      ['chat_welcome', 'Greeting during office hours (English)', true],
      ['chat_offline', 'Greeting outside office hours (English)', true]
    ]
  ],
  [
    'Greek',
    [
      ['address_line1_el', 'Address line 1'],
      ['address_line2_el', 'Address line 2'],
      ['hours_el', 'Office hours', true],
      ['chat_welcome_el', 'Chat greeting, during office hours', true],
      ['chat_offline_el', 'Chat greeting, outside office hours', true]
    ]
  ],
  [
    'Social media',
    [
      ['facebook', 'Facebook URL'],
      ['instagram', 'Instagram URL'],
      ['linkedin', 'LinkedIn URL']
    ]
  ]
  // Facebook, Instagram and LinkedIn appear on the website and the /link page only when filled in
];

const DAYS = [
  [1, 'Mon'],
  [2, 'Tue'],
  [3, 'Wed'],
  [4, 'Thu'],
  [5, 'Fri'],
  [6, 'Sat'],
  [7, 'Sun']
];

function readSchedule(s) {
  try {
    const v = JSON.parse(s.office_schedule || '');
    if (v && typeof v === 'object') return v;
  } catch {}
  const days = String(s.office_days || '').split(',').map((d) => Number(d.trim())).filter(Boolean);
  return Object.fromEntries(days.map((d) => [String(d), [s.office_open || '09:00', s.office_close || '17:00']]));
}

function OpeningHours({ s, setS, status }) {
  const schedule = readSchedule(s);
  function update(d, value) {
    const next = { ...schedule };
    if (value) next[d] = value;
    else delete next[d];
    setS({ ...s, office_schedule: JSON.stringify(next) });
  }
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="font-heading text-xl">Opening hours</h2>
      <p className="mb-4 mt-1 text-sm text-ink/50">
        Used by the live chat, in Cyprus time. During these hours visitors see that the team is online and get the office hours greeting; outside them, and on closed dates, they get the away greeting. The hours shown on the website are the text fields under Firm details and Greek.
        {status && (
          <span className={`ms-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs ${status.officeOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-ink/5 text-ink/60'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${status.officeOpen ? 'bg-emerald-500' : 'bg-ink/30'}`} />
            {status.officeOpen ? 'Open now' : 'Closed now'}
          </span>
        )}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 divide-y divide-ink/5 rounded-xl border border-ink/10">
          {DAYS.map(([d, label]) => {
            const v = schedule[String(d)];
            return (
              <div key={d} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                <label className="flex w-28 items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4 accent-[#B08B4F]" checked={Boolean(v)} onChange={(e) => update(String(d), e.target.checked ? ['08:00', '18:00'] : null)} />
                  {label}
                </label>
                {v ? (
                  <>
                    <input type="time" className="a-input !w-36 !py-1.5" value={v[0] || ''} onChange={(e) => update(String(d), [e.target.value, v[1]])} />
                    <span className="text-sm text-ink/40">to</span>
                    <input type="time" className="a-input !w-36 !py-1.5" value={v[1] || ''} onChange={(e) => update(String(d), [v[0], e.target.value])} />
                  </>
                ) : (
                  <span className="text-sm text-ink/40">Closed</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="sm:col-span-2">
          <label className="a-label">Closed dates (holidays)</label>
          <textarea className="a-input min-h-[160px] font-mono text-sm" value={s.office_closed_dates || ''} onChange={(e) => setS({ ...s, office_closed_dates: e.target.value })} />
          <p className="mt-1 text-xs text-ink/45">
            One date per line. Use MM-DD for a holiday on the same date every year (12-25) or YYYY-MM-DD for a single date (2027-04-30). Add the holidays that move each year, such as Green Monday, Good Friday, Easter Monday and Kataklysmos, as YYYY-MM-DD. Text after # is a note.
          </p>
        </div>
      </div>
    </section>
  );
}

function EmailSettings({ s, setS, status, onTest, testing }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="font-heading text-xl">Emails</h2>
      <p className="mb-4 mt-1 text-sm text-ink/50">
        The office receives an email for every enquiry, job application (with the CV attached) and new live chat. Visitors receive an automatic confirmation in their language, and live chat visitors who have left the website receive the team's replies by email.
      </p>
      {status && !status.configured && (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Email sending is not set up on the server yet, so no emails are sent. Add the SMTP settings (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) to the server environment. Everything still appears here in the admin console.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="a-label">Send office notifications to</label>
          <input className="a-input" placeholder={s.email} value={s.notify_email || ''} onChange={(e) => setS({ ...s, notify_email: e.target.value })} />
          <p className="mt-1 text-xs text-ink/45">Leave empty to use the firm email ({s.email}).</p>
        </div>
        <div>
          <label className="a-label">Reply promised within (working days)</label>
          <input type="number" min="1" max="30" className="a-input" value={s.reply_days || ''} onChange={(e) => setS({ ...s, reply_days: e.target.value })} />
          <p className="mt-1 text-xs text-ink/45">Used in the automatic confirmation sent after an enquiry.</p>
        </div>
        <div className="sm:col-span-2">
          <button type="button" className="a-btn-ghost" onClick={onTest} disabled={testing || !status?.configured}>
            {testing ? 'Sending…' : 'Send a test email'}
          </button>
          {status?.configured && <span className="ms-3 text-xs text-ink/45">Save first if you changed the address. The test goes to {status.to}.</span>}
        </div>
      </div>
    </section>
  );
}

export default function SettingsAdmin() {
  const [s, setS] = useState(null);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);
  const [testing, setTesting] = useState(false);

  const loadStatus = () => api('/api/admin/email-status', { admin: true }).then(setStatus).catch(() => {});
  useEffect(() => {
    api('/api/admin/settings', { admin: true }).then(setS);
    loadStatus();
  }, []);

  async function testEmail() {
    setTesting(true);
    try {
      await api('/api/admin/email-test', { method: 'POST', admin: true });
      setToast(`Test email sent to ${status?.to}`);
    } catch (err) {
      setToast(err.message);
    } finally {
      setTesting(false);
    }
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      setS(await api('/api/admin/settings', { method: 'PUT', admin: true, body: s }));
      setToast('Settings saved');
      loadStatus();
    } finally {
      setBusy(false);
    }
  }

  if (!s) return <p className="text-sm text-ink/40">Loading…</p>;

  return (
    <form onSubmit={save}>
      <PageTitle title="Settings" subtitle="Contact details, opening hours, emails and live chat messages.">
        <button className="a-btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
      </PageTitle>
      <div className="space-y-4">
        <OpeningHours s={s} setS={setS} status={status} />
        <EmailSettings s={s} setS={setS} status={status} onTest={testEmail} testing={testing} />
        {GROUPS.map(([title, fields]) => (
          <section key={title} className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-heading text-xl">{title}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map(([key, label, long]) => (
                <div key={key} className={long ? 'sm:col-span-2' : ''}>
                  <label className="a-label">{label}</label>
                  {long ? (
                    <textarea className="a-input min-h-[80px]" value={s[key] || ''} onChange={(e) => setS({ ...s, [key]: e.target.value })} />
                  ) : (
                    <input className="a-input" value={s[key] || ''} onChange={(e) => setS({ ...s, [key]: e.target.value })} />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="sticky bottom-4 z-20 mt-6 flex justify-end">
        <button className="a-btn-primary shadow-lg" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
      </div>
      <Toast message={toast} onDone={() => setToast('')} />
    </form>
  );
}
