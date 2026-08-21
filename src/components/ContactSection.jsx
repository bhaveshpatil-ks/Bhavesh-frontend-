import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { toast } from './ui/toast';

export default function ContactSection() {
  const { profile } = portfolioData;
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    // Simulate async send
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);

    toast({
      title: 'Message Sent!',
      description: "Thanks for reaching out — I'll get back to you shortly.",
      variant: 'default',
      duration: 5000,
    });

    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="north-contact-section">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="section-header-editorial">
          <span className="section-index-badge">07 / ENGAGEMENT & CONTACT</span>
          <h2 className="section-title-editorial">Let's Build Together</h2>
          <p className="section-subtitle-editorial">
            Have a project in mind, want to collaborate on architecture, or discuss full-stack & AI roles? Send a message below.
          </p>
        </div>

        <div className="north-contact-card">
          <div className="card-corner-motif" />

          <div className="contact-card-grid">
            <div className="contact-info-col">
              <span className="contact-sub-index">01 / DIRECT CONTACT</span>
              <h3 className="contact-col-title">Get In Touch</h3>
              <p className="contact-col-desc">
                Open for freelance projects, full-stack development, distributed system design, and AI integrations.
              </p>

              <div className="contact-link-list">
                <a href={`mailto:${profile.email}`} className="contact-editorial-link">
                  <div className="link-label">EMAIL</div>
                  <div className="link-value">{profile.email}</div>
                </a>

                <a
                  href="https://github.com/bhaveshpatil-ks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-editorial-link"
                >
                  <div className="link-label">GITHUB PROFILE</div>
                  <div className="link-value">github.com/{profile.handle}</div>
                </a>
              </div>
            </div>

            <form className="contact-form-col" onSubmit={handleSubmit}>
              <div className="form-group">
                <Label htmlFor="name" className="shadcn-label">YOUR NAME</Label>
                <Input
                  type="text"
                  id="name"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <Label htmlFor="email" className="shadcn-label">YOUR EMAIL</Label>
                <Input
                  type="email"
                  id="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <Label htmlFor="message" className="shadcn-label">PROJECT DETAILS / MESSAGE</Label>
                <Textarea
                  id="message"
                  required
                  rows={4}
                  placeholder="Tell me about your project scope, timeline, or inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button type="submit" className="contact-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="loading-dot" />
                    <span className="loading-dot" />
                    <span className="loading-dot" />
                  </span>
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <ArrowUpRight size={16} />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .north-contact-section {
          padding: 100px 0;
          border-bottom: 1px solid var(--card-border);
        }

        .north-contact-card {
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-card);
          padding: 50px;
        }

        .contact-card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
        }

        .contact-sub-index {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #ff4500;
          display: block;
          margin-bottom: 14px;
        }

        .contact-col-title {
          font-family: var(--font-heading);
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--text-bold);
          margin-bottom: 16px;
        }

        .contact-col-desc {
          font-size: 14px;
          line-height: 1.65;
          color: var(--text-secondary);
          margin-bottom: 32px;
        }

        .contact-link-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-editorial-link {
          display: block;
          padding: 16px 20px;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-inner);
          text-decoration: none;
          transition: border-color 0.2s, transform 0.2s;
        }

        .contact-editorial-link:hover {
          border-color: #ff4500;
          transform: translateY(-2px);
        }

        .link-label {
          font-family: var(--font-heading);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .link-value {
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 800;
          color: var(--text-bold);
        }

        /* ─── Form ─────────────────────────────────── */
        .contact-form-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Shadcn-style inputs */
        .shadcn-input,
        .shadcn-textarea {
          width: 100%;
          padding: 13px 16px;
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          resize: none;
        }

        [data-theme='dark'] .shadcn-input,
        [data-theme='dark'] .shadcn-textarea {
          background: rgba(255, 255, 255, 0.04);
        }

        .shadcn-input:focus,
        .shadcn-textarea:focus {
          border-color: #ff4500;
          box-shadow: 0 0 0 3px rgba(255, 69, 0, 0.12);
        }

        .shadcn-label {
          font-family: var(--font-heading);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: var(--text-bold);
        }

        /* Submit button */
        .contact-submit-btn {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 28px !important;
          background: #09090b !important;
          color: #ffffff !important;
          border-radius: 9999px !important;
          font-family: var(--font-heading) !important;
          font-size: 12px !important;
          font-weight: 800 !important;
          letter-spacing: 0.1em !important;
          border: none !important;
          cursor: pointer;
          transition: transform 0.2s, background-color 0.2s !important;
          margin-top: 8px;
          width: fit-content;
        }

        .contact-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          background: #27272a !important;
        }

        .contact-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* Loading dots */
        .btn-loading {
          display: flex;
          gap: 5px;
          align-items: center;
        }

        .loading-dot {
          width: 6px;
          height: 6px;
          background: #ffffff;
          border-radius: 50%;
          animation: loadBounce 0.8s ease-in-out infinite;
        }

        .loading-dot:nth-child(2) { animation-delay: 0.15s; }
        .loading-dot:nth-child(3) { animation-delay: 0.3s; }

        @keyframes loadBounce {
          0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
          40% { transform: scale(1.3); opacity: 1; }
        }

        @media (max-width: 900px) {
          .north-contact-card { padding: 28px; }
          .contact-card-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
        }
      `}</style>
    </section>
  );
}
