/**
 * @file LoginPage.jsx
 * Enterprise authentication screen with 1-click credentials filler,
 * password toggle, and accessible validation states.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Lock, User, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, isLoggingIn, loginError, clearLoginError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    clearLoginError();

    if (!username.trim()) {
      setFormError('Please enter your username.');
      return;
    }

    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    await login({ username: username.trim(), password });
  };

  /**
   * One-click autofill for DummyJSON's official active demo accounts
   */
  const handleAutofill = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setFormError('');
    clearLoginError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Subtle ambient gradient mesh */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-4 ring-8 ring-indigo-50 dark:ring-indigo-950/40">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            ApexStore
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Product Admin Dashboard & Catalog Management
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/60">
          {(formError || loginError) && (
            <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <div className="flex-1 font-medium">
                {formError || loginError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. emilys"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <span className="text-[11px] text-slate-400 font-mono">DummyJSON Auth</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. emilyspass"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/20 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 mb-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Demo Credentials (1-Click Fill)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleAutofill('emilys', 'emilyspass')}
                className="flex flex-col items-start p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 text-left transition-colors cursor-pointer group"
              >
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  Primary Admin (PDF)
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">emilys / emilyspass</div>
              </button>

              <button
                type="button"
                onClick={() => handleAutofill('michaelw', 'michaelwpass')}
                className="flex flex-col items-start p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/60 text-left transition-colors cursor-pointer group"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Secondary Admin
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">michaelw / michaelwpass</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security / Assignment Badge */}
        <p className="text-center text-[11px] text-slate-400 mt-4">
          Integrated with DummyJSON JWT Auth Service · Bearer Tokens Encrypted
        </p>
      </div>
    </div>
  );
};
