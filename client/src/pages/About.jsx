import { Link } from 'react-router-dom';
import { PageHero, Reveal, StarMark } from '../components/ui.jsx';

const PRINCIPLES = [
  ['Integrity', 'We give honest advice, even when it is not what a client hopes to hear, and we act with the highest professional standards.'],
  ['Commitment', 'We treat every matter as if it were our own, with thorough preparation and steady attention to detail.'],
  ['Accessibility', 'We are easy to reach, quick to respond and always ready to explain where your matter stands.'],
  ['Confidentiality', 'Trust is the foundation of our work. Your information is protected at every step.']
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About the Firm"
        title="Committed to Our Clients, Grounded in Larnaca"
        intro="Athanasiadou Law Firm was founded on a simple belief: that excellent legal advice should also be personal, clear and accessible."
      />

      <section className="bg-white py-24 sm:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="eyebrow eyebrow-line">Who We Are</p>
            <h2 className="h-display mt-6 text-4xl">A modern practice with traditional values</h2>
            <div className="rule" />
          </Reveal>
          <Reveal delay={120} className="space-y-6 leading-relaxed text-ink/60">
            <p>
              Based at Sakkas Court in central Larnaca, our firm advises individuals, families and companies on matters ranging from
              property and corporate transactions to litigation, employment, family and immigration law.
            </p>
            <p>
              We combine knowledge of Cypriot law with a practical, solution focused mindset. Our clients include local residents,
              international buyers and investors, and growing Cypriot businesses who want a dependable legal partner close at hand.
            </p>
            <p>
              Whatever the size of the matter, you will receive the same attention: a clear explanation of your options, transparent
              fees and a lawyer who stays with you from start to finish.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink-700 py-24 text-white sm:py-32">
        <StarMark className="absolute -right-32 -top-20 h-[480px] w-[480px] opacity-[0.05]" />
        <div className="container-x relative">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Our Principles</p>
            <h2 className="h-display mt-5 text-4xl sm:text-5xl">What guides our work</h2>
          </Reveal>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
            {PRINCIPLES.map(([t, d], i) => (
              <Reveal key={t} delay={(i % 2) * 100} className="bg-ink-700 p-10">
                <p className="font-heading text-5xl text-gold/30">0{i + 1}</p>
                <h3 className="mt-5 font-heading text-2xl">{t}</h3>
                <p className="mt-3 leading-relaxed text-white/55">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24 text-center">
        <Reveal className="container-x">
          <h2 className="h-display mx-auto max-w-2xl text-4xl">Let us help you move forward with confidence</h2>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/lawyers" className="btn-outline-dark">Meet Our Lawyers</Link>
            <Link to="/contact#book" className="btn-gold">Book a Consultation</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
