import { Link } from 'react-router-dom';
import { PageHero, Reveal, StarMark } from '../components/ui.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function About() {
  const { t } = useI18n();
  return (
    <>
      <PageHero eyebrow={t('about.eyebrow')} title={t('about.title')} intro={t('about.intro')} />

      <section className="bg-white py-24 sm:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="eyebrow eyebrow-line">{t('about.whoEyebrow')}</p>
            <h2 className="h-display mt-6 text-4xl">{t('about.whoTitle')}</h2>
            <div className="rule" />
          </Reveal>
          <Reveal delay={120} className="space-y-6 leading-relaxed text-ink/60">
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <p>{t('about.p3')}</p>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink-700 py-24 text-white sm:py-32">
        <StarMark className="absolute -end-32 -top-20 h-[480px] w-[480px] opacity-[0.05]" />
        <div className="container-x relative">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">{t('about.prEyebrow')}</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl">{t('about.prTitle')}</h2>
          </Reveal>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
            {t('about.principles').map(([title, d], i) => (
              <Reveal key={title} delay={(i % 2) * 100} className="bg-ink-700 p-10">
                <p className="font-heading text-5xl text-gold/30">0{i + 1}</p>
                <h3 className="mt-5 font-heading text-2xl">{title}</h3>
                <p className="mt-3 leading-relaxed text-white/55">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24 text-center">
        <Reveal className="container-x">
          <h2 className="h-display mx-auto max-w-2xl text-4xl">{t('about.ctaTitle')}</h2>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/lawyers" className="btn-outline-dark">{t('common.meetLawyers')}</Link>
            <Link to="/contact" className="btn-gold">{t('common.contactUs')}</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
