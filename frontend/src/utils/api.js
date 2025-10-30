// utils/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// API helper function with better error handling
export async function apiRequest(path, { method = 'GET', body, headers = {}, token, auth = true } = {}) {
  try {
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

    console.log('API Request:', `${API_BASE}${path}`, opts); // Debug log

    const res = await fetch(`${API_BASE}${path}`, opts);
    const text = await res.text();
    
    console.log('API Response:', res.status, text); // Debug log
    
    if (!res.ok) {
      let msg = text;
      try {
        const j = JSON.parse(text);
        msg = j.message || j.error || text;
      } catch (err) {
        console.debug('apiRequest: response is not valid JSON', err);
      }
      throw new Error(msg || `HTTP ${res.status}`);
    }
    
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}
