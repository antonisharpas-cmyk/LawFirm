import InquiryForm from '../components/InquiryForm.jsx';
import { PageHero, Reveal, SocialLinks } from '../components/ui.jsx';
import { telHref, useSite } from '../lib/site.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function Contact() {
  const { settings } = useSite();
  const { t, ts, lang } = useI18n();
  const address = `${ts(settings, 'address_line1')}, ${ts(settings, 'address_line2')}`;
  const pin = settings.map_location || address;

  return (
    <>
      <PageHero eyebrow={t('contact.eyebrow')} title={t('contact.title')} intro={t('contact.intro')} />

      <section className="bg-paper py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <div className="card p-6 sm:p-10">
              <h2 className="font-heading text-3xl">{t('contact.enquiryTitle')}</h2>
              <p className="mb-8 mt-2 text-sm text-ink/55">{t('contact.enquiryText')}</p>
              <InquiryForm />
            </div>
          </Reveal>
          <Reveal delay={120} className="space-y-5 lg:col-span-4">
            {[
              [t('contact.emailLabel'), settings.email, `mailto:${settings.email}`, false],
              [t('contact.phoneLabel'), <span dir="ltr">{settings.phone}</span>, telHref(settings.phone), false],
              [t('contact.faxLabel'), settings.fax && <span dir="ltr">{settings.fax}</span>, null, false],
              [t('contact.officeLabel'), address, `https://maps.google.com/?q=${encodeURIComponent(pin)}`, true],
              [t('contact.hoursLabel'), ts(settings, 'hours'), null, false]
            ]
              .filter(([, v]) => v)
              .map(([label, value, href, ext]) => {
                const Tag = href ? 'a' : 'div';
                return (
                  <Tag key={label} href={href || undefined} target={ext ? '_blank' : undefined} rel="noreferrer" className="card group block p-7 transition hover:-translate-y-0.5">
                    <p className="eyebrow !text-[10px]">{label}</p>
                    <p className="mt-2 text-[15px] leading-relaxed transition group-hover:text-gold-dark">{value}</p>
                  </Tag>
                );
              })}
            <SocialLinks settings={settings} className="pt-2 [&_a]:border-ink/15 [&_a]:text-ink/60" />
          </Reveal>

        </div>
      </section>

      <section className="h-[420px] w-full bg-ink-700">
        <iframe
          title={t('contact.mapTitle')}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(pin)}&z=17&hl=${lang}&output=embed`}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
