import { Link } from 'react-router-dom';
import { PageHero } from '../components/ui.jsx';
import { useSite } from '../lib/site.jsx';
import { useI18n } from '../i18n/index.jsx';

function LegalPage({ doc }) {
  const { settings } = useSite();
  const { t } = useI18n();
  const vars = { firm: settings.firm_name, address: `${settings.address_line1}, ${settings.address_line2}`, email: settings.email, phone: settings.phone };
  const fill = (s) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  const d = t(`legal.${doc}`);
  return (
    <>
      <PageHero eyebrow={t('common.legal')} title={d.title} intro={d.intro} />
      <section className="bg-white py-20">
        <div className="container-x max-w-3xl">
          <p className="text-sm text-ink/45">{t('common.lastUpdated')}</p>
          <div className="mt-10 space-y-10">
            {d.sections.map(([title, text]) => (
              <div key={title}>
                <h2 className="font-heading text-2xl">{title}</h2>
                <p className="mt-3 leading-relaxed text-ink/60">{fill(text)}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-8 text-sm">
            <Link to="/terms" className="text-gold-dark hover:underline">{t('footer.terms')}</Link>
            <Link to="/cookies" className="text-gold-dark hover:underline">{t('footer.cookies')}</Link>
            <Link to="/privacy" className="text-gold-dark hover:underline">{t('footer.privacy')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Privacy() {
  return <LegalPage doc="privacy" />;
}
export function Terms() {
  return <LegalPage doc="terms" />;
}
export function Cookies() {
  return <LegalPage doc="cookies" />;
}
