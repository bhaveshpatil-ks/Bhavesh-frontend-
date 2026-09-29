import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Code2, 
  ArrowUpRight, 
  Copy, 
  Check, 
  Printer, 
  Scale, 
  UserCheck, 
  Sparkles 
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { portfolioData } from '../data/portfolioData';
import { toast } from '../components/ui/toast';

const TERMS_STORAGE_KEY = 'bhavesh_terms_agreed';

export default function TermsPage() {
  const { profile } = portfolioData;
  const [hasAgreed, setHasAgreed] = useState(false);
  const [agreeTimestamp, setAgreeTimestamp] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSection, setActiveSection] = useState('section-1');

  useEffect(() => {
    const saved = localStorage.getItem(TERMS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHasAgreed(true);
        setAgreeTimestamp(parsed.timestamp);
      } catch {
        setHasAgreed(true);
      }
    }
  }, []);

  const handleAgreeToggle = () => {
    if (!hasAgreed) {
      const now = new Date().toISOString();
      localStorage.setItem(TERMS_STORAGE_KEY, JSON.stringify({ agreed: true, timestamp: now }));
      setHasAgreed(true);
      setAgreeTimestamp(now);
      toast({
        title: 'Terms Acknowledged & Accepted',
        description: 'Thank you. Your agreement has been safely recorded in your browser local storage.',
        variant: 'default',
        duration: 4000,
      });
    } else {
      localStorage.removeItem(TERMS_STORAGE_KEY);
      setHasAgreed(false);
      setAgreeTimestamp(null);
      toast({
        title: 'Agreement Reset',
        description: 'Terms acknowledgment has been cleared from local storage.',
        variant: 'default',
        duration: 3000,
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast({
      title: 'Link Copied',
      description: 'Terms & Conditions link copied to clipboard.',
      variant: 'default',
      duration: 2500,
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { id: 'section-1', title: '1. Acceptance & Overview' },
    { id: 'section-2', title: '2. Zero Data Exploitation Guarantee' },
    { id: 'section-3', title: '3. Intellectual Property & Code' },
    { id: 'section-4', title: '4. Security & Prohibited Conduct' },
    { id: 'section-5', title: '5. AI Chat & Contact System' },
    { id: 'section-6', title: '6. Limitation of Liability' },
    { id: 'section-7', title: '7. Amendments & Inquiries' },
  ];

  return (
    <div className="terms-page-wrapper">
      <div className="terms-spacer" />

      <div className="terms-container">
        {/* Header Badge */}
        <div className="terms-header">
          <ScrollReveal>
            <div className="terms-badge">
              <span className="badge-slash">//</span>
              <span>08 / LEGAL AGREEMENT & SECURITY PROTOCOLS</span>
            </div>

            <h1 className="terms-main-title">
              Terms & <span className="terms-title-faded">Conditions</span>
            </h1>

            <p className="terms-main-subtitle">
              Mutual security and transparent rules governing the use of {profile.name} {profile.lastName}'s portfolio website, interactive demos, and contact channels.
            </p>

            <div className="terms-meta-row">
              <span className="terms-meta-pill">
                <FileText size={13} /> Effective: May 2026 / Updated Sept 2026
              </span>
              <span className="terms-meta-pill">
                <ShieldCheck size={13} className="text-green" /> 100% Non-Monetized Portfolio
              </span>
              <span className="terms-meta-pill">
                <Lock size={13} className="text-orange" /> Zero Data Selling Pledge
              </span>
            </div>
          </ScrollReveal>
        </div>

        {/* Security & Agreement Action Banner */}
        <ScrollReveal delay={0.05}>
          <div className={`terms-agreement-banner ${hasAgreed ? 'is-agreed' : ''}`}>
            <div className="agreement-banner-left">
              <div className="agreement-shield-icon">
                {hasAgreed ? <CheckCircle2 size={24} /> : <Scale size={24} />}
              </div>
              <div className="agreement-banner-text">
                <h3 className="agreement-banner-title">
                  {hasAgreed ? 'You Have Agreed to These Terms' : 'User Agreement & Security Confirmation'}
                </h3>
                <p className="agreement-banner-desc">
                  {hasAgreed ? (
                    <>
                      Status: <strong className="text-green">Accepted & Active</strong> in your browser storage
                      {agreeTimestamp && ` on ${new Date(agreeTimestamp).toLocaleDateString()}`}.
                    </>
                  ) : (
                    'By navigating or using this website, you confirm your understanding that we do not harvest or sell your personal data, and agree to uphold acceptable security conduct.'
                  )}
                </p>
              </div>
            </div>

            <div className="agreement-banner-actions">
              <button
                type="button"
                className={`agree-action-btn ${hasAgreed ? 'btn-agreed' : 'btn-primary'}`}
                onClick={handleAgreeToggle}
              >
                {hasAgreed ? (
                  <>
                    <Check size={16} />
                    <span>Agreed</span>
                  </>
                ) : (
                  <>
                    <UserCheck size={16} />
                    <span>I Agree to Terms</span>
                  </>
                )}
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
                title="Print Terms"
              >
                <Printer size={16} />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Content Layout */}
        <div className="terms-layout">
          {/* Quick Jump Sidebar */}
          <aside className="terms-sidebar">
            <div className="terms-sidebar-card">
              <h4 className="sidebar-heading">Table of Contents</h4>
              <nav className="sidebar-nav">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`sidebar-nav-link ${activeSection === sec.id ? 'active' : ''}`}
                  >
                    <span>{sec.title}</span>
                  </a>
                ))}
              </nav>

              <div className="sidebar-quick-links">
                <Link to="/privacy" className="sidebar-related-link">
                  <span>Privacy Policy</span>
                  <ArrowUpRight size={13} />
                </Link>
                <Link to="/cookies" className="sidebar-related-link">
                  <span>Cookie Policy</span>
                  <ArrowUpRight size={13} />
                </Link>
                <Link to="/contact" className="sidebar-related-link">
                  <span>Contact Support</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </aside>

          {/* Detailed Document Content */}
          <main className="terms-content">
            {/* Section 1 */}
            <section id="section-1" className="terms-doc-section">
              <div className="section-header-tag">01 // ACCEPTANCE & SCOPE</div>
              <h2 className="section-title">1. Acceptance of Terms & Portfolio Scope</h2>
              <p className="section-paragraph">
                Welcome to the official portfolio website of <strong>{profile.name} {profile.lastName}</strong> ("Developer", "We", "Our", or "Us"), accessible at this domain and associated subdomains. By accessing, browsing, interacting with, or submitting data through this site, you ("User", "Visitor", or "You") acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions ("Terms").
              </p>
              <p className="section-paragraph">
                This website is operated strictly as an independent software development showcase, technical portfolio, and communication hub. It does not operate as an e-commerce storefront, paid subscription portal, or commercial tracking network.
              </p>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="terms-doc-section">
              <div className="section-header-tag">02 // DATA PROTECTION PLEDGE</div>
              <h2 className="section-title">2. Zero Data Exploitation & Privacy Commitment</h2>
              <div className="terms-highlight-box">
                <div className="highlight-icon">
                  <ShieldCheck size={22} className="text-orange" />
                </div>
                <div className="highlight-text">
                  <h4>Clear User Security Assurance</h4>
                  <p>
                    We explicitly guarantee that <strong>your personal data is not collected for commercial monetization, sale, rental, or behavioral ad profiling</strong>. Any information voluntarily provided (such as your name or email when submitting a contact inquiry or support ticket) is used solely and strictly to reply to your inquiry.
                  </p>
                </div>
              </div>
              <p className="section-paragraph">
                We believe in digital integrity. We do not embed ad pixels, cross-site telemetry trackers, or predatory surveillance scripts. Your interaction with this website remains confidential, minimal, and secure.
              </p>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="terms-doc-section">
              <div className="section-header-tag">03 // INTELLECTUAL PROPERTY</div>
              <h2 className="section-title">3. Intellectual Property & Open Source Works</h2>
              <p className="section-paragraph">
                All visual design assets, custom typography, animations, UI layouts, branding elements, and written materials displayed on this site are the intellectual property of {profile.name} {profile.lastName}, unless otherwise noted or attributed to open-source licenses.
              </p>
              <ul className="terms-list">
                <li>
                  <strong>Open Source Projects:</strong> Featured open-source repositories (such as Sparse, RivoCode-Cli, FacultyOne, and CLI utilities) are governed by their respective licenses (e.g., MIT, Apache 2.0, or GPL) hosted on GitHub.
                </li>
                <li>
                  <strong>Personal Portfolio Design:</strong> The unique design architecture, custom GSAP animations, and structural styling of this web portfolio may not be copied, scraped, or republished verbatim for unauthorized commercial redistribution.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="terms-doc-section">
              <div className="section-header-tag">04 // USER CONDUCT & SECURITY</div>
              <h2 className="section-title">4. Prohibited Conduct & Mutual Security Protection</h2>
              <p className="section-paragraph">
                To maintain the integrity, uptime, and security of both visitors and the developer's server infrastructure, you agree NOT to engage in:
              </p>
              <div className="terms-rules-grid">
                <div className="rule-card">
                  <div className="rule-icon-danger">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="rule-content">
                    <h5>Denial of Service & Abuse</h5>
                    <p>Executing automated volumetric attacks, continuous spamming of forms, or API flood exploits.</p>
                  </div>
                </div>

                <div className="rule-card">
                  <div className="rule-icon-danger">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="rule-content">
                    <h5>Unauthorized Infiltration</h5>
                    <p>Attempting to bypass authentication layers, exploit admin tokens, or probe endpoints for unlisted vulnerabilities.</p>
                  </div>
                </div>

                <div className="rule-card">
                  <div className="rule-icon-danger">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="rule-content">
                    <h5>Malicious Injections</h5>
                    <p>Submitting malicious XSS payloads, SQL injections, or deceptive input into contact forms or AI chat prompts.</p>
                  </div>
                </div>

                <div className="rule-card">
                  <div className="rule-icon-danger">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="rule-content">
                    <h5>Aggressive Scraping</h5>
                    <p>Harvesting email addresses or assets using non-standard automated crawlers violating robots.txt.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="terms-doc-section">
              <div className="section-header-tag">05 // INTERACTIVE SERVICES</div>
              <h2 className="section-title">5. AI Chat & Contact System Disclaimers</h2>
              <p className="section-paragraph">
                This website includes interactive features, including an AI Assistant and direct contact messaging:
              </p>
              <ul className="terms-list">
                <li>
                  <strong>AI Assistant:</strong> The embedded AI chatbot is provided for interactive informational demonstration regarding {profile.name}'s technical background, projects, and skills. AI responses are generated algorithmically and should not be construed as legally binding commitments or contracts.
                </li>
                <li>
                  <strong>Contact Inquiries:</strong> Submitting a message does not automatically constitute a freelance contract or employment binding until formalized via a separate mutual agreement.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="terms-doc-section">
              <div className="section-header-tag">06 // LEGAL LIMITATIONS</div>
              <h2 className="section-title">6. Limitation of Liability & "As-Is" Service</h2>
              <p className="section-paragraph">
                This portfolio and all associated demonstrations, code samples, and links are provided on an <strong>"AS IS" and "AS AVAILABLE"</strong> basis without warranties of any kind, whether express or implied.
              </p>
              <p className="section-paragraph">
                To the maximum extent permitted by applicable law, the Developer shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of (or inability to access or use) this website or any third-party links referenced herein.
              </p>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="terms-doc-section">
              <div className="section-header-tag">07 // AMENDMENTS & CONTACT</div>
              <h2 className="section-title">7. Amendments & Direct Contact</h2>
              <p className="section-paragraph">
                We reserve the right to periodically review and update these Terms to reflect technical enhancements or legal updates. Material updates will be indicated by the "Effective Date" at the top of this document.
              </p>
              <p className="section-paragraph">
                If you have questions, feedback, or security inquiries regarding these Terms:
              </p>
              <div className="terms-contact-card">
                <div className="contact-card-item">
                  <span className="contact-label">Developer:</span>
                  <span className="contact-val">{profile.name} {profile.lastName}</span>
                </div>
                <div className="contact-card-item">
                  <span className="contact-label">Email:</span>
                  <a href={`mailto:${profile.email}`} className="contact-email-link">
                    {profile.email}
                  </a>
                </div>
                <div className="contact-card-item">
                  <span className="contact-label">GitHub:</span>
                  <a
                    href={`https://github.com/${profile.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-email-link"
                  >
                    github.com/{profile.handle}
                  </a>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <style>{`
        .terms-page-wrapper {
          min-height: 100vh;
          background: #050505;
          color: #ededed;
          padding-bottom: 80px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .terms-spacer {
          height: 110px;
        }

        .terms-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        .terms-header {
          margin-bottom: 32px;
        }

        .terms-badge {
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

        .badge-slash {
          font-weight: 700;
        }

        .terms-main-title {
          font-family: var(--font-heading, sans-serif);
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #ffffff;
          margin: 0 0 14px 0;
        }

        .terms-title-faded {
          color: #71717a;
        }

        .terms-main-subtitle {
          font-size: clamp(14px, 1.6vw, 17px);
          color: #a1a1aa;
          max-width: 760px;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        .terms-meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .terms-meta-pill {
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

        .text-green {
          color: #4ade80;
        }

        .text-orange {
          color: #ff4500;
        }

        /* Agreement Banner */
        .terms-agreement-banner {
          background: rgba(24, 24, 27, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 40px;
          backdrop-filter: blur(16px);
          transition: all 0.3s ease;
        }

        .terms-agreement-banner.is-agreed {
          border-color: rgba(74, 222, 128, 0.4);
          background: rgba(16, 40, 24, 0.45);
          box-shadow: 0 10px 30px rgba(74, 222, 128, 0.1);
        }

        .agreement-banner-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .agreement-shield-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255, 69, 0, 0.1);
          border: 1px solid rgba(255, 69, 0, 0.3);
          color: #ff4500;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .is-agreed .agreement-shield-icon {
          background: rgba(74, 222, 128, 0.15);
          border-color: rgba(74, 222, 128, 0.4);
          color: #4ade80;
        }

        .agreement-banner-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .agreement-banner-desc {
          font-size: 13px;
          color: #a1a1aa;
          margin: 0;
          line-height: 1.45;
        }

        .agreement-banner-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .agree-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid transparent;
        }

        .btn-primary {
          background: #ff4500;
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(255, 69, 0, 0.35);
        }

        .btn-primary:hover {
          background: #ff5722;
          transform: translateY(-1px);
        }

        .btn-agreed {
          background: rgba(74, 222, 128, 0.15);
          color: #4ade80;
          border-color: rgba(74, 222, 128, 0.35);
        }

        .btn-agreed:hover {
          background: rgba(74, 222, 128, 0.25);
        }

        .action-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #18181b;
          border: 1px solid rgba(255, 255, 255, 0.12);
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
          border-color: rgba(255, 255, 255, 0.25);
        }

        /* Layout */
        .terms-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
          align-items: start;
        }

        .terms-sidebar {
          position: sticky;
          top: 90px;
        }

        .terms-sidebar-card {
          background: rgba(18, 18, 22, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(16px);
        }

        .sidebar-heading {
          font-size: 13px;
          font-weight: 700;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 14px 0;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-nav-link {
          display: block;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 13px;
          color: #a1a1aa;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .sidebar-nav-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .sidebar-nav-link.active {
          color: #ff4500;
          background: rgba(255, 69, 0, 0.1);
          font-weight: 600;
        }

        .sidebar-quick-links {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-related-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12.5px;
          color: #71717a;
          text-decoration: none;
          padding: 4px 6px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .sidebar-related-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
        }

        /* Content Area */
        .terms-content {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .terms-doc-section {
          background: rgba(18, 18, 22, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 30px 34px;
          scroll-margin-top: 100px;
        }

        .section-header-tag {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: #ff4500;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .section-title {
          font-size: clamp(20px, 2.2vw, 24px);
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 16px 0;
          letter-spacing: -0.02em;
        }

        .section-paragraph {
          font-size: 14.5px;
          line-height: 1.7;
          color: #d4d4d8;
          margin: 0 0 14px 0;
        }

        .section-paragraph strong {
          color: #ffffff;
        }

        .terms-highlight-box {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          background: rgba(255, 69, 0, 0.06);
          border: 1px solid rgba(255, 69, 0, 0.25);
          border-radius: 12px;
          padding: 16px 20px;
          margin: 18px 0;
        }

        .highlight-text h4 {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 6px 0;
        }

        .highlight-text p {
          font-size: 13px;
          line-height: 1.55;
          color: #d4d4d8;
          margin: 0;
        }

        .terms-list {
          margin: 12px 0;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .terms-list li {
          font-size: 14px;
          line-height: 1.6;
          color: #d4d4d8;
        }

        .terms-list li strong {
          color: #ffffff;
        }

        /* Rules Grid */
        .terms-rules-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 16px;
        }

        .rule-card {
          display: flex;
          gap: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 14px;
        }

        .rule-icon-danger {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #f87171;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rule-content h5 {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .rule-content p {
          font-size: 12px;
          color: #a1a1aa;
          margin: 0;
          line-height: 1.4;
        }

        /* Contact Card */
        .terms-contact-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }

        .contact-card-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
        }

        .contact-label {
          color: #71717a;
          font-weight: 600;
          min-width: 80px;
        }

        .contact-val {
          color: #ffffff;
          font-weight: 600;
        }

        .contact-email-link {
          color: #ff4500;
          text-decoration: none;
          font-weight: 500;
          transition: text-decoration 0.2s ease;
        }

        .contact-email-link:hover {
          text-decoration: underline;
        }

        /* Print Media Styles */
        @media print {
          .terms-page-wrapper {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .terms-sidebar, .terms-agreement-banner, .terms-badge, .terms-spacer {
            display: none !important;
          }
          .terms-layout {
            display: block !important;
          }
          .terms-doc-section {
            background: none !important;
            border: none !important;
            padding: 0 !important;
            margin-bottom: 24px !important;
          }
          .section-title, .terms-main-title, .terms-paragraph strong {
            color: #000000 !important;
          }
        }

        /* Responsive */
        @media (max-width: 960px) {
          .terms-layout {
            grid-template-columns: 1fr;
          }
          .terms-sidebar {
            display: none;
          }
          .terms-rules-grid {
            grid-template-columns: 1fr;
          }
          .terms-agreement-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .agreement-banner-actions {
            width: 100%;
            justify-content: flex-start;
          }
        }

        @media (max-width: 600px) {
          .terms-doc-section {
            padding: 20px 18px;
          }
          .terms-spacer {
            height: 80px;
          }
        }
      `}</style>
    </div>
  );
}
