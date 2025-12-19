// Utility to check if backend is running
export const checkBackendConnection = async () => {
  try {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const baseUrl = API_BASE_URL.replace('/api', '');
    
    // Create timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${baseUrl}/api/health`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      return {
        connected: true,
        mongodb: data.mongodbReady || false,
        message: 'Backend is running'
      };
    }
    return {
      connected: false,
      mongodb: false,
      message: 'Backend responded but with error'
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        connected: false,
        mongodb: false,
        message: 'Backend server is not responding. Please start it with: cd server && npm start'
      };
    }
    return {
      connected: false,
      mongodb: false,
      message: 'Cannot connect to backend server. Please start it with: cd server && npm start'
    };
  }
};

