import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, formatDate, timeAgo } from '../lib/api.js';
import { Select } from '../components/ui.jsx';
import { Empty, Icon, PageTitle, Pill, Toast } from './common.jsx';

const STATUS = {
  new: { label: 'New', tone: 'gold' },
  in_progress: { label: 'In progress', tone: 'blue' },
  closed: { label: 'Closed', tone: 'green' }
};

export default function Inquiries({ onChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'all', q: '' });
  const [selectedId, setSelectedId] = useState(null);
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    const qs = new URLSearchParams(filter).toString();
    try {
      setItems(await api(`/api/admin/inquiries?${qs}`, { admin: true }));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    const t = setTimeout(load, filter.q ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, filter.q]);

  useEffect(() => {
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  const selected = useMemo(() => items.find((i) => i.id === selectedId), [items, selectedId]);
  useEffect(() => setNotes(selected?.notes || ''), [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function update(id, body, msg) {
    const row = await api(`/api/admin/inquiries/${id}`, { method: 'PATCH', admin: true, body });
    setItems((list) => list.map((i) => (i.id === id ? row : i)));
    if (msg) setToast(msg);
    onChange?.();
  }

  async function open(item) {
    setSelectedId(item.id);
    if (item.status === 'new') update(item.id, { status: 'in_progress' });
  }

  async function remove(id) {
    if (!window.confirm('Delete this inquiry permanently?')) return;
    await api(`/api/admin/inquiries/${id}`, { method: 'DELETE', admin: true });
    setItems((list) => list.filter((i) => i.id !== id));
    setSelectedId(null);
    setToast('Inquiry deleted');
    onChange?.();
  }

  const counts = items.reduce((acc, i) => ({ ...acc, [i.status]: (acc[i.status] || 0) + 1 }), {});

  return (
    <>
      <PageTitle title="Inquiries" subtitle="Messages sent from the website contact forms." />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
          {[['all', 'All'], ['new', 'New'], ['in_progress', 'In progress'], ['closed', 'Closed']].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setFilter({ ...filter, status: k })}
              className={`rounded-lg px-3.5 py-2 text-sm transition ${filter.status === k ? 'bg-ink text-white' : 'text-ink/60 hover:bg-ink/5'}`}
            >
              {l}
              {filter.status === 'all' && k !== 'all' && counts[k] ? <span className="ml-1.5 text-xs opacity-60">{counts[k]}</span> : null}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Icon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input className="a-input !py-3 !pl-10" placeholder="Search name, email or message" value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className={`overflow-hidden rounded-2xl bg-white shadow-sm ${selected ? 'hidden lg:block' : ''}`}>
          {loading ? (
            <p className="p-6 text-sm text-ink/40">Loading…</p>
          ) : items.length === 0 ? (
            <Empty title="No inquiries yet" text="New messages from the contact and booking forms will appear here." />
          ) : (
            <ul className="scrollbar-thin max-h-[calc(100vh-240px)] divide-y divide-ink/5 overflow-y-auto">
              {items.map((i) => (
                <li key={i.id}>
                  <button
                    onClick={() => open(i)}
                    className={`w-full px-5 py-4 text-left transition hover:bg-paper ${selectedId === i.id ? 'bg-paper' : ''} ${i.status === 'new' ? 'border-l-2 border-gold' : 'border-l-2 border-transparent'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className={`truncate text-sm ${i.status === 'new' ? 'font-semibold' : 'font-medium'}`}>{i.name}</p>
                      <span className="shrink-0 text-xs text-ink/40">{timeAgo(i.created_at)}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-ink/50">{i.subject || i.practice_area || i.email}</p>
                    <p className="mt-1.5 line-clamp-2 text-[13px] text-ink/60">{i.message}</p>
                    <div className="mt-2 flex gap-1.5">
                      <Pill tone={STATUS[i.status]?.tone}>{STATUS[i.status]?.label}</Pill>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`rounded-2xl bg-white shadow-sm ${selected ? '' : 'hidden lg:block'}`}>
          {!selected ? (
            <Empty title="Select an inquiry" text="Choose a message on the left to read it and reply." />
          ) : (
            <div className="p-6 sm:p-8">
              <button onClick={() => setSelectedId(null)} className="mb-4 inline-flex items-center gap-1 text-sm text-ink/50 lg:hidden">
                <Icon name="back" /> Back
              </button>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-heading text-2xl">{selected.name}</h2>
                  </div>
                  <p className="mt-1 text-sm text-ink/45">Received {formatDate(selected.created_at)}</p>
                </div>
                <div className="w-full sm:w-44">
                  <Select
                    value={selected.status}
                    onChange={(v) => update(selected.id, { status: v }, 'Status updated')}
                    options={Object.entries(STATUS).map(([value, s]) => ({ value, label: s.label }))}
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || 'Your enquiry to Athanasiadou Law Firm'}`)}`} className="flex items-center gap-3 rounded-xl border border-ink/10 p-4 transition hover:border-gold">
                  <Icon name="mail" className="h-5 w-5 text-gold-dark" />
                  <span className="min-w-0"><span className="block text-xs text-ink/45">Email</span><span className="block truncate text-sm">{selected.email}</span></span>
                </a>
                {selected.phone ? (
                  <a href={`tel:${selected.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 rounded-xl border border-ink/10 p-4 transition hover:border-gold">
                    <Icon name="phone" className="h-5 w-5 text-gold-dark" />
                    <span><span className="block text-xs text-ink/45">Phone</span><span className="block text-sm">{selected.phone}</span></span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-ink/10 p-4 text-sm text-ink/40">No phone number given</div>
                )}
              </div>

              <dl className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                {[
                  ['Subject', selected.subject],
                  ['Area of law', selected.practice_area]
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs uppercase tracking-wider text-ink/40">{k}</dt>
                      <dd className="mt-0.5">{v}</dd>
                    </div>
                  ))}
              </dl>

              <div className="mt-6 whitespace-pre-wrap rounded-xl bg-paper p-5 text-[15px] leading-relaxed">{selected.message}</div>

              <div className="mt-6">
                <label className="a-label">Internal notes</label>
                <textarea className="a-input min-h-[100px]" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Only visible to the team" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button className="a-btn-primary" onClick={() => update(selected.id, { notes }, 'Notes saved')}>Save notes</button>
                <a className="a-btn-gold" href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || 'Your enquiry to Athanasiadou Law Firm'}`)}`}>
                  <Icon name="mail" /> Reply by email
                </a>
                {selected.status !== 'closed' && (
                  <button className="a-btn-ghost" onClick={() => update(selected.id, { status: 'closed' }, 'Marked as closed')}>Mark as closed</button>
                )}
                <button className="a-btn-danger ml-auto" onClick={() => remove(selected.id)}>
                  <Icon name="trash" /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toast message={toast} onDone={() => setToast('')} />
    </>
  );
}
