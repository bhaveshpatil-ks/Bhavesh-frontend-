import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Smile, 
  Heart, 
  ShieldCheck, 
  MessageSquare, 
  Search, 
  User, 
  RefreshCw, 
  Clock, 
  Sparkles,
  CheckCheck
} from 'lucide-react';
import { 
  subscribeAllChats, 
  subscribeChatMessages, 
  sendAdminChatMessage, 
  toggleMessageReaction 
} from '../lib/chatService';

const QUICK_EMOJIS = ['❤️', '🔥', '👋', '🚀', '👍', '💯', '✨', '⚡'];

export default function AdminLiveChat({ initialChatUserId = null, allUsers = [] }) {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(initialChatUserId);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync if initialChatUserId changes
  useEffect(() => {
    if (initialChatUserId) {
      setSelectedChatId(initialChatUserId);
    }
  }, [initialChatUserId]);

  // 1. Subscribe to all active chats
  useEffect(() => {
    const unsubscribe = subscribeAllChats((chatList) => {
      setChats(chatList);
      if (chatList.length > 0 && !selectedChatId && !initialChatUserId) {
        setSelectedChatId(chatList[0].id);
      }
    });

    return () => unsubscribe();
  }, [selectedChatId, initialChatUserId]);

  // 2. Subscribe to selected chat messages
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeChatMessages(selectedChatId, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [selectedChatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Selected chat resolution (from chats collection or allUsers directory)
  const existingChat = chats.find((c) => c.id === selectedChatId);
  const directoryUser = allUsers.find((u) => u.uid === selectedChatId);
  const selectedChat = existingChat || (directoryUser ? {
    id: directoryUser.uid,
    userName: directoryUser.name || 'User',
    userEmail: directoryUser.email || '',
    userPhoto: directoryUser.photo || '',
    lastMessage: 'No messages yet'
  } : null);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || sending || !selectedChatId) return;

    const textToSend = inputText;
    setInputText('');
    setShowEmojiPicker(false);
    setSending(true);

    try {
      await sendAdminChatMessage(selectedChatId, textToSend, 'Bhavesh Patil');
    } catch (err) {
      console.error('Admin send message error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleQuickEmoji = (emoji) => {
    setInputText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleReaction = async (messageId) => {
    if (!selectedChatId) return;
    try {
      await toggleMessageReaction(selectedChatId, messageId, '❤️', 'admin');
    } catch (err) {
      console.warn('Admin reaction error:', err);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const filteredChats = chats.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.userName && c.userName.toLowerCase().includes(q)) ||
      (c.userEmail && c.userEmail.toLowerCase().includes(q)) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
    );
  });

  return (
    <div className="admin-chat-container">
      {/* Sidebar: All Users / Conversations */}
      <aside className="admin-chat-sidebar">
        <div className="admin-chat-search-bar">
          <div className="admin-search-box">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-convos-list">
          {chats.length === 0 ? (
            <div className="admin-empty-chats">
              <MessageSquare size={28} color="#52525b" />
              <p>No active user direct messages yet.</p>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="admin-empty-chats">
              <p>No conversations match your search.</p>
            </div>
          ) : (
            filteredChats.map((c) => {
              const isSelected = c.id === selectedChatId;
              return (
                <div 
                  key={c.id} 
                  className={`admin-convo-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedChatId(c.id)}
                >
                  <div className="admin-avatar-wrap">
                    {c.userPhoto ? (
                      <img src={c.userPhoto} alt={c.userName} className="admin-convo-avatar" />
                    ) : (
                      <div className="admin-convo-avatar-fallback">
                        {(c.userName || c.userEmail || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    {c.unreadByAdmin && <span className="unread-dot" />}
                  </div>

                  <div className="admin-convo-info">
                    <div className="admin-convo-head">
                      <span className="admin-user-title">{c.userName || 'User'}</span>
                      <span className="admin-convo-time">{formatTime(c.updatedAt)}</span>
                    </div>
                    <span className="admin-convo-preview">{c.lastMessage || 'No messages'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Main Chat Thread Area */}
      <main className="admin-chat-main">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="admin-thread-header">
              <div className="admin-target-user">
                {selectedChat.userPhoto ? (
                  <img src={selectedChat.userPhoto} alt={selectedChat.userName} className="target-avatar" />
                ) : (
                  <div className="target-avatar-fallback">
                    {(selectedChat.userName || selectedChat.userEmail || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="target-name">{selectedChat.userName || 'User'}</h3>
                  <span className="target-email">{selectedChat.userEmail}</span>
                </div>
              </div>

              <div className="admin-thread-badge">
                <ShieldCheck size={14} color="#ff4d00" />
                <span>Admin Terminal Mode</span>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="admin-messages-feed">
              {messages.length === 0 ? (
                <div className="admin-feed-empty">
                  <Sparkles size={24} color="#ff4d00" />
                  <p>Conversation started with {selectedChat.userName || 'this user'}.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.isAdmin || msg.senderId === 'admin';
                  const hasReactions = msg.reactions && Object.keys(msg.reactions).length > 0;

                  return (
                    <div 
                      key={msg.id} 
                      className={`admin-msg-row ${isMe ? 'msg-admin' : 'msg-user'}`}
                    >
                      <div className="admin-bubble-wrap">
                        <div 
                          className={`admin-bubble ${isMe ? 'bubble-admin' : 'bubble-user'}`}
                          onDoubleClick={() => handleReaction(msg.id)}
                        >
                          <p className="admin-bubble-text">{msg.text}</p>
                        </div>

                        <div className="admin-msg-meta">
                          <span className="msg-time">{formatTime(msg.createdAt)}</span>
                          {hasReactions && (
                            <div className="reactions-pill">
                              {Object.entries(msg.reactions).map(([emoji, userIds]) => (
                                <span key={emoji} className="reaction-badge">
                                  {emoji} {userIds.length > 1 && userIds.length}
                                </span>
                              ))}
                            </div>
                          )}
                          <button 
                            type="button" 
                            className="heart-btn"
                            onClick={() => handleReaction(msg.id)}
                            title="Heart message"
                          >
                            <Heart size={12} className={msg.reactions?.['❤️']?.includes('admin') ? 'hearted' : ''} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="admin-input-bar-wrap">
              {showEmojiPicker && (
                <div className="admin-emoji-picker">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button 
                      key={emoji} 
                      type="button" 
                      className="emoji-btn" 
                      onClick={() => handleQuickEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSend} className="admin-chat-form">
                <button 
                  type="button" 
                  className="smile-action"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile size={18} />
                </button>

                <input 
                  type="text" 
                  placeholder={`Reply as Bhavesh Patil...`} 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="admin-msg-input"
                  autoFocus
                />

                <button type="submit" className="admin-send-action" disabled={sending || !inputText.trim()}>
                  <Send size={15} />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <MessageSquare size={36} color="#52525b" />
            <h3>Select a Conversation</h3>
            <p>Select a user from the left list to read and respond to direct messages.</p>
          </div>
        )}
      </main>

      <style>{`
        .admin-chat-container {
          display: grid;
          grid-template-columns: 320px 1fr;
          height: 680px;
          background: #111114;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }

        .admin-chat-sidebar {
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          background: #0d0d10;
          display: flex;
          flex-direction: column;
        }

        .admin-chat-search-bar {
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .admin-search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #141418;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 8px 12px;
        }

        .admin-search-box input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 13px;
        }

        .admin-convos-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .admin-empty-chats {
          text-align: center;
          padding: 40px 20px;
          color: #71717a;
          font-size: 13px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .admin-convo-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .admin-convo-item:hover, .admin-convo-item.selected {
          background: #181820;
        }

        .admin-avatar-wrap {
          position: relative;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
        }

        .admin-convo-avatar, .admin-convo-avatar-fallback {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .admin-convo-avatar-fallback {
          background: #ff4d00;
          color: #ffffff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .unread-dot {
          position: absolute;
          top: 0;
          right: 0;
          width: 10px;
          height: 10px;
          background: #ff4d00;
          border-radius: 50%;
          border: 2px solid #0d0d10;
        }

        .admin-convo-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .admin-convo-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .admin-user-title {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-convo-time {
          font-size: 10px;
          color: #71717a;
        }

        .admin-convo-preview {
          font-size: 12px;
          color: #71717a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ─── Main Thread ─── */
        .admin-chat-main {
          display: flex;
          flex-direction: column;
          background: #111114;
        }

        .admin-thread-header {
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: #131317;
        }

        .admin-target-user {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .target-avatar, .target-avatar-fallback {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }

        .target-avatar-fallback {
          background: #ff4d00;
          color: #ffffff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        }

        .target-name {
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
        }

        .target-email {
          font-size: 11px;
          color: #71717a;
        }

        .admin-thread-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: #ff4d00;
          background: rgba(255, 77, 0, 0.1);
          padding: 4px 10px;
          border-radius: 8px;
        }

        .admin-messages-feed {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .admin-feed-empty, .no-chat-selected {
          margin: auto;
          text-align: center;
          color: #71717a;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .no-chat-selected h3 {
          color: #ffffff;
          font-size: 16px;
          margin-top: 6px;
        }

        .admin-msg-row {
          display: flex;
          max-width: 75%;
        }

        .msg-user {
          align-self: flex-start;
        }

        .msg-admin {
          align-self: flex-end;
        }

        .admin-bubble-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .msg-admin .admin-bubble-wrap {
          align-items: flex-end;
        }

        .admin-bubble {
          padding: 10px 16px;
          border-radius: 18px;
          user-select: text;
        }

        .bubble-user {
          background: #202028;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom-left-radius: 4px;
        }

        .bubble-admin {
          background: linear-gradient(135deg, #ff4d00 0%, #d63e00 100%);
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }

        .admin-bubble-text {
          font-size: 13px;
          line-height: 1.45;
          margin: 0;
        }

        .admin-msg-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 4px;
        }

        .msg-time {
          font-size: 10px;
          color: #52525b;
        }

        .heart-btn {
          background: transparent;
          border: none;
          color: #52525b;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
        }

        .heart-btn:hover {
          color: #ef4444;
        }

        .hearted {
          fill: #ef4444;
          color: #ef4444;
        }

        .reactions-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #18181c;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 9999px;
          font-size: 11px;
        }

        /* Input wrap */
        .admin-input-bar-wrap {
          padding: 16px 20px;
          position: relative;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .admin-emoji-picker {
          position: absolute;
          bottom: calc(100% + 4px);
          left: 20px;
          background: #18181f;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 6px 10px;
          display: flex;
          gap: 6px;
          z-index: 10;
        }

        .emoji-btn {
          background: transparent;
          border: none;
          font-size: 16px;
          cursor: pointer;
          padding: 2px;
        }

        .admin-chat-form {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #16161c;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 8px 14px;
        }

        .smile-action {
          background: transparent;
          border: none;
          color: #a1a1aa;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .admin-msg-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 13px;
        }

        .admin-send-action {
          display: flex;
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
        }

        .admin-send-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
