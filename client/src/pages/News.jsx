import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { PageHero, Reveal, RichText, Arrow } from '../components/ui.jsx';
import { useI18n } from '../i18n/index.jsx';

function useDate() {
  const { locale } = useI18n();
  return (d) => {
    if (!d) return '';
    const dt = new Date(`${d}T12:00:00`);
    return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  };
}

export function NewsList() {
  const { t, tr } = useI18n();
  const fmt = useDate();
  const [items, setItems] = useState(null);

  useEffect(() => {
    api('/api/news').then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <>
      <PageHero eyebrow={t('news.eyebrow')} title={t('news.title')} intro={t('news.intro')} image="/heroes/careers.jpg" />
      <section className="bg-paper py-20 sm:py-28">
        <div className="container-x">
          {items === null ? null : items.length === 0 ? (
            <p className="py-10 text-center text-ink/50">{t('news.empty')}</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((n, i) => (
                <Reveal key={n.id} delay={(i % 3) * 80}>
                  <Link to={`/news/${n.slug}`} className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5">
                    <div className="aspect-[16/9] overflow-hidden bg-ink-700">
                      {n.image_url && <img src={n.image_url} alt="" loading="lazy" className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-[1.04]" />}
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <p className="eyebrow !text-[10px]">{fmt(n.published_on)}</p>
                      <h2 className="mt-3 font-heading text-2xl leading-snug transition group-hover:text-gold-dark">{tr(n, 'title')}</h2>
                      {tr(n, 'summary') && <p className="mt-3 text-sm leading-relaxed text-ink/60">{tr(n, 'summary')}</p>}
                      <span className="link-arrow mt-auto pt-6 text-sm">{t('news.readMore')} <Arrow /></span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export function NewsArticle() {
  const { slug } = useParams();
  const { t, tr } = useI18n();
  const fmt = useDate();
  const [item, setItem] = useState(undefined);

  useEffect(() => {
    api(`/api/news/${slug}`)
      .then((n) => {
        setItem(n);
        document.title = `${n.title} | H.A. Andreou & Co`;
      })
      .catch(() => setItem(null));
  }, [slug]);

  if (item === undefined) return <div className="min-h-[60vh] bg-ink" />;
  if (item === null) {
    return (
      <div className="bg-ink pb-32 pt-48 text-center text-white">
        <p className="text-white/70">{t('news.notFound')}</p>
        <Link to="/news" className="btn-gold mt-8">{t('news.back')}</Link>
      </div>
    );
  }

  return (
    <>
      <PageHero eyebrow={fmt(item.published_on)} title={tr(item, 'title')} intro={tr(item, 'summary')} image={item.image_url || '/heroes/careers.jpg'} />
      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <RichText text={tr(item, 'body')} className="leading-relaxed text-ink/70" />
            <Link to="/news" className="link-arrow mt-12">{t('news.back')} <Arrow /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
