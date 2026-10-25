import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { PageTitle, Toast } from './common.jsx';

const GROUPS = [
  [
    'Firm details',
    [
      ['firm_name', 'Firm name'],
      ['email', 'Email'],
      ['phone', 'Phone'],
      ['address_line1', 'Address line 1'],
      ['address_line2', 'Address line 2'],
      ['hours', 'Office hours (English)']
    ]
  ],
  [
    'Live chat',
    [
      ['chat_welcome', 'Greeting when the team is online (English)', true],
      ['chat_offline', 'Greeting when the team is away (English)', true]
    ]
  ],
  ['Careers page', [['careers_intro', 'Introduction (English)', true]]],
  [
    'Greek',
    [
      ['hours_el', 'Office hours'],
      ['careers_intro_el', 'Careers introduction', true],
      ['chat_welcome_el', 'Chat greeting, team online', true],
      ['chat_offline_el', 'Chat greeting, team away', true]
    ]
  ],
  [
    'Russian',
    [
      ['hours_ru', 'Office hours'],
      ['careers_intro_ru', 'Careers introduction', true],
      ['chat_welcome_ru', 'Chat greeting, team online', true],
      ['chat_offline_ru', 'Chat greeting, team away', true]
    ]
  ],
  [
    'Hebrew',
    [
      ['hours_he', 'Office hours'],
      ['careers_intro_he', 'Careers introduction', true],
      ['chat_welcome_he', 'Chat greeting, team online', true],
      ['chat_offline_he', 'Chat greeting, team away', true]
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

export default function SettingsAdmin() {
  const [s, setS] = useState(null);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/api/admin/settings', { admin: true }).then(setS);
  }, []);

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      setS(await api('/api/admin/settings', { method: 'PUT', admin: true, body: s }));
      setToast('Settings saved');
    } finally {
      setBusy(false);
    }
  }

  if (!s) return <p className="text-sm text-ink/40">Loading…</p>;

  return (
    <form onSubmit={save}>
      <PageTitle title="Settings" subtitle="Contact details shown across the website, and live chat messages.">
        <button className="a-btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
      </PageTitle>
      <div className="space-y-4">
        {GROUPS.map(([title, fields]) => (
          <section key={title} className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-heading text-xl">{title}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map(([key, label, long]) => (
                <div key={key} className={long ? 'sm:col-span-2' : ''}>
                  <label className="a-label">{label}</label>
                  {long ? (
                    <textarea className="a-input min-h-[80px]" dir={key.endsWith('_he') ? 'rtl' : 'ltr'} value={s[key] || ''} onChange={(e) => setS({ ...s, [key]: e.target.value })} />
                  ) : (
                    <input className="a-input" dir={key.endsWith('_he') ? 'rtl' : 'ltr'} value={s[key] || ''} onChange={(e) => setS({ ...s, [key]: e.target.value })} />
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <Toast message={toast} onDone={() => setToast('')} />
    </form>
  );
}
