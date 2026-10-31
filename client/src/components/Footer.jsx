import { Link } from 'react-router-dom';
import { useSite, telHref } from '../lib/site.jsx';
import { useI18n } from '../i18n/index.jsx';
import { SocialLinks } from './ui.jsx';

export function ErgonCredit({ className = '' }) {
  const { t } = useI18n();
  return (
    <a
      href="https://www.ergonsite.com"
      target="_blank"
      rel="noreferrer"
      aria-label="Developed & Designed by ErgonSite"
      className={`group flex items-center justify-center gap-2.5 opacity-70 transition duration-500 hover:opacity-100 ${className}`}
    >
      <span className="whitespace-nowrap text-[11px] text-white/45 transition group-hover:text-white/70">{t('footer.credit')}</span>
      <img src="/ergonsite.png" alt="ErgonSite" width="480" height="104" className="h-auto w-[84px]" loading="lazy" dir="ltr" />
    </a>
  );
}

export default function Footer() {
  const { settings, areas } = useSite();
  const { t, tr, ts } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/60">
      <div className="container-x grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <img src="/logo-full.png" alt="H.A. Andreou & Co, Advocates, Legal Consultants" className="w-64 max-w-full" />
          <p className="mt-8 max-w-sm text-sm leading-relaxed">{t('footer.tagline')}</p>
          <SocialLinks settings={settings} className="mt-6" />
        </div>

        <div className="lg:col-span-2">
          <h4 className="eyebrow mb-5">{t('footer.explore')}</h4>
          <ul className="space-y-3 text-sm">
            {[
              ['/lawyers', t('footer.ourLawyers')],
              ['/expertise', t('nav.expertise')],
              ['/about', t('footer.aboutFirm')],
              ['/careers', t('nav.careers')],
              ['/contact', t('nav.contact')]
            ].map(([to, l]) => (
              <li key={to}>
                <Link to={to} className="transition hover:text-gold">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="eyebrow mb-5">{t('nav.expertise')}</h4>
          <ul className="space-y-3 text-sm">
            {areas.slice(0, 6).map((a) => (
              <li key={a.id}>
                <Link to={`/expertise#${a.slug}`} className="transition hover:text-gold">{tr(a, 'name')}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="eyebrow mb-5">{t('footer.office')}</h4>
          <address className="space-y-3 text-sm not-italic leading-relaxed">
            <p>
              {settings.address_line1}
              <br />
              {settings.address_line2}
            </p>
            <p>
              <a href={telHref(settings.phone)} className="hover:text-gold"><span dir="ltr">{settings.phone}</span></a>
              {settings.fax && (
                <>
                  <br />
                  <span>{t('footer.fax')} <span dir="ltr">{settings.fax}</span></span>
                </>
              )}
              <br />
              <a href={`mailto:${settings.email}`} className="hover:text-gold">{settings.email}</a>
            </p>
            {ts(settings, 'hours') && <p>{ts(settings, 'hours')}</p>}
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x grid items-center gap-5 pb-24 pt-7 text-center text-xs lg:grid-cols-3 lg:pb-7 lg:text-start xl:pe-24">
          <p className="order-3 lg:order-1">© {year} {settings.legal_name || settings.firm_name}. {t('footer.rights')}</p>
          <ErgonCredit className="order-2" />
          <nav className="order-1 flex flex-wrap justify-center gap-x-6 gap-y-2 lg:order-3 lg:justify-end" aria-label="Legal">
            <Link to="/terms" className="hover:text-gold">{t('footer.terms')}</Link>
            <Link to="/cookies" className="hover:text-gold">{t('footer.cookies')}</Link>
            <Link to="/privacy" className="hover:text-gold">{t('footer.privacy')}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
