import { lazy, Suspense, useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import { SiteProvider } from './lib/site.jsx';
import { I18nProvider, useI18n } from './i18n/index.jsx';
import LinkPage from './pages/LinkPage.jsx';
import Home from './pages/Home.jsx';
import Lawyers from './pages/Lawyers.jsx';
import LawyerProfile from './pages/LawyerProfile.jsx';
import PracticeAreas, { PracticeAreaDetail } from './pages/PracticeAreas.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Privacy, { Terms, Cookies } from './pages/Privacy.jsx';
import { NewsList, NewsArticle } from './pages/News.jsx';

const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

const TITLES = {
  '/': 'H.A. Andreou & Co | Advocates, Legal Consultants, Larnaca',
  '/lawyers': 'Our Lawyers | H.A. Andreou & Co',
  '/expertise': 'Expertise | H.A. Andreou & Co',
  '/news': 'News | H.A. Andreou & Co',
  '/about': 'About | H.A. Andreou & Co',
  '/contact': 'Contact | H.A. Andreou & Co',
  '/privacy': 'Privacy Policy | H.A. Andreou & Co',
  '/terms': 'Terms & Conditions | H.A. Andreou & Co',
  '/cookies': 'Cookie Policy | H.A. Andreou & Co'
};

function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  // runs on every navigation, including clicking a link to the page you are already on
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
    if (TITLES[pathname]) document.title = TITLES[pathname];
  }, [pathname, hash, key]);
  return null;
}

// After a new version of the website is published, pages that are already open
// reload themselves on the next click, so nobody has to clear their cache.
function UpdateWatcher() {
  const { pathname } = useLocation();
  useEffect(() => {
    let current = null;
    let stale = false;
    let last = 0;
    const check = async () => {
      if (Date.now() - last < 60 * 1000) return;
      last = Date.now();
      try {
        const r = await fetch('/api/version', { cache: 'no-store' });
        const { version } = await r.json();
        if (current === null) current = version;
        else if (version !== current) stale = true;
      } catch {
        /* offline, try again later */
      }
    };
    check();
    const onVisible = () => {
      if (document.visibilityState === 'visible') check();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.__checkForUpdate = () => {
      if (stale) window.location.reload();
      else check();
    };
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);
  useEffect(() => {
    window.__checkForUpdate?.();
  }, [pathname]);
  return null;
}

function NotFound() {
  const { t } = useI18n();
  return (
    <div className="bg-ink pb-32 pt-48 text-center text-white">
      <p className="eyebrow">404</p>
      <h1 className="h-display mt-4 text-5xl">{t('common.notFoundTitle')}</h1>
      <Link to="/" className="btn-gold mt-8">{t('common.backHome')}</Link>
    </div>
  );
}

function PublicSite() {
  // the key makes the page start fresh when its own menu link is clicked again
  const location = useLocation();
  return (
    <>
      <ScrollManager />
      <UpdateWatcher />
      <Header />
      <main>
        <Routes key={location.key}>
          <Route path="/" element={<Home />} />
          <Route path="/lawyers" element={<Lawyers />} />
          <Route path="/lawyers/:slug" element={<LawyerProfile />} />
          <Route path="/expertise" element={<PracticeAreas />} />
          <Route path="/expertise/:slug" element={<PracticeAreaDetail />} />
          <Route path="/practice-areas" element={<Navigate to="/expertise" replace />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/news/:slug" element={<NewsArticle />} />
          <Route path="/careers" element={<Navigate to="/news" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<div className="min-h-screen bg-paper" />}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route
        path="/link"
        element={
          <SiteProvider>
            <I18nProvider>
              <LinkPage />
            </I18nProvider>
          </SiteProvider>
        }
      />
      <Route
        path="/*"
        element={
          <SiteProvider>
            <I18nProvider>
              <PublicSite />
            </I18nProvider>
          </SiteProvider>
        }
      />
    </Routes>
  );
}
