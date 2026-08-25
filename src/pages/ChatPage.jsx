import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Smile, 
  Heart, 
  ShieldCheck, 
  ArrowLeft, 
  MoreVertical, 
  Check, 
  CheckCheck, 
  Sparkles, 
  User, 
  LogIn, 
  RefreshCw,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  subscribeChatMessages, 
  sendUserChatMessage, 
  toggleMessageReaction 
} from '../lib/chatService';
import { portfolioData } from '../data/portfolioData';

const QUICK_EMOJIS = ['❤️', '🔥', '👋', '🚀', '👍', '💯', '✨', '⚡'];

export default function ChatPage() {
  const { currentUser, openAuthModal } = useAuth();
  const { profile } = portfolioData;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' | 'info'
  const messagesEndRef = useRef(null);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = subscribeChatMessages(currentUser.uid, (chatMsgs) => {
      setMessages(chatMsgs);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || sending || !currentUser) return;

    const textToSend = inputText;
    setInputText('');
    setShowEmojiPicker(false);
    setSending(true);

    try {
      await sendUserChatMessage(currentUser, textToSend);
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleQuickEmoji = (emoji) => {
    setInputText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleHeartReaction = async (messageId) => {
    if (!currentUser) return;
    try {
      await toggleMessageReaction(currentUser.uid, messageId, '❤️', currentUser.uid);
    } catch (err) {
      console.warn('Reaction error:', err);
    }
  };

  const formatMessageTime = (createdAt) => {
    if (!createdAt) return 'Just now';
    try {
      const d = createdAt.seconds ? new Date(createdAt.seconds * 1000) : new Date(createdAt);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="ig-chat-page-root">
      <div className="ig-chat-container">
        {/* Left Sidebar / Direct List */}
        <aside className="ig-chat-sidebar">
          {/* Sidebar Top Header */}
          <div className="ig-sidebar-header">
            <div className="ig-handle-wrap">
              <span className="ig-user-handle">
                {currentUser?.displayName ? currentUser.displayName.toLowerCase().replace(/\s+/g, '_') : 'direct_messages'}
              </span>
              <span className="ig-badge-pill">DMs</span>
            </div>
            <Link to="/" className="ig-back-home" title="Back to Portfolio">
              <ArrowLeft size={18} />
            </Link>
          </div>

          {/* Direct Channels List */}
          <div className="ig-sidebar-convos">
            <div className="ig-convo-item active-convo">
              <div className="ig-avatar-wrap">
                <img 
                  src="/assets/bhavesh-profile.png" 
                  alt="Bhavesh Patil" 
                  className="ig-convo-avatar"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';
                  }}
                />
                <span className="ig-online-dot" />
              </div>

              <div className="ig-convo-meta">
                <div className="ig-convo-name-row">
                  <span className="ig-convo-name">Bhavesh Patil</span>
                  <ShieldCheck size={14} color="#ff4d00" />
                </div>
                <span className="ig-convo-preview">
                  {messages.length > 0 ? messages[messages.length - 1].text : 'Available for chat & inquiries'}
                </span>
              </div>
            </div>
          </div>

          {/* User Status Footer */}
          <div className="ig-sidebar-footer">
            {currentUser ? (
              <div className="ig-user-bar">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Me" className="ig-user-thumb" />
                ) : (
                  <div className="ig-user-thumb-fallback">
                    {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="ig-user-info-text">
                  <span className="ig-user-display">{currentUser.displayName || 'You'}</span>
                  <span className="ig-user-online-tag">Active now</span>
                </div>
              </div>
            ) : (
              <button 
                type="button" 
                className="ig-sidebar-login-btn"
                onClick={() => openAuthModal('signin')}
              >
                <LogIn size={14} />
                <span>Sign in to Chat</span>
              </button>
            )}
          </div>
        </aside>

        {/* Right Main Chat Thread Area */}
        <main className="ig-chat-main">
          {/* Chat Top Header */}
          <div className="ig-chat-header">
            <div className="ig-header-profile">
              <div className="ig-header-avatar-box">
                <img 
                  src="/assets/bhavesh-profile.png" 
                  alt="Bhavesh Patil" 
                  className="ig-header-avatar"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';
                  }}
                />
                <span className="ig-header-pulse-dot" />
              </div>
              <div className="ig-header-title-box">
                <div className="ig-header-name-row">
                  <span className="ig-header-name">Bhavesh Patil</span>
                  <ShieldCheck size={15} color="#ff4d00" />
                </div>
                <span className="ig-header-status">Active now • Full Stack Developer & Platform Admin</span>
              </div>
            </div>

            <div className="ig-header-actions">
              <Link to="/contact" className="ig-header-btn" title="Contact Details">
                <Info size={18} />
              </Link>
            </div>
          </div>

          {/* Chat Message Stream */}
          <div className="ig-messages-stream">
            {/* Header Hero in Chat Stream */}
            <div className="ig-stream-hero">
              <div className="ig-hero-avatar-ring">
                <img 
                  src="/assets/bhavesh-profile.png" 
                  alt="Bhavesh" 
                  className="ig-hero-avatar"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';
                  }}
                />
              </div>
              <h2 className="ig-hero-name">Bhavesh Patil</h2>
              <p className="ig-hero-handle">@bhaveshpatil-ks • Full Stack Developer</p>
              <p className="ig-hero-bio">
                Direct communication channel for freelance inquiries, system architecture, feedback, and collaborations.
              </p>
              <div className="ig-hero-divider">
                <span>Today</span>
              </div>
            </div>

            {/* Messages List */}
            {messages.length === 0 ? (
              <div className="ig-welcome-prompt">
                <Sparkles size={20} color="#ff4d00" />
                <p>Say hi! Start a direct conversation with Bhavesh.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUser?.uid;
                const hasReactions = msg.reactions && Object.keys(msg.reactions).length > 0;

                return (
                  <div 
                    key={msg.id} 
                    className={`ig-message-row ${isMe ? 'ig-msg-me' : 'ig-msg-them'}`}
                  >
                    {!isMe && (
                      <img 
                        src="/assets/bhavesh-profile.png" 
                        alt="Bhavesh" 
                        className="ig-msg-avatar"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';
                        }}
                      />
                    )}

                    <div className="ig-bubble-container">
                      <div 
                        className={`ig-bubble ${isMe ? 'ig-bubble-me' : 'ig-bubble-them'}`}
                        onDoubleClick={() => handleHeartReaction(msg.id)}
                      >
                        <p className="ig-bubble-text">{msg.text}</p>
                      </div>

                      {/* Reactions & Hover Actions */}
                      <div className="ig-bubble-meta-row">
                        <span className="ig-msg-timestamp">{formatMessageTime(msg.createdAt)}</span>

                        {hasReactions && (
                          <div className="ig-reactions-pill">
                            {Object.entries(msg.reactions).map(([emoji, userIds]) => (
                              <span key={emoji} className="ig-reaction-badge">
                                {emoji} {userIds.length > 1 && userIds.length}
                              </span>
                            ))}
                          </div>
                        )}

                        <button 
                          type="button" 
                          className="ig-heart-action-btn"
                          onClick={() => handleHeartReaction(msg.id)}
                          title="Like message"
                        >
                          <Heart size={12} className={msg.reactions?.['❤️']?.includes(currentUser?.uid) ? 'hearted' : ''} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          {currentUser ? (
            <div className="ig-input-footer">
              {/* Quick Emojis Drawer */}
              {showEmojiPicker && (
                <div className="ig-emoji-drawer">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button 
                      key={emoji} 
                      type="button" 
                      className="ig-emoji-btn" 
                      onClick={() => handleQuickEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSend} className="ig-input-pill">
                <button 
                  type="button" 
                  className="ig-smile-btn"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Insert Emoji"
                >
                  <Smile size={20} />
                </button>

                <input 
                  type="text" 
                  className="ig-text-input" 
                  placeholder="Message..." 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  autoFocus
                />

                {inputText.trim() ? (
                  <button type="submit" className="ig-send-btn" disabled={sending}>
                    <span>Send</span>
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="ig-like-quick-btn"
                    onClick={() => {
                      setInputText('❤️');
                    }}
                    title="Send Heart"
                  >
                    <Heart size={20} />
                  </button>
                )}
              </form>
            </div>
          ) : (
            <div className="ig-login-banner">
              <div className="ig-login-prompt">
                <User size={18} color="#ff4d00" />
                <span>Sign in with Google or Email to start chatting with Bhavesh</span>
              </div>
              <button 
                type="button" 
                className="ig-login-action-btn"
                onClick={() => openAuthModal('signin')}
              >
                Sign In
              </button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .ig-chat-page-root {
          min-height: 100vh;
          background: #0a0a0c;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 85px 20px 20px 20px;
          color: #ffffff;
          font-family: var(--font-body);
        }

        .ig-chat-container {
          width: 100%;
          max-width: 1100px;
          height: calc(100vh - 110px);
          min-height: 600px;
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          display: grid;
          grid-template-columns: 320px 1fr;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.75);
        }

        /* ─── Sidebar ─── */
        .ig-chat-sidebar {
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          background: #0d0d10;
          display: flex;
          flex-direction: column;
        }

        .ig-sidebar-header {
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .ig-handle-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ig-user-handle {
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .ig-badge-pill {
          font-size: 10px;
          font-weight: 800;
          background: rgba(255, 77, 0, 0.15);
          color: #ff4d00;
          padding: 2px 6px;
          border-radius: 6px;
        }

        .ig-back-home {
          color: #71717a;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .ig-back-home:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .ig-sidebar-convos {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ig-convo-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .ig-convo-item:hover, .active-convo {
          background: #18181f;
        }

        .ig-avatar-wrap {
          position: relative;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
        }

        .ig-convo-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ig-online-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          background: #22c55e;
          border: 2px solid #0d0d10;
          border-radius: 50%;
        }

        .ig-convo-meta {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .ig-convo-name-row {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .ig-convo-name {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .ig-convo-preview {
          font-size: 12px;
          color: #71717a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ig-sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .ig-user-bar {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ig-user-thumb, .ig-user-thumb-fallback {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
        }

        .ig-user-thumb-fallback {
          background: #ff4d00;
          color: #ffffff;
          font-weight: 800;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ig-user-info-text {
          display: flex;
          flex-direction: column;
        }

        .ig-user-display {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
        }

        .ig-user-online-tag {
          font-size: 10px;
          color: #22c55e;
        }

        .ig-sidebar-login-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: #ff4d00;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
        }

        /* ─── Main Chat Area ─── */
        .ig-chat-main {
          display: flex;
          flex-direction: column;
          background: #111114;
          position: relative;
        }

        .ig-chat-header {
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(17, 17, 20, 0.95);
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        .ig-header-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ig-header-avatar-box {
          position: relative;
          width: 38px;
          height: 38px;
        }

        .ig-header-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .ig-header-pulse-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          background: #22c55e;
          border: 2px solid #111114;
          border-radius: 50%;
        }

        .ig-header-title-box {
          display: flex;
          flex-direction: column;
        }

        .ig-header-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ig-header-name {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
        }

        .ig-header-status {
          font-size: 11px;
          color: #71717a;
        }

        .ig-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ig-header-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #18181c;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #a1a1aa;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .ig-header-btn:hover {
          color: #ffffff;
          background: #222228;
        }

        /* ─── Messages Stream ─── */
        .ig-messages-stream {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ig-stream-hero {
          text-align: center;
          padding: 30px 20px 20px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ig-hero-avatar-ring {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
          margin-bottom: 12px;
        }

        .ig-hero-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #111114;
        }

        .ig-hero-name {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
        }

        .ig-hero-handle {
          font-size: 12px;
          color: #a1a1aa;
          margin-top: 2px;
        }

        .ig-hero-bio {
          font-size: 13px;
          color: #71717a;
          max-width: 440px;
          margin: 8px auto 20px auto;
          line-height: 1.4;
        }

        .ig-hero-divider {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-top: 10px;
        }

        .ig-hero-divider::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
        }

        .ig-hero-divider span {
          position: relative;
          background: #111114;
          padding: 0 14px;
          font-size: 11px;
          color: #52525b;
          font-weight: 700;
          text-transform: uppercase;
        }

        .ig-welcome-prompt {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          font-size: 13px;
          color: #a1a1aa;
          margin-top: 10px;
        }

        /* Message Rows */
        .ig-message-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          max-width: 75%;
        }

        .ig-msg-them {
          align-self: flex-start;
        }

        .ig-msg-me {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .ig-msg-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 18px;
        }

        .ig-bubble-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ig-msg-me .ig-bubble-container {
          align-items: flex-end;
        }

        .ig-bubble {
          padding: 12px 18px;
          border-radius: 20px;
          word-break: break-word;
          user-select: text;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .ig-bubble:active {
          transform: scale(0.98);
        }

        .ig-bubble-them {
          background: #24242c;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border-bottom-left-radius: 4px;
        }

        .ig-bubble-me {
          background: linear-gradient(135deg, #ff4d00 0%, #e03e00 100%);
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }

        .ig-bubble-text {
          font-size: 14px;
          line-height: 1.45;
          margin: 0;
        }

        .ig-bubble-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 4px;
        }

        .ig-msg-timestamp {
          font-size: 10px;
          color: #52525b;
        }

        .ig-reactions-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #18181c;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 9999px;
          font-size: 11px;
        }

        .ig-heart-action-btn {
          background: transparent;
          border: none;
          color: #52525b;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          opacity: 0.6;
          transition: all 0.2s;
        }

        .ig-heart-action-btn:hover {
          opacity: 1;
          color: #ef4444;
        }

        .hearted {
          fill: #ef4444;
          color: #ef4444;
        }

        /* ─── Bottom Chat Input ─── */
        .ig-input-footer {
          padding: 16px 24px 20px 24px;
          position: relative;
        }

        .ig-emoji-drawer {
          position: absolute;
          bottom: calc(100% + 6px);
          left: 24px;
          background: #18181f;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 8px 12px;
          display: flex;
          gap: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          z-index: 20;
        }

        .ig-emoji-btn {
          background: transparent;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 4px;
          transition: transform 0.15s;
        }

        .ig-emoji-btn:hover {
          transform: scale(1.25);
        }

        .ig-input-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #18181f;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          padding: 8px 14px 8px 16px;
        }

        .ig-input-pill:focus-within {
          border-color: #ff4d00;
        }

        .ig-smile-btn {
          background: transparent;
          border: none;
          color: #a1a1aa;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
        }

        .ig-smile-btn:hover {
          color: #ffffff;
        }

        .ig-text-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 14px;
        }

        .ig-send-btn {
          background: transparent;
          border: none;
          color: #ff4d00;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          padding: 4px 8px;
        }

        .ig-send-btn:hover {
          color: #ff6a26;
        }

        .ig-like-quick-btn {
          background: transparent;
          border: none;
          color: #a1a1aa;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
        }

        .ig-like-quick-btn:hover {
          color: #ef4444;
        }

        /* Login banner */
        .ig-login-banner {
          padding: 16px 24px;
          background: #16161c;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .ig-login-prompt {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #a1a1aa;
        }

        .ig-login-action-btn {
          padding: 8px 20px;
          background: #ff4d00;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .ig-chat-container {
            grid-template-columns: 1fr;
          }
          .ig-chat-sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
