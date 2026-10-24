import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloating from './components/WhatsAppFloating';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import BookStorage from './pages/BookStorage';
import TrackBooking from './pages/TrackBooking';
import About from './pages/About';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('mzingo_lang') || 'en');
  const [currentView, setCurrentView] = useState('home');
  const [bookingPrefill, setBookingPrefill] = useState(null);

  // Auth state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mzingo_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('mzingo_token') || null);

  useEffect(() => {
    localStorage.setItem('mzingo_lang', lang);
  }, [lang]);

  const handleLoginSuccess = (userData, tokenString) => {
    setUser(userData);
    setToken(tokenString);
    setCurrentView('admin_dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('mzingo_token');
    localStorage.removeItem('mzingo_user');
    setUser(null);
    setToken(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in admin dashboard and user is logged in
  if (currentView === 'admin_dashboard' && user && token) {
    return (
      <AdminLayout
        user={user}
        token={token}
        onLogout={handleLogout}
        onSwitchToPublic={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1F2937] font-sans antialiased selection:bg-[#E75A2D] selection:text-white">
      {/* Responsive Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        currentView={currentView}
        setView={setCurrentView}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <Home
            lang={lang}
            setView={setCurrentView}
            setSelectedPriceTier={(tier) => {
              setBookingPrefill({ size: tier });
              setCurrentView('book');
            }}
          />
        )}

        {currentView === 'pricing' && (
          <Pricing
            lang={lang}
            setView={setCurrentView}
            setBookingPrefill={setBookingPrefill}
          />
        )}

        {currentView === 'book' && (
          <BookStorage
            lang={lang}
            setView={setCurrentView}
            prefill={bookingPrefill}
          />
        )}

        {currentView === 'track' && (
          <TrackBooking
            lang={lang}
            setView={setCurrentView}
          />
        )}

        {currentView === 'about' && (
          <About
            lang={lang}
            setView={setCurrentView}
          />
        )}

        {currentView === 'faq' && (
          <Faq
            lang={lang}
            setView={setCurrentView}
          />
        )}

        {currentView === 'contact' && (
          <Contact
            lang={lang}
          />
        )}

        {currentView === 'terms' && (
          <Terms
            lang={lang}
          />
        )}

        {currentView === 'privacy' && (
          <Privacy
            lang={lang}
          />
        )}

        {currentView === 'admin_login' && (
          <AdminLogin
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Persistent Floating WhatsApp widget */}
      <WhatsAppFloating lang={lang} />

      {/* Footer */}
      <Footer
        lang={lang}
        setView={setCurrentView}
      />
    </div>
  );
}
