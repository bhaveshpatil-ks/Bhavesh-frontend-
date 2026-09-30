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
  Sparkles,
  Zap,
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TermsConsentModal() {
  const { 
    currentUser, 
    termsModalOpen, 
    agreeUserTerms, 
    declineUserTerms 
  } = useAuth();

  const [agreedTerms, setAgreedTerms] = useState(true);
  const [agreedPrivacy, setAgreedPrivacy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!currentUser || !termsModalOpen) {
    return null;
  }

  const handleAgreeAndContinue = async () => {
    if (!agreedTerms || !agreedPrivacy) {
      setError('Please accept both terms and privacy protocols to proceed.');
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

  const handleQuickAcceptAll = async () => {
    setAgreedTerms(true);
    setAgreedPrivacy(true);
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

  const userName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Explorer';
  const allAgreed = agreedTerms && agreedPrivacy;

  return (
    <div className="terms-ai-overlay">
      <div className="terms-ai-card">
        {/* Top glowing ambient gradient */}
        <div className="terms-ai-glow" />

        {/* Header with AI badge */}
        <div className="terms-ai-header">
          <div className="terms-ai-badge">
            <span className="ai-pulse-dot" />
            <Sparkles size={12} className="text-orange" />
            <span>AI AUTHENTICATION PROTOCOL // v2.4</span>
          </div>

          <h2 className="terms-ai-title">
            Welcome, <span className="terms-user-highlight">{userName}</span>
          </h2>

          <p className="terms-ai-subtitle">
            Please verify security compliance and our zero-data exploitation pledge to access your session.
          </p>
        </div>

        {error && (
          <div className="terms-ai-alert">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* AI Security Matrix Box */}
        <div className="terms-ai-matrix">
          <div className="matrix-row">
            <div className="matrix-icon">
              <EyeOff size={15} />
            </div>
            <div className="matrix-content">
              <div className="matrix-title">
                Zero Data Selling Pledge
                <span className="matrix-tag">100% Private</span>
              </div>
              <p className="matrix-text">
                Your data is never sold, tracked, or monetized. Strictly non-commercial and encrypted with 256-bit TLS.
              </p>
            </div>
          </div>

          <div className="matrix-divider" />

          <div className="matrix-row">
            <div className="matrix-icon">
              <Lock size={15} />
            </div>
            <div className="matrix-content">
              <div className="matrix-title">
                Terms of Respectful Use
                <span className="matrix-tag green">Protected</span>
              </div>
              <p className="matrix-text">
                Safe interactive features, developer open-source attribution, and instant data deletion on request.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Checkbox Items (Clickable entire rows) */}
        <div className="terms-ai-checks">
          <div 
            className={`check-item-row ${agreedTerms ? 'checked' : ''}`}
            onClick={() => {
              setAgreedTerms(!agreedTerms);
              if (!agreedTerms && agreedPrivacy) setError('');
            }}
          >
            <div className={`cyber-checkbox ${agreedTerms ? 'active' : ''}`}>
              {agreedTerms && <Check size={12} strokeWidth={3} />}
            </div>
            <div className="check-text">
              I agree to the{' '}
              <Link 
                to="/terms" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="terms-link"
                onClick={(e) => e.stopPropagation()}
              >
                Terms & Conditions <ExternalLink size={10} />
              </Link>
            </div>
          </div>

          <div 
            className={`check-item-row ${agreedPrivacy ? 'checked' : ''}`}
            onClick={() => {
              setAgreedPrivacy(!agreedPrivacy);
              if (agreedTerms && !agreedPrivacy) setError('');
            }}
          >
            <div className={`cyber-checkbox ${agreedPrivacy ? 'active' : ''}`}>
              {agreedPrivacy && <Check size={12} strokeWidth={3} />}
            </div>
            <div className="check-text">
              I accept the{' '}
              <Link 
                to="/privacy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="terms-link"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy <ExternalLink size={10} />
              </Link>{' '}
              (Zero-Selling Guarantee)
            </div>
          </div>
        </div>

        {/* Action Controls - Prominent & Sticky */}
        <div className="terms-ai-actions">
          <button
            type="button"
            className={`btn-ai-agree ${allAgreed ? 'glow' : 'dim'}`}
            onClick={allAgreed ? handleAgreeAndContinue : handleQuickAcceptAll}
            disabled={loading}
          >
            <Zap size={15} className="btn-icon" />
            <span>{loading ? 'Initializing Session...' : (allAgreed ? 'Agree & Launch Session' : 'Accept All & Launch')}</span>
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            className="btn-ai-decline"
            onClick={handleDecline}
            title="Decline agreement and sign out"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <style>{`
        .terms-ai-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 5, 8, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: termsFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          font-family: var(--font-body, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
        }

        @keyframes termsFadeIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .terms-ai-card {
          position: relative;
          width: 100%;
          max-width: 480px;
          background: #0d0d12;
          border: 1px solid rgba(255, 77, 0, 0.22);
          border-radius: 20px;
          padding: 24px 24px 20px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.9),
            0 0 40px rgba(255, 69, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          color: #ffffff;
          overflow: hidden;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
        }

        .terms-ai-glow {
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ff4500, #ff7b00, transparent);
          box-shadow: 0 0 14px rgba(255, 69, 0, 0.8);
        }

        /* Header */
        .terms-ai-header {
          text-align: center;
          margin-bottom: 16px;
        }

        .terms-ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          background: rgba(255, 69, 0, 0.08);
          border: 1px solid rgba(255, 69, 0, 0.25);
          border-radius: 999px;
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #ff5722;
          margin-bottom: 8px;
        }

        .ai-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
          animation: pulseDot 2s infinite;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .terms-ai-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .terms-user-highlight {
          color: #ff5722;
          text-shadow: 0 0 12px rgba(255, 69, 0, 0.35);
        }

        .terms-ai-subtitle {
          font-size: 12px;
          color: #a1a1aa;
          line-height: 1.4;
          margin: 0;
        }

        .terms-ai-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 11.5px;
          margin-bottom: 12px;
        }

        /* Matrix Box */
        .terms-ai-matrix {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .matrix-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .matrix-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255, 69, 0, 0.1);
          border: 1px solid rgba(255, 69, 0, 0.25);
          color: #ff5722;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .matrix-content {
          flex: 1;
        }

        .matrix-title {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 2px;
        }

        .matrix-tag {
          font-family: var(--font-mono, monospace);
          font-size: 9.5px;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: 4px;
          background: rgba(255, 69, 0, 0.15);
          color: #ff7b00;
          border: 1px solid rgba(255, 69, 0, 0.25);
        }

        .matrix-tag.green {
          background: rgba(74, 222, 128, 0.1);
          color: #4ade80;
          border-color: rgba(74, 222, 128, 0.25);
        }

        .matrix-text {
          font-size: 11px;
          color: #9ca3af;
          line-height: 1.35;
          margin: 0;
        }

        .matrix-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
        }

        /* Checkboxes */
        .terms-ai-checks {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 18px;
        }

        .check-item-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.07);
          cursor: pointer;
          transition: all 0.18s ease;
          user-select: none;
        }

        .check-item-row:hover {
          background: rgba(255, 255, 255, 0.045);
          border-color: rgba(255, 69, 0, 0.3);
        }

        .check-item-row.checked {
          background: rgba(255, 69, 0, 0.05);
          border-color: rgba(255, 69, 0, 0.25);
        }

        .cyber-checkbox {
          width: 17px;
          height: 17px;
          border-radius: 4px;
          background: #141419;
          border: 1.5px solid rgba(255, 255, 255, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .cyber-checkbox.active {
          background: #ff4500;
          border-color: #ff4500;
          box-shadow: 0 0 8px rgba(255, 69, 0, 0.5);
        }

        .check-text {
          font-size: 11.5px;
          color: #d1d5db;
          line-height: 1.35;
        }

        .terms-link {
          color: #ffffff;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }

        .terms-link:hover {
          color: #ff4500;
        }

        /* Actions */
        .terms-ai-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: auto;
        }

        .btn-ai-agree {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 11px 16px;
          background: linear-gradient(135deg, #ff4500 0%, #ff5722 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-family: var(--font-heading, sans-serif);
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 18px rgba(255, 69, 0, 0.35);
        }

        .btn-ai-agree.glow {
          box-shadow: 0 0 20px rgba(255, 69, 0, 0.55), 0 4px 12px rgba(255, 69, 0, 0.3);
        }

        .btn-ai-agree:hover {
          background: linear-gradient(135deg, #ff5722 0%, #ff6b3d 100%);
          transform: translateY(-1px);
        }

        .btn-ai-agree.dim {
          background: #ff5722;
          opacity: 0.9;
        }

        .btn-icon {
          color: #ffd700;
        }

        .btn-ai-decline {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 11px 13px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          color: #9ca3af;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn-ai-decline:hover {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .text-orange { color: #ff5722; }

        @media (max-width: 480px) {
          .terms-ai-card {
            padding: 20px 16px 16px;
          }

          .terms-ai-actions {
            flex-direction: column;
          }

          .btn-ai-agree, .btn-ai-decline {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
