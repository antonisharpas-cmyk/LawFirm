import { useCallback, useEffect, useRef, useState } from 'react';
import { api, resizeImage } from '../lib/api.js';
import { Empty, Icon, Modal, PageTitle, Pill, Toast, TranslationFields } from './common.jsx';

const today = () => new Date().toISOString().slice(0, 10);
const blank = () => ({ title: '', summary: '', body: '', published_on: today(), published: true, i18n: {} });

export default function NewsAdmin() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [pendingImage, setPendingImage] = useState(null);
  const fileRef = useRef(null);

  const load = useCallback(async () => setItems(await api('/api/admin/news', { admin: true })), []);
  useEffect(() => {
    load();
  }, [load]);

  function edit(n) {
    setPendingImage(null);
    setError('');
    setEditing(n);
  }

  async function pickImage(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setPendingImage(await resizeImage(file, 1600, 0.82));
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeImage() {
    if (!editing?.id || !editing.image_url) return setPendingImage(null);
    if (!window.confirm('Remove this image?')) return;
    const row = await api(`/api/admin/news/${editing.id}/image`, { method: 'DELETE', admin: true });
    setEditing({ ...editing, image_url: null });
    setItems((l) => l.map((x) => (x.id === row.id ? row : x)));
  }

  async function save(e) {
    e.preventDefault();
    setError('');
    try {
      const body = {
        title: editing.title,
        summary: editing.summary,
        body: editing.body,
        published_on: editing.published_on,
        published: editing.published !== false,
        i18n: editing.i18n || {}
      };
      let row = editing.id
        ? await api(`/api/admin/news/${editing.id}`, { method: 'PUT', admin: true, body })
        : await api('/api/admin/news', { method: 'POST', admin: true, body });
      if (pendingImage) row = await api(`/api/admin/news/${row.id}/image`, { method: 'PUT', admin: true, body: { dataUrl: pendingImage } });
      setPendingImage(null);
      setEditing(null);
      await load();
      setToast('Article saved');
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(n) {
    if (!window.confirm(`Delete "${n.title}"?`)) return;
    await api(`/api/admin/news/${n.id}`, { method: 'DELETE', admin: true });
    setItems((l) => l.filter((x) => x.id !== n.id));
    setToast('Article deleted');
  }

  return (
    <>
      <PageTitle title="News" subtitle="Articles shown on the News page of the website, newest first.">
        <button className="a-btn-gold" onClick={() => edit(blank())}><Icon name="plus" /> Add article</button>
      </PageTitle>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {items.length === 0 ? (
          <Empty title="No articles yet" text="Add the first article with the button above." />
        ) : (
          <ul className="divide-y divide-ink/5">
            {items.map((n) => (
              <li key={n.id} className="flex items-center gap-3 px-4 py-4 sm:px-6">
                <div className="hidden h-12 w-20 shrink-0 overflow-hidden rounded-md bg-ink/5 sm:block">
                  {n.image_url && <img src={n.image_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-medium">{n.title} {!n.published && <Pill>Hidden</Pill>}</p>
                  <p className="truncate text-sm text-ink/50">{n.published_on}{n.summary ? ` · ${n.summary}` : ''}</p>
                </div>
                <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => remove(n)} aria-label="Delete"><Icon name="trash" /></button>
                <button className="a-btn-ghost !py-2" onClick={() => edit(n)}><Icon name="edit" /> Edit</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit article' : 'Add article'} wide>
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="a-label">Image</label>
              <div className="flex flex-wrap items-center gap-4">
                <div className="aspect-[16/9] w-56 overflow-hidden rounded-lg bg-ink/5">
                  {(pendingImage || editing.image_url) && <img src={pendingImage || editing.image_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="flex flex-col gap-2">
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={pickImage} />
                  <button type="button" className="a-btn-ghost" onClick={() => fileRef.current?.click()}><Icon name="image" /> {pendingImage || editing.image_url ? 'Change image' : 'Upload image'}</button>
                  {(pendingImage || editing.image_url) && <button type="button" className="text-xs text-red-600 hover:underline" onClick={removeImage}>Remove image</button>}
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2"><label className="a-label">Title</label><input className="a-input" required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><label className="a-label">Date</label><input type="date" className="a-input" value={editing.published_on || ''} onChange={(e) => setEditing({ ...editing, published_on: e.target.value })} /></div>
            </div>
            <div><label className="a-label">Short summary</label><textarea className="a-input min-h-[70px]" value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></div>
            <div>
              <label className="a-label">Article</label>
              <textarea className="a-input min-h-[220px]" value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
              <p className="mt-1 text-xs text-ink/45">One paragraph per line. Start a line with • to make a bullet list.</p>
            </div>
            <TranslationFields value={editing.i18n || {}} onChange={(i18n) => setEditing({ ...editing, i18n })} source={editing} fields={[['title', 'Title'], ['summary', 'Short summary', true], ['body', 'Article', true]]} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[#B08B4F]" checked={editing.published !== false} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /> Show on website</label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" className="a-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="a-btn-primary">Save article</button>
            </div>
          </form>
        )}
      </Modal>
      <Toast message={toast} onDone={() => setToast('')} />
    </>
  );
}
