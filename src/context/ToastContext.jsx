/**
 * @file ToastContext.jsx
 * Lightweight, accessible toast notification provider.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type, title, message) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
      const newToast = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback(
    (title, message) => addToast('success', title, message),
    [addToast]
  );
  const error = useCallback(
    (title, message) => addToast('error', title, message),
    [addToast]
  );
  const info = useCallback(
    (title, message) => addToast('info', title, message),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      {/* Toast Render Viewport */}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          let bgClass = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100';
          let Icon = Info;
          let iconColor = 'text-indigo-500';

          if (toast.type === 'success') {
            bgClass = 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800/60 text-slate-900 dark:text-slate-100';
            Icon = CheckCircle2;
            iconColor = 'text-emerald-500';
          } else if (toast.type === 'error') {
            bgClass = 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-800/60 text-slate-900 dark:text-slate-100';
            Icon = AlertCircle;
            iconColor = 'text-rose-500';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg shadow-slate-200/50 dark:shadow-black/60 transition-all duration-200 animate-in slide-in-from-bottom-2 ${bgClass}`}
            >
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold leading-tight">{toast.title}</h5>
                {toast.message && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-snug break-words">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                aria-label="Dismiss toast notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
