import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './en.js';
import el from './el.js';

export const LANGUAGES = [
  { code: 'en', short: 'EN', label: 'English', dir: 'ltr' },
  { code: 'el', short: 'ΕΛ', label: 'Ελληνικά', dir: 'ltr' }
];
const DICTS = { en, el };
const KEY = 'ath_lang';
const LOCALES = { en: 'en-GB', el: 'el-GR' };

function initialLang() {
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q && DICTS[q]) return q;
    const saved = localStorage.getItem(KEY);
    if (saved && DICTS[saved]) return saved;
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return DICTS[nav] ? nav : 'en';
}

function lookup(dict, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), dict);
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);
  const meta = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
  }, [lang, meta.dir]);

  const setLang = useCallback((code) => {
    if (!DICTS[code]) return;
    setLangState(code);
    try {
      localStorage.setItem(KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => {
    const dict = DICTS[lang];
    // t('home.heroTitle'), falls back to English when a key is missing
    const t = (path, vars) => {
      let v = lookup(dict, path);
      if (v === undefined) v = lookup(en, path);
      if (v === undefined) return path;
      if (typeof v === 'string' && vars) v = v.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
      return v;
    };
    // translated database content: tr(row, 'name')
    const tr = (row, field) => (row && lang !== 'en' && row.i18n?.[lang]?.[field]) || row?.[field] || '';
    // translated setting: ts(settings, 'hours')
    const ts = (settings, key) => (lang !== 'en' && settings?.[`${key}_${lang}`]) || settings?.[key] || '';
    const locale = LOCALES[lang];
    return { lang, setLang, dir: meta.dir, rtl: meta.dir === 'rtl', t, tr, ts, locale };
  }, [lang, setLang, meta.dir]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

export function LanguageSwitcher({ dark = true, className = '' }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [open]);
  return (
    <div className={`relative ${className}`} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t('nav.language')}
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-[11px] font-semibold tracking-[0.14em] transition ${
          dark ? 'border-white/15 text-white/80 hover:border-gold hover:text-gold' : 'border-ink/15 text-ink/70 hover:border-gold'
        }`}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" /></svg>
        {current.short}
      </button>
      {open && (
        <ul className="absolute end-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-ink-700 p-1 shadow-2xl">
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${l.code === lang ? 'bg-gold/15 text-gold' : 'text-white/75 hover:bg-white/5'}`}
              >
                <span>{l.label}</span>
                <span className="text-[10px] tracking-widest opacity-60">{l.short}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function LanguagePills({ className = '' }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={`inline-flex rounded-full border border-white/15 p-1 ${className}`}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.14em] transition ${l.code === lang ? 'bg-gold text-ink' : 'text-white/60 hover:text-white'}`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
