import { Link } from 'react-router-dom';
import Constellation from '../components/Constellation.jsx';
import InquiryForm from '../components/InquiryForm.jsx';
import LawyerCard from '../components/LawyerCard.jsx';
import { Reveal, Arrow, StarMark } from '../components/ui.jsx';
import { useSite, telHref } from '../lib/site.jsx';

const VALUES = [
  ['Personal Attention', 'Every client works directly with an experienced lawyer who knows their matter in detail.'],
  ['Clear Advice', 'We explain your options in plain language so you can make confident decisions.'],
  ['Discretion', 'Your affairs are handled with complete confidentiality and professional care.'],
  ['Practical Results', 'We focus on efficient, realistic outcomes that protect your interests.']
];

const STEPS = [
  ['Consultation', 'We listen to your situation, review the documents and identify what matters most to you.'],
  ['Strategy', 'We set out a clear plan, the expected timeline and the costs involved, before any work begins.'],
  ['Resolution', 'We act on your behalf, keep you updated at every stage and see the matter through to completion.']
];

export default function Home() {
  const { settings, areas, lawyers } = useSite();

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink text-white">
        <Constellation />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,10,9,0.85)_100%)]" />
        <div className="container-x relative py-32 text-center">
          <p className="eyebrow animate-fadeIn">Athanasiadou Law Firm · Larnaca, Cyprus</p>
          <h1 className="h-display mx-auto mt-7 max-w-4xl animate-fadeUp text-[2.6rem] sm:text-6xl lg:text-7xl">
            Clarity and Confidence in Every Legal Matter
          </h1>
          <p className="mx-auto mt-7 max-w-2xl animate-fadeUp text-base leading-relaxed text-white/60 [animation-delay:200ms] sm:text-lg">
            Dedicated legal advice for individuals and businesses in Cyprus, delivered with care, discretion and a clear focus on your goals.
          </p>
          <div className="mt-10 flex animate-fadeUp flex-col items-center justify-center gap-4 [animation-delay:350ms] sm:flex-row">
            <Link to="/practice-areas" className="btn-gold">Our Practice Areas</Link>
            <Link to="/lawyers" className="btn-outline">Meet Our Lawyers</Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-gold/60" />
      </section>

      {/* OUR FIRM */}
      <section className="bg-white py-24 sm:py-32">
        <div className="container-x">
          <Reveal className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="eyebrow eyebrow-line">Our Firm</p>
              <h2 className="h-display mt-6 text-4xl sm:text-5xl">Trusted Legal Counsel in the Heart of Larnaca</h2>
              <div className="rule" />
              <p className="mt-8 leading-relaxed text-ink/60">
                Athanasiadou Law Firm advises private clients and businesses on the legal matters that shape their lives and their
                work. From property purchases and company structures to disputes and family matters, we bring the same careful
                preparation and personal commitment to every case.
              </p>
            </div>
            <div className="lg:border-l lg:border-ink/10 lg:pl-20">
              <p className="leading-relaxed text-ink/60">
                Our approach is simple: we take the time to understand you, we give honest advice about your position, and we stay
                responsive from the first meeting until the matter is resolved. Clients value our accessibility and the clarity with
                which we guide them through the Cypriot legal system.
              </p>
              <blockquote className="mt-10 rounded-r-2xl border-l-2 border-gold bg-paper p-8">
                <p className="font-accent text-xl italic leading-relaxed text-ink/70">
                  Based in Larnaca, we advise clients from across Cyprus and abroad, at every stage of their matter.
                </p>
                <p className="eyebrow mt-5 !text-[10px] !text-gold-dark">Sakkas Court · Larnaca · Cyprus</p>
              </blockquote>
            </div>
          </Reveal>

          <div className="mt-20 grid border-y border-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(([t, d], i) => (
              <Reveal key={t} delay={i * 100} className={`px-2 py-10 sm:px-8 ${i > 0 ? 'lg:border-l lg:border-ink/10' : ''} ${i % 2 ? 'sm:border-l sm:border-ink/10 lg:border-l' : ''}`}>
                <p className="font-heading text-3xl text-gold">0{i + 1}</p>
                <h3 className="mt-4 text-[13px] font-semibold uppercase tracking-[0.18em]">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/55">{d}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link to="/about" className="btn-outline-dark">Learn More About Us</Link>
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="relative overflow-hidden bg-ink-700 py-24 text-white sm:py-32">
        <StarMark className="absolute -left-40 top-20 h-[520px] w-[520px] opacity-[0.04]" />
        <div className="container-x relative">
          <Reveal className="mb-16 text-center">
            <p className="eyebrow">Our Expertise</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl">Practice Areas</h2>
          </Reveal>
          <div className="grid gap-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <h3 className="font-heading text-3xl leading-snug">Comprehensive advice across the areas that matter to you</h3>
              <p className="mt-6 leading-relaxed text-white/55">
                Our lawyers combine knowledge of Cypriot law with a practical understanding of our clients&apos; personal and
                commercial needs. Whatever the matter, you can expect thorough preparation, transparent communication and
                dedicated representation.
              </p>
              <Link to="/practice-areas" className="link-arrow mt-8 !text-gold">
                Explore all practice areas <Arrow />
              </Link>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:col-span-7">
              {areas.map((a, i) => (
                <Reveal key={a.id} delay={(i % 2) * 80}>
                  <Link
                    to={`/practice-areas#${a.slug}`}
                    className="group flex items-baseline gap-5 border-b border-white/10 py-5 pr-4 transition hover:border-gold/50"
                  >
                    <span className="text-[11px] tabular-nums text-gold/70">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-heading text-lg text-white/85 transition group-hover:translate-x-1 group-hover:text-gold">{a.name}</span>
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
                <p className="eyebrow eyebrow-line">Our Lawyers</p>
                <h2 className="h-display mt-6 text-4xl sm:text-5xl">Meet the Team</h2>
              </div>
              <Link to="/lawyers" className="link-arrow">View all lawyers <Arrow /></Link>
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
            <p className="eyebrow">How We Work</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl">A Clear Path from First Call to Resolution</h2>
          </Reveal>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {STEPS.map(([t, d], i) => (
              <Reveal key={t} delay={i * 120} className="card relative overflow-hidden p-10">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-gold via-gold/40 to-transparent" />
                <p className="font-heading text-6xl text-gold/25">{i + 1}</p>
                <h3 className="mt-4 font-heading text-2xl">{t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/55">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-paper-dark py-24 sm:py-32" id="contact">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow eyebrow-line">Get in Touch</p>
            <h2 className="h-display mt-6 text-4xl sm:text-5xl">How Can We Help?</h2>
            <p className="mt-6 max-w-md leading-relaxed text-ink/60">
              Whether you are buying property, starting a business, facing a dispute or planning for your family, our team is ready
              to listen and advise. Send us your enquiry and we will respond promptly.
            </p>
            <div className="mt-10 space-y-6">
              {[
                ['Call us', settings.phone, telHref(settings.phone)],
                ['Email', settings.email, `mailto:${settings.email}`],
                ['Visit', `${settings.address_line1}, ${settings.address_line2}`, 'https://maps.google.com/?q=' + encodeURIComponent(`${settings.address_line1}, ${settings.address_line2}`)]
              ].map(([l, v, href]) => (
                <a key={l} href={href} target={l === 'Visit' ? '_blank' : undefined} rel="noreferrer" className="group flex gap-5">
                  <span className="mt-1 h-px w-8 shrink-0 bg-gold transition-all group-hover:w-12" />
                  <span>
                    <span className="eyebrow block !text-[10px] !text-ink/40">{l}</span>
                    <span className="mt-1 block text-[15px] transition group-hover:text-gold-dark">{v}</span>
                  </span>
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={150}>
            <InquiryForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
