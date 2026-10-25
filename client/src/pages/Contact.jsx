import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import InquiryForm from '../components/InquiryForm.jsx';
import { PageHero, Reveal } from '../components/ui.jsx';
import { telHref, useSite } from '../lib/site.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function Contact() {
  const { settings } = useSite();
  const { t, ts, lang } = useI18n();
  const { hash } = useLocation();
  const [tab, setTab] = useState(hash === '#book' ? 'appointment' : 'contact');
  const address = `${settings.address_line1}, ${settings.address_line2}`;

  useEffect(() => {
    if (hash === '#book') {
      setTab('appointment');
      setTimeout(() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }
  }, [hash]);

  return (
    <>
      <PageHero eyebrow={t('contact.eyebrow')} title={t('contact.title')} intro={t('contact.intro')} />

      <section className="bg-paper py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <Reveal className="space-y-5 lg:col-span-4">
            {[
              [t('contact.emailLabel'), settings.email, `mailto:${settings.email}`, false],
              [t('contact.phoneLabel'), <span dir="ltr">{settings.phone}</span>, telHref(settings.phone), false],
              [t('contact.officeLabel'), address, `https://maps.google.com/?q=${encodeURIComponent(address)}`, true],
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
          </Reveal>

          <Reveal delay={120} className="scroll-mt-28 lg:col-span-8" id="book">
            <div className="card p-6 sm:p-10">
              <div className="mb-8 inline-flex flex-wrap rounded-full bg-paper-dark p-1">
                {[
                  ['contact', t('contact.tabEnquiry')],
                  ['appointment', t('contact.tabBook')]
                ].map(([k, l]) => (
                  <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={`rounded-full px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] transition ${tab === k ? 'bg-ink text-white' : 'text-ink/55 hover:text-ink'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <h2 className="font-heading text-3xl">{tab === 'appointment' ? t('contact.bookTitle') : t('contact.enquiryTitle')}</h2>
              <p className="mb-8 mt-2 text-sm text-ink/55">{tab === 'appointment' ? t('contact.bookText') : t('contact.enquiryText')}</p>
              <InquiryForm key={tab} kind={tab} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="h-[420px] w-full bg-ink-700">
        <iframe
          title={t('contact.mapTitle')}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=16&hl=${lang}&output=embed`}
          className="h-full w-full grayscale"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
