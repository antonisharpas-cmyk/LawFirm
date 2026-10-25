import { PageHero } from '../components/ui.jsx';
import { useSite } from '../lib/site.jsx';

export default function Privacy() {
  const { settings } = useSite();
  const sections = [
    ['Who we are', `${settings.firm_name}, ${settings.address_line1}, ${settings.address_line2}, is responsible for the personal data collected through this website.`],
    ['What we collect', 'When you send an enquiry, request an appointment or use our live chat, we collect the details you provide, such as your name, email address, phone number and the content of your message.'],
    ['Why we use it', 'We use your information only to respond to your enquiry, arrange appointments and provide the legal services you request. We do not sell your data or use it for unrelated marketing.'],
    ['How long we keep it', 'We keep enquiry and chat records only for as long as necessary for these purposes or as required by law, after which they are deleted.'],
    ['Your rights', `Under the GDPR you may request access to, correction of or deletion of your personal data, and you may object to its processing. To do so, contact us at ${settings.email}.`],
    ['Cookies', 'This website does not use advertising or tracking cookies. Your browser stores a small token only so that an open live chat continues if you move between pages.']
  ];
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Notice" />
      <section className="bg-white py-20">
        <div className="container-x max-w-3xl space-y-10">
          {sections.map(([t, d]) => (
            <div key={t}>
              <h2 className="font-heading text-2xl">{t}</h2>
              <p className="mt-3 leading-relaxed text-ink/60">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
