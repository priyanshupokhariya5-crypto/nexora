// Centralized Frontend API Client for Nexora
// Environment-based API URL configuration supporting VITE_API_URL and local fallback

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Remove trailing slashes from base URL
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

/**
 * Normalizes API endpoint and prevents double '/api/api/' path duplication
 * Production backend URL example: https://nexora-740u.onrender.com/api
 */
export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If base URL ends with '/api' and endpoint starts with '/api/', strip duplicate '/api' from endpoint
  if (API_BASE_URL.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    return `${API_BASE_URL}${cleanEndpoint.substring(4)}`;
  }

  // If base URL does not end with '/api' and endpoint does not start with '/api/', append '/api'
  if (!API_BASE_URL.endsWith('/api') && !cleanEndpoint.startsWith('/api/')) {
    return `${API_BASE_URL}/api${cleanEndpoint}`;
  }

  return `${API_BASE_URL}${cleanEndpoint}`;
};

/**
 * Universal fetch wrapper using normalized production/local API URL
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  return fetch(url, options);
};

export default {
  baseUrl: API_BASE_URL,
  getApiUrl,
  apiFetch
};
