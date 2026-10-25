import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useSite } from '../lib/site.jsx';
import { PageHero, Reveal, Select, Arrow, StarMark } from '../components/ui.jsx';
import { useI18n } from '../i18n/index.jsx';

const MAX_MB = 5;
const ACCEPT = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const OK_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const lines = (s = '') => s.split('\n').map((x) => x.trim()).filter(Boolean);

function readFile(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error('Could not read the file'));
    r.readAsDataURL(file);
  });
}

function guessType(file) {
  if (OK_TYPES.includes(file.type)) return file.type;
  const ext = file.name.split('.').pop().toLowerCase();
  return { pdf: OK_TYPES[0], doc: OK_TYPES[1], docx: OK_TYPES[2] }[ext] || file.type;
}

function JobCard({ job, open, onToggle, onApply }) {
  const { t, tr } = useI18n();
  return (
    <div className={`overflow-hidden rounded-2xl border bg-white transition ${open ? 'border-gold/50 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.3)]' : 'border-ink/10 hover:border-gold/40'}`}>
      <button onClick={onToggle} className="flex w-full items-start gap-5 p-6 text-start sm:items-center sm:p-8" aria-expanded={open}>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-2xl">{tr(job, 'title')}</h3>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] uppercase tracking-[0.16em] text-gold-dark">
            {tr(job, 'location') && <span>{tr(job, 'location')}</span>}
            {tr(job, 'employment_type') && <span>{tr(job, 'employment_type')}</span>}
          </p>
          {tr(job, 'summary') && <p className="mt-3 text-[15px] leading-relaxed text-ink/60">{tr(job, 'summary')}</p>}
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${open ? 'rotate-45 border-gold bg-gold text-ink' : 'border-ink/15 text-ink/60'}`}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
        </span>
      </button>
      {open && (
        <div className="grid gap-8 border-t border-ink/10 px-6 pb-8 pt-6 sm:px-8 md:grid-cols-2">
          <div>
            <h4 className="eyebrow !text-gold-dark">{t('careers.role')}</h4>
            <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink/65">
              {lines(tr(job, 'description')).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <div>
            {tr(job, 'requirements') && (
              <>
                <h4 className="eyebrow !text-gold-dark">{t('careers.lookFor')}</h4>
                <ul className="mt-4 space-y-2 text-[15px] text-ink/70">
                  {lines(tr(job, 'requirements')).map((r) => (
                    <li key={r} className="flex gap-3"><span className="mt-[11px] h-px w-3 shrink-0 bg-gold" />{r}</li>
                  ))}
                </ul>
              </>
            )}
            <button onClick={onApply} className="btn-gold mt-8">{t('careers.apply')} <Arrow /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function ApplicationForm({ jobs, jobId, setJobId }) {
  const { t, tr } = useI18n();
  const empty = { name: '', email: '', phone: '', linkedin: '', message: '', consent: false, website: '' };
  const [f, setF] = useState(empty);
  const [cv, setCv] = useState(null);
  const [drag, setDrag] = useState(false);
  const [state, setState] = useState({ sending: false, done: false, error: '' });
  const fileRef = useRef(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function pick(file) {
    if (!file) return;
    const type = guessType(file);
    if (!OK_TYPES.includes(type)) return setState((s) => ({ ...s, error: t('careers.errType') }));
    if (file.size > MAX_MB * 1024 * 1024) return setState((s) => ({ ...s, error: t('careers.errSize') }));
    const raw = await readFile(file);
    const dataUrl = raw.replace(/^data:[^;]*;/, `data:${type};`);
    setCv({ name: file.name, size: file.size, dataUrl });
    setState((s) => ({ ...s, error: '' }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!f.name.trim() || !f.email.trim() || !f.phone.trim()) return setState({ sending: false, done: false, error: t('careers.errFields') });
    if (!cv) return setState({ sending: false, done: false, error: t('careers.errCv') });
    setState({ sending: true, done: false, error: '' });
    try {
      await api('/api/applications', { method: 'POST', body: { ...f, job_id: jobId === 'general' ? null : jobId, cv: { name: cv.name, dataUrl: cv.dataUrl } } });
      setState({ sending: false, done: true, error: '' });
      setF(empty);
      setCv(null);
    } catch (err) {
      setState({ sending: false, done: false, error: err.message });
    }
  }

  if (state.done) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-white p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3 className="mt-5 font-heading text-2xl">{t('careers.thanksTitle')}</h3>
        <p className="mt-2 text-sm text-ink/60">{t('careers.thanksText')}</p>
        <button onClick={() => setState({ sending: false, done: false, error: '' })} className="link-arrow mt-6">{t('careers.another')}</button>
      </div>
    );
  }

  const positions = [...jobs.map((j) => ({ value: j.id, label: tr(j, 'title') })), { value: 'general', label: t('careers.general') }];

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <input type="text" name="website" value={f.website} onChange={set('website')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <Select value={jobId} onChange={setJobId} options={positions} placeholder={t('careers.position')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="field" placeholder={t('form.name')} value={f.name} onChange={set('name')} maxLength={200} autoComplete="name" />
        <input className="field" type="email" placeholder={t('form.email')} value={f.email} onChange={set('email')} maxLength={200} autoComplete="email" />
        <input className="field" type="tel" placeholder={t('careers.phone')} value={f.phone} onChange={set('phone')} maxLength={60} autoComplete="tel" />
        <input className="field" placeholder={t('careers.linkedin')} value={f.linkedin} onChange={set('linkedin')} maxLength={300} />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        onClick={() => fileRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${
          drag ? 'border-gold bg-gold/5' : cv ? 'border-gold/50 bg-white' : 'border-ink/15 bg-white hover:border-gold/60'
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept={ACCEPT} className="hidden" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} />
        <svg className="h-7 w-7 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 3h7l5 5v13H7zM14 3v5h5M12 11v6M9 14l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {cv ? (
          <>
            <p className="mt-3 text-sm font-medium">{cv.name}</p>
            <p className="mt-1 text-xs text-ink/45">{(cv.size / 1024 / 1024).toFixed(2)} MB · {t('careers.replace')}</p>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm font-medium">{t('careers.upload')}</p>
            <p className="mt-1 text-xs text-ink/45">{t('careers.uploadHint')}</p>
          </>
        )}
      </div>

      <textarea className="field min-h-[120px] resize-y" placeholder={t('careers.about')} value={f.message} onChange={set('message')} maxLength={8000} />

      <label className="flex cursor-pointer items-start gap-3 text-[13px] text-ink/55">
        <input type="checkbox" checked={f.consent} onChange={set('consent')} className="mt-0.5 h-4 w-4 shrink-0 accent-[#BFA575]" />
        <span>
          {t('careers.consentA')} <Link to="/privacy" className="text-gold underline underline-offset-2">{t('form.consentLink')}</Link>.
        </span>
      </label>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      <button className="btn-gold" disabled={state.sending}>{state.sending ? t('common.sending') : t('careers.submit')}</button>
    </form>
  );
}

export default function Careers() {
  const { settings } = useSite();
  const { t, ts } = useI18n();
  const [jobs, setJobs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [jobId, setJobId] = useState('general');

  useEffect(() => {
    api('/api/jobs')
      .then((rows) => {
        setJobs(rows);
        if (rows[0]) setOpenId(rows[0].id);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  function apply(id) {
    setJobId(id);
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <PageHero
        eyebrow={t('careers.eyebrow')}
        title={t('careers.title')}
        intro={ts(settings, 'careers_intro')}
      >
        <div className="mt-10 flex animate-fadeUp flex-col gap-4 [animation-delay:300ms] sm:flex-row">
          <a href="#positions" className="btn-gold">{t('careers.viewOpen')}</a>
          <a href="#apply" className="btn-outline">{t('careers.sendCv')}</a>
        </div>
      </PageHero>

      <section className="bg-white py-24 sm:py-28">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <p className="eyebrow eyebrow-line">{t('careers.whyEyebrow')}</p>
            <h2 className="h-display mt-6 text-4xl sm:text-5xl">{t('careers.whyTitle')}</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {t('careers.perks').map(([title, d], i) => (
              <Reveal key={title} delay={i * 120} className="card relative overflow-hidden p-10">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-gold via-gold/40 to-transparent rtl:bg-gradient-to-l" />
                <p className="font-heading text-5xl text-gold/30">0{i + 1}</p>
                <h3 className="mt-4 font-heading text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/55">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="positions" className="scroll-mt-20 bg-paper py-24 sm:py-28">
        <div className="container-x">
          <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow eyebrow-line">{t('careers.posEyebrow')}</p>
              <h2 className="h-display mt-6 text-4xl sm:text-5xl">{t('careers.posTitle')}</h2>
            </div>
            {jobs.length > 0 && <p className="text-sm text-ink/50">{t('careers.count')(jobs.length)}</p>}
          </Reveal>
          <div className="mt-12 space-y-4">
            {loaded && jobs.length === 0 && (
              <div className="rounded-2xl border border-ink/10 bg-white p-10 text-center">
                <p className="font-heading text-2xl">{t('careers.none')}</p>
                <p className="mt-2 text-sm text-ink/55">{t('careers.noneText')}</p>
              </div>
            )}
            {jobs.map((j) => (
              <Reveal key={j.id}>
                <JobCard job={j} open={openId === j.id} onToggle={() => setOpenId(openId === j.id ? null : j.id)} onApply={() => apply(j.id)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="relative scroll-mt-20 overflow-hidden bg-paper-dark py-24 sm:py-28">
        <StarMark className="absolute -start-32 bottom-0 h-[420px] w-[420px] opacity-[0.06]" />
        <div className="container-x relative grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow eyebrow-line">{t('careers.applyEyebrow')}</p>
            <h2 className="h-display mt-6 text-4xl sm:text-5xl">{t('careers.applyTitle')}</h2>
            <p className="mt-6 max-w-md leading-relaxed text-ink/60">{t('careers.applyText')}</p>
            <p className="mt-8 text-sm text-ink/50">
              {t('careers.questions')}{' '}
              <a href={`mailto:${settings.email}`} className="text-gold-dark hover:underline">{settings.email}</a>
            </p>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <div className="card p-6 sm:p-10">
              <ApplicationForm jobs={jobs} jobId={jobId} setJobId={setJobId} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
