import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSite, telHref } from '../lib/site.jsx';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/lawyers', label: 'Lawyers' },
  { to: '/practice-areas', label: 'Practice Areas' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
];

export default function Header() {
  const { settings } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

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

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? 'bg-ink/95 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="absolute left-0 top-0 h-[2px] bg-gold transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      <div className={`container-x flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-[72px]' : 'h-[92px]'}`}>
        <Link to="/" className="shrink-0" aria-label="Athanasiadou Law Firm, home">
          <img src="/logo.png" alt="Athanasiadou Law Firm" className={`w-auto transition-all duration-500 ${scrolled ? 'h-8' : 'h-9 sm:h-10'}`} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `relative py-2 text-[12px] font-medium uppercase tracking-[0.16em] transition ${
                  isActive ? 'text-gold' : 'text-white/80 hover:text-white'
                } after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-gold after:transition-all ${
                  isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
          <Link to="/contact#book" className="btn-gold !px-5 !py-2.5 !text-[11px]">
            Book a Consultation
          </Link>
        </nav>

        <button
          className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className="relative block h-3 w-5">
            <span className={`absolute left-0 h-px w-5 bg-current transition ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 top-1.5 h-px w-5 bg-current transition ${open ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 h-px w-5 bg-current transition ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
          </span>
        </button>
      </div>

      {/* mobile menu */}
      <div
        className={`fixed inset-0 top-0 z-40 flex flex-col bg-ink px-6 pb-10 pt-28 transition-all duration-500 lg:hidden ${
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
                `border-b border-white/10 py-5 font-heading text-3xl transition-all duration-500 ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                } ${isActive ? 'text-gold' : 'text-white'}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-3 text-sm text-white/60">
          <a href={telHref(settings.phone)} className="block hover:text-gold">{settings.phone}</a>
          <a href={`mailto:${settings.email}`} className="block hover:text-gold">{settings.email}</a>
          <Link to="/contact#book" className="btn-gold mt-4 w-full">Book a Consultation</Link>
        </div>
      </div>
    </header>
  );
}
