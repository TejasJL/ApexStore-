/**
 * @file axios.js
 * Central shared Axios instance for DummyJSON API.
 * Configures:
 * 1. Automatic Bearer token injection on every outgoing request.
 * 2. Unified error handling and response normalization in one place.
 * 3. 401 Unauthorized handling with token clearance.
 */

import axios from 'axios';
import { storage } from '../utils/storage.js';

// Base API configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor:
 * Injects authentication token into headers whenever available.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Custom event dispatcher for unauthorized sessions
 */
export const AUTH_UNAUTHORIZED_EVENT = 'apex_auth_unauthorized';

/**
 * Response Interceptor:
 * Standardizes errors, handles 401 Unauthenticated states, and extracts clean error messages.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = 'Network error: Please verify your internet connection.';

    if (error.response) {
      const { status, data } = error.response;

      // Extract descriptive error from DummyJSON response or standard fallback
      errorMessage = data?.message || data?.error || `Request failed with status code ${status}`;

      if (status === 401) {
        // Session expired or invalid credentials
        storage.clearAuth();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent(AUTH_UNAUTHORIZED_EVENT, { detail: { status, message: errorMessage } })
          );
        }
      } else if (status === 404) {
        errorMessage = data?.message || 'Requested resource could not be found.';
      } else if (status >= 500) {
        errorMessage = 'DummyJSON server encountered an error. Please try again shortly.';
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please try again.';
    } else if (axios.isCancel(error)) {
      // Ignored for cancelled requests (AbortController)
      return Promise.reject(error);
    }

    // Attach standardized message to error object
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;

    return Promise.reject(enhancedError);
  }
);

export default apiClient;
