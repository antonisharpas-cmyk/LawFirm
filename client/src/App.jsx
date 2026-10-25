import { lazy, Suspense, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import { SiteProvider } from './lib/site.jsx';
import Home from './pages/Home.jsx';
import Lawyers from './pages/Lawyers.jsx';
import LawyerProfile from './pages/LawyerProfile.jsx';
import PracticeAreas from './pages/PracticeAreas.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';

const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

const TITLES = {
  '/': 'Athanasiadou Law Firm | Lawyers in Larnaca, Cyprus',
  '/lawyers': 'Our Lawyers | Athanasiadou Law Firm',
  '/practice-areas': 'Practice Areas | Athanasiadou Law Firm',
  '/about': 'About | Athanasiadou Law Firm',
  '/contact': 'Contact | Athanasiadou Law Firm',
  '/privacy': 'Privacy Notice | Athanasiadou Law Firm'
};

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
    if (TITLES[pathname]) document.title = TITLES[pathname];
  }, [pathname, hash]);
  return null;
}

function NotFound() {
  return (
    <div className="bg-ink pb-32 pt-48 text-center text-white">
      <p className="eyebrow">404</p>
      <h1 className="h-display mt-4 text-5xl">Page not found</h1>
      <Link to="/" className="btn-gold mt-8">Back to home</Link>
    </div>
  );
}

function PublicSite() {
  return (
    <SiteProvider>
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lawyers" element={<Lawyers />} />
          <Route path="/lawyers/:slug" element={<LawyerProfile />} />
          <Route path="/practice-areas" element={<PracticeAreas />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </SiteProvider>
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
      <Route path="/*" element={<PublicSite />} />
    </Routes>
  );
}
