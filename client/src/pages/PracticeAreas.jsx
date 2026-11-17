import { useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageHero, Reveal, Arrow, Avatar, RichText } from '../components/ui.jsx';
import { useSite } from '../lib/site.jsx';
import { useI18n } from '../i18n/index.jsx';

function CtaBand() {
  const { t } = useI18n();
  return (
    <section className="bg-ink-700 py-20 text-white">
      <Reveal className="container-x flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <h2 className="h-display text-3xl sm:text-4xl">{t('expertise.ctaTitle')}</h2>
          <p className="mt-3 text-white/55">{t('expertise.ctaText')}</p>
        </div>
        <Link to="/contact" className="btn-gold shrink-0">{t('common.contactUs')} <Arrow /></Link>
      </Reveal>
    </section>
  );
}

// List of all areas: short summary only, each card opens the detail page.
export default function PracticeAreas() {
  const { areas } = useSite();
  const { t, tr } = useI18n();
  const { hash } = useLocation();
  const navigate = useNavigate();

  // old links such as /expertise#family-law open the detail page
  useEffect(() => {
    if (hash && areas.some((a) => a.slug === hash.slice(1))) navigate(`/expertise/${hash.slice(1)}`, { replace: true });
  }, [hash, areas, navigate]);

  return (
    <>
      <PageHero eyebrow={t('home.expEyebrow')} title={t('expertise.title')} intro={t('expertise.intro')} image="/heroes/expertise.jpg" />
      <section className="bg-white py-20 sm:py-28">
        <div className="container-x">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 md:grid-cols-2">
            {areas.map((a, i) => (
              <Reveal key={a.id} delay={(i % 2) * 80} className="bg-white">
                <Link to={`/expertise/${a.slug}`} className="group relative flex h-full flex-col p-8 transition hover:bg-paper sm:p-12">
                  <div className="absolute start-0 top-0 z-10 h-full w-[2px] origin-top scale-y-0 bg-gold transition duration-500 group-hover:scale-y-100" />
                  <span className="text-[11px] tabular-nums tracking-widest text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="mt-4 font-heading text-3xl transition group-hover:text-gold-dark">{tr(a, 'name')}</h2>
                  <p className="mt-4 leading-relaxed text-ink/65">{tr(a, 'summary')}</p>
                  <span className="link-arrow mt-auto pt-8 text-sm">{t('expertise.readMore')} <Arrow /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

// Detail page for one area: full description, services list, related lawyers, other areas.
export function PracticeAreaDetail() {
  const { slug } = useParams();
  const { areas, lawyers, loaded } = useSite();
  const { t, tr } = useI18n();
  const index = areas.findIndex((a) => a.slug === slug);
  const area = areas[index];

  useEffect(() => {
    if (area) document.title = `${area.name} | H.A. Andreou & Co`;
  }, [area]);

  if (!area) return loaded ? <Navigate to="/expertise" replace /> : <div className="min-h-[60vh] bg-ink" />;

  const team = lawyers.filter((l) => (l.practice_areas || '').toLowerCase().includes(area.name.toLowerCase()));

  return (
    <>
      <PageHero eyebrow={`${String(index + 1).padStart(2, '0')} · ${t('expertise.title')}`} title={tr(area, 'name')} intro={tr(area, 'summary')} image="/heroes/expertise.jpg" />
      <section className="bg-white py-20 sm:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <RichText text={tr(area, 'body')} className="area-body text-[17px] leading-relaxed text-ink/70" />
            {team.length > 0 && (
              <div className="mt-12 border-t border-ink/10 pt-8">
                <p className="eyebrow !text-[10px] !text-gold-dark">{t('expertise.related')}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {team.map((l) => (
                    <Link key={l.id} to={`/lawyers/${l.slug}`} className="group/lawyer flex items-center gap-3 rounded-full border border-ink/10 bg-white py-1.5 pe-5 ps-1.5 transition hover:border-gold">
                      <span className="h-11 w-11 shrink-0 overflow-hidden rounded-full">
                        <Avatar lawyer={l} textClass="text-sm" />
                      </span>
                      <span className="leading-tight">
                        <span className="block text-sm font-medium text-ink transition group-hover/lawyer:text-gold-dark">{l.name}</span>
                        <span className="block text-xs text-ink/45">{tr(l, 'title')}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-12 flex flex-wrap gap-4">
              <Link to="/contact" className="btn-gold">{t('common.contactUs')}</Link>
              <Link to="/expertise" className="btn-outline-dark">{t('expertise.allAreas')}</Link>
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4">
            <div className="rounded-2xl bg-paper p-7 lg:sticky lg:top-28">
              <p className="eyebrow !text-[10px]">{t('expertise.title')}</p>
              <ul className="mt-4 divide-y divide-ink/10">
                {areas.map((a, i) => (
                  <li key={a.id}>
                    <Link to={`/expertise/${a.slug}`} className={`flex items-baseline gap-4 py-3 text-sm transition hover:text-gold-dark ${a.slug === slug ? 'font-medium text-gold-dark' : 'text-ink/70'}`}>
                      <span className="text-[10px] tabular-nums text-gold/80">{String(i + 1).padStart(2, '0')}</span>
                      {tr(a, 'name')}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
