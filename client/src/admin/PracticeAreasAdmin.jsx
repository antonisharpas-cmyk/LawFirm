import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { Empty, Icon, Modal, PageTitle, Pill, Toast, TranslationFields } from './common.jsx';

export default function PracticeAreasAdmin() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => setItems(await api('/api/admin/practice-areas', { admin: true })), []);
  useEffect(() => {
    load();
  }, [load]);

  async function save(e) {
    e.preventDefault();
    setError('');
    try {
      const body = { name: editing.name, summary: editing.summary, body: editing.body, published: editing.published !== false, i18n: editing.i18n || {} };
      const row = editing.id
        ? await api(`/api/admin/practice-areas/${editing.id}`, { method: 'PUT', admin: true, body })
        : await api('/api/admin/practice-areas', { method: 'POST', admin: true, body });
      setItems((list) => (list.some((x) => x.id === row.id) ? list.map((x) => (x.id === row.id ? row : x)) : [...list, row]));
      setEditing(null);
      setToast('Expertise area saved');
    } catch (err) {
      setError(err.message);
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
      <PageTitle title="Expertise" subtitle="The areas of law listed on the Expertise page and in the forms.">
        <button className="a-btn-gold" onClick={() => setEditing({ name: '', summary: '', body: '', published: true, i18n: {} })}><Icon name="plus" /> Add area</button>
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
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-medium">{a.name} {!a.published && <Pill>Hidden</Pill>}</p>
                  <p className="truncate text-sm text-ink/50">{a.summary}</p>
                </div>
                <button className="rounded-lg p-2 text-red-500 hover:bg-red-50" onClick={() => remove(a)} aria-label="Delete"><Icon name="trash" /></button>
                <button className="a-btn-ghost !py-2" onClick={() => setEditing(a)}><Icon name="edit" /> Edit</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit area' : 'Add area'} wide>
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <div><label className="a-label">Name *</label><input className="a-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><label className="a-label">Short summary</label><textarea className="a-input min-h-[70px]" value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></div>
            <div><label className="a-label">Description</label><textarea className="a-input min-h-[140px]" value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} /></div>
            <TranslationFields value={editing.i18n || {}} onChange={(i18n) => setEditing({ ...editing, i18n })} source={editing} fields={[['name', 'Name'], ['summary', 'Short summary', true], ['body', 'Description', true]]} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[#BFA575]" checked={editing.published !== false} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /> Show on website</label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2"><button type="button" className="a-btn-ghost" onClick={() => setEditing(null)}>Cancel</button><button className="a-btn-primary">Save</button></div>
          </form>
        )}
      </Modal>
      <Toast message={toast} onDone={() => setToast('')} />
    </>
  );
}
