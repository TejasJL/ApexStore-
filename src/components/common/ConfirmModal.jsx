/**
 * @file ConfirmModal.jsx
 * Accessible destructive confirmation dialog with keyboard support and double-click shielding.
 */

import React, { useEffect, useRef } from 'react';
import { AlertCircle, Trash2, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title = 'Delete Product',
  message = 'Are you sure you want to permanently delete this product? This action cannot be undone.',
  itemName,
  confirmLabel = 'Delete',
  isSubmitting = false,
  onConfirm,
  onClose,
}) => {
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      cancelBtnRef.current?.focus();
      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && !isSubmitting) {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 id="confirm-modal-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              {message}
            </p>

            {itemName && (
              <div className="mt-3 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-xs font-semibold text-slate-800 dark:text-slate-200 truncate font-mono">
                {itemName}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-rose-600 hover:bg-rose-700 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            {isSubmitting ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
