import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api.js';
import { useSite } from '../lib/site.jsx';
import { useI18n } from '../i18n/index.jsx';

const KEY = 'ath_chat_token';
const store = {
  get: () => {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  set: (v) => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* ignore */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }
};

const time = (d, locale) => new Date(d).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

export default function ChatWidget() {
  const { settings } = useSite();
  const { t, lang, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(() => store.get());
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState(false);
  const [unread, setUnread] = useState(0);
  const [text, setText] = useState('');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const lastId = useRef(0);
  const listRef = useRef(null);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => setOnline(Boolean(settings.admin_online)), [settings.admin_online]);

  const poll = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api(`/api/chat/${token}?after=${lastId.current}`);
      setOnline(data.admin_online);
      if (data.messages.length) {
        lastId.current = data.messages[data.messages.length - 1].id;
        setMessages((m) => [...m, ...data.messages.filter((x) => !m.some((y) => y.id === x.id))]);
        if (!openRef.current) setUnread((u) => u + data.messages.filter((x) => x.sender === 'admin').length);
      }
    } catch (e) {
      if (e.status === 404) {
        store.clear();
        setToken(null);
        setMessages([]);
        lastId.current = 0;
      }
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    poll();
    const t = setInterval(poll, open ? 3000 : 15000);
    return () => clearInterval(t);
  }, [token, open, poll]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  async function start(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.message.trim()) return setError(t('chat.errRequired'));
    setSending(true);
    try {
      const { token: t } = await api('/api/chat/start', { method: 'POST', body: { ...form, page: window.location.pathname, lang } });
      store.set(t);
      lastId.current = 0;
      setMessages([]);
      setToken(t);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  async function send(e) {
    e.preventDefault();
    const body = text.trim();
    if (!body || !token) return;
    setText('');
    try {
      const msg = await api(`/api/chat/${token}/messages`, { method: 'POST', body: { body } });
      lastId.current = Math.max(lastId.current, msg.id);
      setMessages((m) => [...m, msg]);
    } catch (err) {
      setError(err.message);
      setText(body);
    }
  }

  function endChat() {
    store.clear();
    setToken(null);
    setMessages([]);
    lastId.current = 0;
    setForm({ name: '', email: '', message: '' });
  }

  return (
    <>
      <div
        className={`fixed bottom-24 end-4 z-[60] flex w-[calc(100vw-2rem)] max-w-[380px] origin-bottom-right rtl:origin-bottom-left flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-800 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] transition-all duration-300 sm:end-6 ${
          open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'
        }`}
        style={{ height: 'min(560px, calc(100vh - 8rem))' }}
        role="dialog"
        aria-label={t('chat.title')}
      >
        <div className="flex items-center gap-3 border-b border-white/10 bg-ink px-5 py-4">
          <img src="/logo-mark.png" alt="" className="h-10 w-10 rounded-full" />
          <div className="min-w-0 flex-1">
            <p className="font-heading text-[15px]">{t('chat.title')}</p>
            <p className="flex items-center gap-1.5 text-xs text-white/50">
              <span className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-400' : 'bg-white/30'}`} />
              {online ? t('chat.online') : t('chat.offline')}
            </p>
          </div>
          <button onClick={() => setOpen(false)} className="rounded-full p-2 text-white/50 transition hover:bg-white/5 hover:text-white" aria-label={t('chat.close')}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
        </div>

        {!token ? (
          <form onSubmit={start} className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
            <p className="text-sm leading-relaxed text-white/60">
              {t('chat.intro')}
            </p>
            <input className="field-dark" placeholder={t('chat.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={120} />
            <input className="field-dark" type="email" placeholder={t('chat.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={200} />
            <textarea className="field-dark min-h-[110px] resize-none" placeholder={t('chat.help')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={4000} />
            {error && <p className="text-xs text-red-300">{error}</p>}
            <button className="btn-gold mt-auto" disabled={sending}>{sending ? t('chat.starting') : t('chat.start')}</button>
            <p className="text-center text-[11px] text-white/35">{t('chat.disclaimer')}</p>
          </form>
        ) : (
          <>
            <div ref={listRef} className="scrollbar-thin flex-1 space-y-3 overflow-y-auto px-4 py-5">
              {messages.map((m) =>
                m.sender === 'system' ? (
                  <div key={m.id} className="rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-[13px] leading-relaxed text-white/70">{m.body}</div>
                ) : (
                  <div key={m.id} className={`flex ${m.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.sender === 'visitor' ? 'rounded-br-md bg-gold text-ink' : 'rounded-bl-md bg-white/10 text-white'
                      }`}
                    >
                      {m.body}
                      <span className={`mt-1 block text-[10px] ${m.sender === 'visitor' ? 'text-ink/50' : 'text-white/40'}`}>
                        {m.sender === 'admin' ? `${t('chat.firm')} · ` : ''}
                        {time(m.created_at, locale)}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
            <form onSubmit={send} className="flex items-end gap-2 border-t border-white/10 p-3">
              <textarea
                className="field-dark max-h-28 min-h-[46px] flex-1 resize-none !py-3"
                rows={1}
                placeholder={t('chat.write')}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) send(e);
                }}
                maxLength={4000}
              />
              <button className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-gold text-ink transition hover:bg-gold-light" aria-label={t('chat.send')}>
                <svg className="h-4 w-4 rtl:-scale-x-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </form>
            <button onClick={endChat} className="pb-3 text-center text-[11px] text-white/35 hover:text-white/60">{t('chat.end')}</button>
          </>
        )}
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 end-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink shadow-[0_15px_40px_-10px_rgba(176,139,79,0.7)] transition hover:scale-105 hover:bg-gold-light sm:end-6"
        aria-label={open ? t('chat.close') : t('chat.open')}
      >
        {open ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
        ) : (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 5.5A1.5 1.5 0 015.5 4h13A1.5 1.5 0 0120 5.5v9a1.5 1.5 0 01-1.5 1.5H9l-5 4V5.5z" strokeLinejoin="round" />
          </svg>
        )}
        {unread > 0 && !open && (
          <span className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-wine px-1 text-[10px] font-semibold text-white ring-2 ring-paper">{unread}</span>
        )}
      </button>
    </>
  );
}
