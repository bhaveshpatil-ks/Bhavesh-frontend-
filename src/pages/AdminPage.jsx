import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  KeyRound, 
  Fingerprint, 
  Mail, 
  CreditCard, 
  Trophy, 
  LogOut, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Trash2, 
  Send, 
  ExternalLink, 
  Smartphone, 
  Laptop, 
  Plus, 
  AlertCircle,
  Eye,
  Filter,
  Check,
  X,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  MessageSquare,
  Users
} from 'lucide-react';
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { 
  adminLogin, 
  adminPasskeyAuthOptions, 
  adminPasskeyAuthVerify,
  adminPasskeyRegisterOptions,
  adminPasskeyRegisterVerify,
  adminGetPasskeyDevices,
  adminRemovePasskeyDevice,
  adminGetTickets,
  adminReplyTicket,
  adminUpdateTicketStatus,
  adminDeleteTicket,
  adminGetPayments,
  adminUpdatePaymentStatus,
  adminDeletePayment,
  adminDeleteLeaderboardEntry,
  adminGetLeaderboard,
  adminGetUsers
} from '../lib/api';
import { useToast } from '../components/ui/toast';
import AdminLiveChat from '../components/AdminLiveChat';

const STORAGE_KEY = 'bhavesh_admin_token';
const ADMIN_USER_KEY = 'bhavesh_admin_username';

export default function AdminPage() {
  const { addToast } = useToast();

  // Auth State
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const [adminUser, setAdminUser] = useState(() => localStorage.getItem(ADMIN_USER_KEY) || 'admin');
  const [authLoading, setAuthLoading] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('livechat'); // 'livechat' | 'users' | 'tickets' | 'payments' | 'leaderboard' | 'security'

  // Data States
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({ totalUsers: 0, deletedCount: 0 });
  const [dataLoading, setDataLoading] = useState(false);

  // Filter & Search States
  const [ticketStatusFilter, setTicketStatusFilter] = useState('all');
  const [ticketSearch, setTicketSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [selectedChatUserId, setSelectedChatUserId] = useState(null);

  // Modal States
  const [replyingTicket, setReplyingTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [isRegisteringDevice, setIsRegisteringDevice] = useState(false);

  // Logout Handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setToken('');
    setTickets([]);
    setPayments([]);
    setLeaderboard([]);
    setDevices([]);
    setUsers([]);
    addToast({ title: 'Logged out', message: 'You have been safely signed out of admin portal.', type: 'info' });
  }, [addToast]);

  // Standard Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) {
      setAuthError('Please fill in both username and password.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await adminLogin(usernameInput.trim(), passwordInput);
      if (res.token) {
        localStorage.setItem(STORAGE_KEY, res.token);
        localStorage.setItem(ADMIN_USER_KEY, usernameInput.trim());
        setToken(res.token);
        setAdminUser(usernameInput.trim());
        addToast({ title: 'Welcome Back', message: `Authenticated as ${usernameInput.trim()}`, type: 'success' });
      }
    } catch (err) {
      setAuthError(err.message || 'Invalid credentials');
      addToast({ title: 'Login Failed', message: err.message || 'Invalid credentials', type: 'error' });
    } finally {
      setAuthLoading(false);
    }
  };

  // Passkey / Biometrics Login
  const handlePasskeyLogin = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const { options, sessionId } = await adminPasskeyAuthOptions();
      const credential = await startAuthentication(options);
      const res = await adminPasskeyAuthVerify(credential, sessionId);

      if (res.token) {
        localStorage.setItem(STORAGE_KEY, res.token);
        setToken(res.token);
        addToast({ title: 'Passkey Verified', message: 'Signed in via hardware biometric passkey', type: 'success' });
      }
    } catch (err) {
      console.error('Passkey Auth Error:', err);
      setAuthError(err.message || 'Passkey authentication was cancelled or failed.');
      addToast({ title: 'Passkey Failed', message: err.message || 'Biometric auth failed', type: 'error' });
    } finally {
      setAuthLoading(false);
    }
  };

  // Load Data for Active Tab
  const loadData = useCallback(async () => {
    if (!token) return;
    setDataLoading(true);
    try {
      // Always fetch users directory for DM resolution and counter
      if (activeTab === 'users' || activeTab === 'livechat' || users.length === 0) {
        const uData = await adminGetUsers(token).catch(() => ({ users: [], totalUsers: 0, deletedCount: 0 }));
        if (uData?.users) {
          setUsers(uData.users);
          setUserStats({ totalUsers: uData.totalUsers || uData.users.length, deletedCount: uData.deletedCount || 0 });
        }
      }

      if (activeTab === 'tickets') {
        const list = await adminGetTickets(token, {
          status: ticketStatusFilter,
          query: ticketSearch
        });
        setTickets(list);
      } else if (activeTab === 'payments') {
        const list = await adminGetPayments(token, {
          status: paymentStatusFilter,
          query: paymentSearch
        });
        setPayments(list);
      } else if (activeTab === 'leaderboard') {
        const list = await adminGetLeaderboard(token, { limit: 100 });
        setLeaderboard(list);
      } else if (activeTab === 'security') {
        const list = await adminGetPasskeyDevices(token);
        setDevices(list);
      }
    } catch (err) {
      console.error('Data Fetch Error:', err);
      if (err.message?.includes('token') || err.message?.includes('401') || err.message?.includes('Not allowed')) {
        handleLogout();
        addToast({ title: 'Session Expired', message: 'Please log in again.', type: 'error' });
      }
    } finally {
      setDataLoading(false);
    }
  }, [token, activeTab, users.length, ticketStatusFilter, ticketSearch, paymentStatusFilter, paymentSearch, handleLogout, addToast]);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, activeTab, loadData]);

  // Reply to Ticket
  const handleSendReply = async () => {
    if (!replyingTicket || !replyText.trim()) return;
    setActionLoading(true);
    try {
      await adminReplyTicket(token, replyingTicket.id, replyText.trim());
      addToast({ title: 'Reply Sent', message: 'Ticket status changed to Replied.', type: 'success' });
      setReplyingTicket(null);
      setReplyText('');
      loadData();
    } catch (err) {
      addToast({ title: 'Error', message: err.message || 'Failed to send reply', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // Update Ticket Status
  const handleUpdateTicketStatus = async (ticketId, status) => {
    try {
      await adminUpdateTicketStatus(token, { ticketId, status });
      addToast({ title: 'Status Updated', message: `Ticket marked as ${status}`, type: 'success' });
      loadData();
    } catch (err) {
      addToast({ title: 'Error', message: err.message || 'Failed to update ticket status', type: 'error' });
    }
  };

  // Delete Ticket
  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry ticket?')) return;
    try {
      await adminDeleteTicket(token, ticketId);
      addToast({ title: 'Ticket Deleted', message: 'The ticket has been removed.', type: 'info' });
      loadData();
    } catch (err) {
      addToast({ title: 'Error', message: err.message || 'Failed to delete ticket', type: 'error' });
    }
  };

  // Update Payment Status (Approve/Reject)
  const handleUpdatePaymentStatus = async (paymentId, status) => {
    try {
      await adminUpdatePaymentStatus(token, paymentId, status);
      addToast({ 
        title: status === 'success' ? 'Payment Approved' : 'Payment Marked Failed', 
        message: status === 'success' ? 'Added to live leaderboard.' : 'Payment marked as rejected.', 
        type: status === 'success' ? 'success' : 'info' 
      });
      loadData();
    } catch (err) {
      addToast({ title: 'Error', message: err.message || 'Failed to update payment status', type: 'error' });
    }
  };

  // Delete Payment Entry
  const handleDeletePayment = async (paymentId, status) => {
    if (!window.confirm('Are you sure you want to delete this payment record?')) return;
    try {
      if (status === 'failed') {
        await adminDeleteLeaderboardEntry(token, paymentId);
      } else {
        await adminDeletePayment(token, paymentId);
      }
      addToast({ title: 'Payment Deleted', message: 'Record and images removed.', type: 'info' });
      loadData();
    } catch (err) {
      addToast({ title: 'Error', message: err.message || 'Failed to delete payment', type: 'error' });
    }
  };

  // Register Current Device as Passkey
  const handleRegisterPasskey = async () => {
    if (!newDeviceName.trim()) {
      addToast({ title: 'Device Name Required', message: 'Enter a friendly name for this device.', type: 'warning' });
      return;
    }
    setActionLoading(true);
    try {
      const { options } = await adminPasskeyRegisterOptions(token);
      const credential = await startRegistration(options);
      await adminPasskeyRegisterVerify(token, credential, newDeviceName.trim());
      addToast({ title: 'Passkey Registered', message: 'This device can now login with 1 click.', type: 'success' });
      setIsRegisteringDevice(false);
      setNewDeviceName('');
      loadData();
    } catch (err) {
      console.error('Passkey Reg Error:', err);
      addToast({ title: 'Registration Failed', message: err.message || 'Failed to register passkey', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // Remove Passkey Device
  const handleRemoveDevice = async (deviceId) => {
    if (!window.confirm('Are you sure you want to remove this passkey device?')) return;
    try {
      await adminRemovePasskeyDevice(token, deviceId);
      addToast({ title: 'Device Removed', message: 'Passkey credentials deleted.', type: 'info' });
      loadData();
    } catch (err) {
      addToast({ title: 'Error', message: err.message || 'Failed to remove device', type: 'error' });
    }
  };

  // Format Dates
  const formatDate = (val) => {
    if (!val) return '—';
    try {
      const d = val?.seconds ? new Date(val.seconds * 1000) : (val?._seconds ? new Date(val._seconds * 1000) : new Date(val));
      if (isNaN(d.getTime())) return '—';
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '—';
    }
  };

  // ----------------------------------------------------
  // UN-AUTHENTICATED: LOGIN SCREEN
  // ----------------------------------------------------
  if (!token) {
    return (
      <div className="admin-page-root">
        <div className="admin-auth-container">
          <div className="admin-auth-card">
            {/* Header Badge */}
            <div className="auth-header">
              <div className="auth-icon-badge">
                <Shield size={24} color="#ff4d00" />
              </div>
              <h1 className="auth-title">ADMIN PORTAL</h1>
              <p className="auth-subtitle">Secure management terminal for Bhavesh Patil's platform</p>
            </div>

            {authError && (
              <div className="auth-error-banner">
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            {/* Quick 1-Click Biometric Login */}
            <div className="passkey-section">
              <button 
                type="button" 
                className="passkey-login-btn"
                onClick={handlePasskeyLogin}
                disabled={authLoading}
              >
                <Fingerprint size={20} color="#ff4d00" />
                <span>Sign in with Passkey / Biometrics</span>
              </button>
              <div className="auth-divider">
                <span>or password credentials</span>
              </div>
            </div>

            {/* Form Login */}
            <form onSubmit={handlePasswordLogin} className="auth-form">
              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter admin username"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrap">
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter master password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={authLoading}
              >
                {authLoading ? (
                  <>
                    <RefreshCw size={16} className="spin-icon" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <KeyRound size={16} />
                    <span>Authorize Access</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <style>{`
          .admin-page-root {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 100px 20px 60px 20px;
            background-color: #0a0a0a;
          }

          .admin-auth-container {
            width: 100%;
            max-width: 440px;
          }

          .admin-auth-card {
            background: #111114;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 36px 32px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          }

          .auth-header {
            text-align: center;
            margin-bottom: 28px;
          }

          .auth-icon-badge {
            width: 52px;
            height: 52px;
            border-radius: 16px;
            background: #18181c;
            border: 1px solid rgba(255, 255, 255, 0.12);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }

          .auth-title {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: #ffffff;
            margin-bottom: 6px;
          }

          .auth-subtitle {
            font-size: 13px;
            color: #a1a1aa;
            line-height: 1.5;
          }

          .auth-error-banner {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(239, 68, 68, 0.12);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #fca5a5;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 13px;
            margin-bottom: 20px;
          }

          .passkey-section {
            margin-bottom: 24px;
          }

          .passkey-login-btn {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 13px 20px;
            background: #18181c;
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 14px;
            font-family: var(--font-heading);
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .passkey-login-btn:hover:not(:disabled) {
            background: #222227;
            border-color: rgba(255, 255, 255, 0.25);
          }

          .auth-divider {
            display: flex;
            align-items: center;
            text-align: center;
            margin: 20px 0 8px 0;
            color: #52525b;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .auth-divider::before,
          .auth-divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }

          .auth-divider span {
            padding: 0 12px;
          }

          .auth-form {
            display: flex;
            flex-direction: column;
            gap: 18px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .form-label {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #a1a1aa;
          }

          .form-input {
            width: 100%;
            padding: 12px 16px;
            background: #141418;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #ffffff;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s ease;
          }

          .form-input:focus {
            border-color: #ff4d00;
          }

          .auth-submit-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 13px 20px;
            background: #ff4d00;
            color: #ffffff;
            border: none;
            border-radius: 14px;
            font-family: var(--font-heading);
            font-size: 14px;
            font-weight: 800;
            cursor: pointer;
            transition: opacity 0.2s ease, transform 0.1s ease;
            margin-top: 6px;
          }

          .auth-submit-btn:hover:not(:disabled) {
            opacity: 0.92;
            transform: translateY(-1px);
          }

          .auth-submit-btn:disabled {
            opacity: 0.6;
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

  // ----------------------------------------------------
  // AUTHENTICATED: DASHBOARD VIEW
  // ----------------------------------------------------
  return (
    <div className="admin-dashboard-root">
      <div className="container">
        {/* Top Control Bar */}
        <div className="admin-header-bar">
          <div className="admin-identity">
            <div className="identity-badge">
              <ShieldCheck size={18} color="#ff4d00" />
              <span>TERMINAL ADMIN</span>
            </div>
            <h1 className="admin-title">System Control Center</h1>
          </div>

          <div className="admin-actions">
            <button 
              type="button" 
              className="action-pill-btn refresh-btn"
              onClick={loadData}
              disabled={dataLoading}
              title="Refresh Data"
            >
              <RefreshCw size={15} className={dataLoading ? 'spin-icon' : ''} />
              <span>Refresh</span>
            </button>

            <button 
              type="button" 
              className="action-pill-btn logout-btn"
              onClick={handleLogout}
              title="Sign Out"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs-nav">
          <button 
            type="button" 
            className={`admin-nav-tab ${activeTab === 'livechat' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('livechat')}
          >
            <MessageSquare size={16} />
            <span>Live DM Chat</span>
          </button>

          <button 
            type="button" 
            className={`admin-nav-tab ${activeTab === 'users' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} />
            <span>Users Directory & Logins</span>
            {users.length > 0 && <span className="tab-badge">{users.length}</span>}
          </button>

          <button 
            type="button" 
            className={`admin-nav-tab ${activeTab === 'tickets' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            <Mail size={16} />
            <span>Tickets & Inquiries</span>
            {tickets.filter(t => t.status === 'Sent' || !t.seen).length > 0 && (
              <span className="tab-badge">{tickets.filter(t => t.status === 'Sent' || !t.seen).length}</span>
            )}
          </button>

          <button 
            type="button" 
            className={`admin-nav-tab ${activeTab === 'payments' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <CreditCard size={16} />
            <span>Payments & Verifications</span>
            {payments.filter(p => p.status === 'pending').length > 0 && (
              <span className="tab-badge">{payments.filter(p => p.status === 'pending').length}</span>
            )}
          </button>

          <button 
            type="button" 
            className={`admin-nav-tab ${activeTab === 'leaderboard' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <Trophy size={16} />
            <span>Live Leaderboard</span>
          </button>

          <button 
            type="button" 
            className={`admin-nav-tab ${activeTab === 'security' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Fingerprint size={16} />
            <span>Passkeys & Security</span>
          </button>
        </div>

        {/* TAB 0: LIVE DM CHAT */}
        {activeTab === 'livechat' && (
          <div className="tab-pane-content">
            <AdminLiveChat initialChatUserId={selectedChatUserId} allUsers={users} />
          </div>
        )}

        {/* TAB 1: USERS DIRECTORY & LOGINS */}
        {activeTab === 'users' && (
          <div className="tab-pane-content">
            {/* Stat Cards */}
            <div className="users-stats-grid">
              <div className="user-stat-card">
                <div className="user-stat-icon-wrap">
                  <Users size={20} color="#ff4d00" />
                </div>
                <div className="user-stat-meta">
                  <span className="user-stat-number">{userStats.totalUsers || users.length}</span>
                  <span className="user-stat-label">Registered Accounts</span>
                </div>
              </div>

              <div className="user-stat-card">
                <div className="user-stat-icon-wrap">
                  <ShieldCheck size={20} color="#22c55e" />
                </div>
                <div className="user-stat-meta">
                  <span className="user-stat-number">{users.filter(u => u.email).length}</span>
                  <span className="user-stat-label">Active Logins</span>
                </div>
              </div>

              <div className="user-stat-card">
                <div className="user-stat-icon-wrap">
                  <Trash2 size={20} color="#f87171" />
                </div>
                <div className="user-stat-meta">
                  <span className="user-stat-number">{userStats.deletedCount}</span>
                  <span className="user-stat-label">Deleted Feedback Surveys</span>
                </div>
              </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="filter-controls-card">
              <div className="search-input-wrap">
                <Search size={16} color="#71717a" />
                <input 
                  type="text" 
                  placeholder="Search registered users by name, email, or username handle..." 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Users Directory Table */}
            {dataLoading && users.length === 0 ? (
              <div className="loading-state">
                <RefreshCw size={24} className="spin-icon" color="#ff4d00" />
                <p>Loading users directory...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <Users size={36} color="#52525b" />
                <h3>No Registered Users Found</h3>
                <p>Users who create an account or sign in with Google will appear in this directory in real time.</p>
              </div>
            ) : (
              <div className="users-table-container">
                <div className="users-table-header">
                  <span>User Profile</span>
                  <span>Registered Email</span>
                  <span>Username Handle</span>
                  <span>Joined Date</span>
                  <span style={{ textAlign: 'right' }}>Direct Action</span>
                </div>

                <div className="users-table-body">
                  {users
                    .filter((u) => {
                      const q = userSearch.toLowerCase();
                      return (
                        (u.name && u.name.toLowerCase().includes(q)) ||
                        (u.email && u.email.toLowerCase().includes(q)) ||
                        (u.username && u.username.toLowerCase().includes(q))
                      );
                    })
                    .map((u) => (
                      <div key={u.uid} className="user-table-row">
                        <div className="user-cell-profile">
                          {u.photo ? (
                            <img src={u.photo} alt={u.name} className="user-cell-avatar" />
                          ) : (
                            <div className="user-cell-fallback">
                              {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="user-cell-names">
                            <span className="user-cell-name">{u.name || 'Anonymous User'}</span>
                            <span className="user-cell-uid">ID: {u.uid.slice(0, 10)}...</span>
                          </div>
                        </div>

                        <div className="user-cell-email">
                          <span>{u.email || 'No email provided'}</span>
                        </div>

                        <div className="user-cell-handle">
                          <span className="handle-tag">@{u.username || 'user'}</span>
                        </div>

                        <div className="user-cell-date">
                          <span>{u.createdAt ? (u.createdAt.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString() : new Date(u.createdAt).toLocaleDateString()) : 'Recently'}</span>
                        </div>

                        <div className="user-cell-actions">
                          <button
                            type="button"
                            className="start-dm-btn"
                            onClick={() => {
                              setSelectedChatUserId(u.uid);
                              setActiveTab('livechat');
                            }}
                            title="Start Direct Message"
                          >
                            <MessageSquare size={13} />
                            <span>Send DM</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TICKETS */}
        {activeTab === 'tickets' && (
          <div className="tab-pane-content">
            {/* Filter / Search Bar */}
            <div className="filter-controls-card">
              <div className="search-input-wrap">
                <Search size={16} color="#71717a" />
                <input 
                  type="text" 
                  placeholder="Search inquiries by name, email, subject, or message..." 
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadData()}
                />
              </div>

              <div className="filter-pills-row">
                {['all', 'Sent', 'Replied', 'Closed'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`filter-pill ${ticketStatusFilter === st ? 'pill-active' : ''}`}
                    onClick={() => setTicketStatusFilter(st)}
                  >
                    {st === 'all' ? 'All Inquiries' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Tickets Grid / List */}
            {dataLoading && tickets.length === 0 ? (
              <div className="loading-state">
                <RefreshCw size={24} className="spin-icon" color="#ff4d00" />
                <p>Loading inquiries...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="empty-state">
                <Mail size={36} color="#3f3f46" />
                <h3>No inquiries found</h3>
                <p>No messages match your current filters.</p>
              </div>
            ) : (
              <div className="tickets-list">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className={`ticket-card ${ticket.status === 'Sent' ? 'ticket-unread' : ''}`}>
                    <div className="ticket-card-header">
                      <div className="ticket-user-meta">
                        {ticket.profilePhoto ? (
                          <img src={ticket.profilePhoto} alt={ticket.name} className="ticket-avatar-img" />
                        ) : (
                          <div className="ticket-avatar-fallback">
                            {(ticket.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="user-name-row">
                            <span className="user-name">{ticket.name || 'Anonymous User'}</span>
                            {ticket.username && (
                              <span className="user-handle">@{ticket.username}</span>
                            )}
                          </div>
                          <span className="user-email">{ticket.email || 'No email specified'}</span>
                        </div>
                      </div>

                      <div className="ticket-badge-time">
                        <span className={`status-tag status-${(ticket.status || 'sent').toLowerCase()}`}>
                          {ticket.status || 'Sent'}
                        </span>
                        <span className="ticket-timestamp">{formatDate(ticket.createdAt)}</span>
                      </div>
                    </div>

                    <div className="ticket-body">
                      <h4 className="ticket-title">{ticket.title || 'Inquiry Subject'}</h4>
                      <p className="ticket-details">{ticket.details}</p>

                      {ticket.reply && (
                        <div className="ticket-reply-box">
                          <div className="reply-header">
                            <Send size={13} color="#ff4d00" />
                            <span>Your Admin Reply:</span>
                            {ticket.repliedAt && (
                              <span className="reply-date">({formatDate(ticket.repliedAt)})</span>
                            )}
                          </div>
                          <p className="reply-text">{ticket.reply}</p>
                        </div>
                      )}
                    </div>

                    <div className="ticket-actions-bar">
                      <button 
                        type="button" 
                        className="ticket-action-btn reply-btn"
                        onClick={() => {
                          setReplyingTicket(ticket);
                          setReplyText(ticket.reply || '');
                        }}
                      >
                        <Send size={14} />
                        <span>{ticket.reply ? 'Edit Reply' : 'Send Reply'}</span>
                      </button>

                      <div className="ticket-secondary-actions">
                        {ticket.status !== 'Closed' && (
                          <button 
                            type="button" 
                            className="status-toggle-btn"
                            onClick={() => handleUpdateTicketStatus(ticket.id, 'Closed')}
                            title="Mark Closed"
                          >
                            <CheckCircle2 size={15} />
                            <span>Mark Closed</span>
                          </button>
                        )}

                        {ticket.status === 'Closed' && (
                          <button 
                            type="button" 
                            className="status-toggle-btn"
                            onClick={() => handleUpdateTicketStatus(ticket.id, 'Replied')}
                            title="Reopen"
                          >
                            <Clock size={15} />
                            <span>Reopen</span>
                          </button>
                        )}

                        <button 
                          type="button" 
                          className="delete-icon-btn"
                          onClick={() => handleDeleteTicket(ticket.id)}
                          title="Delete Ticket"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAYMENTS & VERIFICATION */}
        {activeTab === 'payments' && (
          <div className="tab-pane-content">
            {/* Filter / Search Bar */}
            <div className="filter-controls-card">
              <div className="search-input-wrap">
                <Search size={16} color="#71717a" />
                <input 
                  type="text" 
                  placeholder="Search by transaction ID, contributor name, or message..." 
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadData()}
                />
              </div>

              <div className="filter-pills-row">
                {['all', 'pending', 'success', 'failed'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`filter-pill ${paymentStatusFilter === st ? 'pill-active' : ''}`}
                    onClick={() => setPaymentStatusFilter(st)}
                  >
                    {st === 'all' ? 'All Payments' : st.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Payments List */}
            {dataLoading && payments.length === 0 ? (
              <div className="loading-state">
                <RefreshCw size={24} className="spin-icon" color="#ff4d00" />
                <p>Loading transactions...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="empty-state">
                <CreditCard size={36} color="#3f3f46" />
                <h3>No payment submissions</h3>
                <p>No transactions found matching criteria.</p>
              </div>
            ) : (
              <div className="payments-grid">
                {payments.map((p) => (
                  <div key={p.id} className="payment-card">
                    <div className="payment-top-row">
                      <div className="payment-amount-wrap">
                        <span className="payment-currency">₹</span>
                        <span className="payment-amount">{Number(p.amount || 0).toLocaleString()}</span>
                      </div>
                      <span className={`status-tag status-${(p.status || 'pending').toLowerCase()}`}>
                        {p.status || 'pending'}
                      </span>
                    </div>

                    <div className="payment-donor-info">
                      {p.profilePhotoUrl ? (
                        <img 
                          src={p.profilePhotoUrl} 
                          alt={p.name} 
                          className="donor-avatar-img"
                          onClick={() => setPreviewImage(p.profilePhotoUrl)}
                          title="Click to zoom profile photo"
                        />
                      ) : (
                        <div className="donor-avatar-fallback">
                          {(p.name || 'D').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="donor-name">{p.name || 'Anonymous Supporter'}</h4>
                        <span className="payment-date">{formatDate(p.createdAt)}</span>
                      </div>
                    </div>

                    {p.transactionId && (
                      <div className="transaction-id-pill">
                        <span className="tx-label">TXN ID:</span>
                        <span className="tx-val">{p.transactionId}</span>
                      </div>
                    )}

                    {p.message && (
                      <p className="donor-message">"{p.message}"</p>
                    )}

                    {p.paymentProofUrl && (
                      <div className="payment-proof-preview" onClick={() => setPreviewImage(p.paymentProofUrl)}>
                        <img src={p.paymentProofUrl} alt="Payment Proof" />
                        <div className="proof-overlay">
                          <Eye size={16} />
                          <span>View Proof Screenshot</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="payment-card-actions">
                      {p.status !== 'success' && (
                        <button 
                          type="button" 
                          className="pay-btn approve-btn"
                          onClick={() => handleUpdatePaymentStatus(p.id, 'success')}
                        >
                          <Check size={14} />
                          <span>Approve (Live)</span>
                        </button>
                      )}

                      {p.status !== 'failed' && (
                        <button 
                          type="button" 
                          className="pay-btn reject-btn"
                          onClick={() => handleUpdatePaymentStatus(p.id, 'failed')}
                        >
                          <X size={14} />
                          <span>Mark Failed</span>
                        </button>
                      )}

                      <button 
                        type="button" 
                        className="delete-icon-btn"
                        onClick={() => handleDeletePayment(p.id, p.status)}
                        title="Delete Record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="tab-pane-content">
            <div className="leaderboard-preview-card">
              <div className="lb-header">
                <div className="lb-title-wrap">
                  <Trophy size={20} color="#ff4d00" />
                  <h3>Live Public Leaderboard</h3>
                </div>
                <span className="lb-count-pill">{leaderboard.length} Top Contributors</span>
              </div>

              {leaderboard.length === 0 ? (
                <div className="empty-state">
                  <Trophy size={36} color="#3f3f46" />
                  <h3>Leaderboard is empty</h3>
                  <p>Approved payments with 'success' status appear here automatically.</p>
                </div>
              ) : (
                <div className="leaderboard-table-wrap">
                  <table className="leaderboard-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Contributor</th>
                        <th>Amount (INR)</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry) => (
                        <tr key={entry.id || entry.rank}>
                          <td className="rank-cell">
                            <span className={`rank-badge rank-${entry.rank <= 3 ? entry.rank : 'default'}`}>
                              #{entry.rank}
                            </span>
                          </td>
                          <td className="contributor-cell">
                            <div className="contributor-profile">
                              {entry.profilePhotoUrl ? (
                                <img src={entry.profilePhotoUrl} alt={entry.name} className="contributor-avatar" />
                              ) : (
                                <div className="contributor-avatar-fallback">
                                  {(entry.name || 'C').charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="contributor-name">{entry.name}</span>
                            </div>
                          </td>
                          <td className="amount-cell">
                            ₹{Number(entry.amount || 0).toLocaleString()}
                          </td>
                          <td className="date-cell">
                            {formatDate(entry.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PASSKEYS & SECURITY */}
        {activeTab === 'security' && (
          <div className="tab-pane-content">
            <div className="security-management-grid">
              {/* Device Registration Card */}
              <div className="security-card">
                <div className="sec-header">
                  <div className="sec-icon-wrap">
                    <Fingerprint size={20} color="#ff4d00" />
                  </div>
                  <div>
                    <h3 className="sec-title">Biometric Passkey Devices</h3>
                    <p className="sec-sub">Fast, hardware-grade authentication via TouchID, FaceID, or Windows Hello</p>
                  </div>
                </div>

                {!isRegisteringDevice ? (
                  <button 
                    type="button" 
                    className="add-device-btn"
                    onClick={() => setIsRegisteringDevice(true)}
                  >
                    <Plus size={16} />
                    <span>Register Current Browser / Device</span>
                  </button>
                ) : (
                  <div className="register-device-form">
                    <label className="form-label">Friendly Device Name</label>
                    <div className="input-with-button">
                      <input 
                        type="text" 
                        placeholder="e.g. MacBook Pro, Workstation, iPhone..."
                        value={newDeviceName}
                        onChange={(e) => setNewDeviceName(e.target.value)}
                      />
                      <button 
                        type="button" 
                        className="save-device-btn"
                        onClick={handleRegisterPasskey}
                        disabled={actionLoading}
                      >
                        {actionLoading ? 'Enrolling...' : 'Enroll Key'}
                      </button>
                      <button 
                        type="button" 
                        className="cancel-device-btn"
                        onClick={() => setIsRegisteringDevice(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Device List */}
                <div className="devices-list">
                  {devices.length === 0 ? (
                    <div className="no-devices-box">
                      <Smartphone size={24} color="#52525b" />
                      <p>No passkey devices enrolled yet. Enroll your current device above for instant passwordless sign in.</p>
                    </div>
                  ) : (
                    devices.map((d) => (
                      <div key={d.id} className="device-item-card">
                        <div className="device-meta">
                          <Laptop size={18} color="#a1a1aa" />
                          <div>
                            <h4 className="device-name">{d.deviceName || 'Hardware Passkey'}</h4>
                            <span className="device-sub">
                              Enrolled: {formatDate(d.createdAt)} {d.lastUsedAt ? `• Last Used: ${formatDate(d.lastUsedAt)}` : ''}
                            </span>
                          </div>
                        </div>

                        <button 
                          type="button" 
                          className="delete-icon-btn"
                          onClick={() => handleRemoveDevice(d.id)}
                          title="Remove Passkey Device"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Admin Session Info Card */}
              <div className="security-card session-card">
                <div className="sec-header">
                  <div className="sec-icon-wrap">
                    <Shield size={20} color="#ff4d00" />
                  </div>
                  <div>
                    <h3 className="sec-title">Active Admin Session</h3>
                    <p className="sec-sub">Authentication tokens and access permissions</p>
                  </div>
                </div>

                <div className="session-info-rows">
                  <div className="info-row">
                    <span className="info-label">Active Operator:</span>
                    <span className="info-val">{adminUser}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Access Level:</span>
                    <span className="info-val high-clearance">Full Administrator</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Session Token:</span>
                    <span className="info-val mono-font">JWT Bearer (30 min auto-refresh)</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="revoke-session-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  <span>Terminate Active Session</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: REPLY TO TICKET */}
      {replyingTicket && (
        <div className="modal-backdrop" onClick={() => setReplyingTicket(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Reply to Inquiry</h3>
                <p className="modal-subtitle">Inquiry from {replyingTicket.name} ({replyingTicket.email})</p>
              </div>
              <button type="button" className="close-modal-btn" onClick={() => setReplyingTicket(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="original-inquiry-box">
                <span className="orig-label">Subject: {replyingTicket.title}</span>
                <p className="orig-text">{replyingTicket.details}</p>
              </div>

              <div className="form-group">
                <label className="form-label">Your Response / Message</label>
                <textarea
                  className="reply-textarea"
                  rows={6}
                  placeholder="Write your official reply to this client/inquiry..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setReplyingTicket(null)}
              >
                Cancel
              </button>

              <button 
                type="button" 
                className="send-reply-modal-btn"
                onClick={handleSendReply}
                disabled={actionLoading || !replyText.trim()}
              >
                {actionLoading ? 'Sending...' : 'Send & Mark Replied'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IMAGE LIGHTBOX */}
      {previewImage && (
        <div className="modal-backdrop image-lightbox" onClick={() => setPreviewImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close-lightbox-btn" onClick={() => setPreviewImage(null)}>
              <X size={20} />
            </button>
            <img src={previewImage} alt="Payment Proof Fullscreen" className="lightbox-img" />
          </div>
        </div>
      )}

      <style>{`
        .admin-dashboard-root {
          min-height: 100vh;
          padding: 100px 0 80px 0;
          background-color: #0a0a0a;
          color: #f8fafc;
        }

        .admin-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .identity-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #ff4d00;
          margin-bottom: 8px;
        }

        .admin-title {
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .admin-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .action-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 9999px;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .refresh-btn {
          background: #18181c;
          color: #ffffff;
        }

        .refresh-btn:hover:not(:disabled) {
          background: #222228;
        }

        .logout-btn {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.25);
          color: #fca5a5;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        /* Tabs Nav */
        .admin-tabs-nav {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px;
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          margin-bottom: 28px;
          overflow-x: auto;
        }

        .admin-nav-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: transparent;
          color: #a1a1aa;
          border: none;
          border-radius: 12px;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .admin-nav-tab:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
        }

        .admin-nav-tab.active-tab {
          background: #1c1c22;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .tab-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          background: #ff4d00;
          color: #ffffff;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 800;
        }

        /* Filter Controls */
        .filter-controls-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 20px;
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .search-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 260px;
          background: #16161b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 8px 14px;
        }

        .search-input-wrap input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 13px;
        }

        .filter-pills-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-pill {
          padding: 6px 14px;
          background: #16161b;
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #a1a1aa;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-pill:hover {
          color: #ffffff;
        }

        .filter-pill.pill-active {
          background: #ff4d00;
          color: #ffffff;
          border-color: #ff4d00;
        }

        /* Empty / Loading States */
        .loading-state, .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
        }

        .empty-state h3 {
          font-size: 18px;
          color: #ffffff;
          margin: 12px 0 4px 0;
        }

        .empty-state p, .loading-state p {
          color: #71717a;
          font-size: 13px;
        }

        /* Users Stats Grid */
        .users-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .user-stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
        }

        .user-stat-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #18181f;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-stat-meta {
          display: flex;
          flex-direction: column;
        }

        .user-stat-number {
          font-size: 24px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .user-stat-label {
          font-size: 12px;
          color: #a1a1aa;
        }

        /* Users Table Container */
        .users-table-container {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          overflow: hidden;
        }

        .users-table-header {
          display: grid;
          grid-template-columns: 2fr 2fr 1.5fr 1.2fr 1.2fr;
          padding: 14px 20px;
          background: #15151a;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #71717a;
        }

        .users-table-body {
          display: flex;
          flex-direction: column;
        }

        .user-table-row {
          display: grid;
          grid-template-columns: 2fr 2fr 1.5fr 1.2fr 1.2fr;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: background 0.2s ease;
        }

        .user-table-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .user-table-row:last-child {
          border-bottom: none;
        }

        .user-cell-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-cell-avatar, .user-cell-fallback {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .user-cell-fallback {
          background: #ff4d00;
          color: #ffffff;
          font-weight: 800;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-cell-names {
          display: flex;
          flex-direction: column;
        }

        .user-cell-name {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .user-cell-uid {
          font-size: 10px;
          color: #71717a;
          font-family: monospace;
        }

        .user-cell-email {
          font-size: 13px;
          color: #d4d4d8;
        }

        .handle-tag {
          display: inline-block;
          padding: 2px 8px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          font-size: 12px;
          color: #ff4d00;
          font-weight: 700;
        }

        .user-cell-date {
          font-size: 12px;
          color: #71717a;
        }

        .user-cell-actions {
          display: flex;
          justify-content: flex-end;
        }

        .start-dm-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: #ff4d00;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
        }

        .start-dm-btn:hover {
          background: #ff6a26;
          transform: translateY(-1px);
        }

        /* Tickets List */
        .tickets-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ticket-card {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 24px;
          transition: border-color 0.2s ease;
        }

        .ticket-card:hover {
          border-color: rgba(255, 255, 255, 0.16);
        }

        .ticket-card.ticket-unread {
          border-left: 3px solid #ff4d00;
        }

        .ticket-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .ticket-user-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ticket-avatar-img, .ticket-avatar-fallback {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          object-fit: cover;
        }

        .ticket-avatar-fallback {
          background: #22222a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          font-weight: 800;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-name {
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
        }

        .user-handle {
          font-size: 12px;
          color: #71717a;
        }

        .user-email {
          font-size: 12px;
          color: #a1a1aa;
        }

        .ticket-badge-time {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-tag {
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-sent, .status-pending {
          background: rgba(234, 179, 8, 0.12);
          color: #facc15;
          border: 1px solid rgba(234, 179, 8, 0.25);
        }

        .status-replied, .status-success {
          background: rgba(34, 197, 94, 0.12);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }

        .status-closed, .status-failed {
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        .ticket-timestamp {
          font-size: 12px;
          color: #71717a;
        }

        .ticket-body {
          margin-bottom: 20px;
        }

        .ticket-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .ticket-details {
          font-size: 14px;
          color: #d4d4d8;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .ticket-reply-box {
          margin-top: 14px;
          padding: 14px 16px;
          background: #16161c;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
        }

        .reply-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .reply-date {
          font-size: 11px;
          color: #71717a;
          font-weight: 500;
        }

        .reply-text {
          font-size: 13px;
          color: #a1a1aa;
          line-height: 1.5;
        }

        .ticket-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          flex-wrap: wrap;
          gap: 12px;
        }

        .ticket-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 9999px;
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .reply-btn {
          background: #ff4d00;
          color: #ffffff;
        }

        .reply-btn:hover {
          opacity: 0.9;
        }

        .ticket-secondary-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          background: #18181c;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #a1a1aa;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .status-toggle-btn:hover {
          color: #ffffff;
          background: #222228;
        }

        .delete-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .delete-icon-btn:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        /* PAYMENTS GRID */
        .payments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .payment-card {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .payment-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .payment-amount-wrap {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .payment-currency {
          font-size: 16px;
          font-weight: 800;
          color: #ff4d00;
        }

        .payment-amount {
          font-size: 24px;
          font-weight: 900;
          color: #ffffff;
        }

        .payment-donor-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .donor-avatar-img, .donor-avatar-fallback {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          object-fit: cover;
          cursor: pointer;
        }

        .donor-avatar-fallback {
          background: #202028;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .donor-name {
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
        }

        .payment-date {
          font-size: 11px;
          color: #71717a;
        }

        .transaction-id-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #16161c;
          padding: 6px 10px;
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
        }

        .tx-label { color: #71717a; }
        .tx-val { color: #d4d4d8; font-weight: 700; }

        .donor-message {
          font-size: 13px;
          color: #a1a1aa;
          font-style: italic;
          line-height: 1.5;
        }

        .payment-proof-preview {
          position: relative;
          width: 100%;
          height: 120px;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .payment-proof-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .payment-proof-preview:hover img {
          transform: scale(1.04);
        }

        .proof-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .payment-proof-preview:hover .proof-overlay {
          opacity: 1;
        }

        .payment-card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .pay-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        .approve-btn {
          background: #22c55e;
          color: #000000;
        }

        .approve-btn:hover {
          background: #16a34a;
        }

        .reject-btn {
          background: #27272a;
          color: #f87171;
        }

        .reject-btn:hover {
          background: #3f3f46;
        }

        /* LEADERBOARD TABLE */
        .leaderboard-preview-card {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 24px;
        }

        .lb-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .lb-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .lb-title-wrap h3 {
          font-size: 18px;
          color: #ffffff;
        }

        .lb-count-pill {
          font-size: 12px;
          padding: 4px 10px;
          background: #18181c;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          color: #a1a1aa;
          font-weight: 700;
        }

        .leaderboard-table-wrap {
          overflow-x: auto;
        }

        .leaderboard-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .leaderboard-table th {
          padding: 12px 16px;
          font-size: 11px;
          font-weight: 800;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .leaderboard-table td {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          font-size: 13px;
        }

        .rank-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          font-weight: 800;
          font-size: 12px;
        }

        .rank-1 { background: rgba(255, 215, 0, 0.2); color: #ffd700; border: 1px solid rgba(255, 215, 0, 0.4); }
        .rank-2 { background: rgba(192, 192, 192, 0.2); color: #e2e8f0; border: 1px solid rgba(192, 192, 192, 0.4); }
        .rank-3 { background: rgba(205, 127, 50, 0.2); color: #f97316; border: 1px solid rgba(205, 127, 50, 0.4); }
        .rank-default { background: #18181c; color: #a1a1aa; }

        .contributor-profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .contributor-avatar, .contributor-avatar-fallback {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          object-fit: cover;
        }

        .contributor-avatar-fallback {
          background: #202026;
          color: #ffffff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        }

        .contributor-name {
          font-weight: 700;
          color: #ffffff;
        }

        .amount-cell {
          font-weight: 800;
          color: #ffffff;
          font-family: var(--font-mono);
        }

        .date-cell {
          color: #71717a;
          font-size: 12px;
        }

        /* SECURITY TAB */
        .security-management-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        .security-card {
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 26px;
        }

        .sec-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 22px;
        }

        .sec-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #18181c;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sec-title {
          font-size: 16px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .sec-sub {
          font-size: 12px;
          color: #a1a1aa;
          line-height: 1.5;
        }

        .add-device-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 18px;
          background: #18181c;
          border: 1px dashed rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 20px;
        }

        .add-device-btn:hover {
          background: #202026;
          border-color: #ff4d00;
        }

        .register-device-form {
          margin-bottom: 20px;
          background: #16161c;
          padding: 16px;
          border-radius: 12px;
        }

        .input-with-button {
          display: flex;
          gap: 8px;
          margin-top: 6px;
          flex-wrap: wrap;
        }

        .input-with-button input {
          flex: 1;
          min-width: 160px;
          padding: 10px 14px;
          background: #101014;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #ffffff;
          font-size: 13px;
          outline: none;
        }

        .save-device-btn {
          padding: 10px 16px;
          background: #ff4d00;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
        }

        .cancel-device-btn {
          padding: 10px 14px;
          background: transparent;
          color: #a1a1aa;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-size: 12px;
          cursor: pointer;
        }

        .devices-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .no-devices-box {
          text-align: center;
          padding: 24px;
          background: #141418;
          border-radius: 12px;
          color: #71717a;
          font-size: 12px;
        }

        .no-devices-box p {
          margin-top: 8px;
          line-height: 1.5;
        }

        .device-item-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
        }

        .device-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .device-name {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .device-sub {
          font-size: 11px;
          color: #71717a;
        }

        .session-info-rows {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: #141418;
          border-radius: 10px;
          font-size: 12px;
        }

        .info-label { color: #a1a1aa; }
        .info-val { color: #ffffff; font-weight: 700; }
        .high-clearance { color: #4ade80; }
        .mono-font { font-family: var(--font-mono); font-size: 11px; }

        .revoke-session-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #fca5a5;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .revoke-session-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        /* MODALS */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-card {
          width: 100%;
          max-width: 580px;
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
        }

        .modal-subtitle {
          font-size: 12px;
          color: #a1a1aa;
          margin-top: 2px;
        }

        .close-modal-btn {
          background: transparent;
          border: none;
          color: #71717a;
          cursor: pointer;
          padding: 4px;
        }

        .close-modal-btn:hover { color: #ffffff; }

        .original-inquiry-box {
          background: #16161c;
          padding: 14px;
          border-radius: 12px;
          margin-bottom: 16px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .orig-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .orig-text {
          font-size: 13px;
          color: #a1a1aa;
          line-height: 1.5;
        }

        .reply-textarea {
          width: 100%;
          padding: 14px;
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
          resize: vertical;
        }

        .reply-textarea:focus {
          border-color: #ff4d00;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
        }

        .cancel-btn {
          padding: 10px 18px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #a1a1aa;
          border-radius: 10px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
        }

        .send-reply-modal-btn {
          padding: 10px 20px;
          background: #ff4d00;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .send-reply-modal-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Lightbox */
        .image-lightbox {
          cursor: zoom-out;
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 85vh;
          border-radius: 14px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .close-lightbox-btn {
          position: absolute;
          top: -16px;
          right: -16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #18181c;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .admin-header-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .admin-actions {
            width: 100%;
            justify-content: space-between;
          }
          .payments-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
