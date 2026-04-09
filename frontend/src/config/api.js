// API Configuration for development and production
const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5001'
  : (import.meta.env.VITE_API_URL || window.location.origin);

export const API_ENDPOINTS = {
  surveys: `${API_BASE_URL}/api/surveys`,
  stats: `${API_BASE_URL}/api/surveys/stats`,
  overview: `${API_BASE_URL}/api/surveys/overview`,
  export: `${API_BASE_URL}/api/export/excel`,
  health: `${API_BASE_URL}/api/health`
};

export default API_ENDPOINTS;
