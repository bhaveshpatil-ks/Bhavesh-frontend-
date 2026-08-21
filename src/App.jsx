import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import Navbar from './components/Navbar';
import MegaFooter from './components/MegaFooter';
import FloatingAIChat from './components/FloatingAIChat';
import PageTransition from './components/PageTransition';
import { ToastProvider } from './components/ui/toast';

import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import TechStackPage from './pages/TechStackPage';
import EducationPage from './pages/EducationPage';
import ContactPage from './pages/ContactPage';
import ScrollReveal from './components/ScrollReveal';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global reference for Lenis to handle instant scroll-to-top across pages
let globalLenis = null;

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Reset standard browser scroll immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 2. Reset Lenis virtual scroll immediately
    if (globalLenis) {
      globalLenis.scrollTo(0, { immediate: true });
    }

    // 3. Refresh GSAP ScrollTrigger after new page DOM mounts
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (globalLenis) {
        globalLenis.scrollTo(0, { immediate: true });
      }
      ScrollTrigger.refresh();
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

function AppContent({ theme, toggleTheme }) {
  return (
    <>
      <ScrollToTop />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/tech-stack" element={<TechStackPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/experience" element={<Navigate to="/education" replace />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      <ScrollReveal delay={0}>
        <MegaFooter />
      </ScrollReveal>

      <FloatingAIChat />
      <ToastProvider />
    </>
  );
}

export default function App() {
  const [theme] = useState('dark');
  const [transitionDone, setTransitionDone] = useState(false);

  // Pure dark theme enforcement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.backgroundColor = '#0a0a0a';
    document.body.style.backgroundColor = '#0a0a0a';
    localStorage.setItem('bhavesh-portfolio-theme', 'dark');
  }, []);

  // Lenis Smooth Scroll + GSAP ScrollTrigger sync
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    globalLenis = lenis;

    const tickerUpdate = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      lenis.destroy();
      globalLenis = null;
      gsap.ticker.remove(tickerUpdate);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="app-main">
        <PageTransition onComplete={() => setTransitionDone(true)} />
        <AppContent theme="dark" toggleTheme={() => {}} />
      </div>
    </BrowserRouter>
  );
}

