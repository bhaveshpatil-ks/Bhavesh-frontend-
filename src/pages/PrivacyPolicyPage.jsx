import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Database, 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer, 
  Mail, 
  ArrowUpRight, 
  FileLock2, 
  Server, 
  Globe2, 
  UserX 
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { portfolioData } from '../data/portfolioData';
import { toast } from '../components/ui/toast';

export default function PrivacyPolicyPage() {
  const { profile } = portfolioData;
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState('principles');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast({
      title: 'Link Copied',
      description: 'Privacy Policy link copied to clipboard.',
      variant: 'default',
      duration: 2500,
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const triggerCookieSettings = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  };

  return (
    <div className="privacy-page-wrapper">
      <div className="privacy-spacer" />

      <div className="privacy-container">
        {/* Header */}
        <div className="privacy-header">
          <ScrollReveal>
            <div className="privacy-badge">
              <span className="badge-slash">//</span>
              <span>09 / PRIVACY, DATA INTEGRITY & ZERO-SELLING PLEDGE</span>
            </div>

            <h1 className="privacy-main-title">
              Privacy <span className="privacy-title-faded">Policy</span>
            </h1>

            <p className="privacy-main-subtitle">
              We respect your right to digital privacy. Here is our unequivocal commitment to protecting your personal data, ensuring zero tracking exploitation, and maintaining top-tier security standards.
            </p>

            <div className="privacy-meta-row">
              <span className="privacy-meta-pill">
                <FileLock2 size={13} /> Effective: May 2026 / Updated Sept 2026
              </span>
              <span className="privacy-meta-pill">
                <ShieldCheck size={13} className="text-green" /> 100% Zero-Sale Guarantee
              </span>
              <span className="privacy-meta-pill">
                <EyeOff size={13} className="text-orange" /> No Cross-Site Ad Tracking
              </span>
            </div>
          </ScrollReveal>
        </div>

        {/* Big Assurance Cards */}
        <ScrollReveal delay={0.05}>
          <div className="assurance-grid">
            <div className="assurance-card">
              <div className="assurance-icon-box">
                <EyeOff size={22} className="text-orange" />
              </div>
              <h3 className="assurance-title">Zero Data Monetization</h3>
              <p className="assurance-desc">
                We will never sell, rent, lease, trade, or distribute your personal information, messages, or email addresses to data brokers or third-party marketers.
              </p>
            </div>

            <div className="assurance-card">
              <div className="assurance-icon-box">
                <Lock size={22} className="text-green" />
              </div>
              <h3 className="assurance-title">No Cross-Site Profiling</h3>
              <p className="assurance-desc">
                This website does not load behavioral trackers, Facebook Pixels, marketing ad networks, or covert canvas fingerprinting scripts.
              </p>
            </div>

            <div className="assurance-card">
              <div className="assurance-icon-box">
                <Database size={22} className="text-yellow" />
              </div>
              <h3 className="assurance-title">Minimal Functional Storage</h3>
              <p className="assurance-desc">
                Browser storage is used purely for essential operations: preserving your dark mode theme, recording consent preferences, and maintaining uptime.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Top Controls Bar */}
        <div className="privacy-controls-bar">
          <div className="controls-left">
            <span className="controls-label">Jump to Section:</span>
            <div className="controls-tab-group">
              <a href="#section-collection" className="tab-pill">Data We Process</a>
              <a href="#section-usage" className="tab-pill">How It's Used</a>
              <a href="#section-cookies" className="tab-pill">Cookies & Storage</a>
              <a href="#section-security" className="tab-pill">Security Standards</a>
              <a href="#section-rights" className="tab-pill">Your Rights</a>
            </div>
          </div>

          <div className="controls-right">
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
              title="Print Document"
            >
              <Printer size={16} />
            </button>
          </div>
        </div>

        {/* Detailed Policy Sections */}
        <div className="privacy-sections-stack">
          {/* Section 1: Overview */}
          <section id="section-overview" className="privacy-card-section">
            <div className="section-tag">01 // INTRODUCTION & FUNDAMENTAL PRINCIPLES</div>
            <h2 className="section-title">1. Introduction & Developer Integrity</h2>
            <p className="section-p">
              This Privacy Policy explains the privacy and data protection practices of <strong>{profile.name} {profile.lastName}</strong> ("Developer", "We", "Our", or "Us") regarding your use of this personal developer portfolio.
            </p>
            <p className="section-p">
              Our core tenet is simple: <strong>Your privacy is paramount.</strong> We believe software developers should lead by example in building ethical, transparent web systems that respect visitor autonomy and preserve data sovereignty.
            </p>
          </section>

          {/* Section 2: Data Processed */}
          <section id="section-collection" className="privacy-card-section">
            <div className="section-tag">02 // DATA COLLECTION & INPUTS</div>
            <h2 className="section-title">2. Information We Process & Why</h2>
            <p className="section-p">
              We collect and process only the bare minimum information necessary to provide you with functional features and responsive communication:
            </p>

            <div className="info-types-grid">
              <div className="info-box">
                <div className="info-box-header">
                  <Mail size={16} className="text-orange" />
                  <h4>Contact Form & Inquiries</h4>
                </div>
                <p>
                  When you submit a contact inquiry, we receive your <strong>Name, Email Address, and Message Content</strong>. This data is transmitted securely to our backend and used solely to compose a direct personal reply to your request.
                </p>
              </div>

              <div className="info-box">
                <div className="info-box-header">
                  <Globe2 size={16} className="text-green" />
                  <h4>Interactive AI Assistant</h4>
                </div>
                <p>
                  Questions entered into the AI chat are passed transiently to our AI model endpoint (Groq API) to generate contextual answers about the developer's experience. Prompts are not used for advertising profile creation.
                </p>
              </div>

              <div className="info-box">
                <div className="info-box-header">
                  <Server size={16} className="text-yellow" />
                  <h4>Technical & Security Telemetry</h4>
                </div>
                <p>
                  Our cloud hosting infrastructure (Netlify, Render) logs standard HTTP connection metadata (IP address, browser type, timestamp) strictly for firewall protection, rate limiting, and DDoS attack prevention.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Zero Selling Guarantee */}
          <section id="section-usage" className="privacy-card-section">
            <div className="section-tag">03 // USAGE & THIRD-PARTY DISCLOSURE</div>
            <h2 className="section-title">3. How Information Is Used & No Third-Party Selling</h2>
            <p className="section-p">
              We strictly enforce the following rules regarding all data:
            </p>
            <ul className="privacy-bullet-list">
              <li>
                <strong>No Commercial Sale or Rental:</strong> We never monetize, sell, lease, or syndicate user details to advertising brokers, email lists, or analytics conglomerates.
              </li>
              <li>
                <strong>No Unsolicited Marketing:</strong> Submitting a contact message will never subscribe you to marketing newsletters or unsolicited automated bulk emails.
              </li>
              <li>
                <strong>Essential Infrastructure Only:</strong> Data is processed solely by essential technical service providers needed to run this site (e.g. Netlify for CDN hosting, Render for API backend, Firebase/Cloudinary for authenticated admin data and project media).
              </li>
            </ul>
          </section>

          {/* Section 4: Cookies & Local Storage */}
          <section id="section-cookies" className="privacy-card-section">
            <div className="section-tag">04 // LOCAL STORAGE & COOKIES</div>
            <h2 className="section-title">4. Cookies & Browser Local Storage</h2>
            <p className="section-p">
              This website does NOT use third-party behavioral cookies or tracking beacons. We make use of browser <code>localStorage</code> purely for client-side functionality:
            </p>

            <div className="table-responsive">
              <table className="storage-table">
                <thead>
                  <tr>
                    <th>Storage Key</th>
                    <th>Type</th>
                    <th>Purpose</th>
                    <th>Retention</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>bhavesh-portfolio-theme</code></td>
                    <td>Functional</td>
                    <td>Preserves Dark Mode theme preferences</td>
                    <td>Persistent</td>
                  </tr>
                  <tr>
                    <td><code>bhavesh_cookie_consent</code></td>
                    <td>Functional</td>
                    <td>Stores your cookie consent & privacy preferences</td>
                    <td>Persistent</td>
                  </tr>
                  <tr>
                    <td><code>bhavesh_terms_agreed</code></td>
                    <td>Functional</td>
                    <td>Records your voluntary acknowledgment of Terms</td>
                    <td>Persistent</td>
                  </tr>
                  <tr>
                    <td><code>bhavesh_token</code></td>
                    <td>Security (JWT)</td>
                    <td>Used solely for authenticated developer/admin access</td>
                    <td>Session</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="cookie-adjust-box">
              <span>Want to update your cookie consent choices?</span>
              <button type="button" onClick={triggerCookieSettings} className="btn-adjust-cookies">
                Open Cookie Settings
              </button>
            </div>
          </section>

          {/* Section 5: Security Standards */}
          <section id="section-security" className="privacy-card-section">
            <div className="section-tag">05 // DATA PROTECTION & ENCRYPTION</div>
            <h2 className="section-title">5. Data Security & Encryption Standards</h2>
            <p className="section-p">
              We implement industry-standard cybersecurity controls to protect information:
            </p>
            <div className="security-features-grid">
              <div className="sec-feature-card">
                <ShieldCheck size={20} className="text-green" />
                <div>
                  <h5>HTTPS / TLS 1.3 Encryption</h5>
                  <p>All network traffic between your browser and our server is encrypted with modern TLS ciphers.</p>
                </div>
              </div>

              <div className="sec-feature-card">
                <Lock size={20} className="text-orange" />
                <div>
                  <h5>Sanitized Inputs & XSS Shields</h5>
                  <p>All input fields are validated and sanitized to prevent script injection attacks and data leakage.</p>
                </div>
              </div>

              <div className="sec-feature-card">
                <FileLock2 size={20} className="text-yellow" />
                <div>
                  <h5>Secure Secret Management</h5>
                  <p>API keys and database credentials are fully isolated in server-side environment variables.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: User Rights */}
          <section id="section-rights" className="privacy-card-section">
            <div className="section-tag">06 // USER AUTONOMY & LEGAL RIGHTS</div>
            <h2 className="section-title">6. Your Rights (GDPR & CCPA Compliance)</h2>
            <p className="section-p">
              Regardless of your geographic location, we extend the following privacy rights to all visitors:
            </p>
            <ul className="privacy-bullet-list">
              <li>
                <strong>Right to Access:</strong> You may request a summary of any contact inquiry data you have previously sent to us.
              </li>
              <li>
                <strong>Right to Erasure (Right to Be Forgotten):</strong> You may request the immediate, permanent deletion of any message or email address in our inbox.
              </li>
              <li>
                <strong>Right to Rectification:</strong> You may update or correct any previously submitted contact details.
              </li>
            </ul>

            <div className="rights-cta-card">
              <div className="rights-cta-text">
                <h4>Have a Privacy Request or Data Inquiry?</h4>
                <p>Contact the developer directly to request data lookup or deletion.</p>
              </div>
              <a
                href={`mailto:${profile.email}?subject=Privacy%20Data%20Request%20-%20Portfolio`}
                className="btn-privacy-contact"
              >
                <Mail size={15} />
                <span>Email Developer ({profile.email})</span>
              </a>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .privacy-page-wrapper {
          min-height: 100vh;
          background: #050505;
          color: #ededed;
          padding-bottom: 80px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .privacy-spacer {
          height: 110px;
        }

        .privacy-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        .privacy-header {
          margin-bottom: 32px;
        }

        .privacy-badge {
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

        .privacy-main-title {
          font-family: var(--font-heading, sans-serif);
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #ffffff;
          margin: 0 0 14px 0;
        }

        .privacy-title-faded {
          color: #71717a;
        }

        .privacy-main-subtitle {
          font-size: clamp(14px, 1.6vw, 17px);
          color: #a1a1aa;
          max-width: 780px;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        .privacy-meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .privacy-meta-pill {
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
        .text-yellow { color: #facc15; }

        /* Assurance Grid */
        .assurance-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .assurance-card {
          background: rgba(18, 18, 22, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 22px;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .assurance-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .assurance-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .assurance-title {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 6px 0;
        }

        .assurance-desc {
          font-size: 12.5px;
          line-height: 1.5;
          color: #a1a1aa;
          margin: 0;
        }

        /* Controls Bar */
        .privacy-controls-bar {
          background: rgba(24, 24, 27, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 12px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .controls-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .controls-label {
          font-size: 12px;
          font-weight: 600;
          color: #71717a;
          text-transform: uppercase;
        }

        .controls-tab-group {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .tab-pill {
          font-size: 12px;
          color: #d4d4d8;
          text-decoration: none;
          padding: 5px 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.2s ease;
        }

        .tab-pill:hover {
          color: #ffffff;
          background: rgba(255, 69, 0, 0.15);
          border-color: rgba(255, 69, 0, 0.3);
        }

        .controls-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
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

        /* Stack Sections */
        .privacy-sections-stack {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .privacy-card-section {
          background: rgba(18, 18, 22, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 28px 32px;
          scroll-margin-top: 90px;
        }

        .section-tag {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: #ff4500;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .section-title {
          font-size: clamp(19px, 2vw, 22px);
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 14px 0;
          letter-spacing: -0.02em;
        }

        .section-p {
          font-size: 14px;
          line-height: 1.65;
          color: #d4d4d8;
          margin: 0 0 14px 0;
        }

        .section-p strong {
          color: #ffffff;
        }

        .section-p code {
          background: #18181b;
          padding: 2px 6px;
          border-radius: 4px;
          color: #ff8c00;
          font-size: 12.5px;
          font-family: var(--font-mono, monospace);
        }

        .info-types-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 16px;
        }

        .info-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 16px;
        }

        .info-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .info-box-header h4 {
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .info-box p {
          font-size: 12px;
          line-height: 1.5;
          color: #a1a1aa;
          margin: 0;
        }

        .privacy-bullet-list {
          margin: 12px 0;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .privacy-bullet-list li {
          font-size: 13.5px;
          line-height: 1.6;
          color: #d4d4d8;
        }

        .privacy-bullet-list li strong {
          color: #ffffff;
        }

        /* Storage Table */
        .table-responsive {
          overflow-x: auto;
          margin: 16px 0;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .storage-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          text-align: left;
        }

        .storage-table th {
          background: #18181b;
          color: #a1a1aa;
          font-weight: 600;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .storage-table td {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: #d4d4d8;
        }

        .storage-table code {
          color: #ff8c00;
          font-family: var(--font-mono, monospace);
        }

        .cookie-adjust-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 69, 0, 0.06);
          border: 1px solid rgba(255, 69, 0, 0.2);
          border-radius: 10px;
          padding: 12px 16px;
          margin-top: 14px;
          font-size: 13px;
          color: #d4d4d8;
        }

        .btn-adjust-cookies {
          background: #ff4500;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .btn-adjust-cookies:hover {
          background: #ff5722;
        }

        /* Security Features Grid */
        .security-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 16px;
        }

        .sec-feature-card {
          display: flex;
          gap: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 14px;
        }

        .sec-feature-card h5 {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .sec-feature-card p {
          font-size: 12px;
          color: #a1a1aa;
          margin: 0;
          line-height: 1.4;
        }

        /* Rights CTA */
        .rights-cta-card {
          background: rgba(24, 24, 27, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 20px;
        }

        .rights-cta-text h4 {
          font-size: 14.5px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .rights-cta-text p {
          font-size: 12.5px;
          color: #a1a1aa;
          margin: 0;
        }

        .btn-privacy-contact {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #09090b;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 18px;
          border-radius: 10px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-privacy-contact:hover {
          background: #f4f4f5;
          transform: translateY(-1px);
        }

        /* Responsive */
        @media (max-width: 960px) {
          .assurance-grid, .info-types-grid, .security-features-grid {
            grid-template-columns: 1fr;
          }
          .rights-cta-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .btn-privacy-contact {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 600px) {
          .privacy-card-section {
            padding: 20px 16px;
          }
          .privacy-spacer {
            height: 80px;
          }
        }
      `}</style>
    </div>
  );
}
