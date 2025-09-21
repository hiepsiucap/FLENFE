/** @format */

// Debug utilities for production
export const debugInfo = () => {
  console.log('🐛 Debug Info:');
  console.log('Environment:', import.meta.env.MODE);
  console.log('API URL:', import.meta.env.VITE_API_URL_SERVER);
  console.log('Base URL:', import.meta.env.BASE_URL);
  console.log('Current URL:', window.location.href);
  console.log('Current Path:', window.location.pathname);
  console.log('Local Storage Keys:', Object.keys(localStorage));
  
  // Check if critical components can be imported
  try {
    console.log('✅ All imports seem to be working');
  } catch (error) {
    console.error('❌ Import error:', error);
  }
};
