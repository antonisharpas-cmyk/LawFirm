import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHero, Reveal, Arrow, Avatar, RichText } from '../components/ui.jsx';
import { useSite } from '../lib/site.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function PracticeAreas() {
  const { areas, lawyers } = useSite();
  const { t, tr } = useI18n();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash || !areas.length) return;
    const el = document.getElementById(hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  }, [hash, areas.length]);

  return (
    <>
      <PageHero eyebrow={t('home.expEyebrow')} title={t('home.expTitle')} intro={t('expertise.intro')} image="/heroes/expertise.jpg" />
      <section className="bg-white py-20 sm:py-28">
        <div className="container-x">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 md:grid-cols-2">
            {areas.map((a, i) => {
              const team = lawyers.filter((l) => (l.practice_areas || '').toLowerCase().includes(a.name.toLowerCase()));
              return (
                <Reveal
                  key={a.id}
                  id={a.slug}
                  delay={(i % 2) * 80}
                  className={`group relative scroll-mt-32 bg-white p-8 transition hover:bg-paper sm:p-12 ${hash === `#${a.slug}` ? '!bg-paper' : ''}`}
                >
                  <div className="absolute start-0 top-0 z-10 h-full w-[2px] origin-top scale-y-0 bg-gold transition duration-500 group-hover:scale-y-100" />
                  {a.image_url && (
                    <div className="-mx-8 -mt-8 mb-8 aspect-[16/7] overflow-hidden bg-ink-700 sm:-mx-12 sm:-mt-12 sm:mb-10">
                      <img src={a.image_url} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 grayscale transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100" />
                    </div>
                  )}
                  <span className="text-[11px] tabular-nums tracking-widest text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="mt-4 font-heading text-3xl">{tr(a, 'name')}</h2>
                  <p className="mt-4 font-medium leading-relaxed text-ink/70">{tr(a, 'summary')}</p>
                  {tr(a, 'body') && <RichText text={tr(a, 'body')} className="mt-4 text-[15px] leading-relaxed text-ink/55" />}
                  {team.length > 0 && (
                    <div className="mt-8 border-t border-ink/10 pt-6">
                      <p className="eyebrow !text-[10px] !text-gold-dark">{t('expertise.related')}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {team.map((l) => (
                          <Link
                            key={l.id}
                            to={`/lawyers/${l.slug}`}
                            className="group/lawyer flex items-center gap-3 rounded-full border border-ink/10 bg-white py-1.5 pe-5 ps-1.5 transition hover:border-gold"
                          >
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
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-ink-700 py-20 text-white">
        <Reveal className="container-x flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="h-display text-3xl sm:text-4xl">{t('expertise.ctaTitle')}</h2>
            <p className="mt-3 text-white/55">{t('expertise.ctaText')}</p>
          </div>
          <Link to="/contact" className="btn-gold shrink-0">{t('common.contactUs')} <Arrow /></Link>
        </Reveal>
      </section>
    </>
  );
}
