import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { 
    authModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    closeAuthModal, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    sendResetEmail 
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authModalMode === 'signin') {
        await signInWithEmail(email.trim(), password);
      } else if (authModalMode === 'signup') {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        await signUpWithEmail(name.trim(), email.trim(), password);
      } else if (authModalMode === 'reset') {
        await sendResetEmail(email.trim());
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Google sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={closeAuthModal}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button type="button" className="auth-close-btn" onClick={closeAuthModal} aria-label="Close">
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-badge-pill">
            <span>SECURE FIREBASE AUTH</span>
          </div>
          <h2 className="auth-modal-title">
            {authModalMode === 'signin' && 'Sign in to Account'}
            {authModalMode === 'signup' && 'Create Your Account'}
            {authModalMode === 'reset' && 'Reset Password'}
          </h2>
          <p className="auth-modal-subtitle">
            {authModalMode === 'signin' && 'Access your inquiry tickets, leaderboard status, and portfolio features'}
            {authModalMode === 'signup' && 'Join the platform to submit inquiries, get notified, and contribute'}
            {authModalMode === 'reset' && 'Enter your registered email address to receive a recovery link'}
          </p>
        </div>

        {error && (
          <div className="auth-error-box">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Google 1-Click Button (for signin & signup) */}
        {authModalMode !== 'reset' && (
          <div className="google-auth-section">
            <button 
              type="button" 
              className="google-signin-btn"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="auth-divider-line">
              <span>or continue with email</span>
            </div>
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="auth-form-body">
          {authModalMode === 'signup' && (
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-container">
                <User size={15} className="auth-field-icon" />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-container">
              <Mail size={15} className="auth-field-icon" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {authModalMode !== 'reset' && (
            <div className="auth-field">
              <div className="label-with-link">
                <label className="auth-label">Password</label>
                {authModalMode === 'signin' && (
                  <button 
                    type="button" 
                    className="forgot-link"
                    onClick={() => { setError(''); setAuthModalMode('reset'); }}
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="auth-input-container">
                <Lock size={15} className="auth-field-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={authModalMode === 'signin' ? 'current-password' : 'new-password'}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="auth-main-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw size={15} className="spin-icon" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {authModalMode === 'signin' && 'Sign In'}
                  {authModalMode === 'signup' && 'Create Account'}
                  {authModalMode === 'reset' && 'Send Reset Link'}
                </span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Footer Mode Switcher */}
        <div className="auth-modal-footer">
          {authModalMode === 'signin' && (
            <p>
              Don't have an account yet?{' '}
              <button 
                type="button" 
                className="mode-switch-btn"
                onClick={() => { setError(''); setAuthModalMode('signup'); }}
              >
                Create one now
              </button>
            </p>
          )}

          {authModalMode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button 
                type="button" 
                className="mode-switch-btn"
                onClick={() => { setError(''); setAuthModalMode('signin'); }}
              >
                Sign in
              </button>
            </p>
          )}

          {authModalMode === 'reset' && (
            <p>
              Remember your password?{' '}
              <button 
                type="button" 
                className="mode-switch-btn"
                onClick={() => { setError(''); setAuthModalMode('signin'); }}
              >
                Back to sign in
              </button>
            </p>
          )}
        </div>
      </div>

      <style>{`
        .auth-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          z-index: 5000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .auth-modal-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 36px 32px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8);
          color: #ffffff;
        }

        .auth-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #18181c;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #a1a1aa;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .auth-close-btn:hover {
          color: #ffffff;
          background: #222228;
        }

        .auth-modal-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .auth-badge-pill {
          display: inline-block;
          padding: 4px 12px;
          background: #18181c;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #ff4d00;
          margin-bottom: 12px;
        }

        .auth-modal-title {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .auth-modal-subtitle {
          font-size: 13px;
          color: #a1a1aa;
          line-height: 1.5;
        }

        .auth-error-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 12px;
          margin-bottom: 18px;
        }

        .google-auth-section {
          margin-bottom: 20px;
        }

        .google-signin-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 18px;
          background: #18181c;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          color: #ffffff;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .google-signin-btn:hover:not(:disabled) {
          background: #222228;
          border-color: rgba(255, 255, 255, 0.25);
        }

        .auth-divider-line {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 18px 0 6px 0;
          color: #52525b;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .auth-divider-line::before,
        .auth-divider-line::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .auth-divider-line span {
          padding: 0 10px;
        }

        .auth-form-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .label-with-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .auth-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #a1a1aa;
        }

        .forgot-link {
          background: transparent;
          border: none;
          color: #ff4d00;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .auth-input-container {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 10px 14px;
          transition: border-color 0.2s ease;
        }

        .auth-input-container:focus-within {
          border-color: #ff4d00;
        }

        .auth-field-icon {
          color: #71717a;
          flex-shrink: 0;
        }

        .auth-input-container input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 14px;
        }

        .auth-main-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 13px;
          background: #ff4d00;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: opacity 0.2s ease, transform 0.1s ease;
          margin-top: 6px;
        }

        .auth-main-submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .auth-main-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-modal-footer {
          text-align: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 13px;
          color: #71717a;
        }

        .mode-switch-btn {
          background: transparent;
          border: none;
          color: #ff4d00;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }

        .mode-switch-btn:hover {
          text-decoration: underline;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
