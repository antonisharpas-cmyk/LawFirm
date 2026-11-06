import { useCallback, useEffect, useRef, useState } from 'react';
import { api, resizeImage } from '../lib/api.js';
import { Empty, Icon, Modal, PageTitle, Pill, Toast, TranslationFields } from './common.jsx';

const HOME_MAX = 6;

function StarIcon({ filled }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
    </svg>
  );
}

export default function PracticeAreasAdmin() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [pendingImage, setPendingImage] = useState(null);
  const fileRef = useRef(null);

  function edit(a) {
    setPendingImage(null);
    setError('');
    setEditing(a);
  }

  async function pickImage(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setPendingImage(await resizeImage(file, 1400, 0.82));
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeImage() {
    if (!editing?.id || !editing.image_url) return setPendingImage(null);
    if (!window.confirm('Remove this image?')) return;
    const row = await api(`/api/admin/practice-areas/${editing.id}/image`, { method: 'DELETE', admin: true });
    setEditing({ ...editing, image_url: null });
    setItems((l) => l.map((x) => (x.id === row.id ? row : x)));
  }

  const load = useCallback(async () => setItems(await api('/api/admin/practice-areas', { admin: true })), []);
  useEffect(() => {
    load();
  }, [load]);

  async function save(e) {
    e.preventDefault();
    setError('');
    try {
      const body = { name: editing.name, summary: editing.summary, body: editing.body, published: editing.published !== false, featured: Boolean(editing.featured), i18n: editing.i18n || {} };
      let row = editing.id
        ? await api(`/api/admin/practice-areas/${editing.id}`, { method: 'PUT', admin: true, body })
        : await api('/api/admin/practice-areas', { method: 'POST', admin: true, body });
      if (pendingImage) row = await api(`/api/admin/practice-areas/${row.id}/image`, { method: 'PUT', admin: true, body: { dataUrl: pendingImage } });
      setPendingImage(null);
      setItems((list) => (list.some((x) => x.id === row.id) ? list.map((x) => (x.id === row.id ? row : x)) : [...list, row]));
      setEditing(null);
      setToast('Expertise area saved');
    } catch (err) {
      setError(err.message);
    }
  }

  const featuredCount = items.filter((x) => x.featured).length;

  async function toggleHome(a) {
    if (!a.featured && featuredCount >= HOME_MAX) {
      setToast(`The homepage shows ${HOME_MAX} areas. Remove one first.`);
      return;
    }
    try {
      const row = await api(`/api/admin/practice-areas/${a.id}`, { method: 'PUT', admin: true, body: { featured: !a.featured } });
      setItems((l) => l.map((x) => (x.id === row.id ? row : x)));
    } catch (err) {
      setToast(err.message);
    }
  }

  async function remove(a) {
    if (!window.confirm(`Delete "${a.name}"?`)) return;
    await api(`/api/admin/practice-areas/${a.id}`, { method: 'DELETE', admin: true });
    setItems((l) => l.filter((x) => x.id !== a.id));
    setToast('Expertise area deleted');
  }

  async function move(i, dir) {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    await api('/api/admin/practice-areas/reorder', { method: 'POST', admin: true, body: { ids: next.map((x) => x.id) } });
  }

  return (
    <>
      <PageTitle title="Expertise" subtitle={`The areas of law listed on the Expertise page and in the forms. Use the star to choose the ${HOME_MAX} areas shown on the homepage (${featuredCount} of ${HOME_MAX} chosen).`}>
        <button className="a-btn-gold" onClick={() => edit({ name: '', summary: '', body: '', published: true, i18n: {} })}><Icon name="plus" /> Add area</button>
      </PageTitle>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {items.length === 0 ? (
          <Empty title="No expertise areas" />
        ) : (
          <ul className="divide-y divide-ink/5">
            {items.map((a, i) => (
              <li key={a.id} className="flex items-center gap-3 px-4 py-4 sm:px-6">
                <div className="flex flex-col">
                  <button className="text-ink/40 hover:text-ink disabled:opacity-20" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><Icon name="up" className="h-3.5 w-3.5" /></button>
                  <button className="text-ink/40 hover:text-ink disabled:opacity-20" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down"><Icon name="down" className="h-3.5 w-3.5" /></button>
                </div>
                <div className="hidden h-12 w-20 shrink-0 overflow-hidden rounded-md bg-ink/5 sm:block">
                  {a.image_url && <img src={a.image_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-medium">{a.name} {!a.published && <Pill>Hidden</Pill>}</p>
                  <p className="truncate text-sm text-ink/50">{a.summary}</p>
                </div>
                <button
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${a.featured ? 'border-gold bg-gold/15 text-gold-dark' : 'border-ink/10 text-ink/40 hover:border-gold hover:text-gold-dark'}`}
                  onClick={() => toggleHome(a)}
                  title={a.featured ? 'Shown on the homepage. Click to remove.' : 'Click to show on the homepage'}
                >
                  <StarIcon filled={a.featured} /> <span className="hidden sm:inline">Homepage</span>
                </button>
                <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => remove(a)} aria-label="Delete"><Icon name="trash" /></button>
                <button className="a-btn-ghost !py-2" onClick={() => edit(a)}><Icon name="edit" /> Edit</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit area' : 'Add area'} wide>
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="a-label">Image</label>
              <div className="flex flex-wrap items-center gap-4">
                <div className="aspect-[16/7] w-56 overflow-hidden rounded-lg bg-ink/5">
                  {(pendingImage || editing.image_url) && <img src={pendingImage || editing.image_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="flex flex-col gap-2">
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={pickImage} />
                  <button type="button" className="a-btn-ghost" onClick={() => fileRef.current?.click()}><Icon name="image" /> {pendingImage || editing.image_url ? 'Change image' : 'Upload image'}</button>
                  {(pendingImage || editing.image_url) && <button type="button" className="text-xs text-red-600 hover:underline" onClick={removeImage}>Remove image</button>}
                  <p className="text-xs text-ink/40">Wide photos work best. Shown in black and white.</p>
                </div>
              </div>
            </div>
            <div><label className="a-label">Name *</label><input className="a-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><label className="a-label">Short summary</label><textarea className="a-input min-h-[70px]" value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></div>
            <div><label className="a-label">Description</label><textarea className="a-input min-h-[140px]" value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} /><p className="mt-1 text-xs text-ink/40">Start a line with • to show it as a bullet point</p></div>
            <TranslationFields value={editing.i18n || {}} onChange={(i18n) => setEditing({ ...editing, i18n })} source={editing} fields={[['name', 'Name'], ['summary', 'Short summary', true], ['body', 'Description', true]]} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[#B08B4F]" checked={editing.published !== false} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /> Show on website</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[#B08B4F]" checked={Boolean(editing.featured)} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Show on the homepage (up to {HOME_MAX} areas)</label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2"><button type="button" className="a-btn-ghost" onClick={() => setEditing(null)}>Cancel</button><button className="a-btn-primary">Save</button></div>
          </form>
        )}
      </Modal>
      <Toast message={toast} onDone={() => setToast('')} />
    </>
  );
}
