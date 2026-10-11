import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Calculator from './pages/Calculator';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('calculator')) {
      return 'calculator';
    }
    return 'home';
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.includes('calculator')) {
        setCurrentPage('calculator');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    const targetPath = page === 'calculator' ? '/calculator' : '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-cream)'
    }}>
      <Navbar activePage={currentPage} onNavigate={navigateTo} />
      
      <main style={{ flex: 1 }}>
        {currentPage === 'calculator' ? (
          <Calculator onNavigate={navigateTo} />
        ) : (
          <Home onNavigate={navigateTo} />
        )}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}
