import { useEffect, useRef, useState } from 'react';
import { initials } from '../lib/api.js';

export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

export function Arrow({ className = 'h-4 w-4' }) {
  return (
    <svg className={`${className} rtl:-scale-x-100`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StarMark({ className = 'h-6 w-6', stroke = '#BFA575' }) {
  // Four point star from the Athanasiadou logo
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path
        d="M50 6 C54 30 62 40 92 50 C62 60 54 70 50 94 C46 70 38 60 8 50 C38 40 46 30 50 6 Z"
        stroke={stroke}
        strokeWidth="7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Avatar({ lawyer, className = '', textClass = 'text-5xl' }) {
  if (lawyer?.photo_url) {
    return <img src={lawyer.photo_url} alt={lawyer.name} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }
  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-ink-700 ${className}`}>
      <StarMark className="absolute h-[70%] w-[70%] opacity-[0.07]" />
      <span className={`font-heading text-gold ${textClass}`}>{initials(lawyer?.name)}</span>
    </div>
  );
}

// Custom styled dropdown (no native select)
export function Select({ value, onChange, options, placeholder = 'Select', dark = false, name }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const label = options.find((o) => (o.value ?? o) === value);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        name={name}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        className={`${dark ? 'field-dark' : 'field'} flex items-center justify-between text-start`}
      >
        <span className={label ? '' : dark ? 'text-white/35' : 'text-ink/40'}>{label ? label.label ?? label : placeholder}</span>
        <svg className={`h-4 w-4 shrink-0 transition ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className={`scrollbar-thin absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border p-1.5 shadow-2xl ${
            dark ? 'border-white/10 bg-ink-700 text-white' : 'border-ink/10 bg-white text-ink'
          }`}
        >
          {options.map((o) => {
            const v = o.value ?? o;
            const l = o.label ?? o;
            const active = v === value;
            return (
              <li key={v}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(v);
                    setOpen(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2.5 text-start text-sm transition ${
                    active ? 'bg-gold/15 text-gold-dark' : dark ? 'hover:bg-white/5' : 'hover:bg-paper-dark'
                  } ${dark && active ? '!text-gold' : ''}`}
                >
                  {l}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro, children }) {
  return (
    <section className="relative overflow-hidden bg-ink pb-20 pt-40 text-white sm:pb-24 sm:pt-44">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(191,165,117,0.14),transparent_55%)]" />
      <StarMark className="absolute -end-24 top-16 h-[420px] w-[420px] opacity-[0.05]" />
      <div className="container-x relative">
        <p className="eyebrow eyebrow-line animate-fadeIn">{eyebrow}</p>
        <h1 className="h-display mt-6 max-w-3xl animate-fadeUp text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl animate-fadeUp text-lg leading-relaxed text-white/60 [animation-delay:150ms]">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
