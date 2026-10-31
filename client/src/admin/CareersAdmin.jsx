import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, adminToken, formatDate, timeAgo } from '../lib/api.js';
import { Select } from '../components/ui.jsx';
import { Empty, Icon, Modal, PageTitle, Pill, Toast, TranslationFields } from './common.jsx';

const STATUS = {
  new: { label: 'New', tone: 'gold' },
  reviewing: { label: 'Reviewing', tone: 'blue' },
  shortlisted: { label: 'Shortlisted', tone: 'green' },
  hired: { label: 'Hired', tone: 'green' },
  rejected: { label: 'Not selected', tone: 'neutral' }
};

async function fetchCv(id) {
  const res = await fetch(`/api/admin/applications/${id}/cv`, { headers: { Authorization: `Bearer ${adminToken.get()}` } });
  if (!res.ok) throw new Error('Could not load the CV');
  return res.blob();
}

function Applications({ onChange, jobs }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'all', q: '' });
  const [selectedId, setSelectedId] = useState(null);
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await api(`/api/admin/applications?${new URLSearchParams(filter)}`, { admin: true }));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    const t = setTimeout(load, filter.q ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, filter.q]);

  const selected = useMemo(() => items.find((i) => i.id === selectedId), [items, selectedId]);
  useEffect(() => setNotes(selected?.notes || ''), [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function update(id, body, msg) {
    const row = await api(`/api/admin/applications/${id}`, { method: 'PATCH', admin: true, body });
    setItems((l) => l.map((i) => (i.id === id ? row : i)));
    if (msg) setToast(msg);
    onChange?.();
  }

  function open(a) {
    setSelectedId(a.id);
    if (a.status === 'new') update(a.id, { status: 'reviewing' });
  }

  async function remove(id) {
    if (!window.confirm('Delete this application and the attached CV permanently?')) return;
    await api(`/api/admin/applications/${id}`, { method: 'DELETE', admin: true });
    setItems((l) => l.filter((i) => i.id !== id));
    setSelectedId(null);
    setToast('Application deleted');
    onChange?.();
  }

  async function download(a) {
    try {
      const blob = await fetchCv(a.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = a.cv_name || 'cv';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (e) {
      setToast(e.message);
    }
  }

  async function view(a) {
    const w = window.open('', '_blank');
    try {
      const blob = await fetchCv(a.id);
      w.location.href = URL.createObjectURL(blob);
    } catch (e) {
      w?.close();
      setToast(e.message);
    }
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
          {[['all', 'All'], ...Object.entries(STATUS).map(([k, s]) => [k, s.label])].map(([k, l]) => (
            <button key={k} onClick={() => setFilter({ ...filter, status: k })} className={`rounded-lg px-3.5 py-2 text-sm transition ${filter.status === k ? 'bg-ink text-white' : 'text-ink/60 hover:bg-ink/5'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Icon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input className="a-input !py-3 !pl-10" placeholder="Search name, email or position" value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className={`overflow-hidden rounded-2xl bg-white shadow-sm ${selected ? 'hidden lg:block' : ''}`}>
          {loading ? (
            <p className="p-6 text-sm text-ink/40">Loading…</p>
          ) : items.length === 0 ? (
            <Empty title="No applications yet" text="Applications sent from the Careers page will appear here." />
          ) : (
            <ul className="scrollbar-thin max-h-[calc(100vh-300px)] divide-y divide-ink/5 overflow-y-auto">
              {items.map((a) => (
                <li key={a.id}>
                  <button onClick={() => open(a)} className={`w-full border-l-2 px-5 py-4 text-left transition hover:bg-paper ${selectedId === a.id ? 'bg-paper' : ''} ${a.status === 'new' ? 'border-gold' : 'border-transparent'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <p className={`truncate text-sm ${a.status === 'new' ? 'font-semibold' : 'font-medium'}`}>{a.name}</p>
                      <span className="shrink-0 text-xs text-ink/40">{timeAgo(a.created_at)}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-ink/50">{a.job_title}</p>
                    <div className="mt-2"><Pill tone={STATUS[a.status]?.tone}>{STATUS[a.status]?.label}</Pill></div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`rounded-2xl bg-white shadow-sm ${selected ? '' : 'hidden lg:block'}`}>
          {!selected ? (
            <Empty title="Select an application" text="Choose an applicant on the left to review their details and CV." />
          ) : (
            <div className="p-6 sm:p-8">
              <button onClick={() => setSelectedId(null)} className="mb-4 inline-flex items-center gap-1 text-sm text-ink/50 lg:hidden"><Icon name="back" /> Back</button>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-heading text-2xl">{selected.name}</h2>
                  <p className="mt-1 text-sm text-ink/55">{selected.job_title}</p>
                  <p className="mt-0.5 text-xs text-ink/40">Received {formatDate(selected.created_at)}</p>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={selected.status} onChange={(v) => update(selected.id, { status: v }, 'Status updated')} options={Object.entries(STATUS).map(([value, s]) => ({ value, label: s.label }))} />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a href={`mailto:${selected.email}?subject=${encodeURIComponent(`Your application: ${selected.job_title}`)}`} className="flex items-center gap-3 rounded-xl border border-ink/10 p-4 transition hover:border-gold">
                  <Icon name="mail" className="h-5 w-5 text-gold-dark" />
                  <span className="min-w-0"><span className="block text-xs text-ink/45">Email</span><span className="block truncate text-sm">{selected.email}</span></span>
                </a>
                <a href={`tel:${selected.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 rounded-xl border border-ink/10 p-4 transition hover:border-gold">
                  <Icon name="phone" className="h-5 w-5 text-gold-dark" />
                  <span><span className="block text-xs text-ink/45">Phone</span><span className="block text-sm">{selected.phone}</span></span>
                </a>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-paper p-4">
                <Icon name="file" className="h-6 w-6 text-gold-dark" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{selected.cv_name}</span>
                {selected.cv_type === 'application/pdf' && <button className="a-btn-ghost !py-2" onClick={() => view(selected)}>Open</button>}
                <button className="a-btn-gold !py-2" onClick={() => download(selected)}><Icon name="download" /> Download CV</button>
              </div>

              {selected.linkedin && (
                <p className="mt-4 text-sm">
                  <span className="text-ink/45">LinkedIn: </span>
                  <a href={/^https?:\/\//.test(selected.linkedin) ? selected.linkedin : `https://${selected.linkedin}`} target="_blank" rel="noreferrer" className="text-gold-dark hover:underline">{selected.linkedin}</a>
                </p>
              )}
              {selected.message && <div className="mt-4 whitespace-pre-wrap rounded-xl border border-ink/10 p-5 text-[15px] leading-relaxed">{selected.message}</div>}

              <div className="mt-6">
                <label className="a-label">Internal notes</label>
                <textarea className="a-input min-h-[100px]" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Only visible to the team" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="a-btn-primary" onClick={() => update(selected.id, { notes }, 'Notes saved')}>Save notes</button>
                <a className="a-btn-ghost" href={`mailto:${selected.email}?subject=${encodeURIComponent(`Your application: ${selected.job_title}`)}`}><Icon name="mail" /> Reply by email</a>
                <button className="a-btn-danger ml-auto" onClick={() => remove(selected.id)}><Icon name="trash" /> Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toast message={toast} onDone={() => setToast('')} />
          </>
  );
}

const EMPTY_JOB = { title: '', location: 'Larnaca', employment_type: 'Full time', summary: '', description: '', requirements: '', published: true, i18n: {} };

function Positions({ jobs, setJobs }) {
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const set = (k) => (e) => setEditing({ ...editing, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function save(e) {
    e.preventDefault();
    setError('');
    try {
      const row = editing.id
        ? await api(`/api/admin/jobs/${editing.id}`, { method: 'PUT', admin: true, body: editing })
        : await api('/api/admin/jobs', { method: 'POST', admin: true, body: editing });
      setJobs((l) => (l.some((x) => x.id === row.id) ? l.map((x) => (x.id === row.id ? row : x)) : [...l, row]));
      setEditing(null);
      setToast('Position saved');
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(j) {
    if (!window.confirm(`Delete the "${j.title}" position? Existing applications are kept.`)) return;
    await api(`/api/admin/jobs/${j.id}`, { method: 'DELETE', admin: true });
    setJobs((l) => l.filter((x) => x.id !== j.id));
    setToast('Position deleted');
  }

  async function toggle(j) {
    const row = await api(`/api/admin/jobs/${j.id}`, { method: 'PUT', admin: true, body: { published: !j.published } });
    setJobs((l) => l.map((x) => (x.id === row.id ? row : x)));
  }

  async function move(i, dir) {
    const next = [...jobs];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setJobs(next);
    await api('/api/admin/jobs/reorder', { method: 'POST', admin: true, body: { ids: next.map((x) => x.id) } });
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button className="a-btn-gold" onClick={() => setEditing({ ...EMPTY_JOB })}><Icon name="plus" /> Add position</button>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {jobs.length === 0 ? (
          <Empty title="No positions" text="When there are no open positions, the Careers page still accepts general applications." />
        ) : (
          <ul className="divide-y divide-ink/5">
            {jobs.map((j, i) => (
              <li key={j.id} className="flex items-center gap-3 px-4 py-4 sm:px-6">
                <div className="flex flex-col">
                  <button className="text-ink/40 hover:text-ink disabled:opacity-20" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><Icon name="up" className="h-3.5 w-3.5" /></button>
                  <button className="text-ink/40 hover:text-ink disabled:opacity-20" onClick={() => move(i, 1)} disabled={i === jobs.length - 1} aria-label="Move down"><Icon name="down" className="h-3.5 w-3.5" /></button>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 font-medium">{j.title} {j.published ? <Pill tone="green">Open</Pill> : <Pill>Hidden</Pill>}</p>
                  <p className="truncate text-sm text-ink/50">{[j.location, j.employment_type].filter(Boolean).join(' · ')}</p>
                </div>
                <button className="hidden rounded-lg px-2 py-1.5 text-xs text-ink/55 hover:bg-ink/5 sm:block" onClick={() => toggle(j)}>{j.published ? 'Hide' : 'Show'}</button>
                <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => remove(j)} aria-label="Delete"><Icon name="trash" /></button>
                <button className="a-btn-ghost !py-2" onClick={() => setEditing(j)}><Icon name="edit" /> Edit</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit position' : 'Add position'} wide>
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-3"><label className="a-label">Job title *</label><input className="a-input" value={editing.title} onChange={set('title')} /></div>
              <div><label className="a-label">Location</label><input className="a-input" value={editing.location} onChange={set('location')} /></div>
              <div><label className="a-label">Type</label><input className="a-input" value={editing.employment_type} onChange={set('employment_type')} placeholder="Full time, Part time…" /></div>
              <label className="flex items-end gap-2 pb-3 text-sm"><input type="checkbox" className="h-4 w-4 accent-[#B08B4F]" checked={editing.published !== false} onChange={set('published')} /> Show on website</label>
            </div>
            <div><label className="a-label">Short summary</label><textarea className="a-input min-h-[60px]" value={editing.summary} onChange={set('summary')} /></div>
            <div><label className="a-label">About the role</label><textarea className="a-input min-h-[140px]" value={editing.description} onChange={set('description')} /><p className="mt-1 text-xs text-ink/40">Leave an empty line between paragraphs</p></div>
            <div><label className="a-label">Requirements</label><textarea className="a-input min-h-[120px]" value={editing.requirements} onChange={set('requirements')} /><p className="mt-1 text-xs text-ink/40">One per line</p></div>
            <TranslationFields
              value={editing.i18n || {}}
              onChange={(i18n) => setEditing({ ...editing, i18n })}
              source={editing}
              fields={[['title', 'Job title'], ['location', 'Location'], ['employment_type', 'Type'], ['summary', 'Short summary', true], ['description', 'About the role', true], ['requirements', 'Requirements (one per line)', true]]}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 border-t border-ink/10 pt-4">
              <button type="button" className="a-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="a-btn-primary">Save position</button>
            </div>
          </form>
        )}
      </Modal>
      <Toast message={toast} onDone={() => setToast('')} />
    </>
  );
}

export default function CareersAdmin({ onChange }) {
  const [tab, setTab] = useState('applications');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api('/api/admin/jobs', { admin: true }).then(setJobs).catch(() => {});
  }, []);

  return (
    <>
      <PageTitle title="Careers" subtitle="Job applications from the website and the open positions shown on the Careers page." />
      <div className="mb-5 inline-flex rounded-xl bg-white p-1 shadow-sm">
        {[['applications', 'Applications'], ['positions', `Positions (${jobs.length})`]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-lg px-4 py-2 text-sm transition ${tab === k ? 'bg-ink text-white' : 'text-ink/60 hover:bg-ink/5'}`}>{l}</button>
        ))}
      </div>
      {tab === 'applications' ? <Applications onChange={onChange} jobs={jobs} /> : <Positions jobs={jobs} setJobs={setJobs} />}
    </>
  );
}
