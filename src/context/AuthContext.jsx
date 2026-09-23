/**
 * @file AuthContext.jsx
 * Authentication provider managing login session, credentials autofill,
 * route protection, and logout mechanics.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.api.js';
import { storage } from '../utils/storage.js';
import { AUTH_UNAUTHORIZED_EVENT } from '../api/axios.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getUser());
  const [token, setToken] = useState(() => storage.getToken());
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const { success, error: toastError, info } = useToast();

  // Validate session on mount
  useEffect(() => {
    const initSession = async () => {
      const activeToken = storage.getToken();
      if (!activeToken) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
        storage.setUser(currentUser);
      } catch (err) {
        // If token expired or invalid, reset
        storage.clearAuth();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    // Listen for unauthorized events emitted by Axios response interceptor
    const handleUnauthorized = (event) => {
      setUser(null);
      setToken(null);
      toastError('Session Expired', event.detail?.message || 'Please log in again to continue.');
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [toastError]);

  /**
   * Log in action handler with debounce / multiple click protection
   */
  const login = useCallback(
    async (credentials) => {
      if (isLoggingIn) return; // Prevent double click submissions

      setIsLoggingIn(true);
      setLoginError(null);

      try {
        const response = await authApi.login(credentials);
        
        // DummyJSON returns accessToken or token
        const jwt = response.accessToken || response.token;
        const userPayload = {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          gender: response.gender,
          image: response.image,
        };

        storage.setToken(jwt);
        storage.setUser(userPayload);
        setToken(jwt);
        setUser(userPayload);

        success('Signed In Successfully', `Welcome back, ${response.firstName || response.username}!`);
      } catch (err) {
        const message = err.message || 'Invalid username or password. Please check your credentials.';
        setLoginError(message);
        toastError('Login Failed', message);
      } finally {
        setIsLoggingIn(false);
      }
    },
    [isLoggingIn, success, toastError]
  );

  /**
   * Clear session and log out
   */
  const logout = useCallback(() => {
    storage.clearAuth();
    setUser(null);
    setToken(null);
    setLoginError(null);
    info('Logged Out', 'You have been signed out of ApexStore.');
  }, [info]);

  const clearLoginError = useCallback(() => {
    setLoginError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        isLoggingIn,
        loginError,
        login,
        logout,
        clearLoginError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
