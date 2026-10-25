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
      ['hours', 'Office hours']
    ]
  ],
  [
    'Live chat',
    [
      ['chat_welcome', 'Greeting when the team is online', true],
      ['chat_offline', 'Greeting when the team is away', true]
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
      <Toast message={toast} onDone={() => setToast('')} />
    </form>
  );
}
