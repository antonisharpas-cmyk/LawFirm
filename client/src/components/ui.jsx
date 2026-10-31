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

// Decorative ampersand taken from the "H. A. Andreou & Co" name
export function StarMark({ className = 'h-6 w-6', stroke = '#B08B4F' }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <text
        x="50"
        y="80"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="104"
        fontStyle="italic"
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
      >
        &amp;
      </text>
    </svg>
  );
}

// Thin gold rule used as a separator
export function GoldRule({ className = '' }) {
  return <span className={`inline-block h-px w-8 bg-gold/70 ${className}`} aria-hidden="true" />;
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

export function PageHero({ eyebrow, title, intro, image, children }) {
  return (
    <section className="relative overflow-hidden bg-ink pb-20 pt-40 text-white sm:pb-24 sm:pt-44">
      {image ? (
        <>
          <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full animate-fadeIn object-cover grayscale" />
          <div className="absolute inset-0 bg-ink/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/20 rtl:bg-gradient-to-l" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(176,139,79,0.18),transparent_55%)]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(176,139,79,0.16),transparent_55%)]" />
          <StarMark className="absolute -end-24 top-16 h-[420px] w-[420px] opacity-[0.05]" />
        </>
      )}
      <div className="container-x relative">
        <p className="eyebrow eyebrow-line animate-fadeIn">{eyebrow}</p>
        <h1 className="h-display mt-6 max-w-3xl animate-fadeUp text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl animate-fadeUp text-lg leading-relaxed text-white/60 [animation-delay:150ms]">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

const SOCIAL_PATHS = {
  facebook: 'M14 8h3V4h-3a4 4 0 00-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z',
  instagram: 'M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zM12 16a4 4 0 100-8 4 4 0 000 8zM17.5 6.5h.01',
  linkedin: 'M4 9h4v11H4zM6 4a2 2 0 110 4 2 2 0 010-4zM10 9h4v1.6c.6-1 1.8-1.8 3.5-1.8 3 0 3.5 2 3.5 4.6V20h-4v-5.6c0-1.3 0-3-1.8-3s-2.2 1.4-2.2 2.9V20h-4z'
};

export function SocialLinks({ settings, className = '' }) {
  const items = [
    ['facebook', 'Facebook', settings.facebook],
    ['instagram', 'Instagram', settings.instagram],
    ['linkedin', 'LinkedIn', settings.linkedin]
  ].filter(([, , url]) => url);
  if (!items.length) return null;
  return (
    <div className={`flex gap-3 ${className}`}>
      {items.map(([key, label, url]) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-gold hover:text-gold"
        >
          <svg className="h-[17px] w-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={SOCIAL_PATHS[key]} />
          </svg>
        </a>
      ))}
    </div>
  );
}

// Plain text with paragraphs; lines starting with "• " become a list
export function RichText({ text = '', className = '' }) {
  const blocks = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('•')) {
      const item = line.replace(/^•\s*/, '');
      const last = blocks[blocks.length - 1];
      if (last && last.type === 'list') last.items.push(item);
      else blocks.push({ type: 'list', items: [item] });
    } else blocks.push({ type: 'p', text: line });
  }
  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((b, i) =>
        b.type === 'p' ? (
          <p key={i}>{b.text}</p>
        ) : (
          <ul key={i} className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {b.items.map((x) => (
              <li key={x} className="flex gap-3"><span className="mt-[11px] h-px w-3 shrink-0 bg-gold" />{x}</li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}
