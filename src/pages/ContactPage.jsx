import React, { useState } from 'react';
import { Mail, Github, FileText, Send, Check, Copy, ArrowUpRight, Pin, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import ScrollReveal from '../components/ScrollReveal';
import TextReveal from '../components/ui/TextReveal';
import MagneticButton from '../components/ui/MagneticButton';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from '../components/ui/toast';
import { sendContactInquiry } from '../lib/api';

export default function ContactPage() {
  const { profile } = portfolioData;
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, label, key, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast({
      title: 'Copied to Clipboard',
      description: `${label} copied: ${text}`,
      variant: 'default',
      duration: 3000,
    });
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    
    // Send to backend API
    await sendContactInquiry(formData);
    
    setLoading(false);
    toast({
      title: 'Message Sent Successfully!',
      description: `Thanks ${formData.name}! Your message has been received.`,
      variant: 'default',
      duration: 5000,
    });
    setFormData({ name: '', email: '', message: '' });
    setIsFormOpen(false);
  };

  return (
    <div className="ct-page-wrapper">
      <div className="ct-spacer" />

      <div className="container-contact">
        {/* ─── Hero Section ────────────────── */}
        <div className="ct-header">
          <ScrollReveal>
            <div className="contact-badge">
              <span className="badge-slash">//</span>
              <span>07 / DIRECT ENGAGEMENT & CONTACT</span>
            </div>

            <h1 className="ct-main-title">
              Get in <span className="ct-title-faded">Touch</span>
            </h1>

            <p className="ct-main-subtitle">
              Reach out for collaboration, support, or any questions about {profile.name} {profile.lastName}.
            </p>
          </ScrollReveal>
        </div>

        {/* ─── Stacked Contact Hub Cards ─────────────── */}
        <div className="ct-hub-stack">
          {/* 1. Professional Web Contact */}
          <ScrollReveal delay={0.05}>
            <div className={`ct-hub-card ${isFormOpen ? 'card-expanded' : ''}`}>
              <div
                className="ct-card-main-row"
                onClick={() => setIsFormOpen(!isFormOpen)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsFormOpen(!isFormOpen); }}
              >
                <div className="ct-icon-box ct-icon-avatar">
                  <img
                    src={profile.avatar || profile.githubAvatar}
                    alt={profile.name}
                    className="ct-avatar-img"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="ct-avatar-fallback">BP</div>
                </div>

                <div className="ct-card-content">
                  <h3 className="ct-card-title">Professional Web Contact</h3>
                  <p className="ct-card-desc">Submit a private support ticket to connect directly with Bhavesh</p>
                </div>

                <div className="ct-card-action">
                  <button
                    className={`ct-pin-badge ${isFormOpen ? 'active' : ''}`}
                    title={isFormOpen ? "Close form" : "Open contact form"}
                    aria-label="Toggle contact form"
                    type="button"
                  >
                    {isFormOpen ? <ChevronUp size={15} /> : <Pin size={15} />}
                  </button>
                </div>
              </div>

              {/* Collapsible Contact Form */}
              {isFormOpen && (
                <div className="ct-embedded-form-wrapper">
                  <div className="ct-embedded-divider" />
                  <form onSubmit={handleSubmit} className="ct-embedded-form">
                    <div className="ct-form-row">
                      <div className="ct-form-field">
                        <Label htmlFor="ct-name" className="ct-field-label">YOUR NAME</Label>
                        <Input
                          type="text"
                          id="ct-name"
                          required
                          placeholder="e.g. John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="ct-input"
                        />
                      </div>
                      <div className="ct-form-field">
                        <Label htmlFor="ct-email" className="ct-field-label">YOUR EMAIL</Label>
                        <Input
                          type="email"
                          id="ct-email"
                          required
                          placeholder="e.g. john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="ct-input"
                        />
                      </div>
                    </div>

                    <div className="ct-form-field">
                      <Label htmlFor="ct-msg" className="ct-field-label">PROJECT DETAILS / MESSAGE</Label>
                      <Textarea
                        id="ct-msg"
                        required
                        rows={4}
                        placeholder="Tell me about your project scope, timeline, or inquiry..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="ct-textarea"
                      />
                    </div>

                    <div className="ct-form-submit-row">
                      <MagneticButton strength={0.25}>
                        <button type="submit" className="ct-btn-send" disabled={loading}>
                          {loading ? (
                            <span className="ct-loading-dots">
                              <span className="ct-dot" /><span className="ct-dot" /><span className="ct-dot" />
                            </span>
                          ) : (
                            <>
                              <span>SEND MESSAGE</span>
                              <Send size={13} />
                            </>
                          )}
                        </button>
                      </MagneticButton>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* 2. Chat on WhatsApp */}
          <ScrollReveal delay={0.1}>
            <div className="ct-hub-card">
              <a
                href={`https://wa.me/${profile.whatsapp?.replace(/\D/g, '') || '919307601125'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ct-card-main-row"
              >
                <div className="ct-icon-box ct-icon-whatsapp">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>

                <div className="ct-card-content">
                  <h3 className="ct-card-title">Chat on WhatsApp</h3>
                  <p className="ct-card-desc">{profile.phone || '+91 93076 01125'}</p>
                </div>

                <div className="ct-card-action">
                  <button
                    className="ct-pin-badge"
                    type="button"
                    onClick={(e) => copyToClipboard(profile.phone || '+91 93076 01125', 'WhatsApp number', 'phone', e)}
                    title="Copy phone number"
                    aria-label="Copy phone number"
                  >
                    {copiedKey === 'phone' ? <Check size={14} className="ct-icon-check" /> : <Pin size={15} />}
                  </button>
                </div>
              </a>
            </div>
          </ScrollReveal>

          {/* 3. Connect on Sparse */}
          <ScrollReveal delay={0.15}>
            <div className="ct-hub-card">
              <a
                href="https://github.com/bhaveshpatil-ks"
                target="_blank"
                rel="noopener noreferrer"
                className="ct-card-main-row"
              >
                <div className="ct-icon-box ct-icon-sparse">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>

                <div className="ct-card-content">
                  <h3 className="ct-card-title">Connect on Sparse</h3>
                  <p className="ct-card-desc">{profile.sparseHandle || '@kaii'}</p>
                </div>

                <div className="ct-card-action">
                  <div className="ct-pin-badge" title="Sparse network profile">
                    <ArrowUpRight size={15} />
                  </div>
                </div>
              </a>
            </div>
          </ScrollReveal>

          {/* 4. Mail Bhavesh */}
          <ScrollReveal delay={0.2}>
            <div className="ct-hub-card">
              <div className="ct-card-main-row">
                <a
                  href={`mailto:${profile.email}`}
                  className="ct-card-link-inner"
                >
                  <div className="ct-icon-box ct-icon-mail">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 6l-10 7L2 6" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  <div className="ct-card-content">
                    <h3 className="ct-card-title">Mail Bhavesh</h3>
                    <p className="ct-card-desc">{profile.email}</p>
                  </div>
                </a>

                <div className="ct-card-action">
                  <button
                    className="ct-pin-badge"
                    type="button"
                    onClick={(e) => copyToClipboard(profile.email, 'Email address', 'email', e)}
                    title="Copy email to clipboard"
                    aria-label="Copy email address"
                  >
                    {copiedKey === 'email' ? <Check size={14} className="ct-icon-check" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* 5. GitHub Profile */}
          <ScrollReveal delay={0.25}>
            <div className="ct-hub-card">
              <a
                href={`https://github.com/${profile.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ct-card-main-row"
              >
                <div className="ct-icon-box ct-icon-github">
                  <Github size={20} />
                </div>

                <div className="ct-card-content">
                  <h3 className="ct-card-title">GitHub Profile</h3>
                  <p className="ct-card-desc">github.com/{profile.handle}</p>
                </div>

                <div className="ct-card-action">
                  <div className="ct-pin-badge" title="Open GitHub profile">
                    <ArrowUpRight size={15} />
                  </div>
                </div>
              </a>
            </div>
          </ScrollReveal>

          {/* 6. Download Resume */}
          <ScrollReveal delay={0.3}>
            <div className="ct-hub-card">
              <a
                href={profile.resume || "/assets/bhavesh-patil-resume.png"}
                target="_blank"
                rel="noopener noreferrer"
                download="Bhavesh-Patil-Resume.png"
                className="ct-card-main-row"
              >
                <div className="ct-icon-box ct-icon-resume">
                  <FileText size={20} />
                </div>

                <div className="ct-card-content">
                  <h3 className="ct-card-title">Download Resume</h3>
                  <p className="ct-card-desc">Download the professional Bhavesh Patil resume</p>
                </div>

                <div className="ct-card-action">
                  <div className="ct-pin-badge" title="Download Resume">
                    <ArrowUpRight size={15} />
                  </div>
                </div>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <style>{`
        .ct-page-wrapper {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 100px;
          background: #0a0a0a;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .ct-spacer {
          height: 20px;
        }

        .container-contact {
          width: 100%;
          max-width: 680px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ─── Header ─────────────────────────────────── */
        .ct-header {
          text-align: center;
          margin-bottom: 44px;
        }

        .contact-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 2px;
          color: #888888;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .badge-slash {
          color: #ff4d00;
          font-weight: 900;
        }

        .ct-main-title {
          font-family: var(--font-heading) !important;
          font-size: clamp(38px, 6.5vw, 62px) !important;
          font-weight: 900 !important;
          letter-spacing: -0.03em;
          color: #ffffff;
          line-height: 1.05;
          margin-bottom: 14px;
        }

        .ct-title-faded {
          color: #a1a1aa;
          font-weight: 800;
        }

        .ct-main-subtitle {
          font-size: 1.05rem;
          color: #a1a1aa;
          max-width: 540px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ─── Stack of Contact Cards ────────────────── */
        .ct-hub-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ct-hub-card {
          background: rgba(18, 18, 22, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          box-shadow: 8px 12px 35px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          position: relative;
        }

        .ct-hub-card:hover {
          border-color: #ff4d00;
          transform: translateY(-2.5px);
          box-shadow: 10px 16px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(255, 77, 0, 0.2);
        }

        .ct-hub-card.card-expanded {
          border-color: #ff4d00;
          background: rgba(18, 18, 22, 0.95);
          box-shadow: 10px 16px 45px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 77, 0, 0.25);
        }

        .ct-card-main-row {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 18px 24px;
          text-decoration: none;
          color: #ffffff;
          cursor: pointer;
          user-select: none;
        }

        .ct-card-link-inner {
          display: flex;
          align-items: center;
          gap: 18px;
          text-decoration: none;
          color: #ffffff;
          flex: 1;
        }

        /* ─── Icon Boxes ────────────────────────────── */
        .ct-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
        }

        .ct-icon-avatar {
          background: #18181b;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .ct-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .ct-avatar-fallback {
          position: absolute;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 800;
          color: #ffffff;
        }

        .ct-icon-whatsapp {
          background: rgba(37, 211, 102, 0.12);
          color: #25D366;
          border: 1px solid rgba(37, 211, 102, 0.3);
        }

        .ct-icon-sparse {
          background: rgba(255, 255, 255, 0.05);
          color: #ff4d00;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .ct-icon-mail {
          background: rgba(234, 67, 53, 0.12);
          color: #EA4335;
          border: 1px solid rgba(234, 67, 53, 0.3);
        }

        .ct-icon-github {
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .ct-icon-resume {
          background: rgba(59, 130, 246, 0.14);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        /* ─── Card Content ──────────────────────────── */
        .ct-card-content {
          flex: 1;
          min-width: 0;
        }

        .ct-card-title {
          font-family: var(--font-heading);
          font-size: 1.02rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.01em;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ct-card-desc {
          font-size: 0.84rem;
          color: #a1a1aa;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
        }

        /* ─── Pin Action Badge ───────────────────────── */
        .ct-card-action {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .ct-pin-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          color: #a1a1aa;
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .ct-hub-card:hover .ct-pin-badge {
          background: #ff4d00;
          color: #ffffff;
          border-color: #ff4d00;
          box-shadow: 0 0 16px rgba(255, 77, 0, 0.4);
          transform: scale(1.06);
        }

        .ct-pin-badge.active {
          background: #ff4d00;
          color: #ffffff;
          border-color: #ff4d00;
          box-shadow: 0 0 16px rgba(255, 77, 0, 0.4);
        }

        .ct-icon-check {
          color: #10b981;
        }

        /* ─── Embedded Contact Form ─────────────────── */
        .ct-embedded-form-wrapper {
          padding: 0 24px 24px 24px;
          animation: ctSlideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes ctSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ct-embedded-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin-bottom: 20px;
        }

        .ct-embedded-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ct-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .ct-form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ct-field-label {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #888888;
        }

        .ct-input,
        .ct-textarea {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          border-radius: 12px !important;
          padding: 12px 14px !important;
          font-size: 13px !important;
          color: #ffffff !important;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .ct-input:focus,
        .ct-textarea:focus {
          border-color: #ff4d00 !important;
          box-shadow: 0 0 0 3px rgba(255, 77, 0, 0.15) !important;
        }

        .ct-form-submit-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 4px;
        }

        .ct-btn-send {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px 22px;
          background: #ffffff;
          color: #09090b;
          border-radius: 9999px;
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          border: 1px solid #ffffff;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .ct-btn-send:hover:not(:disabled) {
          background: #ff4d00;
          color: #ffffff;
          border-color: #ff4d00;
          box-shadow: 0 0 18px rgba(255, 77, 0, 0.45);
          transform: translateY(-2px);
        }

        .ct-btn-send:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ct-loading-dots {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .ct-dot {
          width: 5px;
          height: 5px;
          background: #ffffff;
          border-radius: 50%;
          animation: ctBounce 0.8s ease-in-out infinite;
        }

        .ct-dot:nth-child(2) { animation-delay: 0.15s; }
        .ct-dot:nth-child(3) { animation-delay: 0.3s; }

        @keyframes ctBounce {
          0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
          40% { transform: scale(1.3); opacity: 1; }
        }

        /* ─── Responsive ────────────────────────────── */
        @media (max-width: 768px) {
          .container-contact { padding: 0 20px; }
          .ct-card-main-row { padding: 16px 20px; gap: 16px; }
          .ct-icon-box { width: 40px; height: 40px; }
          .ct-card-title { font-size: 0.98rem; }
          .ct-card-desc { font-size: 0.82rem; }
        }

        @media (max-width: 560px) {
          .container-contact { padding: 0 16px; }
          .ct-header { margin-bottom: 32px; }
          .ct-form-row { grid-template-columns: 1fr; gap: 12px; }
          .ct-card-main-row { padding: 14px 16px; gap: 12px; }
          .ct-icon-box { width: 38px; height: 38px; }
          .ct-card-title { font-size: 0.92rem; }
          .ct-card-desc { font-size: 0.78rem; word-break: break-all; }
          .ct-embedded-form-wrapper { padding: 0 16px 16px 16px; }
          .ct-btn-send { width: 100%; justify-content: center; }
          .ct-form-submit-row { width: 100%; }
        }

        @media (max-width: 380px) {
          .ct-card-main-row { padding: 12px 12px; gap: 10px; }
          .ct-icon-box { width: 34px; height: 34px; }
          .ct-pin-badge { width: 30px; height: 30px; }
          .contact-badge { font-size: 9.5px; }
          .ct-card-title { font-size: 0.88rem; }
          .ct-card-desc { font-size: 0.74rem; }
        }
      `}</style>
    </div>
  );
}


