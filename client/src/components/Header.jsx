import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSite, telHref } from '../lib/site.jsx';
import { useI18n, LanguageSwitcher, LanguagePills } from '../i18n/index.jsx';

const NAV = [
  { to: '/', key: 'home', end: true },
  { to: '/lawyers', key: 'lawyers' },
  { to: '/expertise', key: 'expertise' },
  { to: '/about', key: 'about' },
  { to: '/careers', key: 'careers' },
  { to: '/contact', key: 'contact' }
];

export default function Header() {
  const { settings } = useSite();
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const { pathname, key } = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname, key]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open ? 'bg-ink/95 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="absolute start-0 top-0 h-[2px] bg-gold transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
        <div className={`container-x flex items-center justify-between gap-4 transition-all duration-500 ${scrolled ? 'h-[72px]' : 'h-[92px]'}`}>
          <Link to="/" className="min-w-0 shrink" aria-label="Athanasiadou Law Firm">
            <img src="/logo.png" alt="Athanasiadou Law Firm" className={`w-auto max-w-full object-contain transition-all duration-500 ${scrolled ? 'h-7 sm:h-8' : 'h-8 sm:h-10'}`} />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Main">
            {NAV.filter((n) => n.key !== 'contact').map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `relative whitespace-nowrap py-2 text-[12px] font-medium uppercase tracking-[0.14em] transition ${
                    isActive ? 'text-gold' : 'text-white/80 hover:text-white'
                  } after:absolute after:-bottom-0.5 after:start-0 after:h-px after:bg-gold after:transition-all ${
                    isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                  }`
                }
              >
                {t(`nav.${n.key}`)}
              </NavLink>
            ))}
            <Link to="/contact" className="btn-gold whitespace-nowrap !px-5 !py-2.5 !text-[11px]">
              {t('nav.book')}
            </Link>
            <LanguageSwitcher />
          </nav>

          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              className="relative z-50 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-gold hover:text-gold"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={open}
            >
              <span className="relative block h-4 w-5" aria-hidden="true">
                <span
                  className="absolute inset-x-0 top-1/2 h-[2px] rounded-full bg-current transition-transform duration-300"
                  style={{ transform: open ? 'translateY(-50%) rotate(45deg)' : 'translateY(calc(-50% - 6px))' }}
                />
                <span className={`absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ${open ? 'opacity-0' : 'opacity-100'}`} />
                <span
                  className="absolute inset-x-0 top-1/2 h-[2px] rounded-full bg-current transition-transform duration-300"
                  style={{ transform: open ? 'translateY(-50%) rotate(-45deg)' : 'translateY(calc(-50% + 6px))' }}
                />
              </span>
            </button>
          </div>
        </div>

      </header>
      {/* mobile menu: kept outside <header> because the header backdrop blur would trap a fixed overlay inside it */}
      <div
        className={`fixed inset-0 top-0 z-40 flex flex-col overflow-y-auto bg-ink px-6 pb-28 pt-28 transition-all duration-500 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav className="flex flex-col" aria-label="Mobile">
          {NAV.map((n, i) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : '0ms' }}
              className={({ isActive }) =>
                `border-b border-white/10 py-4 font-heading text-3xl transition-all duration-500 ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                } ${isActive ? 'text-gold' : 'text-white'}`
              }
            >
              {t(`nav.${n.key}`)}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-3 pt-8 text-sm text-white/60">
          <LanguagePills />
          <a href={telHref(settings.phone)} className="block hover:text-gold"><span dir="ltr">{settings.phone}</span></a>
          <a href={`mailto:${settings.email}`} className="block hover:text-gold">{settings.email}</a>
          <Link to="/contact" className="btn-gold mt-4 w-full">{t('nav.book')}</Link>
        </div>
      </div>
    </>
  );
}
