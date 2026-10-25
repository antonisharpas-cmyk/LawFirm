import { useCallback, useEffect, useRef, useState } from 'react';
import { api, resizeImage } from '../lib/api.js';
import { Avatar } from '../components/ui.jsx';
import { Empty, Icon, Modal, PageTitle, Pill, Toast } from './common.jsx';

const EMPTY = { name: '', title: '', email: '', phone: '', languages: '', education: '', admissions: '', practice_areas: '', summary: '', bio: '', linkedin: '', published: true };

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="a-label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink/40">{hint}</p>}
    </div>
  );
}

function Editor({ lawyer, areas, onSaved, onClose }) {
  const [f, setF] = useState({ ...EMPTY, ...lawyer });
  const [current, setCurrent] = useState(lawyer);
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function pickPhoto(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setPendingPhoto(await resizeImage(file));
    } catch (err) {
      setError(err.message);
    }
  }

  function toggleArea(name) {
    const list = f.practice_areas.split(',').map((x) => x.trim()).filter(Boolean);
    const next = list.includes(name) ? list.filter((x) => x !== name) : [...list, name];
    setF({ ...f, practice_areas: next.join(', ') });
  }

  async function removePhoto() {
    if (!current?.id) return setPendingPhoto(null);
    if (!window.confirm('Remove this photo?')) return;
    const row = await api(`/api/admin/lawyers/${current.id}/photo`, { method: 'DELETE', admin: true });
    setCurrent(row);
    setPendingPhoto(null);
    onSaved(row, false);
  }

  async function save(e) {
    e.preventDefault();
    if (!f.name.trim()) return setError('Name is required');
    setBusy(true);
    setError('');
    try {
      let row = current?.id
        ? await api(`/api/admin/lawyers/${current.id}`, { method: 'PUT', admin: true, body: f })
        : await api('/api/admin/lawyers', { method: 'POST', admin: true, body: f });
      if (pendingPhoto) row = await api(`/api/admin/lawyers/${row.id}/photo`, { method: 'PUT', admin: true, body: { dataUrl: pendingPhoto } });
      onSaved(row, true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const selectedAreas = f.practice_areas.split(',').map((x) => x.trim()).filter(Boolean);
  const preview = pendingPhoto ? { ...current, name: f.name, photo_url: pendingPhoto } : { ...current, name: f.name };

  return (
    <form onSubmit={save} className="grid gap-8 md:grid-cols-[220px_1fr]">
      <div>
        <div className="aspect-[4/5] overflow-hidden rounded-xl bg-ink-700">
          <Avatar lawyer={preview} textClass="text-4xl" />
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={pickPhoto} />
        <button type="button" onClick={() => fileRef.current?.click()} className="a-btn-ghost mt-3 w-full">
          <Icon name="image" /> {preview.photo_url ? 'Change photo' : 'Upload photo'}
        </button>
        {preview.photo_url && (
          <button type="button" onClick={removePhoto} className="mt-2 w-full text-center text-xs text-red-600 hover:underline">Remove photo</button>
        )}
        <p className="mt-2 text-xs text-ink/40">Portrait photos work best (4:5). Images are resized automatically.</p>
        <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={f.published} onChange={set('published')} className="h-4 w-4 accent-[#BFA575]" />
          Show on website
        </label>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name *"><input className="a-input" value={f.name} onChange={set('name')} /></Field>
          <Field label="Position"><input className="a-input" value={f.title} onChange={set('title')} placeholder="e.g. Partner, Associate" /></Field>
          <Field label="Email"><input className="a-input" type="email" value={f.email} onChange={set('email')} /></Field>
          <Field label="Phone"><input className="a-input" value={f.phone} onChange={set('phone')} /></Field>
          <Field label="Languages" hint="Separate with commas"><input className="a-input" value={f.languages} onChange={set('languages')} /></Field>
          <Field label="LinkedIn URL"><input className="a-input" value={f.linkedin} onChange={set('linkedin')} placeholder="https://" /></Field>
        </div>

        <Field label="Practice areas" hint="Click to select, or type below separated with commas">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {areas.map((a) => (
              <button
                type="button"
                key={a.id}
                onClick={() => toggleArea(a.name)}
                className={`rounded-full border px-3 py-1 text-xs transition ${selectedAreas.includes(a.name) ? 'border-gold bg-gold/15 text-ink' : 'border-ink/10 text-ink/55 hover:border-ink/30'}`}
              >
                {a.name}
              </button>
            ))}
          </div>
          <input className="a-input" value={f.practice_areas} onChange={set('practice_areas')} />
        </Field>

        <Field label="Short summary" hint="One or two sentences shown on the lawyers page and at the top of the profile">
          <textarea className="a-input min-h-[70px]" value={f.summary} onChange={set('summary')} />
        </Field>
        <Field label="Biography" hint="Leave an empty line between paragraphs">
          <textarea className="a-input min-h-[200px]" value={f.bio} onChange={set('bio')} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Education" hint="One per line"><textarea className="a-input min-h-[80px]" value={f.education} onChange={set('education')} /></Field>
          <Field label="Admissions" hint="One per line"><textarea className="a-input min-h-[80px]" value={f.admissions} onChange={set('admissions')} /></Field>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 border-t border-ink/10 pt-4">
          <button type="button" className="a-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="a-btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save lawyer'}</button>
        </div>
      </div>
    </form>
  );
}

export default function LawyersAdmin() {
  const [items, setItems] = useState([]);
  const [areas, setAreas] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [l, a] = await Promise.all([api('/api/admin/lawyers', { admin: true }), api('/api/admin/practice-areas', { admin: true })]);
    setItems(l);
    setAreas(a);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function onSaved(row, close) {
    setItems((list) => (list.some((x) => x.id === row.id) ? list.map((x) => (x.id === row.id ? row : x)) : [...list, row]));
    if (close) {
      setEditing(null);
      setToast('Lawyer saved');
    }
  }

  async function remove(l) {
    if (!window.confirm(`Delete ${l.name}? This removes the profile and photo permanently.`)) return;
    await api(`/api/admin/lawyers/${l.id}`, { method: 'DELETE', admin: true });
    setItems((list) => list.filter((x) => x.id !== l.id));
    setToast('Lawyer deleted');
  }

  async function move(index, dir) {
    const next = [...items];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setItems(next);
    await api('/api/admin/lawyers/reorder', { method: 'POST', admin: true, body: { ids: next.map((x) => x.id) } });
  }

  async function togglePublished(l) {
    const row = await api(`/api/admin/lawyers/${l.id}`, { method: 'PUT', admin: true, body: { published: !l.published } });
    onSaved(row, false);
    setToast(row.published ? 'Now visible on the website' : 'Hidden from the website');
  }

  return (
    <>
      <PageTitle title="Lawyers" subtitle="Add, edit, reorder and remove the people shown on the website.">
        <button className="a-btn-gold" onClick={() => setEditing({})}><Icon name="plus" /> Add lawyer</button>
      </PageTitle>

      {loading ? (
        <p className="text-sm text-ink/40">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white shadow-sm"><Empty title="No lawyers yet" text="Add your first team member to show them on the website." /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((l, i) => (
            <div key={l.id} className={`overflow-hidden rounded-2xl bg-white shadow-sm ${l.published ? '' : 'opacity-70'}`}>
              <div className="flex gap-4 p-4">
                <div className="h-28 w-[88px] shrink-0 overflow-hidden rounded-xl bg-ink-700"><Avatar lawyer={l} textClass="text-2xl" /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-heading text-lg">{l.name}</p>
                  <p className="truncate text-sm text-ink/50">{l.title || 'No position set'}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {l.published ? <Pill tone="green">Visible</Pill> : <Pill>Hidden</Pill>}
                    {!l.photo_url && <Pill tone="gold">No photo</Pill>}
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-ink/45">{l.summary}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 border-t border-ink/5 px-3 py-2">
                <button className="rounded-lg p-2 text-ink/50 hover:bg-ink/5 disabled:opacity-30" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><Icon name="up" /></button>
                <button className="rounded-lg p-2 text-ink/50 hover:bg-ink/5 disabled:opacity-30" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down"><Icon name="down" /></button>
                <button className="rounded-lg px-2 py-1.5 text-xs text-ink/55 hover:bg-ink/5" onClick={() => togglePublished(l)}>{l.published ? 'Hide' : 'Show'}</button>
                <a className="rounded-lg px-2 py-1.5 text-xs text-ink/55 hover:bg-ink/5" href={`/lawyers/${l.slug}`} target="_blank" rel="noreferrer">View</a>
                <button className="ml-auto rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => remove(l)} aria-label="Delete"><Icon name="trash" /></button>
                <button className="a-btn-primary !px-3 !py-1.5 !text-xs" onClick={() => setEditing(l)}><Icon name="edit" /> Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? `Edit ${editing.name}` : 'Add lawyer'} wide>
        {editing && <Editor lawyer={editing} areas={areas} onSaved={onSaved} onClose={() => setEditing(null)} />}
      </Modal>
      <Toast message={toast} onDone={() => setToast('')} />
    </>
  );
}
