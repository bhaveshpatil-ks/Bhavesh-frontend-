import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { sendChatMessage } from '../lib/api';

export default function FloatingAIChat() {
  const { profile } = portfolioData;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hi! I'm Bhavesh's AI Assistant. Ask me anything about his projects, skills, tech stack, or experience!`,
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
          text: "I couldn't reach the backend right now. Please feel free to email bhaveshpatil4251@gmail.com directly!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "What are Bhavesh's top projects?",
    "Tell me about Sparse",
    "How can I contact Bhavesh?",
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
                  {msg.text}
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
          {messages.length <= 2 && (
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
          )}

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
          max-width: 82%;
          padding: 10px 14px;
          font-size: 13px;
          line-height: 1.5;
          border-radius: 14px;
          word-break: break-word;
          white-space: pre-wrap;
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
          padding: 0 16px 10px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .quick-prompt-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #d4d4d8;
          font-size: 11.5px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .quick-prompt-btn:hover {
          background: rgba(255, 77, 0, 0.15);
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

