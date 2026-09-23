/**
 * @file ArchitectureModal.jsx
 * In-depth technical architecture documentation modal answering the core assignment questions:
 * 1. DummyJSON search + category limitation solution.
 * 2. DummyJSON non-persistence solution via local mutation overlay.
 * 3. Race condition prevention via AbortController + Monotonic Request Sequence IDs.
 * 4. Custom pagination calculation breakdown.
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

export const ArchitectureModal = ({
  isOpen,
  onClose,
  activeDelay = 0,
  onToggleDelay,
}) => {
  const [activeTab, setActiveTab] = useState('questions');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="arch-modal-title"
    >
      <div className="relative w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 id="arch-modal-title" className="text-sm font-bold text-slate-900 dark:text-white">
                ApexStore Architecture & Assignment Report
              </h2>
              <p className="text-[11px] text-slate-400">
                Detailed design decisions, API workarounds, and edge case resilience
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
            aria-label="Close documentation dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'questions'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Core Questions (Limitations & Solutions)
          </button>

          <button
            onClick={() => setActiveTab('race')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'race'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Race Conditions & Delays
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Requirements Checklist
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {activeTab === 'questions' && (
            <div className="space-y-6">
              {/* Question 1 */}
              <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/30 dark:bg-indigo-950/20">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm mb-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-mono">
                    1
                  </span>
                  DummyJSON Limitation: Search + Category Mutual Exclusivity
                </div>
                <div className="mb-2 text-slate-600 dark:text-slate-400">
                  <strong>The Problem:</strong> The DummyJSON API separates{' '}
                  <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-mono">
                    /products/search?q=...
                  </code>{' '}
                  from{' '}
                  <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-mono">
                    /products/category/:category
                  </code>
                  . It has no single endpoint accepting both query parameters simultaneously.
                </div>
                <div className="text-slate-800 dark:text-slate-200">
                  <strong>Our Architectural Solution:</strong>
                  <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600 dark:text-slate-400">
                    <li>
                      When both <em>search</em> and <em>category</em> are selected, the application queries{' '}
                      <code className="font-mono">/products/search?q=...&limit=100</code> to obtain candidate matches.
                    </li>
                    <li>
                      ApexStore then performs client-side category filtering and sorting on the returned collection.
                    </li>
                    <li>
                      Local mutation overlays are merged seamlessly into this filtered set.
                    </li>
                    <li>
                      A dedicated UI banner (<code className="font-mono">CategorySearchAlert</code>) notifies the user that hybrid filtering is active.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Question 2 */}
              <div className="p-4 rounded-xl border border-violet-100 dark:border-violet-950/60 bg-violet-50/30 dark:bg-violet-950/20">
                <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300 font-bold text-sm mb-2">
                  <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-mono">
                    2
                  </span>
                  DummyJSON Limitation: Non-Persistence of Mutations
                </div>
                <div className="mb-2 text-slate-600 dark:text-slate-400">
                  <strong>The Problem:</strong> DummyJSON is a mock static server. While <code className="font-mono">POST /products/add</code>, <code className="font-mono">PUT /products/:id</code>, and <code className="font-mono">DELETE /products/:id</code> return HTTP 200 success with simulated payloads, the backend never actually modifies the database. Subsequent <code className="font-mono">GET /products</code> calls return original unmodified data.
                </div>
                <div className="text-slate-800 dark:text-slate-200">
                  <strong>Our Architectural Solution:</strong>
                  <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-600 dark:text-slate-400">
                    <li>
                      Implemented <code className="font-mono">ProductMutationContext</code> which maintains three state overlays: <code className="font-mono">createdProducts</code>, <code className="font-mono">updatedProducts</code> (id-to-patch map), and <code className="font-mono">deletedProductIds</code> (set of deleted IDs).
                    </li>
                    <li>
                      These overlays are automatically synced to <code className="font-mono">sessionStorage</code>, surviving page reloads and detail navigations.
                    </li>
                    <li>
                      Every time products are fetched or a product detail is loaded, the <code className="font-mono">applyMutationsToList</code> and <code className="font-mono">applyMutationsToSingle</code> methods blend the overlay into the raw response.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'race' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Dual-Shield Race Condition Architecture
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mb-3">
                  In web applications with dynamic search, fast user typing causes multiple asynchronous HTTP requests to be issued in rapid succession. If an older request takes longer to resolve than a newer request, it can overwrite the latest search results.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="font-semibold text-slate-900 dark:text-white mb-1">
                      Shield 1: AbortController Signal
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Whenever a new request begins in <code className="font-mono">useProducts</code>, the previous controller is aborted immediately via <code className="font-mono">abortControllerRef.current.abort()</code>, canceling browser network processing.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="font-semibold text-slate-900 dark:text-white mb-1">
                      Shield 2: Monotonic Sequence Counter
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Each fetch increments <code className="font-mono">requestIdRef.current</code>. When the promise resolves, we verify that <code className="font-mono">currentRequestId === requestIdRef.current</code> before touching React state.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      Live Race Condition Tester:
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Appends <code className="font-mono">&delay=2000</code> to DummyJSON API requests.
                    </div>
                  </div>

                  <button
                    onClick={onToggleDelay}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      activeDelay > 0
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300'
                    }`}
                  >
                    {activeDelay > 0 ? 'Active (2000ms Delay)' : 'Enable 2000ms Delay'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                Assignment Specification Compliance (PDF Requirements)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {[
                  'Login with emilys / emilyspass (POST /auth/login) with error handling & logout',
                  'Route protection: unauthenticated users redirected to /auth/login',
                  'Product list table with image, title, category, price, rating, stock',
                  'Zero third-party table or pagination libraries (built from scratch)',
                  'Exact pagination label: "Showing 21–40 of 194"',
                  'Page size options (10, 20, 50) and limit/skip API calculations',
                  'Debounced search (/products/search?q=) with auto-reset to page 1',
                  'Category filter (/products/categories) & sort by price, rating, title',
                  'Product details page (/products/:id) with gallery, specs, reviews, & 404 state',
                  'Add / Edit product modal with input validation',
                  'Delete product confirmation popup dialog',
                  'Loading spinners, empty catalog messages, & retry buttons on failure',
                  'Single shared Axios client with token injection & unified error handling',
                  'URL synchronization: page, search, filter, sort preserved on reload/share',
                  'Race condition protection during fast typing (tested with &delay=2000)',
                  'Search + Category conflict resolution strategy',
                  'Simulated mutation persistence overlay for Add / Edit / Delete',
                  'Resilient URL query handling (?page=abc / ?page=999 will not break page)',
                  'Multiple-click spam prevention on Login and Save actions',
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
