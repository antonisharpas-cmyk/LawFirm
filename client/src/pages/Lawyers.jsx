import { Link } from 'react-router-dom';
import LawyerCard from '../components/LawyerCard.jsx';
import { PageHero, Reveal } from '../components/ui.jsx';
import { useSite } from '../lib/site.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function Lawyers() {
  const { lawyers, loaded } = useSite();
  const { t, tr } = useI18n();
  return (
    <>
      <PageHero eyebrow={t('lawyers.eyebrow')} title={t('lawyers.title')} intro={t('lawyers.intro')} />
      <section className="bg-paper py-20 sm:py-28">
        <div className="container-x">
          {loaded && lawyers.length === 0 && <p className="text-center text-ink/50">{t('lawyers.soon')}</p>}
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {lawyers.map((l, i) => (
              <Reveal key={l.id} delay={(i % 3) * 100}>
                <LawyerCard lawyer={l} />
                {tr(l, 'summary') && <p className="mt-5 text-sm leading-relaxed text-ink/55">{tr(l, 'summary')}</p>}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-ink-700 py-20 text-center text-white">
        <Reveal className="container-x">
          <h2 className="h-display text-3xl sm:text-4xl">{t('lawyers.ctaTitle')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/55">{t('lawyers.ctaText')}</p>
          <Link to="/contact" className="btn-gold mt-8">{t('common.contactUs')}</Link>
        </Reveal>
      </section>
    </>
  );
}
