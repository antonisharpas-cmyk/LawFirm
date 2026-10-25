import { Link } from 'react-router-dom';
import { useSite, telHref } from '../lib/site.jsx';

export default function Footer() {
  const { settings, areas } = useSite();
  const year = new Date().getFullYear();
  const socials = [
    ['Facebook', settings.facebook],
    ['Instagram', settings.instagram],
    ['LinkedIn', settings.linkedin]
  ].filter(([, url]) => url);

  return (
    <footer className="bg-ink text-white/60">
      <div className="container-x grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <img src="/logo.png" alt="Athanasiadou Law Firm" className="h-10 w-auto" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">
            A Larnaca law firm providing clear, dependable legal advice to individuals and businesses across Cyprus.
          </p>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-4">
              {socials.map(([label, url]) => (
                <a key={label} href={url} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-[0.16em] hover:text-gold">
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <h4 className="eyebrow mb-5">Explore</h4>
          <ul className="space-y-3 text-sm">
            {[
              ['/lawyers', 'Our Lawyers'],
              ['/practice-areas', 'Practice Areas'],
              ['/about', 'About the Firm'],
              ['/contact', 'Contact'],
              ['/contact#book', 'Book a Consultation']
            ].map(([to, l]) => (
              <li key={to}>
                <Link to={to} className="transition hover:text-gold">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="eyebrow mb-5">Practice Areas</h4>
          <ul className="space-y-3 text-sm">
            {areas.slice(0, 6).map((a) => (
              <li key={a.id}>
                <Link to={`/practice-areas#${a.slug}`} className="transition hover:text-gold">{a.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="eyebrow mb-5">Office</h4>
          <address className="space-y-3 text-sm not-italic leading-relaxed">
            <p>
              {settings.address_line1}
              <br />
              {settings.address_line2}
            </p>
            <p>
              <a href={telHref(settings.phone)} className="hover:text-gold">{settings.phone}</a>
              <br />
              <a href={`mailto:${settings.email}`} className="hover:text-gold">{settings.email}</a>
            </p>
            {settings.hours && <p>{settings.hours}</p>}
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {settings.firm_name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold">Privacy Notice</Link>
            <a href="https://www.ergonsite.com" target="_blank" rel="noreferrer" className="hover:text-gold">Website by ErgonSite</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
