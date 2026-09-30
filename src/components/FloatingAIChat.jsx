import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, X, Send, Sparkles, Bot, User, ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { sendChatMessage } from '../lib/api';

function FormattedChatMessage({ text }) {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="formatted-chat-msg">
      {lines.map((line, lIdx) => {
        if (!line.trim()) {
          return <div key={lIdx} className="chat-line-break" />;
        }

        const parts = [];
        const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
        let lastIdx = 0;
        let match;

        while ((match = regex.exec(line)) !== null) {
          if (match.index > lastIdx) {
            parts.push(line.substring(lastIdx, match.index));
          }

          if (match[2] && match[3]) {
            const linkText = match[2];
            const linkUrl = match[3];
            const isInternal = linkUrl.startsWith('/');
            parts.push(
              isInternal ? (
                <Link key={match.index} to={linkUrl} className="chat-inline-link">
                  {linkText}
                </Link>
              ) : (
                <a
                  key={match.index}
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chat-inline-link"
                >
                  {linkText}
                </a>
              )
            );
          } else if (match[4]) {
            parts.push(<strong key={match.index}>{match[4]}</strong>);
          } else if (match[5]) {
            parts.push(<em key={match.index}>{match[5]}</em>);
          }

          lastIdx = regex.lastIndex;
        }

        if (lastIdx < line.length) {
          parts.push(line.substring(lastIdx));
        }

        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || /^\d+\./.test(line.trim());

        return (
          <div key={lIdx} className={`chat-line ${isBullet ? 'chat-bullet-line' : ''}`}>
            {parts}
          </div>
        );
      })}
    </div>
  );
}

export default function FloatingAIChat() {
  const { profile } = portfolioData;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hi! I'm **Bhavesh's AI Assistant**. Ask me anything about his projects, technical stack, education, or freelance availability!`,
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : input;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: query.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(query.trim());
      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.reply,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: "I couldn't reach the server right now. You can email **bhaveshpatil4251@gmail.com** directly!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "🚀 Top Projects",
    "🛠️ Tech Stack",
    "🎓 Education",
    "📬 Contact Bhavesh",
    "📄 Resume",
    "☕ Buy Me a Coffee",
  ];

  return (
    <>
      {/* Floating Orb Trigger */}
      <div
        className={`floating-ai-widget ${isOpen ? 'active' : ''}`}
        title="Chat with Bhavesh AI Assistant"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="ai-widget-halo" />
        <div className="ai-widget-inner">
          {isOpen ? (
            <X size={22} className="ai-close-icon" />
          ) : (
            <img src={profile.avatar} alt="AI Assistant" className="ai-widget-avatar" />
          )}
        </div>
      </div>

      {/* Interactive AI Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-header-left">
              <div className="ai-header-avatar">
                <img src={profile.avatar} alt="Bhavesh Assistant" />
                <span className="online-indicator" />
              </div>
              <div className="ai-header-info">
                <h4>Bhavesh Assistant</h4>
                <span>AI Powered • Online</span>
              </div>
            </div>
            <button
              type="button"
              className="ai-header-close"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="ai-chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-msg-row ${msg.role}`}>
                <div className="ai-msg-bubble">
                  {msg.role === 'assistant' ? (
                    <FormattedChatMessage text={msg.text} />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="ai-msg-row assistant">
                <div className="ai-msg-bubble loading-bubble">
                  <span className="dot" /><span className="dot" /><span className="dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="ai-quick-prompts">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                className="quick-prompt-btn"
                onClick={() => handleSend(prompt)}
              >
                <Sparkles size={11} />
                <span>{prompt}</span>
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            className="ai-chat-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="ai-chat-input"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="ai-chat-send"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        .floating-ai-widget {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
          width: 56px;
          height: 56px;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .floating-ai-widget:hover {
          transform: scale(1.08);
        }

        .ai-widget-halo {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff4d00 0%, #ff7a00 50%, #ffb703 100%);
          filter: blur(5px);
          opacity: 0.85;
          animation: rotateGlow 6s linear infinite;
        }

        @keyframes rotateGlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .ai-widget-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          padding: 2px;
          background: #18181b;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .ai-widget-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .ai-close-icon {
          color: #ffffff;
        }

        /* ─── Chat Window Modal ──────────────────────── */
        .ai-chat-window {
          position: fixed;
          bottom: 92px;
          right: 24px;
          width: 360px;
          max-width: calc(100vw - 32px);
          height: 500px;
          max-height: calc(100vh - 120px);
          background: rgba(18, 18, 22, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 30px rgba(255, 77, 0, 0.15);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: aiFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        @keyframes aiFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .ai-chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ai-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-header-avatar {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: visible;
        }

        .ai-header-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .online-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 9px;
          height: 9px;
          background: #10b981;
          border: 2px solid #18181b;
          border-radius: 50%;
        }

        .ai-header-info h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          font-family: var(--font-heading);
        }

        .ai-header-info span {
          font-size: 11px;
          color: #a1a1aa;
        }

        .ai-header-close {
          background: transparent;
          border: none;
          color: #a1a1aa;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: color 0.2s;
        }

        .ai-header-close:hover {
          color: #ffffff;
        }

        /* ─── Chat Body ──────────────────────────────── */
        .ai-chat-body {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ai-msg-row {
          display: flex;
          width: 100%;
        }

        .ai-msg-row.user {
          justify-content: flex-end;
        }

        .ai-msg-row.assistant {
          justify-content: flex-start;
        }

        .ai-msg-bubble {
          max-width: 85%;
          padding: 10px 14px;
          font-size: 13px;
          line-height: 1.5;
          border-radius: 14px;
          word-break: break-word;
        }

        .formatted-chat-msg {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .chat-line {
          line-height: 1.5;
        }

        .chat-bullet-line {
          padding-left: 4px;
        }

        .chat-line-break {
          height: 6px;
        }

        .chat-inline-link {
          color: #ff7a00;
          text-decoration: underline;
          font-weight: 600;
          cursor: pointer;
        }

        .chat-inline-link:hover {
          color: #ffa133;
        }

        .ai-msg-row.user .ai-msg-bubble {
          background: #ff4d00;
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }

        .ai-msg-row.assistant .ai-msg-bubble {
          background: rgba(255, 255, 255, 0.07);
          color: #e4e4e7;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom-left-radius: 4px;
        }

        .loading-bubble {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
        }

        .dot {
          width: 5px;
          height: 5px;
          background: #a1a1aa;
          border-radius: 50%;
          animation: dotBounce 0.8s ease-in-out infinite;
        }

        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }

        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.4; }
          40% { transform: scale(1.3); opacity: 1; }
        }

        /* ─── Quick Prompts ──────────────────────────── */
        .ai-quick-prompts {
          padding: 6px 12px 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          white-space: nowrap;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          scrollbar-width: none;
        }

        .ai-quick-prompts::-webkit-scrollbar {
          display: none;
        }

        .quick-prompt-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          color: #d4d4d8;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          font-weight: 500;
        }

        .quick-prompt-btn:hover {
          background: rgba(255, 77, 0, 0.2);
          border-color: #ff4d00;
          color: #ffffff;
        }

        /* ─── Input Form ─────────────────────────────── */
        .ai-chat-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ai-chat-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          padding: 9px 16px;
          color: #ffffff;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }

        .ai-chat-input:focus {
          border-color: #ff4d00;
        }

        .ai-chat-send {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #ff4d00;
          color: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
        }

        .ai-chat-send:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .ai-chat-send:hover:not(:disabled) {
          transform: scale(1.06);
        }

        @media (max-width: 768px) {
          .floating-ai-widget {
            bottom: 16px;
            right: 16px;
            width: 48px;
            height: 48px;
          }

          .ai-chat-window {
            bottom: 76px;
            right: 16px;
            width: calc(100vw - 32px);
            height: 440px;
          }
        }
      `}</style>
    </>
  );
}

