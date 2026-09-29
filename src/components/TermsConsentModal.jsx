import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Check, 
  ArrowRight, 
  LogOut, 
  ExternalLink, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { portfolioData } from '../data/portfolioData';

export default function TermsConsentModal() {
  const { 
    currentUser, 
    termsModalOpen, 
    agreeUserTerms, 
    declineUserTerms 
  } = useAuth();

  const { profile } = portfolioData;

  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!currentUser || !termsModalOpen) {
    return null;
  }

  const handleAgreeAndContinue = async () => {
    if (!agreedTerms || !agreedPrivacy) {
      setError('Please check both boxes to confirm your agreement before continuing.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await agreeUserTerms();
    } catch (err) {
      setError('Failed to record agreement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    await declineUserTerms();
  };

  const userName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Member';

  return (
    <div className="terms-modal-overlay">
      <div className="terms-modal-box">
        {/* Header */}
        <div className="terms-modal-header">
          <div className="terms-modal-badge">
            <ShieldCheck size={14} className="text-orange" />
            <span>AUTHENTICATION SECURITY STEP</span>
          </div>

          <h2 className="terms-modal-title">
            Welcome, <span className="terms-user-name">{userName}</span>!
          </h2>

          <p className="terms-modal-subtitle">
            Before proceeding to your account, please review and accept our mutual security policies and zero-data exploitation pledge.
          </p>
        </div>

        {error && (
          <div className="terms-error-alert">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Highlight Guarantee Box */}
        <div className="terms-guarantee-card">
          <div className="guarantee-header-row">
            <div className="guarantee-icon-box">
              <EyeOff size={18} className="text-orange" />
            </div>
            <div>
              <h4 className="guarantee-title">Zero Data Selling & Security Pledge</h4>
              <p className="guarantee-desc">
                We guarantee <strong>100% data privacy</strong>. Your name, email, credentials, and messages will <strong>NEVER</strong> be sold, rented, monetized, or cross-tracked with third-party advertisers.
              </p>
            </div>
          </div>

          <div className="guarantee-pills-row">
            <span className="guarantee-pill">
              <CheckCircle2 size={12} className="text-green" /> 256-Bit TLS Encryption
            </span>
            <span className="guarantee-pill">
              <CheckCircle2 size={12} className="text-green" /> Strictly Non-Commercial
            </span>
            <span className="guarantee-pill">
              <CheckCircle2 size={12} className="text-green" /> Instant Data Deletion on Request
            </span>
          </div>
        </div>

        {/* Scrollable Summary of Rules */}
        <div className="terms-summary-scroll">
          <div className="summary-item">
            <h5 className="summary-item-title">
              <FileText size={14} className="text-orange" /> 1. Terms of Service Summary
            </h5>
            <p className="summary-item-text">
              You agree to use this portfolio and interactive features respectfully without attempting DDoS attacks, automated form spamming, or unauthorized penetration. Code showcases are intellectual property governed by open-source licenses.
            </p>
            <Link to="/terms" target="_blank" rel="noopener noreferrer" className="read-full-link">
              Read Full Terms & Conditions <ExternalLink size={11} />
            </Link>
          </div>

          <div className="summary-item">
            <h5 className="summary-item-title">
              <Lock size={14} className="text-green" /> 2. Privacy Policy Summary
            </h5>
            <p className="summary-item-text">
              Your login data (via Google or Email) is used strictly to identify your session for personal inquiries, leaderboard submissions, and support tickets. No marketing spam is ever sent.
            </p>
            <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="read-full-link">
              Read Full Privacy Policy <ExternalLink size={11} />
            </Link>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="terms-checkbox-group">
          <label className="terms-checkbox-label">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => {
                setAgreedTerms(e.target.checked);
                if (e.target.checked && agreedPrivacy) setError('');
              }}
              className="terms-checkbox-input"
            />
            <span className="terms-checkbox-custom">
              {agreedTerms && <Check size={12} />}
            </span>
            <span className="terms-label-text">
              I have read, understood, and agree to the{' '}
              <Link to="/terms" target="_blank" rel="noopener noreferrer" className="inline-link">
                Terms & Conditions
              </Link>.
            </span>
          </label>

          <label className="terms-checkbox-label">
            <input
              type="checkbox"
              checked={agreedPrivacy}
              onChange={(e) => {
                setAgreedPrivacy(e.target.checked);
                if (e.target.checked && agreedTerms) setError('');
              }}
              className="terms-checkbox-input"
            />
            <span className="terms-checkbox-custom">
              {agreedPrivacy && <Check size={12} />}
            </span>
            <span className="terms-label-text">
              I acknowledge the{' '}
              <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="inline-link">
                Privacy Policy
              </Link>{' '}
              and confirm understanding that my data is protected and never sold.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="terms-modal-actions">
          <button
            type="button"
            className={`btn-agree-continue ${agreedTerms && agreedPrivacy ? 'active' : 'disabled'}`}
            onClick={handleAgreeAndContinue}
            disabled={loading}
          >
            <span>{loading ? 'Recording Agreement...' : 'Agree & Continue'}</span>
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            className="btn-decline-logout"
            onClick={handleDecline}
            title="Decline and sign out"
          >
            <LogOut size={14} />
            <span>Decline & Sign Out</span>
          </button>
        </div>
      </div>

      <style>{`
        .terms-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.25s ease forwards;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        .terms-modal-box {
          position: relative;
          width: 100%;
          max-width: 520px;
          background: #0f0f13;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-top: 3px solid #ff4500;
          border-radius: 20px;
          padding: 30px 28px;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 69, 0, 0.2);
          color: #ffffff;
          max-height: 90vh;
          overflow-y: auto;
        }

        .terms-modal-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .terms-modal-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(255, 69, 0, 0.1);
          border: 1px solid rgba(255, 69, 0, 0.25);
          border-radius: 999px;
          font-family: var(--font-mono, monospace);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #ff4500;
          margin-bottom: 10px;
        }

        .terms-modal-title {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin: 0 0 6px 0;
        }

        .terms-user-name {
          color: #ff4500;
        }

        .terms-modal-subtitle {
          font-size: 13px;
          color: #a1a1aa;
          line-height: 1.5;
          margin: 0;
        }

        .terms-error-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 12px;
          margin-bottom: 16px;
        }

        /* Guarantee Box */
        .terms-guarantee-card {
          background: rgba(255, 69, 0, 0.05);
          border: 1px solid rgba(255, 69, 0, 0.22);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .guarantee-header-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .guarantee-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 69, 0, 0.12);
          border: 1px solid rgba(255, 69, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .guarantee-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 3px 0;
        }

        .guarantee-desc {
          font-size: 12px;
          line-height: 1.45;
          color: #d4d4d8;
          margin: 0;
        }

        .guarantee-pills-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 69, 0, 0.12);
        }

        .guarantee-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #a1a1aa;
          background: rgba(0, 0, 0, 0.3);
          padding: 3px 8px;
          border-radius: 6px;
        }

        .text-orange { color: #ff4500; }
        .text-green { color: #4ade80; }

        /* Summary Scroll */
        .terms-summary-scroll {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .summary-item-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .summary-item-text {
          font-size: 11.5px;
          line-height: 1.45;
          color: #a1a1aa;
          margin: 0 0 6px 0;
        }

        .read-full-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          color: #ff4500;
          text-decoration: none;
        }

        .read-full-link:hover {
          text-decoration: underline;
        }

        /* Checkboxes */
        .terms-checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 22px;
        }

        .terms-checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          user-select: none;
        }

        .terms-checkbox-input {
          display: none;
        }

        .terms-checkbox-custom {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          background: #18181c;
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
          margin-top: 1px;
          transition: all 0.2s ease;
        }

        .terms-checkbox-input:checked + .terms-checkbox-custom {
          background: #ff4500;
          border-color: #ff4500;
        }

        .terms-label-text {
          font-size: 12.5px;
          line-height: 1.45;
          color: #d4d4d8;
        }

        .inline-link {
          color: #ffffff;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .inline-link:hover {
          color: #ff4500;
        }

        /* Actions */
        .terms-modal-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-agree-continue {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 18px;
          background: #ff4500;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-family: var(--font-heading, sans-serif);
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(255, 69, 0, 0.35);
        }

        .btn-agree-continue.active:hover {
          background: #ff5722;
          transform: translateY(-1px);
        }

        .btn-agree-continue.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-decline-logout {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #a1a1aa;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-decline-logout:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        @media (max-width: 480px) {
          .terms-modal-box {
            padding: 22px 18px;
          }

          .terms-modal-actions {
            flex-direction: column;
          }

          .btn-agree-continue, .btn-decline-logout {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
