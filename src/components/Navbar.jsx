import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import MagneticButton from './ui/MagneticButton';

export default function Navbar({ theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile } = portfolioData;
  const location = useLocation();

  const navLinks = [
    { name: 'PROJECTS', to: '/projects' },
    { name: 'TECH STACK', to: '/tech-stack' },
    { name: 'EDUCATION', to: '/education' },
    { name: 'CONTACT', to: '/contact' },
  ];

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Left Brand */}
        <Link 
          to="/" 
          className="navbar-brand"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            setMobileMenuOpen(false);
          }}
        >
          <span className="brand-primary">BHAVESH</span>
          <span className="brand-slash">/</span>
          <span className="brand-secondary">KAI</span>
        </Link>

        {/* Center Nav Links - Desktop */}
        <nav className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                setMobileMenuOpen(false);
              }}
              className={`nav-link ${location.pathname === link.to ? 'nav-active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right CTA — Magnetic Button */}
        <div className="navbar-cta-desktop">
          <MagneticButton strength={0.4}>
            <Link 
              to="/contact" 
              className="pill-cta-btn"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                setMobileMenuOpen(false);
              }}
            >
              <span>LET'S BUILD</span>
              <ArrowUpRight size={14} />
            </Link>
          </MagneticButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav-list">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`mobile-nav-link ${location.pathname === link.to ? 'nav-active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="mobile-drawer-bottom">
              <Link
                to="/contact"
                className="pill-cta-btn mobile-cta-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>LET'S BUILD</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </nav>
        </div>
      )}

      <style>{`
        .navbar-wrapper {
          position: fixed;
          top: 20px;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          padding: 0 20px;
        }

        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1100px;
          height: 56px;
          padding: 6px 20px;
          background: rgba(10, 10, 12, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: 15px;
          letter-spacing: 0.05em;
          color: #ffffff;
        }

        .brand-primary { color: #ffffff; }
        .brand-slash { color: #ff4500; font-weight: 900; }
        .brand-secondary { color: #a1a1aa; }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #d4d4d8;
          text-decoration: none;
          transition: color 0.2s;
          position: relative;
        }

        .nav-link:hover { color: #ffffff; }

        .nav-link.nav-active {
          color: #ffffff;
        }

        .nav-link.nav-active::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #ff4500;
        }

        .pill-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          background: #ffffff;
          color: #09090b;
          border-radius: 9999px;
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-decoration: none;
          transition: background-color 0.2s;
          border: none;
          cursor: pointer;
        }

        .pill-cta-btn:hover {
          background: #f4f4f5;
        }

        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
        }

        .mobile-drawer {
          position: absolute;
          top: 68px;
          left: 20px;
          right: 20px;
          background: rgba(15, 15, 18, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          padding: 24px;
          backdrop-filter: blur(24px);
        }

        .mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-nav-link {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #ffffff;
          text-decoration: none;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .mobile-nav-link.nav-active {
          color: #ff4500;
        }

        .mobile-drawer-bottom { margin-top: 12px; }
        .mobile-cta-full { width: 100%; justify-content: center; }

        @media (max-width: 820px) {
          .navbar-links,
          .navbar-cta-desktop { display: none; }
          .mobile-menu-btn { display: flex; }
        }
      `}</style>
    </header>
  );
}
