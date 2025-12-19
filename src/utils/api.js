const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to handle API calls with better error handling
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Handle network errors
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Cannot connect to server. Please make sure:\n1. Backend server is running on http://localhost:5000\n2. Run: cd server && npm start\n3. Check: http://localhost:5000/api/health`);
    }
    throw error;
  }
};

export const api = {
  // Auth
  login: async (email, password) => {
    return apiCall(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (name, email, password) => {
    return apiCall(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  // Members
  getMembers: async () => {
    return apiCall(`${API_BASE_URL}/members`);
  },

  createMember: async (memberData) => {
    return apiCall(`${API_BASE_URL}/members`, {
      method: 'POST',
      body: JSON.stringify(memberData)
    });
  },

  updateMember: async (id, memberData) => {
    return apiCall(`${API_BASE_URL}/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData)
    });
  },

  deleteMember: async (id) => {
    return apiCall(`${API_BASE_URL}/members/${id}`, {
      method: 'DELETE'
    });
  },

  // Gyms
  getGyms: async () => {
    return apiCall(`${API_BASE_URL}/gyms`);
  },

  createGym: async (gymData) => {
    return apiCall(`${API_BASE_URL}/gyms`, {
      method: 'POST',
      body: JSON.stringify(gymData)
    });
  },

  updateGym: async (id, gymData) => {
    return apiCall(`${API_BASE_URL}/gyms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gymData)
    });
  },

  deleteGym: async (id) => {
    return apiCall(`${API_BASE_URL}/gyms/${id}`, {
      method: 'DELETE'
    });
  },

  // Billing
  getBills: async () => {
    return apiCall(`${API_BASE_URL}/billing`);
  },

  createBill: async (billData) => {
    return apiCall(`${API_BASE_URL}/billing`, {
      method: 'POST',
      body: JSON.stringify(billData)
    });
  },

  generateInvoice: async (id) => {
    return apiCall(`${API_BASE_URL}/billing/generate-invoice/${id}`, {
      method: 'POST'
    });
  },

  sendReminder: async (id) => {
    return apiCall(`${API_BASE_URL}/billing/send-reminder/${id}`, {
      method: 'POST'
    });
  },

  updateBill: async (id, billData) => {
    return apiCall(`${API_BASE_URL}/billing/${id}`, {
      method: 'PUT',
      body: JSON.stringify(billData)
    });
  },

  // Settings
  getSettings: async () => {
    return apiCall(`${API_BASE_URL}/settings`);
  },

  updateSettings: async (settingsData) => {
    return apiCall(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    });
  },

  // Trainers
  getTrainers: async (specialization, search) => {
    const params = new URLSearchParams();
    if (specialization) params.append('specialization', specialization);
    if (search) params.append('search', search);
    return apiCall(`${API_BASE_URL}/trainers?${params}`);
  },

  getTrainer: async (id) => {
    return apiCall(`${API_BASE_URL}/trainers/${id}`);
  },

  createTrainer: async (trainerData) => {
    return apiCall(`${API_BASE_URL}/trainers`, {
      method: 'POST',
      body: JSON.stringify(trainerData)
    });
  },

  updateTrainer: async (id, trainerData) => {
    return apiCall(`${API_BASE_URL}/trainers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(trainerData)
    });
  },

  deleteTrainer: async (id) => {
    return apiCall(`${API_BASE_URL}/trainers/${id}`, {
      method: 'DELETE'
    });
  },

  // Attendance
  getAttendance: async (date) => {
    const params = date ? `?date=${date}` : '';
    return apiCall(`${API_BASE_URL}/attendance${params}`);
  },

  createAttendance: async (attendanceData) => {
    return apiCall(`${API_BASE_URL}/attendance`, {
      method: 'POST',
      body: JSON.stringify(attendanceData)
    });
  },

  updateAttendance: async (id, attendanceData) => {
    return apiCall(`${API_BASE_URL}/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(attendanceData)
    });
  },

  // Settings
  getSettings: async () => {
    return apiCall(`${API_BASE_URL}/settings`);
  },

  updateSettings: async (settingsData) => {
    return apiCall(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    });
  }
};
