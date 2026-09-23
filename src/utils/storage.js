/**
 * @file storage.js
 * Safe abstraction over browser localStorage and sessionStorage with error guards.
 */

const TOKEN_KEY = 'apex_store_auth_token';
const USER_KEY = 'apex_store_auth_user';

export const storage = {
  /**
   * Retrieves active auth token
   * @returns {string | null}
   */
  getToken() {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Stores authentication token in local storage
   * @param {string} token
   */
  setToken(token) {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
      }
    } catch (e) {
      console.error('Failed to persist auth token:', e);
    }
  },

  /**
   * Retrieves active user payload
   * @returns {any | null}
   */
  getUser() {
    try {
      if (typeof window === 'undefined') return null;
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Stores authenticated user profile
   * @param {any} user
   */
  setUser(user) {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.error('Failed to persist auth user:', e);
    }
  },

  /**
   * Purges all authentication state
   */
  clearAuth() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.error('Failed to clear auth state:', e);
    }
  },
};
