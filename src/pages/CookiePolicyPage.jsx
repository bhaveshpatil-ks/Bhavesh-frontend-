import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cookie, 
  ShieldCheck, 
  Settings, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  Sliders, 
  Database, 
  ArrowUpRight, 
  Copy, 
  Check, 
  Printer 
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { portfolioData } from '../data/portfolioData';
import { toast } from '../components/ui/toast';

export default function CookiePolicyPage() {
  const { profile } = portfolioData;
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeStorageKeys, setActiveStorageKeys] = useState([]);

  // Scan current browser localStorage
  const refreshStorageScan = () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const val = localStorage.getItem(key);
      keys.push({ key, value: val });
    }
    setActiveStorageKeys(keys);
  };

  useEffect(() => {
    refreshStorageScan();
  }, []);

  const handleOpenCookieSettings = () => {
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  };

  const handleClearNonEssential = () => {
    // Keep theme and security token if present, clear optional
    localStorage.removeItem('bhavesh_cookie_consent');
    refreshStorageScan();
    toast({
      title: 'Consent Cleared',
      description: 'Cookie consent has been reset. Refreshing preferences.',
      variant: 'default',
      duration: 3000,
    });
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast({
      title: 'Link Copied',
      description: 'Cookie Policy link copied to clipboard.',
      variant: 'default',
      duration: 2500,
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cookie-page-wrapper">
      <div className="cookie-spacer" />

      <div className="cookie-container">
        {/* Header */}
        <div className="cookie-header-section">
          <ScrollReveal>
            <div className="cookie-badge">
              <span className="badge-slash">//</span>
              <span>10 / TRANSPARENT STORAGE & COOKIE PROTOCOL</span>
            </div>

            <h1 className="cookie-main-title">
              Cookie <span className="cookie-title-faded">Policy</span>
            </h1>

            <p className="cookie-main-subtitle">
              Complete transparency on how {profile.name} {profile.lastName}'s portfolio uses essential local storage and functional cookies — strictly without cross-site tracking or commercial data sales.
            </p>

            <div className="cookie-meta-row">
              <span className="cookie-meta-pill">
                <Cookie size={13} /> Effective: May 2026 / Updated Sept 2026
              </span>
              <span className="cookie-meta-pill">
                <ShieldCheck size={13} className="text-green" /> Zero 3rd-Party Tracking Cookies
              </span>
              <span className="cookie-meta-pill">
                <Lock size={13} className="text-orange" /> Minimal Functional Storage
              </span>
            </div>
          </ScrollReveal>
        </div>

        {/* Action & Manage Banner */}
        <ScrollReveal delay={0.05}>
          <div className="cookie-manage-banner">
            <div className="manage-banner-left">
              <div className="manage-icon-box">
                <Sliders size={24} className="text-orange" />
              </div>
              <div>
                <h3 className="manage-banner-title">Manage Your Cookie & Storage Preferences</h3>
                <p className="manage-banner-desc">
                  You can change your consent status or inspect your active client-side storage keys at any time.
                </p>
              </div>
            </div>

            <div className="manage-banner-actions">
              <button
                type="button"
                className="btn-primary-orange"
                onClick={handleOpenCookieSettings}
              >
                <Settings size={15} />
                <span>Adjust Cookie Settings</span>
              </button>

              <button
                type="button"
                className="action-icon-btn"
                onClick={handleCopyLink}
                title="Copy Link"
              >
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
              </button>

              <button
                type="button"
                className="action-icon-btn"
                onClick={handlePrint}
                title="Print Policy"
              >
                <Printer size={16} />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Live Storage Inspector Widget */}
        <ScrollReveal delay={0.08}>
          <div className="storage-inspector-card">
            <div className="inspector-header">
              <div className="inspector-title-group">
                <Database size={18} className="text-orange" />
                <h4>Live Browser Storage Inspector for this Website</h4>
              </div>
              <div className="inspector-actions">
                <button
                  type="button"
                  className="btn-inspector-action"
                  onClick={refreshStorageScan}
                  title="Refresh Scan"
                >
                  <RefreshCw size={13} />
                  <span>Scan Storage</span>
                </button>
                <button
                  type="button"
                  className="btn-inspector-action btn-danger-action"
                  onClick={handleClearNonEssential}
                  title="Reset Consent"
                >
                  <Trash2 size={13} />
                  <span>Reset Consent</span>
                </button>
              </div>
            </div>

            <p className="inspector-desc">
              Here are the exact keys currently stored in your browser's <code>localStorage</code> for this domain. Notice that no third-party tracking cookies or advertising payloads exist.
            </p>

            <div className="inspector-table-wrap">
              {activeStorageKeys.length > 0 ? (
                <table className="inspector-table">
                  <thead>
                    <tr>
                      <th>Key Name</th>
                      <th>Category</th>
                      <th>Stored Value (Preview)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeStorageKeys.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <code className="key-name">{item.key}</code>
                        </td>
                        <td>
                          <span className="badge-cat">
                            {item.key.includes('token')
                              ? 'Security / Auth'
                              : item.key.includes('theme')
                              ? 'UI Theme'
                              : item.key.includes('consent')
                              ? 'Cookie Consent'
                              : 'Functional State'}
                          </span>
                        </td>
                        <td className="val-cell">
                          <span className="val-text" title={item.value}>
                            {item.value?.length > 45 ? `${item.value.slice(0, 45)}...` : item.value}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-keys-box">
                  <span>No localStorage keys found in your current session.</span>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Detailed Explanation Sections */}
        <div className="cookie-sections-grid">
          {/* Section 1 */}
          <div className="cookie-card-block">
            <div className="block-tag">01 // CONCEPTS & DEFINITION</div>
            <h3 className="block-title">What Are Cookies & Local Storage?</h3>
            <p className="block-text">
              <strong>Cookies</strong> and <strong>Local Storage</strong> are small text entries or key-value data structures stored directly in your web browser by websites you visit.
            </p>
            <p className="block-text">
              While some commercial websites use cross-site tracking cookies to build behavioral profiles for targeted advertisements, <strong>this website uses purely first-party, essential client-side storage</strong> to preserve UI preferences (like dark theme) and record security state.
            </p>
          </div>

          {/* Section 2 */}
          <div className="cookie-card-block">
            <div className="block-tag">02 // CLASSIFICATION</div>
            <h3 className="block-title">How We Categorize Storage</h3>
            <div className="cat-list">
              <div className="cat-item">
                <div className="cat-item-top">
                  <span className="cat-name">Strictly Essential Storage</span>
                  <span className="cat-badge-locked">Always Active</span>
                </div>
                <p className="cat-desc">
                  Required for site navigation, security firewalls, routing, and remembering whether you acknowledged our legal notices.
                </p>
              </div>

              <div className="cat-item">
                <div className="cat-item-top">
                  <span className="cat-name">Functional Preferences</span>
                  <span className="cat-badge-opt">User Controlled</span>
                </div>
                <p className="cat-desc">
                  Remembers your aesthetic theme (pure dark mode) and customized UI layout options.
                </p>
              </div>

              <div className="cat-item">
                <div className="cat-item-top">
                  <span className="cat-name">Third-Party Tracking Cookies</span>
                  <span className="cat-badge-none">0% Present</span>
                </div>
                <p className="cat-desc">
                  We do not use advertising networks, Facebook Pixel, Google AdSense, or third-party marketing cookies.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="cookie-card-block">
            <div className="block-tag">03 // BROWSER CONTROLS</div>
            <h3 className="block-title">How to Manage or Block Storage in Your Browser</h3>
            <p className="block-text">
              Every major modern web browser lets you view, delete, and block cookies and local storage through its settings:
            </p>
            <ul className="cookie-guide-list">
              <li>
                <strong>Google Chrome:</strong> Settings ➔ Privacy and Security ➔ Cookies and other site data.
              </li>
              <li>
                <strong>Mozilla Firefox:</strong> Settings ➔ Privacy & Security ➔ Enhanced Tracking Protection.
              </li>
              <li>
                <strong>Apple Safari:</strong> Preferences ➔ Privacy ➔ Manage Website Data.
              </li>
              <li>
                <strong>Brave Browser:</strong> Brave Shields automatically blocks non-essential cookies.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="cookie-card-block">
            <div className="block-tag">04 // LEGAL & CONTACT</div>
            <h3 className="block-title">Questions & Security Verification</h3>
            <p className="block-text">
              If you have any questions regarding our storage practices or would like to verify compliance with GDPR, ePrivacy Directive, or CCPA, reach out directly:
            </p>
            <div className="contact-quick-row">
              <span className="contact-label">Email:</span>
              <a href={`mailto:${profile.email}`} className="contact-link">
                {profile.email}
              </a>
            </div>
            <div className="contact-quick-row">
              <span className="contact-label">Explore More:</span>
              <div className="quick-links-group">
                <Link to="/privacy" className="related-link">
                  Privacy Policy <ArrowUpRight size={12} />
                </Link>
                <Link to="/terms" className="related-link">
                  Terms of Service <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cookie-page-wrapper {
          min-height: 100vh;
          background: #050505;
          color: #ededed;
          padding-bottom: 80px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .cookie-spacer {
          height: 110px;
        }

        .cookie-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        .cookie-header-section {
          margin-bottom: 32px;
        }

        .cookie-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono, monospace);
          font-size: 11.5px;
          color: #ff4500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 12px;
          background: rgba(255, 69, 0, 0.08);
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 69, 0, 0.2);
        }

        .cookie-main-title {
          font-family: var(--font-heading, sans-serif);
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #ffffff;
          margin: 0 0 14px 0;
        }

        .cookie-title-faded {
          color: #71717a;
        }

        .cookie-main-subtitle {
          font-size: clamp(14px, 1.6vw, 17px);
          color: #a1a1aa;
          max-width: 780px;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        .cookie-meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .cookie-meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #d4d4d8;
          background: #18181b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 5px 12px;
          border-radius: 999px;
        }

        .text-green { color: #4ade80; }
        .text-orange { color: #ff4500; }

        /* Manage Banner */
        .cookie-manage-banner {
          background: rgba(24, 24, 27, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 30px;
          backdrop-filter: blur(16px);
        }

        .manage-banner-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .manage-icon-box {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: rgba(255, 69, 0, 0.1);
          border: 1px solid rgba(255, 69, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .manage-banner-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .manage-banner-desc {
          font-size: 13px;
          color: #a1a1aa;
          margin: 0;
        }

        .manage-banner-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .btn-primary-orange {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ff4500;
          color: #ffffff;
          border: none;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(255, 69, 0, 0.35);
        }

        .btn-primary-orange:hover {
          background: #ff5722;
          transform: translateY(-1px);
        }

        .action-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #18181b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #d4d4d8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-icon-btn:hover {
          background: #27272a;
          color: #ffffff;
        }

        /* Storage Inspector Card */
        .storage-inspector-card {
          background: rgba(18, 18, 22, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 36px;
        }

        .inspector-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .inspector-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .inspector-title-group h4 {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .inspector-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-inspector-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #18181b;
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #d4d4d8;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-inspector-action:hover {
          background: #27272a;
          color: #ffffff;
        }

        .btn-danger-action:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .inspector-desc {
          font-size: 13px;
          line-height: 1.5;
          color: #a1a1aa;
          margin: 0 0 16px 0;
        }

        .inspector-desc code {
          background: #18181b;
          padding: 2px 6px;
          border-radius: 4px;
          color: #ff8c00;
          font-size: 12px;
        }

        .inspector-table-wrap {
          overflow-x: auto;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .inspector-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
          text-align: left;
        }

        .inspector-table th {
          background: #18181b;
          color: #a1a1aa;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-weight: 600;
        }

        .inspector-table td {
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: #d4d4d8;
        }

        .key-name {
          color: #ff8c00;
          font-family: var(--font-mono, monospace);
          font-size: 12px;
        }

        .badge-cat {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          color: #e4e4e7;
        }

        .val-text {
          font-family: var(--font-mono, monospace);
          font-size: 11.5px;
          color: #a1a1aa;
        }

        .no-keys-box {
          padding: 20px;
          text-align: center;
          color: #71717a;
          font-size: 13px;
        }

        /* 2x2 Content Grid */
        .cookie-sections-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .cookie-card-block {
          background: rgba(18, 18, 22, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 24px;
        }

        .block-tag {
          font-family: var(--font-mono, monospace);
          font-size: 10.5px;
          color: #ff4500;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 6px;
        }

        .block-title {
          font-size: 17px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 12px 0;
          letter-spacing: -0.01em;
        }

        .block-text {
          font-size: 13.5px;
          line-height: 1.6;
          color: #d4d4d8;
          margin: 0 0 12px 0;
        }

        .block-text strong {
          color: #ffffff;
        }

        .cat-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }

        .cat-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 12px 14px;
        }

        .cat-item-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .cat-name {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .cat-badge-locked {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
        }

        .cat-badge-opt {
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.08);
          color: #a1a1aa;
        }

        .cat-badge-none {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(255, 69, 0, 0.15);
          color: #ff4500;
        }

        .cat-desc {
          font-size: 12px;
          color: #a1a1aa;
          margin: 0;
          line-height: 1.4;
        }

        .cookie-guide-list {
          margin: 10px 0;
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cookie-guide-list li {
          font-size: 13px;
          color: #d4d4d8;
          line-height: 1.5;
        }

        .cookie-guide-list li strong {
          color: #ffffff;
        }

        .contact-quick-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 13px;
        }

        .contact-label {
          color: #71717a;
          font-weight: 600;
        }

        .contact-link {
          color: #ff4500;
          text-decoration: none;
        }

        .contact-link:hover {
          text-decoration: underline;
        }

        .quick-links-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .related-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #ffffff;
          text-decoration: none;
          font-size: 12.5px;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .related-link:hover {
          color: #ff4500;
        }

        /* Responsive */
        @media (max-width: 960px) {
          .cookie-sections-grid {
            grid-template-columns: 1fr;
          }
          .cookie-manage-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .manage-banner-actions {
            width: 100%;
            justify-content: flex-start;
          }
        }

        @media (max-width: 600px) {
          .cookie-card-block, .storage-inspector-card {
            padding: 18px 16px;
          }
          .cookie-spacer {
            height: 80px;
          }
        }
      `}</style>
    </div>
  );
}
