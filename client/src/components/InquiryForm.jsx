import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useSite } from '../lib/site.jsx';
import { useI18n } from '../i18n/index.jsx';
import { Select } from './ui.jsx';

const TIME_VALUES = ['Morning (9:00 to 12:00)', 'Midday (12:00 to 14:00)', 'Afternoon (14:00 to 17:00)'];

export default function InquiryForm({ kind = 'contact', dark = false, compact = false }) {
  const { areas } = useSite();
  const { t, tr, lang } = useI18n();
  const empty = { name: '', email: '', phone: '', subject: '', practice_area: '', preferred_date: '', preferred_time: '', message: '', consent: false, website: '' };
  const [f, setF] = useState(empty);
  const [state, setState] = useState({ sending: false, done: false, error: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e });
  const field = dark ? 'field-dark' : 'field';
  const today = new Date().toISOString().slice(0, 10);
  const times = t('form.times');

  async function submit(e) {
    e.preventDefault();
    if (!f.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) || !f.message.trim()) {
      return setState({ sending: false, done: false, error: t('form.errRequired') });
    }
    if (!f.consent) return setState({ sending: false, done: false, error: t('form.errConsent') });
    setState({ sending: true, done: false, error: '' });
    try {
      // values are sent in English so the admin inbox is consistent; the language is noted in the message
      const body = { ...f, kind, message: lang === 'en' ? f.message : `${f.message}\n\n[Website language: ${lang.toUpperCase()}]` };
      await api('/api/inquiries', { method: 'POST', body });
      setState({ sending: false, done: true, error: '' });
      setF(empty);
    } catch (err) {
      setState({ sending: false, done: false, error: err.message });
    }
  }

  if (state.done) {
    return (
      <div className={`rounded-2xl border p-8 text-center ${dark ? 'border-gold/30 bg-gold/5 text-white' : 'border-gold/30 bg-white'}`}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3 className="mt-5 font-heading text-2xl">{t('form.thanks')}</h3>
        <p className={`mt-2 text-sm ${dark ? 'text-white/60' : 'text-ink/60'}`}>{kind === 'appointment' ? t('form.thanksAppointment') : t('form.thanksContact')}</p>
        <button onClick={() => setState({ sending: false, done: false, error: '' })} className="link-arrow mt-6">{t('form.another')}</button>
      </div>
    );
  }

  const areaOptions = [...areas.map((a) => ({ value: a.name, label: tr(a, 'name') })), { value: 'Other or not sure', label: t('form.areaOther') }];

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <input type="text" name="website" value={f.website} onChange={set('website')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <input className={field} placeholder={t('form.name')} value={f.name} onChange={set('name')} required maxLength={200} autoComplete="name" />
        <input className={field} type="email" placeholder={t('form.email')} value={f.email} onChange={set('email')} required maxLength={200} autoComplete="email" dir="ltr" />
        <input className={field} type="tel" placeholder={t('form.phone')} value={f.phone} onChange={set('phone')} maxLength={60} autoComplete="tel" />
        <Select dark={dark} value={f.practice_area} onChange={set('practice_area')} placeholder={t('form.area')} options={areaOptions} />
      </div>

      {kind === 'appointment' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className={`${field} ${!f.preferred_date ? (dark ? 'text-white/35' : 'text-ink/40') : ''}`}
            type="date"
            min={today}
            value={f.preferred_date}
            onChange={set('preferred_date')}
            aria-label={t('form.date')}
            title={t('form.date')}
            style={{ colorScheme: dark ? 'dark' : 'light' }}
          />
          <Select dark={dark} value={f.preferred_time} onChange={set('preferred_time')} placeholder={t('form.time')} options={TIME_VALUES.map((v, i) => ({ value: v, label: times[i] }))} />
        </div>
      ) : (
        <input className={field} placeholder={t('form.subject')} value={f.subject} onChange={set('subject')} maxLength={300} />
      )}

      <textarea
        className={`${field} min-h-[140px] resize-y`}
        placeholder={kind === 'appointment' ? t('form.matter') : t('form.message')}
        value={f.message}
        onChange={set('message')}
        required
        maxLength={8000}
      />

      <label className={`flex cursor-pointer items-start gap-3 text-[13px] ${dark ? 'text-white/55' : 'text-ink/55'}`}>
        <input type="checkbox" checked={f.consent} onChange={set('consent')} className="mt-0.5 h-4 w-4 shrink-0 accent-[#BFA575]" />
        <span>
          {t('form.consentA')} <Link to="/privacy" className="text-gold underline underline-offset-2">{t('form.consentLink')}</Link>.
        </span>
      </label>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <button className="btn-gold" disabled={state.sending}>
        {state.sending ? t('common.sending') : kind === 'appointment' ? t('form.requestAppointment') : t('form.sendEnquiry')}
      </button>
    </form>
  );
}
