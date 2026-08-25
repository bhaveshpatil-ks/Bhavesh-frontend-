import React, { useState, useEffect, useRef } from 'react';
import { 
  Coffee, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Copy, 
  ArrowRight, 
  Upload, 
  QrCode, 
  HelpCircle, 
  Trophy, 
  User, 
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Maximize2,
  ZoomIn,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitCoffeeSupport, fetchPublicLeaderboard } from '../lib/api';
import { toast } from '../components/ui/toast';
import { portfolioData } from '../data/portfolioData';

const PRESET_TIERS = [
  {
    id: 'single',
    cups: 1,
    amount: 20,
    title: 'Single Cup',
    tag: 'SINGLE CUP',
    subtitle: 'A small thank-you for the work',
    popular: false,
    icon: '☕'
  },
  {
    id: 'double',
    cups: 2,
    amount: 50,
    title: 'Double Brew',
    tag: 'POPULAR',
    subtitle: 'Fuel for a solid coding session',
    popular: true,
    icon: '☕☕'
  },
  {
    id: 'pack',
    cups: 5,
    amount: 150,
    title: 'Coffee Pack',
    tag: 'SUPPORTER',
    subtitle: 'Supercharges open-source builds',
    popular: false,
    icon: '☕☕☕'
  },
  {
    id: 'roast',
    cups: 10,
    amount: 500,
    title: 'Artisan Roast',
    tag: 'PATRON',
    subtitle: 'Sponsors major server & infra costs',
    popular: false,
    icon: '🚀'
  }
];

const UPI_ID = 'bhaveshpatil4251@okaxis';

export default function BuyMeCoffeePage() {
  const { currentUser, openAuthModal } = useAuth();
  const { profile } = portfolioData;

  const [selectedTier, setSelectedTier] = useState('single');
  const [customAmount, setCustomAmount] = useState(20);
  const [supporterName, setSupporterName] = useState('');
  const [supporterMessage, setSupporterMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  // Files
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState('');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');

  // UI States
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Leaderboard
  const [supporters, setSupporters] = useState([]);
  const [loadingSupporters, setLoadingSupporters] = useState(true);

  // Auto-fill logged in user
  useEffect(() => {
    if (currentUser) {
      setSupporterName(currentUser.displayName || currentUser.email?.split('@')[0] || '');
      if (currentUser.photoURL && !profilePhotoPreview) {
        setProfilePhotoPreview(currentUser.photoURL);
      }
    }
  }, [currentUser]);

  // Load public supporters leaderboard
  useEffect(() => {
    fetchPublicLeaderboard(15)
      .then((data) => {
        setSupporters(data);
      })
      .catch(() => {})
      .finally(() => setLoadingSupporters(false));
  }, [submittedSuccess]);

  const activeAmount = selectedTier === 'custom' 
    ? Number(customAmount) || 20 
    : PRESET_TIERS.find(t => t.id === selectedTier)?.amount || 20;

  const handleSelectTier = (tierId, amount) => {
    setSelectedTier(tierId);
    setCustomAmount(amount);
  };

  const handleCustomAmountChange = (val) => {
    setSelectedTier('custom');
    const num = Math.max(20, Math.min(10000, Number(val) || 0));
    setCustomAmount(num);
  };

  const handleProofChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Screenshot must be under 5MB', variant: 'destructive' });
        return;
      }
      setPaymentProofFile(file);
      setPaymentProofPreview(URL.createObjectURL(file));
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Photo must be under 5MB', variant: 'destructive' });
        return;
      }
      setProfilePhotoFile(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    toast({ title: 'UPI ID Copied', description: `${UPI_ID} copied to clipboard.` });
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Static Asset QR + UPI URI for mobile intents
  const upiUri = `upi://pay?pa=${UPI_ID}&pn=Bhavesh+Patil&am=${activeAmount}&cu=INR&tn=Buy+Bhavesh+a+Coffee`;
  const qrUrl = '/assets/qr.png';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supporterName.trim()) {
      toast({ title: 'Missing Name', description: 'Please enter your name or handle.', variant: 'destructive' });
      return;
    }

    if (!paymentProofFile) {
      toast({ title: 'Missing Payment Proof', description: 'Please attach a screenshot of your payment.', variant: 'destructive' });
      return;
    }

    // Default profile photo fallback if user didn't upload one
    let photoBlob = profilePhotoFile;
    if (!photoBlob) {
      try {
        const fallbackSrc = currentUser?.photoURL || '/assets/bhavesh-profile.png';
        const res = await fetch(fallbackSrc);
        const blob = await res.blob();
        photoBlob = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      } catch {
        // Create canvas 1x1 fallback
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ff4d00';
        ctx.fillRect(0, 0, 100, 100);
        const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg'));
        photoBlob = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      }
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', supporterName.trim());
      formData.append('amount', String(activeAmount));
      formData.append('message', supporterMessage.trim() || 'Bought a coffee for Bhavesh!');
      if (transactionId.trim()) formData.append('transactionId', transactionId.trim().replace(/\D/g, ''));
      formData.append('paymentProof', paymentProofFile);
      formData.append('profilePhoto', photoBlob);

      await submitCoffeeSupport(formData);

      setSubmittedSuccess(true);
      toast({
        title: 'Thank you for your support! ☕',
        description: 'Your contribution has been received. Once verified, you will appear on the live leaderboard!',
        variant: 'default'
      });
    } catch (err) {
      console.error('Support submission error:', err);
      toast({
        title: 'Submission Failed',
        description: err.message || 'Could not submit support entry. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="coffee-page-root">
      <div className="container coffee-layout-container">
        {/* Top Hero Section */}
        <header className="coffee-hero-section">
          <div className="coffee-avatar-ring">
            <img 
              src="/assets/bhavesh-profile.png" 
              alt="Bhavesh Patil" 
              className="coffee-avatar-img"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';
              }}
            />
            <div className="coffee-cup-badge">
              <Coffee size={14} color="#ffffff" />
            </div>
          </div>

          <h1 className="coffee-hero-title">
            Buy Bhavesh a <span className="highlight-text">Coffee</span>
          </h1>

          <p className="coffee-hero-subtitle">
            If you find my work, open-source builds, or architecture useful, consider supporting. 
            Your contribution keeps me shipping clean, production-ready software.
          </p>
        </header>

        {/* Main Grid: Support Configurator & Checkout Summary */}
        <div className="coffee-cards-grid">
          {/* Left Column: Support Type & Details Form */}
          <div className="support-config-card">
            <h2 className="card-section-title">Choose Support Amount</h2>

            {/* Tiers Grid */}
            <div className="tiers-grid">
              {PRESET_TIERS.map((tier) => {
                const isSelected = selectedTier === tier.id;
                return (
                  <div 
                    key={tier.id}
                    className={`tier-card ${isSelected ? 'tier-selected' : ''}`}
                    onClick={() => handleSelectTier(tier.id, tier.amount)}
                  >
                    <div className="tier-top-row">
                      <span className="tier-icon">{tier.icon}</span>
                      <span className={`tier-tag ${tier.popular ? 'tag-popular' : ''}`}>
                        {tier.tag}
                      </span>
                    </div>

                    <div className="tier-content">
                      <p className="tier-sub">{tier.subtitle}</p>
                      <div className="tier-price-row">
                        <span className="tier-symbol">₹</span>
                        <span className="tier-val">{tier.amount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Amount Bar */}
            <div className="custom-amount-box">
              <label className="field-label">Custom Coffee Amount</label>
              <div className="custom-input-wrap">
                <span className="currency-prefix">₹</span>
                <input
                  type="number"
                  min="20"
                  max="10000"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="custom-amount-input"
                  placeholder="Enter amount"
                />
              </div>
              <div className="quick-chips-row">
                {[50, 100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className={`chip-btn ${activeAmount === amt ? 'chip-active' : ''}`}
                    onClick={() => handleCustomAmountChange(amt)}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>
              <span className="amount-range-hint">Minimum ₹20 and maximum ₹10,000</span>
            </div>

            {/* Supporter Details Form */}
            <form onSubmit={handleSubmit} className="supporter-details-form">
              <h3 className="form-sub-title">Personalize Your Support</h3>

              <div className="form-field">
                <label className="field-label">Your Name / Handle</label>
                <div className="input-icon-wrap">
                  <User size={15} color="#71717a" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe or @handle"
                    value={supporterName}
                    onChange={(e) => setSupporterName(e.target.value)}
                    className="coffee-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Say something nice (Optional message)</label>
                <div className="input-icon-wrap textarea-wrap">
                  <MessageSquare size={15} color="#71717a" className="textarea-icon" />
                  <textarea
                    rows={3}
                    placeholder="Leave a friendly message, project shoutout, or advice..."
                    value={supporterMessage}
                    onChange={(e) => setSupporterMessage(e.target.value)}
                    className="coffee-textarea"
                  />
                </div>
              </div>

              {/* Upload Proof & Profile Photo */}
              <div className="upload-fields-grid">
                {/* 1. Payment Screenshot */}
                <div className="upload-box">
                  <label className="field-label">Payment Screenshot <span className="req-star">*</span></label>
                  <label className="upload-dropzone">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleProofChange} 
                      className="hidden-file-input"
                    />
                    {paymentProofPreview ? (
                      <div className="preview-container">
                        <img src={paymentProofPreview} alt="Proof" className="uploaded-thumb" />
                        <span className="change-photo-text">Change Screenshot</span>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <Upload size={18} color="#ff4d00" />
                        <span>Upload UPI Screenshot</span>
                        <span className="upload-hint">PNG, JPG up to 5MB</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* 2. Profile Avatar (Optional) */}
                <div className="upload-box">
                  <label className="field-label">Profile Photo (Optional)</label>
                  <label className="upload-dropzone">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleProfilePhotoChange} 
                      className="hidden-file-input"
                    />
                    {profilePhotoPreview ? (
                      <div className="preview-container">
                        <img src={profilePhotoPreview} alt="Avatar" className="uploaded-avatar-thumb" />
                        <span className="change-photo-text">Change Avatar</span>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <User size={18} color="#a1a1aa" />
                        <span>Upload Your Photo</span>
                        <span className="upload-hint">Featured on Leaderboard</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Transaction ID Optional */}
              <div className="form-field">
                <label className="field-label">UPI Reference / UTR Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 439201948291"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="coffee-input"
                />
              </div>

              {/* Submit CTA for mobile */}
              <div className="submit-form-row">
                <button type="submit" className="complete-support-btn" disabled={submitting}>
                  {submitting ? (
                    <>
                      <RefreshCw size={16} className="spin-icon" />
                      <span>Verifying & Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Coffee size={16} />
                      <span>Confirm Support (₹{activeAmount})</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Checkout Summary & Direct Payment Box */}
          <div className="checkout-summary-card">
            {/* Total Summary Header */}
            <div className="summary-header-row">
              <div>
                <span className="summary-label">Total Contribution</span>
                <span className="summary-sub">One-time supporter payment</span>
              </div>
              <div className="total-amount-display">
                <span className="total-symbol">₹</span>
                <span className="total-num">{activeAmount}</span>
              </div>
            </div>

            {/* UPI QR Code Preview Box */}
            <div className="upi-qr-card">
              <div className="upi-qr-head">
                <div className="qr-badge">
                  <QrCode size={16} color="#ff4d00" />
                  <span>Scan to Pay (Any UPI App)</span>
                </div>
                <span className="instant-badge">Instant Verification</span>
              </div>

              <div className="qr-image-container clickable-qr" onClick={() => setShowQrModal(true)} role="button" tabIndex={0} title="Click to enlarge QR code">
                <img src={qrUrl} alt="UPI QR Code" className="upi-qr-img" />
                <div className="qr-expand-overlay">
                  <Maximize2 size={16} />
                  <span>Click to Enlarge</span>
                </div>
              </div>

              <div className="upi-id-pill">
                <div className="upi-text-group">
                  <span className="upi-label">UPI ID:</span>
                  <span className="upi-id-val">{UPI_ID}</span>
                </div>
                <button type="button" className="copy-upi-btn" onClick={copyUpi}>
                  {copiedUpi ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Direct UPI Intent Link (Mobile) */}
              <a 
                href={upiUri} 
                className="open-upi-app-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Pay via PhonePe / GPay / Paytm</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* How to support Accordion Button */}
            <div className="how-to-accordion">
              <button 
                type="button" 
                className="how-to-toggle"
                onClick={() => setShowHowToModal(!showHowToModal)}
              >
                <div className="how-to-left">
                  <HelpCircle size={16} color="#ff4d00" />
                  <span>How to complete your support?</span>
                </div>
                <ChevronDown size={16} className={showHowToModal ? 'rotate-180' : ''} />
              </button>

              {showHowToModal && (
                <div className="how-to-content">
                  <ol className="steps-list">
                    <li>Scan the <strong>UPI QR Code</strong> with GPay, PhonePe, Paytm, or BHIM.</li>
                    <li>Pay <strong>₹{activeAmount}</strong> directly to <code>{UPI_ID}</code>.</li>
                    <li>Take a screenshot of the successful payment receipt.</li>
                    <li>Attach the screenshot in the form on the left and click <strong>Confirm Support</strong>.</li>
                    <li>Once confirmed, your contribution will be featured on the Live Leaderboard!</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Security Guarantee Box */}
            <div className="security-guarantee-box">
              <ShieldCheck size={18} color="#22c55e" />
              <div>
                <strong>100% Direct & Transparent</strong>
                <p>Funds go directly towards servers, open-source tooling, and independent developer projects.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Supporters Leaderboard Wall */}
        <section className="supporters-wall-section">
          <div className="wall-header">
            <div className="wall-badge">
              <Trophy size={16} color="#f59e0b" />
              <span>WALL OF SUPPORTERS</span>
            </div>
            <h2 className="wall-title">Recent Contributors & Patrons</h2>
            <p className="wall-sub">Special thanks to everyone fueling independent engineering and code shipping.</p>
          </div>

          {loadingSupporters ? (
            <div className="supporters-loading">
              <RefreshCw size={24} className="spin-icon" color="#ff4d00" />
              <p>Loading contributors...</p>
            </div>
          ) : supporters.length === 0 ? (
            <div className="supporters-empty">
              <Coffee size={36} color="#71717a" />
              <h3>Be the First Supporter!</h3>
              <p>Buy a coffee above to get featured permanently on the Wall of Supporters.</p>
            </div>
          ) : (
            <div className="supporters-grid">
              {supporters.map((s, idx) => (
                <div key={s.id || idx} className="supporter-card">
                  <div className="supporter-card-top">
                    <div className="supporter-avatar-wrap">
                      <img 
                        src={s.profilePhotoUrl || '/assets/bhavesh-profile.png'} 
                        alt={s.name}
                        className="supporter-avatar"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';
                        }}
                      />
                      {idx < 3 && <span className="rank-badge">#{idx + 1}</span>}
                    </div>

                    <div className="supporter-info">
                      <h4 className="supporter-name">{s.name}</h4>
                      <span className="supporter-amount">₹{s.amount} • Supporter</span>
                    </div>
                  </div>

                  {s.message && (
                    <p className="supporter-quote">"{s.message}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Fullscreen Expandable QR Lightbox Modal */}
        {showQrModal && (
          <div className="qr-modal-backdrop" onClick={() => setShowQrModal(false)}>
            <div className="qr-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="qr-modal-header">
                <div className="qr-modal-header-meta">
                  <div className="qr-modal-badge">
                    <QrCode size={20} color="#ff4d00" />
                  </div>
                  <div>
                    <h3 className="qr-modal-title">Scan to Pay with Any UPI App</h3>
                    <p className="qr-modal-sub">Amount: <strong style={{ color: '#f59e0b' }}>₹{activeAmount}</strong> • GPay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="close-qr-modal-btn"
                  onClick={() => setShowQrModal(false)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="qr-modal-image-wrap">
                <img src="/assets/qr.png" alt="Large UPI QR Code" className="qr-modal-img" />
              </div>

              <div className="qr-modal-footer">
                <div className="upi-id-pill">
                  <div className="upi-text-group">
                    <span className="upi-label">UPI ID:</span>
                    <span className="upi-id-val">{UPI_ID}</span>
                  </div>
                  <button type="button" className="copy-upi-btn" onClick={copyUpi}>
                    {copiedUpi ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                  </button>
                </div>

                <a 
                  href={upiUri} 
                  className="open-upi-app-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Open in UPI App on Mobile</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .coffee-page-root {
          min-height: 100vh;
          padding: 110px 0 80px 0;
          background: #0a0a0c;
          color: #ffffff;
          font-family: var(--font-body);
        }

        .coffee-layout-container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* ─── Hero Section ─── */
        .coffee-hero-section {
          text-align: center;
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .coffee-avatar-ring {
          position: relative;
          width: 80px;
          height: 80px;
          margin-bottom: 18px;
        }

        .coffee-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #ff4d00;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        }

        .coffee-cup-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #ff4d00;
          border: 2px solid #0a0a0c;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .coffee-hero-title {
          font-family: var(--font-heading);
          font-size: clamp(32px, 4.5vw, 44px);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin-bottom: 12px;
        }

        .highlight-text {
          color: #f59e0b;
        }

        .coffee-hero-subtitle {
          max-width: 620px;
          font-size: 15px;
          line-height: 1.6;
          color: #a1a1aa;
        }

        /* ─── Cards Grid ─── */
        .coffee-cards-grid {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 28px;
          margin-bottom: 60px;
        }

        .support-config-card, .checkout-summary-card {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
        }

        .card-section-title {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 20px;
        }

        /* ─── Tiers Grid ─── */
        .tiers-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }

        .tier-card {
          background: #16161c;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 120px;
        }

        .tier-card:hover {
          border-color: rgba(255, 77, 0, 0.4);
          background: #1b1b22;
          transform: translateY(-2px);
        }

        .tier-selected {
          border-color: #ff4d00;
          background: #1a1714;
          box-shadow: 0 0 0 1px #ff4d00;
        }

        .tier-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .tier-icon {
          font-size: 18px;
        }

        .tier-tag {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.06);
          color: #a1a1aa;
        }

        .tag-popular {
          background: rgba(255, 77, 0, 0.15);
          color: #ff4d00;
        }

        .tier-sub {
          font-size: 11px;
          color: #a1a1aa;
          margin-bottom: 6px;
          line-height: 1.35;
        }

        .tier-price-row {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .tier-symbol {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
        }

        .tier-val {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
        }

        /* ─── Custom Amount Box ─── */
        .custom-amount-box {
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #a1a1aa;
          margin-bottom: 8px;
        }

        .req-star {
          color: #ff4d00;
        }

        .custom-input-wrap {
          display: flex;
          align-items: center;
          background: #101014;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 6px 14px;
          margin-bottom: 12px;
        }

        .custom-input-wrap:focus-within {
          border-color: #ff4d00;
        }

        .currency-prefix {
          font-size: 18px;
          font-weight: 800;
          color: #ff4d00;
          margin-right: 6px;
        }

        .custom-amount-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 18px;
          font-weight: 800;
        }

        .quick-chips-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }

        .chip-btn {
          padding: 4px 10px;
          background: #1b1b22;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          color: #d4d4d8;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
        }

        .chip-btn:hover, .chip-active {
          background: #ff4d00;
          color: #ffffff;
          border-color: #ff4d00;
        }

        .amount-range-hint {
          font-size: 10px;
          color: #71717a;
        }

        /* ─── Supporter Form ─── */
        .supporter-details-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-sub-title {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-icon-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 10px 14px;
        }

        .input-icon-wrap:focus-within {
          border-color: #ff4d00;
        }

        .textarea-wrap {
          align-items: flex-start;
        }

        .textarea-icon {
          margin-top: 4px;
        }

        .coffee-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 13px;
        }

        .coffee-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 13px;
          resize: none;
        }

        .upload-fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .upload-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .upload-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 14px;
          background: #141418;
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 90px;
        }

        .upload-dropzone:hover {
          border-color: #ff4d00;
          background: #191920;
        }

        .hidden-file-input {
          display: none;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
          text-align: center;
        }

        .upload-hint {
          font-size: 9px;
          color: #71717a;
          font-weight: 400;
        }

        .preview-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .uploaded-thumb, .uploaded-avatar-thumb {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          object-fit: cover;
        }

        .uploaded-avatar-thumb {
          border-radius: 50%;
        }

        .change-photo-text {
          font-size: 10px;
          color: #ff4d00;
          font-weight: 700;
        }

        .submit-form-row {
          margin-top: 10px;
        }

        .complete-support-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          background: #ff4d00;
          color: #ffffff;
          border: none;
          border-radius: 14px;
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.15s, opacity 0.15s;
        }

        .complete-support-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          opacity: 0.94;
        }

        .complete-support-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ─── Right Column: Summary & UPI Box ─── */
        .checkout-summary-card {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .summary-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .summary-label {
          display: block;
          font-family: var(--font-heading);
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
        }

        .summary-sub {
          display: block;
          font-size: 12px;
          color: #71717a;
          margin-top: 2px;
        }

        .total-amount-display {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .total-symbol {
          font-size: 20px;
          font-weight: 800;
          color: #f59e0b;
        }

        .total-num {
          font-family: var(--font-heading);
          font-size: 36px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        /* UPI QR Card */
        .upi-qr-card {
          background: #16161c;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .upi-qr-head {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .qr-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 800;
          color: #ffffff;
        }

        .instant-badge {
          font-size: 10px;
          color: #22c55e;
          font-weight: 700;
        }

        .qr-image-container {
          position: relative;
          background: #ffffff;
          padding: 12px;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .qr-image-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(255, 77, 0, 0.25);
        }

        .upi-qr-img {
          width: 220px;
          height: 220px;
          object-fit: contain;
          display: block;
          border-radius: 8px;
        }

        .qr-expand-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #ffffff;
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 800;
          opacity: 0;
          transition: opacity 0.2s ease;
          border-radius: 16px;
        }

        .qr-image-container:hover .qr-expand-overlay {
          opacity: 1;
        }

        /* ─── Expandable QR Modal Lightbox ─── */
        .qr-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.88);
          backdrop-filter: blur(12px);
          z-index: 6000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .qr-modal-card {
          width: 100%;
          max-width: 440px;
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.9);
          display: flex;
          flex-direction: column;
          gap: 18px;
          color: #ffffff;
        }

        .qr-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .qr-modal-header-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .qr-modal-badge {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #18181f;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .qr-modal-title {
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
        }

        .qr-modal-sub {
          font-size: 11px;
          color: #a1a1aa;
          margin-top: 2px;
        }

        .close-qr-modal-btn {
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

        .close-qr-modal-btn:hover {
          color: #ffffff;
          background: #24242c;
        }

        .qr-modal-image-wrap {
          background: #ffffff;
          padding: 16px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .qr-modal-img {
          width: 100%;
          max-width: 320px;
          height: auto;
          display: block;
          border-radius: 10px;
        }

        .qr-modal-footer {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .upi-id-pill {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 8px 12px;
        }

        .upi-text-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .upi-label {
          font-size: 11px;
          color: #71717a;
          font-weight: 600;
        }

        .upi-id-val {
          font-family: monospace;
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
        }

        .copy-upi-btn {
          background: transparent;
          border: none;
          color: #a1a1aa;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }

        .copy-upi-btn:hover {
          color: #ffffff;
        }

        .open-upi-app-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          background: #202028;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s;
        }

        .open-upi-app-btn:hover {
          background: #282834;
        }

        /* How to accordion */
        .how-to-accordion {
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          overflow: hidden;
        }

        .how-to-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .how-to-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .rotate-180 {
          transform: rotate(180deg);
        }

        .how-to-content {
          padding: 0 16px 16px 16px;
          font-size: 12px;
          color: #a1a1aa;
          line-height: 1.6;
        }

        .steps-list {
          padding-left: 18px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .steps-list strong {
          color: #ffffff;
        }

        .steps-list code {
          background: rgba(255, 255, 255, 0.08);
          padding: 2px 5px;
          border-radius: 4px;
          color: #ff4d00;
        }

        .security-guarantee-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          background: rgba(34, 197, 94, 0.06);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 14px;
          font-size: 12px;
          line-height: 1.45;
          color: #d4d4d8;
        }

        .security-guarantee-box strong {
          color: #4ade80;
          display: block;
          margin-bottom: 2px;
        }

        /* ─── Supporters Wall ─── */
        .supporters-wall-section {
          margin-top: 20px;
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .wall-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .wall-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 9999px;
          color: #fbbf24;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .wall-title {
          font-family: var(--font-heading);
          font-size: 26px;
          font-weight: 800;
          color: #ffffff;
        }

        .wall-sub {
          font-size: 13px;
          color: #71717a;
          margin-top: 4px;
        }

        .supporters-loading, .supporters-empty {
          text-align: center;
          padding: 40px;
          background: #111114;
          border-radius: 18px;
          color: #71717a;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .supporters-empty h3 {
          color: #ffffff;
          font-size: 16px;
        }

        .supporters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }

        .supporter-card {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .supporter-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .supporter-avatar-wrap {
          position: relative;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
        }

        .supporter-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .rank-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: #f59e0b;
          color: #000000;
          font-size: 9px;
          font-weight: 900;
          padding: 1px 4px;
          border-radius: 9999px;
        }

        .supporter-info {
          display: flex;
          flex-direction: column;
        }

        .supporter-name {
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
        }

        .supporter-amount {
          font-size: 11px;
          color: #f59e0b;
          font-weight: 700;
        }

        .supporter-quote {
          font-size: 12px;
          color: #d4d4d8;
          line-height: 1.45;
          font-style: italic;
          background: #16161c;
          padding: 8px 12px;
          border-radius: 8px;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .coffee-cards-grid {
            grid-template-columns: 1fr;
          }
          .tiers-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
