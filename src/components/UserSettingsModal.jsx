import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Shield, 
  Save, 
  CheckCircle, 
  RefreshCw, 
  Settings as SettingsIcon, 
  AlertCircle, 
  Trash2, 
  AlertTriangle, 
  CheckSquare, 
  Square,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, fetchUserProfile, deleteUserAccount } from '../lib/api';
import { updateProfile, deleteUser } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from './ui/toast';

const DELETION_REASONS = [
  { id: 'no_longer_needed', label: 'I no longer need to use this platform or portfolio services' },
  { id: 'privacy_concerns', label: 'Privacy, security, or data collection concerns' },
  { id: 'technical_issues', label: 'Encountered technical issues, bugs, or slow response times' },
  { id: 'accidental_account', label: 'Created this account by accident / just testing features' },
  { id: 'too_many_notifications', label: 'Too many emails or unwanted messages' },
  { id: 'other', label: 'Other reason (specified in feedback below)' }
];

export default function UserSettingsModal({ isOpen, onClose }) {
  const { currentUser, backendToken, logout } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [showPhoto, setShowPhoto] = useState(true);
  const [showUsername, setShowUsername] = useState(true);
  const [saving, setSaving] = useState(false);

  // Deletion Procedure States
  const [showDeleteProcedure, setShowDeleteProcedure] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [deletionFeedback, setDeletionFeedback] = useState('');
  const [confirmInput, setConfirmInput] = useState('');
  const [confirmAgreed, setConfirmAgreed] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
    }
    if (backendToken && isOpen) {
      fetchUserProfile(backendToken)
        .then((userData) => {
          if (userData) {
            if (typeof userData.showProfilePhoto === 'boolean') setShowPhoto(userData.showProfilePhoto);
            if (typeof userData.showUsername === 'boolean') setShowUsername(userData.showUsername);
            if (userData.name) setDisplayName(userData.name);
          }
        })
        .catch(() => {});
    }
  }, [currentUser, backendToken, isOpen]);

  // Reset deletion states when closing
  useEffect(() => {
    if (!isOpen) {
      setShowDeleteProcedure(false);
      setSelectedReasons([]);
      setDeletionFeedback('');
      setConfirmInput('');
      setConfirmAgreed(false);
    }
  }, [isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Update Firebase display name
      if (auth.currentUser && displayName.trim() !== currentUser.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: displayName.trim()
        });
      }

      // 2. Update Backend Firestore Profile
      if (backendToken) {
        await updateUserProfile(backendToken, {
          name: displayName.trim(),
          showProfilePhoto: showPhoto,
          showUsername: showUsername
        });
      }

      toast({
        title: 'Settings Saved',
        description: 'Your profile settings have been updated successfully.',
        variant: 'default'
      });
      onClose();
    } catch (err) {
      toast({
        title: 'Save Failed',
        description: err.message || 'Could not update settings.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleReason = (reasonId) => {
    setSelectedReasons((prev) => 
      prev.includes(reasonId) ? prev.filter((r) => r !== reasonId) : [...prev, reasonId]
    );
  };

  const handleExecuteDeletion = async (e) => {
    e.preventDefault();
    if (confirmInput.trim().toUpperCase() !== 'DELETE' || !confirmAgreed || selectedReasons.length === 0) {
      return;
    }

    setDeleting(true);
    try {
      // 1. Send deletion request to backend database
      if (backendToken) {
        await deleteUserAccount(backendToken, {
          reasons: selectedReasons.map(rId => DELETION_REASONS.find(dr => dr.id === rId)?.label || rId),
          feedback: deletionFeedback
        });
      }

      // 2. Delete Firebase client auth record if possible
      if (auth.currentUser) {
        try {
          await deleteUser(auth.currentUser);
        } catch (firebaseDeleteErr) {
          console.warn('Client Firebase auth delete note:', firebaseDeleteErr.message);
        }
      }

      // 3. Clear auth state and logout
      logout();
      onClose();

      toast({
        title: 'Account Deleted',
        description: 'Your account and data have been permanently removed from our database. Thank you for your feedback.',
        variant: 'default'
      });
    } catch (err) {
      console.error('Account deletion error:', err);
      toast({
        title: 'Deletion Failed',
        description: err.message || 'Could not delete account. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="settings-modal-backdrop" onClick={onClose}>
      <div className="settings-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="settings-header">
          <div className="settings-header-meta">
            <div className="settings-icon-badge">
              {showDeleteProcedure ? (
                <ShieldAlert size={18} color="#ef4444" />
              ) : (
                <SettingsIcon size={18} color="#ff4d00" />
              )}
            </div>
            <div>
              <h2 className="settings-title">
                {showDeleteProcedure ? 'Delete Account Procedure' : 'Account Settings'}
              </h2>
              <p className="settings-sub">
                {showDeleteProcedure 
                  ? 'Please review the procedure and tell us why you are deleting your account' 
                  : 'Manage your profile and public inquiry preferences'}
              </p>
            </div>
          </div>

          <button type="button" className="close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* VIEW 1: REGULAR PROFILE SETTINGS */}
        {!showDeleteProcedure ? (
          <form onSubmit={handleSave} className="settings-form">
            {/* Avatar Preview */}
            <div className="profile-preview-card">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Avatar" className="settings-avatar-img" />
              ) : (
                <div className="settings-avatar-fallback">
                  {(displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="preview-meta">
                <span className="preview-name">{displayName || 'User'}</span>
                <span className="preview-email">{currentUser.email}</span>
              </div>
            </div>

            {/* Display Name Input */}
            <div className="settings-field">
              <label className="field-label">Display Name</label>
              <div className="field-input-wrap">
                <User size={15} className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email (Read only) */}
            <div className="settings-field">
              <label className="field-label">Registered Email</label>
              <div className="field-input-wrap readonly-wrap">
                <Mail size={15} className="input-icon" />
                <input
                  type="email"
                  value={currentUser.email || ''}
                  readOnly
                  disabled
                />
              </div>
            </div>

            {/* Privacy Toggles */}
            <div className="privacy-section">
              <span className="privacy-heading">Privacy & Submissions</span>

              <label className="toggle-row">
                <div>
                  <span className="toggle-title">Show Profile Photo on Submissions</span>
                  <span className="toggle-sub">Display your Google avatar on tickets and leaderboard</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={showPhoto} 
                  onChange={(e) => setShowPhoto(e.target.checked)}
                  className="custom-toggle"
                />
              </label>

              <label className="toggle-row">
                <div>
                  <span className="toggle-title">Show Username Handle</span>
                  <span className="toggle-sub">Display generated username on public contributions</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={showUsername} 
                  onChange={(e) => setShowUsername(e.target.checked)}
                  className="custom-toggle"
                />
              </label>
            </div>

            {/* Danger Zone */}
            <div className="danger-zone-section">
              <div className="danger-zone-header">
                <AlertTriangle size={14} color="#ef4444" />
                <span>Danger Zone</span>
              </div>
              <p className="danger-zone-text">
                Permanently erase your account, inquiry tickets, DM messages, and profile from the database.
              </p>
              <button 
                type="button" 
                className="trigger-delete-btn"
                onClick={() => setShowDeleteProcedure(true)}
              >
                <Trash2 size={14} />
                <span>Delete Account Permanently</span>
              </button>
            </div>

            {/* Footer Save Button */}
            <div className="settings-footer">
              <button type="button" className="cancel-settings-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-settings-btn" disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw size={14} className="spin-icon" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* VIEW 2: MULTI-STEP DELETION PROCEDURE & REASONS */
          <form onSubmit={handleExecuteDeletion} className="deletion-procedure-form">
            <div className="deletion-warning-banner">
              <AlertTriangle size={18} color="#ef4444" />
              <div>
                <strong>Permanent Action:</strong> Deleting your account will immediately erase your records, tickets, direct chats, and username mapping from our database.
              </div>
            </div>

            {/* Reasons Checklist */}
            <div className="reasons-block">
              <label className="reasons-heading">
                Why are you deleting your account? <span className="req-star">* (Select all that apply)</span>
              </label>
              <div className="reasons-checklist">
                {DELETION_REASONS.map((r) => {
                  const isChecked = selectedReasons.includes(r.id);
                  return (
                    <div 
                      key={r.id}
                      className={`reason-item ${isChecked ? 'reason-checked' : ''}`}
                      onClick={() => toggleReason(r.id)}
                    >
                      <div className="reason-checkbox-icon">
                        {isChecked ? (
                          <CheckSquare size={16} color="#ff4d00" />
                        ) : (
                          <Square size={16} color="#71717a" />
                        )}
                      </div>
                      <span className="reason-label">{r.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Optional Feedback */}
            <div className="settings-field">
              <label className="field-label">Additional Feedback / Suggestions (Optional)</label>
              <textarea
                rows={2}
                placeholder="What could we have improved for you?"
                value={deletionFeedback}
                onChange={(e) => setDeletionFeedback(e.target.value)}
                className="deletion-feedback-textarea"
              />
            </div>

            {/* Security Confirmation Step */}
            <div className="security-confirm-step">
              <label className="field-label">Type "DELETE" to confirm irreversible erasure</label>
              <input
                type="text"
                placeholder='Type "DELETE"'
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                className="confirm-delete-input"
                required
              />

              <label className="confirm-agreement-row">
                <input
                  type="checkbox"
                  checked={confirmAgreed}
                  onChange={(e) => setConfirmAgreed(e.target.checked)}
                  className="custom-toggle"
                />
                <span className="confirm-agreement-text">
                  I understand that this action is permanent and cannot be undone.
                </span>
              </label>
            </div>

            {/* Deletion Modal Footer Actions */}
            <div className="deletion-modal-footer">
              <button 
                type="button" 
                className="cancel-settings-btn"
                onClick={() => setShowDeleteProcedure(false)}
                disabled={deleting}
              >
                Back to Settings
              </button>

              <button
                type="submit"
                className="confirm-final-delete-btn"
                disabled={
                  deleting || 
                  confirmInput.trim().toUpperCase() !== 'DELETE' || 
                  !confirmAgreed || 
                  selectedReasons.length === 0
                }
              >
                {deleting ? (
                  <>
                    <RefreshCw size={14} className="spin-icon" />
                    <span>Deleting from Database...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Confirm & Delete Forever</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .settings-modal-backdrop {
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

        .settings-modal-card {
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8);
          color: #ffffff;
        }

        .settings-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .settings-header-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .settings-icon-badge {
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

        .settings-title {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .settings-sub {
          font-size: 12px;
          color: #a1a1aa;
          margin-top: 2px;
          line-height: 1.4;
        }

        .close-btn {
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

        .close-btn:hover {
          color: #ffffff;
          background: #222228;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .profile-preview-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          background: #16161c;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
        }

        .settings-avatar-img, .settings-avatar-fallback {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }

        .settings-avatar-fallback {
          background: #ff4d00;
          color: #ffffff;
          font-weight: 800;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .preview-name {
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
        }

        .preview-email {
          font-size: 12px;
          color: #71717a;
        }

        .settings-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #a1a1aa;
        }

        .field-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 10px 14px;
        }

        .field-input-wrap:focus-within {
          border-color: #ff4d00;
        }

        .input-icon {
          color: #71717a;
        }

        .field-input-wrap input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 13px;
        }

        .readonly-wrap {
          background: #0e0e12;
          opacity: 0.75;
        }

        .privacy-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .privacy-heading {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #71717a;
        }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          gap: 12px;
        }

        .toggle-title {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .toggle-sub {
          display: block;
          font-size: 11px;
          color: #71717a;
        }

        .custom-toggle {
          width: 18px;
          height: 18px;
          accent-color: #ff4d00;
          cursor: pointer;
        }

        /* Danger Zone */
        .danger-zone-section {
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 14px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 4px;
        }

        .danger-zone-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 800;
          color: #ef4444;
          text-transform: uppercase;
        }

        .danger-zone-text {
          font-size: 12px;
          color: #a1a1aa;
          line-height: 1.4;
        }

        .trigger-delete-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          width: fit-content;
          transition: background 0.2s ease;
        }

        .trigger-delete-btn:hover {
          background: rgba(239, 68, 68, 0.22);
        }

        /* Settings footer */
        .settings-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cancel-settings-btn {
          padding: 9px 16px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #a1a1aa;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .save-settings-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          background: #ff4d00;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        /* ─── Deletion Procedure View ─── */
        .deletion-procedure-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .deletion-warning-banner {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #fca5a5;
          padding: 12px 14px;
          border-radius: 12px;
          font-size: 12px;
          line-height: 1.5;
        }

        .reasons-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .reasons-heading {
          font-size: 12px;
          font-weight: 800;
          color: #ffffff;
        }

        .req-star {
          color: #ff4d00;
          font-weight: 600;
        }

        .reasons-checklist {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .reason-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: #15151a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .reason-item:hover {
          background: #1a1a22;
          border-color: rgba(255, 77, 0, 0.3);
        }

        .reason-checked {
          background: rgba(255, 77, 0, 0.08);
          border-color: #ff4d00;
        }

        .reason-label {
          font-size: 12px;
          color: #d4d4d8;
          line-height: 1.35;
        }

        .deletion-feedback-textarea {
          width: 100%;
          padding: 10px 12px;
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #ffffff;
          font-size: 12px;
          outline: none;
          resize: none;
        }

        .deletion-feedback-textarea:focus {
          border-color: #ff4d00;
        }

        .security-confirm-step {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px;
          background: #15151a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .confirm-delete-input {
          width: 100%;
          padding: 10px 14px;
          background: #101014;
          border: 1px solid rgba(239, 68, 68, 0.4);
          border-radius: 8px;
          color: #ffffff;
          font-size: 13px;
          outline: none;
        }

        .confirm-delete-input:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
        }

        .confirm-agreement-row {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .confirm-agreement-text {
          font-size: 11px;
          color: #a1a1aa;
        }

        .deletion-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .confirm-final-delete-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          background: #dc2626;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .confirm-final-delete-btn:hover:not(:disabled) {
          background: #b91c1c;
        }

        .confirm-final-delete-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
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
