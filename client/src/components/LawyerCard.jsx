import { Link } from 'react-router-dom';
import { Avatar, Arrow } from './ui.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function LawyerCard({ lawyer }) {
  const { t, tr } = useI18n();
  return (
    <Link to={`/lawyers/${lawyer.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-700">
        <div className="h-full w-full transition duration-700 group-hover:scale-[1.04]">
          <Avatar lawyer={lawyer} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent opacity-90" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="eyebrow !text-[10px]">{tr(lawyer, 'title')}</p>
          <h3 className="mt-2 font-heading text-2xl text-white">{lawyer.name}</h3>
          <span className="mt-3 inline-flex translate-y-2 items-center gap-2 text-sm text-gold opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {t('common.viewProfile')} <Arrow />
          </span>
        </div>
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 transition group-hover:ring-gold/40" />
      </div>
    </Link>
  );
}
