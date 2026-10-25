import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { telHref, useSite } from '../lib/site.jsx';
import { useI18n } from '../i18n/index.jsx';
import { Avatar, Arrow, Reveal } from '../components/ui.jsx';
import LawyerCard from '../components/LawyerCard.jsx';

const lines = (s = '') => s.split('\n').map((x) => x.trim()).filter(Boolean);
const list = (s = '') => s.split(/[,\n]/).map((x) => x.trim()).filter(Boolean);

export default function LawyerProfile() {
  const { slug } = useParams();
  const { lawyers, areas } = useSite();
  const { t, tr } = useI18n();
  const [lawyer, setLawyer] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setLawyer(null);
    setMissing(false);
    api(`/api/lawyers/${slug}`)
      .then((l) => {
        setLawyer(l);
        document.title = `${l.name} | Athanasiadou Law Firm`;
      })
      .catch(() => setMissing(true));
  }, [slug]);

  if (missing) {
    return (
      <div className="bg-ink pb-32 pt-48 text-center text-white">
        <h1 className="font-heading text-4xl">{t('profile.notFound')}</h1>
        <Link to="/lawyers" className="link-arrow mt-6 !text-gold">{t('profile.back')} <Arrow /></Link>
      </div>
    );
  }
  if (!lawyer) return <div className="min-h-screen bg-ink" />;

  // expertise names are stored in English; show them in the visitor's language
  const areaName = (name) => {
    const a = areas.find((x) => x.name.toLowerCase() === name.toLowerCase());
    return a ? tr(a, 'name') : name;
  };
  const others = lawyers.filter((l) => l.id !== lawyer.id).slice(0, 3);
  const details = [
    [t('profile.expertise'), list(lawyer.practice_areas).map(areaName)],
    [t('profile.education'), lines(tr(lawyer, 'education'))],
    [t('profile.admissions'), lines(tr(lawyer, 'admissions'))],
    [t('profile.languages'), list(tr(lawyer, 'languages'))]
  ].filter(([, v]) => v.length);

  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-16 pt-36 text-white sm:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(191,165,117,0.14),transparent_55%)]" />
        <div className="container-x relative grid items-end gap-12 lg:grid-cols-12">
          <div className="animate-fadeUp lg:col-span-5">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Avatar lawyer={lawyer} textClass="text-7xl" />
            </div>
          </div>
          <div className="pb-4 lg:col-span-7">
            <Link to="/lawyers" className="eyebrow eyebrow-line hover:text-gold-light">{t('home.teamEyebrow')}</Link>
            <h1 className="h-display mt-6 animate-fadeUp text-5xl sm:text-6xl">{lawyer.name}</h1>
            <p className="mt-4 font-accent text-2xl italic text-gold">{tr(lawyer, 'title')}</p>
            {tr(lawyer, 'summary') && <p className="mt-6 max-w-xl leading-relaxed text-white/60">{tr(lawyer, 'summary')}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              {lawyer.email && <a href={`mailto:${lawyer.email}`} className="btn-gold !py-3">{t('profile.email')}</a>}
              {lawyer.phone && <a href={telHref(lawyer.phone)} className="btn-outline !py-3"><span dir="ltr">{lawyer.phone}</span></a>}
              {lawyer.linkedin && <a href={lawyer.linkedin} target="_blank" rel="noreferrer" className="btn-outline !py-3">LinkedIn</a>}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow eyebrow-line">{t('profile.biography')}</p>
            <div className="prose-bio mt-8 text-[17px] leading-[1.85] text-ink/70">
              {lines(tr(lawyer, 'bio')).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <div className="rounded-2xl bg-paper p-8 sm:p-10">
              {details.map(([label, items], i) => (
                <div key={label} className={i ? 'mt-8 border-t border-ink/10 pt-8' : ''}>
                  <h3 className="eyebrow !text-gold-dark">{label}</h3>
                  <ul className="mt-4 space-y-2 text-[15px] text-ink/75">
                    {items.map((x) => (
                      <li key={x} className="flex gap-3"><span className="mt-[11px] h-px w-3 shrink-0 bg-gold" />{x}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link to="/contact" className="btn-gold mt-10 w-full">{t('common.contactUs')}</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {others.length > 0 && (
        <section className="bg-paper py-20">
          <div className="container-x">
            <h2 className="h-display text-3xl">{t('profile.others')}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((l) => <LawyerCard key={l.id} lawyer={l} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
