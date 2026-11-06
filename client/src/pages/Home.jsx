import { Link } from 'react-router-dom';
import Constellation from '../components/Constellation.jsx';
import LawyerCard from '../components/LawyerCard.jsx';
import { Reveal, Arrow, StarMark } from '../components/ui.jsx';
import { useSite } from '../lib/site.jsx';
import { useI18n } from '../i18n/index.jsx';

// Homepage hero background: 'video' (Larnaca aerial) or 'network' (animated constellation).
// Switch back to 'network' to restore the previous look.
const HERO_BACKGROUND = 'video';

function HeroVideo() {
  return (
    <>
      <video
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        src="/video/hero-larnaca.mp4"
        poster="/video/hero-larnaca.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <img src="/video/hero-larnaca.jpg" alt="" aria-hidden="true" className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block" />
      <div className="absolute inset-0 bg-ink/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/80" />
    </>
  );
}

export default function Home() {
  const { areas, lawyers } = useSite();
  // up to 6 areas chosen in the admin console (Expertise, "Homepage"); the first 6 if none are chosen
  const chosen = areas.filter((a) => a.featured);
  const homeAreas = (chosen.length ? chosen : areas).slice(0, 6);
  const { t, tr } = useI18n();

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink text-white">
        {HERO_BACKGROUND === 'video' ? (
          <HeroVideo />
        ) : (
          <>
            <Constellation />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(14,26,48,0.85)_100%)]" />
          </>
        )}
        <div className="container-x relative py-32 text-center">
          <p className="eyebrow animate-fadeIn">{t('home.heroEyebrow')}</p>
          <h1 className="h-display mx-auto mt-7 max-w-4xl animate-fadeUp text-[2.6rem] sm:text-6xl lg:text-7xl">{t('home.heroTitle')}</h1>
          <p className="mx-auto mt-7 max-w-2xl animate-fadeUp text-base leading-relaxed text-white/60 [animation-delay:200ms] sm:text-lg">{t('home.heroText')}</p>
          <div className="mt-10 flex animate-fadeUp flex-col items-center justify-center gap-4 [animation-delay:350ms] sm:flex-row">
            <Link to="/expertise" className="btn-gold">{t('home.ctaExpertise')}</Link>
            <Link to="/lawyers" className="btn-outline">{t('common.meetLawyers')}</Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-gold/60" />
      </section>

      {/* OUR FIRM */}
      <section className="bg-white py-24 sm:py-32">
        <div className="container-x">
          <Reveal className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="eyebrow eyebrow-line">{t('home.firmEyebrow')}</p>
              <h2 className="h-display mt-6 text-4xl sm:text-5xl">{t('home.firmTitle')}</h2>
              <div className="rule" />
              <p className="mt-8 leading-relaxed text-ink/60">{t('home.firmP1')}</p>
            </div>
            <div className="lg:border-s lg:border-ink/10 lg:ps-20">
              <p className="leading-relaxed text-ink/60">{t('home.firmP2')}</p>
              <blockquote className="mt-10 rounded-e-2xl border-s-2 border-gold bg-paper p-8">
                <p className="font-accent text-xl italic leading-relaxed text-ink/70">{t('home.firmQuote')}</p>
                <p className="eyebrow mt-5 !text-[10px] !text-gold-dark">{t('home.firmQuoteTag')}</p>
              </blockquote>
            </div>
          </Reveal>

          <div className="mt-20 grid border-y border-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {t('home.values').map(([title, d], i) => (
              <Reveal key={title} delay={i * 100} className={`px-2 py-10 sm:px-8 ${i > 0 ? 'lg:border-s lg:border-ink/10' : ''} ${i % 2 ? 'sm:border-s sm:border-ink/10' : ''}`}>
                <p className="font-heading text-3xl text-gold">0{i + 1}</p>
                <h3 className="mt-4 text-[13px] font-semibold uppercase tracking-[0.18em]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/55">{d}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link to="/about" className="btn-outline-dark">{t('common.learnMore')}</Link>
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="relative overflow-hidden bg-ink-700 py-24 text-white sm:py-32">
        <StarMark className="absolute -start-40 top-20 h-[520px] w-[520px] opacity-[0.04]" />
        <div className="container-x relative">
          <Reveal className="mb-16 text-center">
            <p className="eyebrow">{t('home.expEyebrow')}</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl">{t('home.expTitle')}</h2>
          </Reveal>
          <div className="grid gap-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <h3 className="font-heading text-3xl leading-snug">{t('home.expSub')}</h3>
              <p className="mt-6 leading-relaxed text-white/55">{t('home.expText')}</p>
              <Link to="/expertise" className="link-arrow mt-8 !text-gold">{t('home.expLink')} <Arrow /></Link>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:col-span-7">
              {homeAreas.map((a, i) => (
                <Reveal key={a.id} delay={(i % 2) * 80}>
                  <Link to={`/expertise#${a.slug}`} className="group flex items-baseline gap-5 border-b border-white/10 py-5 pe-4 transition hover:border-gold/50">
                    <span className="text-[11px] tabular-nums text-gold/70">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-heading text-lg text-white/85 transition group-hover:translate-x-1 group-hover:text-gold rtl:group-hover:-translate-x-1">{tr(a, 'name')}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LAWYERS */}
      {lawyers.length > 0 && (
        <section className="bg-paper py-24 sm:py-32">
          <div className="container-x">
            <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow eyebrow-line">{t('home.teamEyebrow')}</p>
                <h2 className="h-display mt-6 text-4xl sm:text-5xl">{t('home.teamTitle')}</h2>
              </div>
              <Link to="/lawyers" className="link-arrow">{t('home.teamAll')} <Arrow /></Link>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lawyers.slice(0, 3).map((l, i) => (
                <Reveal key={l.id} delay={i * 120}>
                  <LawyerCard lawyer={l} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* APPROACH */}
      <section className="bg-white py-24 sm:py-32">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">{t('home.howEyebrow')}</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl">{t('home.howTitle')}</h2>
          </Reveal>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {t('home.steps').map(([title, d], i) => (
              <Reveal key={title} delay={i * 120} className="card relative overflow-hidden p-10">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-gold via-gold/40 to-transparent rtl:bg-gradient-to-l" />
                <p className="font-heading text-6xl text-gold/25">{i + 1}</p>
                <h3 className="mt-4 font-heading text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/55">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-paper-dark py-24 sm:py-32" id="contact">
        <Reveal className="container-x">
          <div>
            <p className="eyebrow eyebrow-line">{t('home.contactEyebrow')}</p>
            <h2 className="h-display mt-6 text-4xl sm:text-5xl">{t('home.contactTitle')}</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/60">{t('home.contactText')}</p>
            <div className="mt-10 flex justify-center"><Link to="/contact" className="btn-gold">{t('common.contactUs')}</Link></div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
