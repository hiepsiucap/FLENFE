/** @format */

// Environment configuration
export const ENV_CONFIG = {
  API_URL: import.meta.env.VITE_API_URL_SERVER || 'http://localhost:3001',
  MODE: import.meta.env.MODE || 'development',
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

// Check if API URL is configured
export const isApiConfigured = () => {
  return !!import.meta.env.VITE_API_URL_SERVER;
};

// Get API URL with fallback
export const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL_SERVER) {
    return import.meta.env.VITE_API_URL_SERVER;
  }
  
  console.warn('VITE_API_URL_SERVER is not configured. Using fallback URL.');
  return 'http://localhost:3001';
};
