import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHero, Reveal, Arrow } from '../components/ui.jsx';
import { useSite } from '../lib/site.jsx';

export default function PracticeAreas() {
  const { areas, lawyers } = useSite();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash || !areas.length) return;
    const el = document.getElementById(hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  }, [hash, areas.length]);

  return (
    <>
      <PageHero
        eyebrow="Our Expertise"
        title="Practice Areas"
        intro="We advise individuals, families and businesses on a broad range of legal matters, with the care and attention each one deserves."
      />
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
                  <div className="absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-gold transition duration-500 group-hover:scale-y-100" />
                  <span className="text-[11px] tabular-nums tracking-widest text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="mt-4 font-heading text-3xl">{a.name}</h2>
                  <p className="mt-4 font-medium leading-relaxed text-ink/70">{a.summary}</p>
                  {a.body && <p className="mt-4 text-[15px] leading-relaxed text-ink/55">{a.body}</p>}
                  {team.length > 0 && (
                    <p className="mt-6 text-sm text-ink/50">
                      Contact:{' '}
                      {team.map((l, j) => (
                        <span key={l.id}>
                          {j > 0 && ', '}
                          <Link to={`/lawyers/${l.slug}`} className="text-gold-dark hover:underline">{l.name}</Link>
                        </span>
                      ))}
                    </p>
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
            <h2 className="h-display text-3xl sm:text-4xl">Not sure where your matter fits?</h2>
            <p className="mt-3 text-white/55">Tell us about it and we will point you in the right direction.</p>
          </div>
          <Link to="/contact" className="btn-gold shrink-0">Contact Us <Arrow /></Link>
        </Reveal>
      </section>
    </>
  );
}
