import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cookie, X, Check, Settings, Lock } from 'lucide-react';

export const COOKIE_CONSENT_KEY = 'bhavesh_cookie_consent';

export default function CookieConsentBanner() {
  const [consent, setConsent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true and locked
    analytics: false,
    preferences: true,
  });

  useEffect(() => {
    // Check existing stored consent
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConsent(parsed.status);
        if (parsed.preferences) {
          setPreferences((prev) => ({ ...prev, ...parsed.preferences, essential: true }));
        }
      } catch {
        setConsent(stored);
      }
    } else {
      // Show after a brief delay for smoother initial page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen to external custom events to reopen settings from footer/links
  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
      setShowDetails(true);
    };

    window.addEventListener('open-cookie-settings', handleOpenModal);
    return () => window.removeEventListener('open-cookie-settings', handleOpenModal);
  }, []);

  const saveConsent = (status, customPrefs = preferences) => {
    const payload = {
      status,
      timestamp: new Date().toISOString(),
      preferences: {
        ...customPrefs,
        essential: true,
      },
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(payload));
    setConsent(status);
    setIsOpen(false);
    setShowDetails(false);

    // Notify other components
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: payload }));
  };

  const handleAcceptAll = () => {
    const allPrefs = { essential: true, analytics: true, preferences: true };
    setPreferences(allPrefs);
    saveConsent('accepted', allPrefs);
  };

  const handleEssentialOnly = () => {
    const essentialOnly = { essential: true, analytics: false, preferences: false };
    setPreferences(essentialOnly);
    saveConsent('essential_only', essentialOnly);
  };

  const handleSaveCustom = () => {
    saveConsent('customized', preferences);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <aside aria-label="Cookie and Privacy Consent" className="cookie-banner-wrapper">
      <div className="cookie-banner-card">
        {/* Top Header */}
        <div className="cookie-header">
          <div className="cookie-title-group">
            <div className="cookie-icon-badge">
              <ShieldCheck size={18} className="cookie-icon-shield" />
              <Cookie size={16} className="cookie-icon-cookie" />
            </div>
            <div>
              <h3 className="cookie-title">Privacy & Cookie Choices</h3>
              <span className="cookie-subtitle">Zero data selling • Strictly essential & performance</span>
            </div>
          </div>
          <button
            type="button"
            className="cookie-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close cookie banner"
          >
            <X size={16} />
          </button>
        </div>

        {/* Banner Body */}
        {!showDetails ? (
          <>
            <p className="cookie-text">
              We respect your digital privacy. This website uses only essential local storage and functional cookies to ensure smooth navigation, remember your interface settings, and guard system security. <strong>We do not sell, monetize, or track your personal data across the web.</strong>
            </p>

            {/* Quick Actions */}
            <div className="cookie-actions">
              <button
                type="button"
                className="cookie-btn cookie-btn-primary"
                onClick={handleAcceptAll}
              >
                <Check size={14} />
                <span>Accept All</span>
              </button>

              <button
                type="button"
                className="cookie-btn cookie-btn-secondary"
                onClick={handleEssentialOnly}
              >
                <span>Essential Only</span>
              </button>

              <button
                type="button"
                className="cookie-btn cookie-btn-outline"
                onClick={() => setShowDetails(true)}
              >
                <Settings size={13} />
                <span>Customize</span>
              </button>
            </div>
          </>
        ) : (
          /* Detailed Preference Controls */
          <div className="cookie-details-view">
            <p className="cookie-details-intro">
              Customize your privacy preferences. Essential storage is strictly required for core security and navigation.
            </p>

            <div className="cookie-options-list">
              {/* Option 1: Strictly Essential */}
              <div className="cookie-option-item">
                <div className="cookie-option-info">
                  <div className="cookie-option-title-row">
                    <span className="cookie-option-name">Essential & Security Storage</span>
                    <span className="cookie-badge-locked">
                      <Lock size={10} /> Always Active
                    </span>
                  </div>
                  <p className="cookie-option-desc">
                    Required for site security, DDoS prevention, routing, and saving your consent status.
                  </p>
                </div>
                <div className="cookie-toggle-wrap">
                  <input type="checkbox" checked disabled className="cookie-toggle-input" />
                  <div className="cookie-toggle-slider locked"></div>
                </div>
              </div>

              {/* Option 2: Functional UI Preferences */}
              <div className="cookie-option-item">
                <div className="cookie-option-info">
                  <div className="cookie-option-title-row">
                    <span className="cookie-option-name">Functional Preferences</span>
                    <span className="cookie-badge-opt">Optional</span>
                  </div>
                  <p className="cookie-option-desc">
                    Saves dark mode theme, interactive UI state, and audio/animation configurations.
                  </p>
                </div>
                <label className="cookie-toggle-wrap">
                  <input
                    type="checkbox"
                    checked={preferences.preferences}
                    onChange={(e) =>
                      setPreferences((prev) => ({ ...prev, preferences: e.target.checked }))
                    }
                    className="cookie-toggle-input"
                  />
                  <div className={`cookie-toggle-slider ${preferences.preferences ? 'active' : ''}`}></div>
                </label>
              </div>

              {/* Option 3: Anonymous Performance Metrics */}
              <div className="cookie-option-item">
                <div className="cookie-option-info">
                  <div className="cookie-option-title-row">
                    <span className="cookie-option-name">Anonymous Performance Metrics</span>
                    <span className="cookie-badge-opt">Optional</span>
                  </div>
                  <p className="cookie-option-desc">
                    Aggregated page load telemetry to help optimize UI animations and responsiveness.
                  </p>
                </div>
                <label className="cookie-toggle-wrap">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))
                    }
                    className="cookie-toggle-input"
                  />
                  <div className={`cookie-toggle-slider ${preferences.analytics ? 'active' : ''}`}></div>
                </label>
              </div>
            </div>

            <div className="cookie-details-actions">
              <button
                type="button"
                className="cookie-btn cookie-btn-primary"
                onClick={handleSaveCustom}
              >
                <span>Save Preferences</span>
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn-secondary"
                onClick={() => setShowDetails(false)}
              >
                <span>Back</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="cookie-footer-links">
          <Link to="/privacy" onClick={() => setIsOpen(false)} className="cookie-legal-link">
            Privacy Policy
          </Link>
          <span className="cookie-dot">•</span>
          <Link to="/terms" onClick={() => setIsOpen(false)} className="cookie-legal-link">
            Terms of Service
          </Link>
          <span className="cookie-dot">•</span>
          <Link to="/cookies" onClick={() => setIsOpen(false)} className="cookie-legal-link">
            Cookie Policy
          </Link>
        </div>
      </div>

      <style>{`
        .cookie-banner-wrapper {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 99999;
          max-width: 460px;
          width: calc(100vw - 32px);
          pointer-events: auto;
          animation: cookieSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        @keyframes cookieSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .cookie-banner-card {
          background: rgba(13, 13, 18, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-left: 3px solid #ff4500;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 20px 22px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 69, 0, 0.15);
          color: #f4f4f5;
        }

        .cookie-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .cookie-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cookie-icon-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 69, 0, 0.12);
          border: 1px solid rgba(255, 69, 0, 0.3);
          color: #ff4500;
          position: relative;
          flex-shrink: 0;
        }

        .cookie-icon-shield {
          position: absolute;
          opacity: 0.9;
        }

        .cookie-icon-cookie {
          position: absolute;
          opacity: 0.35;
          transform: scale(0.7) translate(6px, 6px);
        }

        .cookie-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .cookie-subtitle {
          font-size: 11px;
          color: #a1a1aa;
          font-weight: 500;
          display: block;
          margin-top: 2px;
        }

        .cookie-close-btn {
          background: transparent;
          border: none;
          color: #71717a;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .cookie-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .cookie-text {
          font-size: 12.5px;
          line-height: 1.5;
          color: #d4d4d8;
          margin: 0 0 16px 0;
        }

        .cookie-text strong {
          color: #ffffff;
          font-weight: 600;
        }

        .cookie-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .cookie-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid transparent;
          white-space: nowrap;
          user-select: none;
        }

        .cookie-btn-primary {
          background: #ff4500;
          color: #ffffff;
          border-color: #ff5722;
          box-shadow: 0 4px 14px rgba(255, 69, 0, 0.35);
          flex: 1 1 auto;
        }

        .cookie-btn-primary:hover {
          background: #ff5722;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(255, 69, 0, 0.45);
        }

        .cookie-btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #e4e4e7;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .cookie-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.14);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.22);
        }

        .cookie-btn-outline {
          background: transparent;
          color: #a1a1aa;
          border-color: rgba(255, 255, 255, 0.08);
        }

        .cookie-btn-outline:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.04);
        }

        /* Detailed View */
        .cookie-details-intro {
          font-size: 12px;
          color: #a1a1aa;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .cookie-options-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
        }

        .cookie-option-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
        }

        .cookie-option-info {
          flex: 1;
        }

        .cookie-option-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 3px;
        }

        .cookie-option-name {
          font-size: 12.5px;
          font-weight: 600;
          color: #ffffff;
        }

        .cookie-badge-locked {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 9.5px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.25);
          text-transform: uppercase;
        }

        .cookie-badge-opt {
          font-size: 9.5px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.08);
          color: #a1a1aa;
          text-transform: uppercase;
        }

        .cookie-option-desc {
          font-size: 11px;
          color: #71717a;
          margin: 0;
          line-height: 1.35;
        }

        .cookie-toggle-wrap {
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
        }

        .cookie-toggle-input {
          display: none;
        }

        .cookie-toggle-slider {
          width: 38px;
          height: 20px;
          background: #27272a;
          border-radius: 999px;
          position: relative;
          transition: background 0.2s ease;
        }

        .cookie-toggle-slider::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          transition: transform 0.2s ease;
        }

        .cookie-toggle-slider.active {
          background: #ff4500;
        }

        .cookie-toggle-slider.active::after {
          transform: translateX(18px);
        }

        .cookie-toggle-slider.locked {
          background: #15803d;
          opacity: 0.85;
          cursor: not-allowed;
        }

        .cookie-toggle-slider.locked::after {
          transform: translateX(18px);
        }

        .cookie-details-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .cookie-footer-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 11px;
        }

        .cookie-legal-link {
          color: #71717a;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .cookie-legal-link:hover {
          color: #ff4500;
          text-decoration: underline;
        }

        .cookie-dot {
          color: #3f3f46;
        }

        @media (max-width: 480px) {
          .cookie-banner-wrapper {
            bottom: 12px;
            right: 12px;
            left: 12px;
            width: auto;
          }

          .cookie-banner-card {
            padding: 16px 14px;
          }

          .cookie-actions {
            flex-direction: column;
            width: 100%;
          }

          .cookie-btn {
            width: 100%;
          }
        }
      `}</style>
    </aside>
  );
}
