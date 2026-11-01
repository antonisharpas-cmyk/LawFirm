import { useEffect } from 'react';
import { useSite, telHref } from '../lib/site.jsx';
import { useI18n, LanguageSwitcher } from '../i18n/index.jsx';
import { GoldRule } from '../components/ui.jsx';
import { ErgonCredit } from '../components/Footer.jsx';

const ICONS = {
  home: 'M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1v-9z',
  chat: 'M4 5.5A1.5 1.5 0 015.5 4h13A1.5 1.5 0 0120 5.5v9a1.5 1.5 0 01-1.5 1.5H9l-5 4V5.5z',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  pin: 'M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  facebook: 'M14 8h3V4h-3a4 4 0 00-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z',
  instagram: 'M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zM12 16a4 4 0 100-8 4 4 0 000 8zM17.5 6.5h.01',
  linkedin: 'M4 9h4v11H4zM6 4a2 2 0 110 4 2 2 0 010-4zM10 9h4v1.6c.6-1 1.8-1.8 3.5-1.8 3 0 3.5 2 3.5 4.6V20h-4v-5.6c0-1.3 0-3-1.8-3s-2.2 1.4-2.2 2.9V20h-4z'
};

function Icon({ name }) {
  return (
    <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function Marquee({ words, reverse = false }) {
  const items = [...words, ...words, ...words, ...words];
  return (
    <div className="overflow-hidden border-y border-gold/20 bg-paper-dark py-4 lg:py-3" aria-hidden="true" dir="ltr">
      <div className={`marquee-track ${reverse ? 'marquee-reverse' : ''}`} style={{ animationDuration: '90s' }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {items.map((w, i) => (
              <span key={`${k}-${i}`} className="flex items-center">
                <span className="whitespace-nowrap px-8 text-[13px] uppercase tracking-[0.4em] text-ink/45">{w}</span>
                <GoldRule className="!w-6" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LinkPage() {
  const { settings } = useSite();
  const { t, ts } = useI18n();
  const address = `${ts(settings, 'address_line1')}, ${ts(settings, 'address_line2')}`;

  useEffect(() => {
    document.title = 'H.A. Andreou & Co';
  }, []);

  const links = [
    { icon: 'home', label: t('link.website'), href: '/' },
    { icon: 'chat', label: t('link.book'), href: '/contact', primary: true },
    { icon: 'phone', label: t('link.call'), href: telHref(settings.phone) },
    { icon: 'mail', label: t('link.email'), href: `mailto:${settings.email}` },
    settings.facebook && { icon: 'facebook', label: 'Facebook', href: settings.facebook, ext: true },
    settings.instagram && { icon: 'instagram', label: 'Instagram', href: settings.instagram, ext: true },
    settings.linkedin && { icon: 'linkedin', label: 'LinkedIn', href: settings.linkedin, ext: true },
    { icon: 'pin', label: t('link.directions'), href: `https://maps.google.com/?q=${encodeURIComponent(settings.map_location || address)}`, ext: true }
  ].filter(Boolean);

  return (
    <div className="flex min-h-[100svh] flex-col bg-ink">
      <Marquee words={t('link.marqueeTop')} />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-14 text-white lg:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(176,139,79,0.16),transparent_60%)]" />
        <div className="absolute end-4 top-4 z-20 sm:end-6 sm:top-6">
          <LanguageSwitcher />
        </div>
        <div className="relative w-full max-w-xl text-center">
          <img src="/logo-full.png" alt="H.A. Andreou & Co, Advocates, Legal Consultants" className="mx-auto w-72 animate-fadeIn sm:w-80 lg:w-72" />
          <h1 className="mt-6 animate-fadeUp lg:mt-4 font-heading text-2xl text-white/90 sm:text-3xl">{t('link.tagline')}</h1>
          <nav className="mt-8 space-y-3 lg:mt-6 lg:space-y-2.5">
            {links.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                target={l.ext ? '_blank' : undefined}
                rel={l.ext ? 'noreferrer' : undefined}
                style={{ animationDelay: `${150 + i * 70}ms` }}
                className={`flex animate-fadeUp items-center justify-center gap-3 rounded-full border px-6 py-4 text-[13px] lg:py-3 uppercase tracking-[0.28em] transition duration-300 ${
                  l.primary ? 'border-gold bg-gold text-ink hover:bg-gold-light' : 'border-white/20 text-white/90 hover:border-gold hover:text-gold'
                }`}
              >
                <Icon name={l.icon} />
                {l.label}
              </a>
            ))}
          </nav>
          <p className="mt-10 text-[12px] uppercase lg:mt-6 tracking-[0.3em] text-white/40">{ts(settings, 'address_line1').split(',')[0]}, {ts(settings, 'address_line2')}</p>
          <ErgonCredit className="mt-6 lg:mt-4" />
        </div>
      </main>
    </div>
  );
}
