import React, { useState, useEffect } from 'react';
import { X, Mail, Shield, Clock, Send, MessageSquare, CheckCircle, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserTickets, sendContactInquiry } from '../lib/api';
import { toast } from './ui/toast';

export default function UserMessagesModal({ isOpen, onClose }) {
  const { currentUser, backendToken } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newInquiryOpen, setNewInquiryOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadTickets = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      if (backendToken) {
        const list = await fetchUserTickets(backendToken);
        setTickets(list);
      }
    } catch (err) {
      console.warn('Could not load user tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadTickets();
    }
  }, [isOpen, backendToken, currentUser]);

  if (!isOpen) return null;

  const handleCreateInquiry = async (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;
    setSubmitting(true);
    try {
      await sendContactInquiry({
        name: currentUser.displayName || 'User',
        email: currentUser.email,
        message: `${newSubject.trim()}: ${newMessage.trim()}`
      });
      toast({
        title: 'Inquiry Submitted',
        description: 'Your message was sent to admin. You will see replies here.',
        variant: 'default'
      });
      setNewSubject('');
      setNewMessage('');
      setNewInquiryOpen(false);
      loadTickets();
    } catch (err) {
      toast({
        title: 'Submission Failed',
        description: err.message || 'Could not send inquiry.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (val) => {
    if (!val) return 'Recently';
    try {
      const d = val?.seconds ? new Date(val.seconds * 1000) : (val?._seconds ? new Date(val._seconds * 1000) : new Date(val));
      if (isNaN(d.getTime())) return 'Recently';
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="user-messages-backdrop" onClick={onClose}>
      <div className="user-messages-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="user-messages-header">
          <div className="header-meta">
            <div className="msg-icon-badge">
              <MessageSquare size={18} color="#ff4d00" />
            </div>
            <div>
              <h2 className="messages-title">Messages & Admin Replies</h2>
              <p className="messages-sub">Track inquiries sent to Bhavesh and read official responses</p>
            </div>
          </div>

          <div className="header-actions">
            <button 
              type="button" 
              className="refresh-btn" 
              onClick={loadTickets} 
              disabled={loading}
              title="Refresh messages"
            >
              <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
            </button>
            <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="messages-content-body">
          {/* New Inquiry Action */}
          <div className="new-inquiry-bar">
            {!newInquiryOpen ? (
              <button 
                type="button" 
                className="start-inquiry-btn"
                onClick={() => setNewInquiryOpen(true)}
              >
                <Send size={14} />
                <span>Send New Inquiry to Admin</span>
              </button>
            ) : (
              <form onSubmit={handleCreateInquiry} className="new-inquiry-form">
                <div className="form-head">
                  <span className="form-head-title">New Inquiry</span>
                  <button type="button" className="form-close-text" onClick={() => setNewInquiryOpen(false)}>Cancel</button>
                </div>
                <input 
                  type="text" 
                  placeholder="Subject (e.g. Project Consultation, Collaboration...)" 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="inquiry-input"
                  required
                />
                <textarea 
                  rows={3} 
                  placeholder="Your message details..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="inquiry-textarea"
                  required
                />
                <button type="submit" className="submit-inquiry-btn" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>

          {/* Tickets List */}
          {loading && tickets.length === 0 ? (
            <div className="loading-box">
              <RefreshCw size={22} className="spin-icon" color="#ff4d00" />
              <p>Loading your messages...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="empty-messages-box">
              <Mail size={36} color="#52525b" />
              <h3>No inquiries yet</h3>
              <p>When you send a message through the contact page or submit an inquiry above, admin responses will appear here in real time.</p>
            </div>
          ) : (
            <div className="inquiries-list">
              {tickets.map((t) => (
                <div key={t.id} className="inquiry-card">
                  <div className="inquiry-card-header">
                    <div className="inquiry-subject-row">
                      <span className="inquiry-subject">{t.title || 'Inquiry'}</span>
                      <span className={`status-pill status-${(t.status || 'sent').toLowerCase()}`}>
                        {t.status || 'Sent'}
                      </span>
                    </div>
                    <span className="inquiry-date">{formatDate(t.createdAt)}</span>
                  </div>

                  <p className="inquiry-details">{t.details}</p>

                  {/* Admin Reply */}
                  {t.reply ? (
                    <div className="admin-reply-box">
                      <div className="admin-reply-head">
                        <Shield size={14} color="#ff4d00" />
                        <span className="admin-name">Bhavesh Patil (Admin)</span>
                        {t.repliedAt && <span className="reply-time">• {formatDate(t.repliedAt)}</span>}
                      </div>
                      <p className="admin-reply-text">{t.reply}</p>
                    </div>
                  ) : (
                    <div className="awaiting-reply-pill">
                      <Clock size={12} color="#eab308" />
                      <span>Awaiting admin response...</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .user-messages-backdrop {
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

        .user-messages-card {
          width: 100%;
          max-width: 600px;
          max-height: 85vh;
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          color: #ffffff;
        }

        .user-messages-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .header-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .msg-icon-badge {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #18181c;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .messages-title {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .messages-sub {
          font-size: 12px;
          color: #a1a1aa;
          margin-top: 2px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .refresh-btn, .close-btn {
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

        .refresh-btn:hover, .close-btn:hover {
          color: #ffffff;
          background: #222228;
        }

        .messages-content-body {
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-right: 4px;
        }

        .new-inquiry-bar {
          margin-bottom: 6px;
        }

        .start-inquiry-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 16px;
          background: #18181c;
          border: 1px dashed rgba(255, 255, 255, 0.18);
          border-radius: 12px;
          color: #ffffff;
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .start-inquiry-btn:hover {
          background: #222228;
          border-color: #ff4d00;
        }

        .new-inquiry-form {
          background: #16161c;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 700;
        }

        .form-head-title { color: #ffffff; }
        .form-close-text {
          background: transparent;
          border: none;
          color: #71717a;
          cursor: pointer;
          font-size: 11px;
        }

        .form-close-text:hover { color: #ffffff; }

        .inquiry-input, .inquiry-textarea {
          width: 100%;
          padding: 10px 12px;
          background: #101014;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #ffffff;
          font-size: 13px;
          outline: none;
        }

        .inquiry-input:focus, .inquiry-textarea:focus {
          border-color: #ff4d00;
        }

        .submit-inquiry-btn {
          align-self: flex-end;
          padding: 8px 18px;
          background: #ff4d00;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
        }

        .loading-box, .empty-messages-box {
          text-align: center;
          padding: 36px 20px;
          background: #141418;
          border-radius: 14px;
          color: #71717a;
          font-size: 13px;
        }

        .empty-messages-box h3 {
          font-size: 15px;
          color: #ffffff;
          margin: 10px 0 4px 0;
        }

        .empty-messages-box p {
          max-width: 380px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .inquiries-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .inquiry-card {
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .inquiry-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .inquiry-subject-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .inquiry-subject {
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
        }

        .inquiry-date {
          font-size: 11px;
          color: #71717a;
        }

        .status-pill {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .status-sent {
          background: rgba(234, 179, 8, 0.12);
          color: #facc15;
          border: 1px solid rgba(234, 179, 8, 0.3);
        }

        .status-replied {
          background: rgba(34, 197, 94, 0.12);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .status-closed {
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .inquiry-details {
          font-size: 13px;
          color: #d4d4d8;
          line-height: 1.5;
        }

        .admin-reply-box {
          background: #181820;
          border: 1px solid rgba(255, 77, 0, 0.25);
          border-radius: 10px;
          padding: 12px;
          margin-top: 4px;
        }

        .admin-reply-head {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: #ff4d00;
          margin-bottom: 6px;
        }

        .reply-time {
          color: #71717a;
          font-weight: 500;
        }

        .admin-reply-text {
          font-size: 13px;
          color: #ffffff;
          line-height: 1.5;
        }

        .awaiting-reply-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #ca8a04;
          font-weight: 600;
          padding: 4px 8px;
          background: rgba(234, 179, 8, 0.08);
          border-radius: 6px;
          width: fit-content;
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
