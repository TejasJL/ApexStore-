/**
 * @file ErrorState.jsx
 * Standardized error banner and recovery action.
 */

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Failed to load catalog',
  message = 'An unexpected error occurred while communicating with the DummyJSON server.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 my-6">
      <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6 stroke-[2]" />
      </div>

      <h3 className="text-base font-semibold text-rose-900 dark:text-rose-200 mb-1">
        {title}
      </h3>
      <p className="text-xs text-rose-700/80 dark:text-rose-300/80 max-w-md mb-5 leading-relaxed font-mono">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
};
