import { useCallback, useEffect, useRef, useState } from 'react';
import { api, formatDate, timeAgo } from '../lib/api.js';
import { Empty, Icon, PageTitle, Pill } from './common.jsx';

const QUICK = [
  'Thank you for your message. Could you share a phone number so one of our lawyers can call you?',
  'We would be happy to help. Would you like one of our lawyers to call you?',
  'Thank you, we have noted your details and will get back to you by email shortly.'
];

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.35);
  } catch {
    /* sound not available */
  }
}

export default function Chats({ onChange }) {
  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const lastId = useRef(0);
  const listRef = useRef(null);
  const prevUnread = useRef(null);

  const loadSessions = useCallback(async () => {
    try {
      const rows = await api('/api/admin/chats', { admin: true });
      const unread = rows.reduce((a, s) => a + s.unread_admin, 0);
      if (prevUnread.current !== null && unread > prevUnread.current) beep();
      prevUnread.current = unread;
      setSessions(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    if (!activeId) return;
    const rows = await api(`/api/admin/chats/${activeId}/messages?after=${lastId.current}`, { admin: true });
    if (rows.length) {
      lastId.current = rows[rows.length - 1].id;
      setMessages((m) => [...m, ...rows.filter((r) => !m.some((x) => x.id === r.id))]);
      onChange?.();
    }
  }, [activeId, onChange]);

  useEffect(() => {
    loadSessions();
    const t = setInterval(loadSessions, 4000);
    return () => clearInterval(t);
  }, [loadSessions]);

  useEffect(() => {
    lastId.current = 0;
    setMessages([]);
    if (!activeId) return;
    loadMessages();
    const t = setInterval(loadMessages, 2500);
    return () => clearInterval(t);
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const active = sessions.find((s) => s.id === activeId);

  async function send(e, preset) {
    e?.preventDefault();
    const body = (preset ?? text).trim();
    if (!body) return;
    if (!preset) setText('');
    const msg = await api(`/api/admin/chats/${activeId}/messages`, { method: 'POST', admin: true, body: { body } });
    lastId.current = Math.max(lastId.current, msg.id);
    setMessages((m) => [...m, msg]);
    loadSessions();
  }

  async function setStatus(status) {
    await api(`/api/admin/chats/${activeId}`, { method: 'PATCH', admin: true, body: { status } });
    loadSessions();
  }

  async function remove() {
    if (!window.confirm('Delete this conversation permanently?')) return;
    await api(`/api/admin/chats/${activeId}`, { method: 'DELETE', admin: true });
    setActiveId(null);
    loadSessions();
    onChange?.();
  }

  return (
    <>
      <PageTitle title="Live Chat" subtitle="Reply to visitors chatting on the website. During the office opening hours set in Settings, visitors see that the team is online; outside them, they get the away greeting." />
      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <div className={`overflow-hidden rounded-2xl bg-white shadow-sm ${active ? 'hidden lg:block' : ''}`}>
          {loading ? (
            <p className="p-6 text-sm text-ink/40">Loading…</p>
          ) : sessions.length === 0 ? (
            <Empty title="No conversations yet" text="When a visitor starts a chat on the website it will appear here." />
          ) : (
            <ul className="scrollbar-thin max-h-[calc(100vh-200px)] divide-y divide-ink/5 overflow-y-auto">
              {sessions.map((s) => (
                <li key={s.id}>
                  <button onClick={() => setActiveId(s.id)} className={`flex w-full gap-3 px-4 py-4 text-left transition hover:bg-paper ${activeId === s.id ? 'bg-paper' : ''}`}>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium ${s.unread_admin ? 'bg-gold text-ink' : 'bg-ink/5 text-ink/60'}`}>
                      {(s.visitor_name || '?')[0].toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className={`truncate text-sm ${s.unread_admin ? 'font-semibold' : 'font-medium'}`}>{s.visitor_name}</span>
                        <span className="shrink-0 text-[11px] text-ink/40">{timeAgo(s.last_message_at)}</span>
                      </span>
                      <span className="mt-0.5 flex items-center gap-2">
                        <span className="truncate text-[13px] text-ink/55">
                          {s.last_message ? `${s.last_message.sender === 'admin' ? 'You: ' : ''}${s.last_message.body}` : 'No messages'}
                        </span>
                        {s.unread_admin > 0 && <span className="ml-auto shrink-0 rounded-full bg-gold px-1.5 text-[11px] font-semibold text-ink">{s.unread_admin}</span>}
                      </span>
                      {s.status === 'closed' && <span className="mt-1 block"><Pill>Closed</Pill></span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`flex h-[calc(100vh-200px)] min-h-[480px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm ${active ? '' : 'hidden lg:flex'}`}>
          {!active ? (
            <div className="flex flex-1 items-center justify-center"><Empty title="Select a conversation" text="Pick a chat on the left to read and reply." /></div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3 border-b border-ink/10 px-5 py-4">
                <button onClick={() => setActiveId(null)} className="rounded-lg p-1 text-ink/50 lg:hidden" aria-label="Back"><Icon name="back" className="h-5 w-5" /></button>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{active.visitor_name}</p>
                  <p className="truncate text-xs text-ink/45">
                    {[active.visitor_email, active.visitor_phone, `Started ${formatDate(active.created_at)}`, active.page && `on ${active.page}`].filter(Boolean).join(' · ')}
                  </p>
                </div>
                {active.visitor_email && (
                  <a className="a-btn-ghost !py-2" href={`mailto:${active.visitor_email}?subject=${encodeURIComponent('Your chat with H.A. Andreou & Co')}`}><Icon name="mail" /> Email</a>
                )}
                {active.status === 'open' ? (
                  <button className="a-btn-ghost !py-2" onClick={() => setStatus('closed')}>Close</button>
                ) : (
                  <button className="a-btn-ghost !py-2" onClick={() => setStatus('open')}>Reopen</button>
                )}
                <button className="a-btn-danger !py-2" onClick={remove} aria-label="Delete conversation"><Icon name="trash" /></button>
              </div>

              <div ref={listRef} className="scrollbar-thin flex-1 space-y-3 overflow-y-auto bg-paper/60 px-5 py-6">
                {messages.map((m) =>
                  m.sender === 'system' ? (
                    <p key={m.id} className="mx-auto max-w-md text-center text-xs text-ink/40">Automatic greeting: {m.body}</p>
                  ) : (
                    <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.sender === 'admin' ? 'rounded-br-md bg-ink text-white' : 'rounded-bl-md border border-ink/5 bg-white'}`}>
                        {m.body}
                        <span className={`mt-1 block text-[10px] ${m.sender === 'admin' ? 'text-white/40' : 'text-ink/35'}`}>{formatDate(m.created_at)}</span>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="border-t border-ink/10 p-3">
                <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
                  {QUICK.map((q) => (
                    <button key={q} onClick={() => send(null, q)} className="shrink-0 rounded-full border border-ink/10 px-3 py-1.5 text-xs text-ink/60 transition hover:border-gold hover:text-ink" title={q}>
                      {q.length > 42 ? `${q.slice(0, 42)}…` : q}
                    </button>
                  ))}
                </div>
                <form onSubmit={send} className="flex items-end gap-2">
                  <textarea
                    className="a-input max-h-32 min-h-[46px] flex-1 resize-none"
                    rows={1}
                    placeholder="Type your reply… (Enter to send, Shift + Enter for a new line)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) send(e);
                    }}
                  />
                  <button className="a-btn-gold h-[46px]"><Icon name="send" /> Send</button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
