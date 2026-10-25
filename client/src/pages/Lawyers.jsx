import { Link } from 'react-router-dom';
import LawyerCard from '../components/LawyerCard.jsx';
import { PageHero, Reveal } from '../components/ui.jsx';
import { useSite } from '../lib/site.jsx';

export default function Lawyers() {
  const { lawyers, loaded } = useSite();
  return (
    <>
      <PageHero
        eyebrow="Our People"
        title="Our Lawyers"
        intro="A dedicated team of lawyers who combine sound legal knowledge with a personal, attentive approach to every client."
      />
      <section className="bg-paper py-20 sm:py-28">
        <div className="container-x">
          {loaded && lawyers.length === 0 && <p className="text-center text-ink/50">Team profiles are coming soon.</p>}
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {lawyers.map((l, i) => (
              <Reveal key={l.id} delay={(i % 3) * 100}>
                <LawyerCard lawyer={l} />
                {l.summary && <p className="mt-5 text-sm leading-relaxed text-ink/55">{l.summary}</p>}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-ink-700 py-20 text-center text-white">
        <Reveal className="container-x">
          <h2 className="h-display text-3xl sm:text-4xl">Speak with one of our lawyers</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/55">Book a consultation and we will match you with the lawyer best suited to your matter.</p>
          <Link to="/contact#book" className="btn-gold mt-8">Book a Consultation</Link>
        </Reveal>
      </section>
    </>
  );
}
