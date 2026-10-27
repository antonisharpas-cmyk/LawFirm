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
import PracticeAreas from './pages/PracticeAreas.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Privacy, { Terms, Cookies } from './pages/Privacy.jsx';
import Careers from './pages/Careers.jsx';

const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

const TITLES = {
  '/': 'Athanasiadou Law Firm | Lawyers in Larnaca, Cyprus',
  '/lawyers': 'Our Lawyers | Athanasiadou Law Firm',
  '/expertise': 'Expertise | Athanasiadou Law Firm',
  '/careers': 'Careers | Athanasiadou Law Firm',
  '/about': 'About | Athanasiadou Law Firm',
  '/contact': 'Contact | Athanasiadou Law Firm',
  '/privacy': 'Privacy Policy | Athanasiadou Law Firm',
  '/terms': 'Terms & Conditions | Athanasiadou Law Firm',
  '/cookies': 'Cookie Policy | Athanasiadou Law Firm'
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
      <Header />
      <main>
        <Routes key={location.key}>
          <Route path="/" element={<Home />} />
          <Route path="/lawyers" element={<Lawyers />} />
          <Route path="/lawyers/:slug" element={<LawyerProfile />} />
          <Route path="/expertise" element={<PracticeAreas />} />
          <Route path="/practice-areas" element={<Navigate to="/expertise" replace />} />
          <Route path="/careers" element={<Careers />} />
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
