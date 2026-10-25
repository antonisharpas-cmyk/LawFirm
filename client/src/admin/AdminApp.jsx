import { useCallback, useEffect, useState } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { api, adminToken } from '../lib/api.js';
import Inquiries from './Inquiries.jsx';
import Chats from './Chats.jsx';
import LawyersAdmin from './LawyersAdmin.jsx';
import PracticeAreasAdmin from './PracticeAreasAdmin.jsx';
import SettingsAdmin from './SettingsAdmin.jsx';
import { Icon } from './common.jsx';

function Login({ onLogin }) {
  const [f, setF] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { token } = await api('/api/admin/login', { method: 'POST', body: f });
      adminToken.set(token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-ink-800 p-8 text-white shadow-2xl">
        <img src="/logo.png" alt="Athanasiadou Law Firm" className="mx-auto h-9" />
        <p className="eyebrow mt-8 text-center">Admin Console</p>
        <div className="mt-6 space-y-3">
          <input className="field-dark" placeholder="Username" autoComplete="username" value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} />
          <input className="field-dark" type="password" placeholder="Password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        </div>
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        <button className="btn-gold mt-6 w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign In'}</button>
      </form>
    </div>
  );
}

const NAV = [
  { to: 'inquiries', label: 'Inquiries', icon: 'inbox', badge: 'newInquiries' },
  { to: 'chat', label: 'Live Chat', icon: 'chat', badge: 'unreadChats' },
  { to: 'lawyers', label: 'Lawyers', icon: 'users' },
  { to: 'practice-areas', label: 'Practice Areas', icon: 'scale' },
  { to: 'settings', label: 'Settings', icon: 'cog' }
];

export default function AdminApp() {
  const [authed, setAuthed] = useState(Boolean(adminToken.get()));
  const [stats, setStats] = useState({ newInquiries: 0, unreadChats: 0 });
  const [me, setMe] = useState(null);
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    adminToken.clear();
    setAuthed(false);
    navigate('/admin');
  }, [navigate]);

  const refreshStats = useCallback(async () => {
    try {
      setStats(await api('/api/admin/stats', { admin: true }));
    } catch (e) {
      if (e.status === 401) logout();
    }
  }, [logout]);

  useEffect(() => {
    document.title = 'Admin | Athanasiadou Law Firm';
    if (!authed) return;
    api('/api/admin/me', { admin: true }).then(setMe).catch((e) => e.status === 401 && logout());
    refreshStats();
    const t = setInterval(refreshStats, 8000);
    return () => clearInterval(t);
  }, [authed, refreshStats, logout]);

  useEffect(() => {
    const n = stats.newInquiries + stats.unreadChats;
    document.title = `${n ? `(${n}) ` : ''}Admin | Athanasiadou Law Firm`;
  }, [stats]);

  useEffect(() => setMenu(false), [pathname]);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-6 pb-6 pt-7">
        <img src="/logo.png" alt="Athanasiadou Law Firm" className="h-7" />
        <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-white/35">Admin Console</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={`/admin/${n.to}`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'}`
            }
          >
            <Icon name={n.icon} className="h-[18px] w-[18px]" />
            <span className="flex-1">{n.label}</span>
            {n.badge && stats[n.badge] > 0 && (
              <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-ink">{stats[n.badge]}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/55 hover:bg-white/5 hover:text-white">
          <Icon name="external" className="h-[18px] w-[18px]" /> View website
        </a>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/55 hover:bg-white/5 hover:text-white">
          <Icon name="logout" className="h-[18px] w-[18px]" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-ink lg:block">{sidebar}</aside>

      {/* mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-ink px-4 py-3 lg:hidden">
        <img src="/logo.png" alt="" className="h-6" />
        <button onClick={() => setMenu(true)} className="relative rounded-lg p-2 text-white" aria-label="Open menu">
          <Icon name="menu" className="h-5 w-5" />
          {stats.newInquiries + stats.unreadChats > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-gold" />}
        </button>
      </div>
      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenu(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-ink">{sidebar}</aside>
        </div>
      )}

      <main className="lg:pl-64">
        {me?.memoryDb && (
          <div className="bg-amber-100 px-6 py-2 text-center text-xs text-amber-900">
            Demo mode: no DATABASE_URL is set, so changes are kept in memory and will reset when the server restarts.
          </div>
        )}
        <div className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<Navigate to="inquiries" replace />} />
            <Route path="inquiries" element={<Inquiries onChange={refreshStats} />} />
            <Route path="chat" element={<Chats onChange={refreshStats} />} />
            <Route path="lawyers" element={<LawyersAdmin />} />
            <Route path="practice-areas" element={<PracticeAreasAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="*" element={<Navigate to="inquiries" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
