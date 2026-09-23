/**
 * @file auth.api.js
 * Dedicated API module for user authentication against DummyJSON.
 */

import apiClient from './axios.js';

export const authApi = {
  /**
   * Log in user with username and password
   * @param {{ username: string; password: string; expiresInMins?: number }} credentials
   * @returns {Promise<any>}
   */
  async login(credentials) {
    const response = await apiClient.post('/auth/login', {
      username: credentials.username.trim(),
      password: credentials.password,
      expiresInMins: credentials.expiresInMins || 60,
    });

    return response.data;
  },

  /**
   * Fetch authenticated user details with active token
   * @returns {Promise<any>}
   */
  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
