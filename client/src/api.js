// Centralized Frontend API Client for Nexora
// Environment-based API URL configuration supporting VITE_API_URL and local fallback

const defaultProdUrl = (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ? 'https://nexora-740u.onrender.com/api'
  : 'http://localhost:5000/api';

const rawApiUrl = import.meta.env.VITE_API_URL || defaultProdUrl;

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

export const apiFetch = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  
  // Automatically attach Authorization Bearer token header if present in localStorage
  const headers = { ...(options.headers || {}) };
  try {
    const savedUser = localStorage.getItem('nexora_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed?.token && !headers['Authorization'] && !headers['authorization']) {
        headers['Authorization'] = `Bearer ${parsed.token}`;
      }
    }
  } catch (e) {}

  return fetch(url, {
    ...options,
    headers
  });
};

export default {
  baseUrl: API_BASE_URL,
  getApiUrl,
  apiFetch
};
