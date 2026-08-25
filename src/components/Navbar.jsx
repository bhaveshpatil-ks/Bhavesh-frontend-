import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, User, LogOut, MessageSquare, Settings, Sparkles } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import MagneticButton from './ui/MagneticButton';
import { useAuth } from '../context/AuthContext';
import UserMessagesModal from './UserMessagesModal';
import UserSettingsModal from './UserSettingsModal';

export default function Navbar({ theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const { profile } = portfolioData;
  const location = useLocation();
  const { currentUser, openAuthModal, logout } = useAuth();

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

        {/* Right Actions — Account & Magnetic CTA */}
        <div className="navbar-cta-desktop">
          {currentUser ? (
            <div className="user-profile-menu">
              <button 
                type="button" 
                className="user-nav-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                title={currentUser.displayName || currentUser.email}
              >
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="User" className="user-nav-avatar" />
                ) : (
                  <div className="user-nav-fallback">
                    {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="user-nav-name">
                  {(currentUser.displayName || currentUser.email || 'User').split(' ')[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="user-dropdown-card">
                  <div className="dropdown-user-info">
                    <span className="dropdown-user-name">{currentUser.displayName || 'User'}</span>
                    <span className="dropdown-user-email">{currentUser.email}</span>
                  </div>

                  <div className="dropdown-links-list">
                    <Link 
                      to="/chat"
                      className="dropdown-menu-item"
                      onClick={() => {
                        setUserDropdownOpen(false);
                      }}
                    >
                      <MessageSquare size={14} color="#ff4d00" />
                      <span>Live Direct Chat</span>
                    </Link>

                    <button 
                      type="button"
                      className="dropdown-menu-item"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setMessagesModalOpen(true);
                      }}
                    >
                      <Sparkles size={14} color="#f59e0b" />
                      <span>Inquiries & Tickets</span>
                    </button>

                    <button 
                      type="button"
                      className="dropdown-menu-item"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setSettingsModalOpen(true);
                      }}
                    >
                      <Settings size={14} color="#a1a1aa" />
                      <span>Settings</span>
                    </button>
                  </div>

                  <button 
                    type="button" 
                    className="dropdown-logout-btn"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              type="button" 
              className="nav-signin-btn"
              onClick={() => openAuthModal('signin')}
            >
              <User size={13} />
              <span>Sign In</span>
            </button>
          )}

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

      {/* User Modals */}
      <UserMessagesModal 
        isOpen={messagesModalOpen} 
        onClose={() => setMessagesModalOpen(false)} 
      />
      <UserSettingsModal 
        isOpen={settingsModalOpen} 
        onClose={() => setSettingsModalOpen(false)} 
      />

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

        .navbar-cta-desktop {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-signin-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.06);
          color: #d4d4d8;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-signin-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .user-profile-menu {
          position: relative;
        }

        .user-nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 4px 12px 4px 4px;
          border-radius: 9999px;
          color: #ffffff;
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-nav-btn:hover {
          background: rgba(255, 255, 255, 0.14);
        }

        .user-nav-avatar, .user-nav-fallback {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-nav-fallback {
          background: #ff4d00;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-dropdown-card {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 200px;
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 1100;
        }

        .dropdown-user-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 8px;
        }

        .dropdown-user-name {
          font-size: 13px;
          font-weight: 800;
          color: #ffffff;
        }

        .dropdown-user-email {
          font-size: 11px;
          color: #71717a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dropdown-links-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 8px;
        }

        .dropdown-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: transparent;
          border: none;
          color: #d4d4d8;
          border-radius: 8px;
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }

        .dropdown-menu-item:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .dropdown-logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dropdown-logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
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
