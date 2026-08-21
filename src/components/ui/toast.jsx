import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

// Singleton toast state management
let toastListeners = [];
let toastQueue = [];

export function toast({ title, description, variant = 'default', duration = 4000 }) {
  const id = Date.now() + Math.random();
  const newToast = { id, title, description, variant, duration };
  toastQueue = [...toastQueue, newToast];
  toastListeners.forEach((listener) => listener([...toastQueue]));
  return id;
}

export function ToastProvider() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToasts);
    };
  }, []);

  const dismiss = useCallback((id) => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    setToasts([...toastQueue]);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    if (!latest) return;
    const timer = setTimeout(() => dismiss(latest.id), latest.duration);
    return () => clearTimeout(timer);
  }, [toasts, dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-viewport">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item toast-${t.variant}`}>
          <div className="toast-icon">
            {t.variant === 'destructive' ? (
              <XCircle size={18} />
            ) : (
              <CheckCircle size={18} />
            )}
          </div>
          <div className="toast-content">
            {t.title && <div className="toast-title">{t.title}</div>}
            {t.description && <div className="toast-description">{t.description}</div>}
          </div>
          <button className="toast-close" onClick={() => dismiss(t.id)}>
            <X size={14} />
          </button>
        </div>
      ))}

      <style>{`
        .toast-viewport {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 380px;
          width: 100%;
        }

        .toast-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 20px;
          background: #09090b;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          color: #ffffff;
        }

        .toast-default .toast-icon { color: #22c55e; }
        .toast-destructive { border-color: rgba(239,68,68,0.3); }
        .toast-destructive .toast-icon { color: #ef4444; }

        .toast-title {
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.02em;
          margin-bottom: 2px;
        }

        .toast-description {
          font-size: 13px;
          color: #a1a1aa;
          line-height: 1.4;
        }

        .toast-close {
          margin-left: auto;
          background: transparent;
          border: none;
          color: #71717a;
          cursor: pointer;
          padding: 2px;
          border-radius: 4px;
          transition: color 0.2s;
          flex-shrink: 0;
        }

        .toast-close:hover { color: #ffffff; }

        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
