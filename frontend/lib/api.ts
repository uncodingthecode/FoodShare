// API service for connecting to backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Helper function to handle API responses
async function handleResponse(response: Response) {
  const data = await response.json();
  
  if (!response.ok) {
    // If there are validation errors, format them nicely
    if (data.errors && Array.isArray(data.errors)) {
      const errorMessages = data.errors.map((err: any) => `${err.field}: ${err.message}`).join(', ');
      throw new Error(errorMessages || data.message || 'API request failed');
    }
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

// Auth API
export const authAPI = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await handleResponse(response);
    
    // Store token and user info
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.user._id || data.user.id);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userName', data.user.name);
    }
    
    return data;
  },

  async register(userData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await handleResponse(response);
    
    // Store token and user info
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.user._id || data.user.id);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userName', data.user.name);
    }
    
    return data;
  },

  async getMe() {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  },
};

// Donations API
export const donationsAPI = {
  async getAvailable() {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/donations/available`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },

  async getMyDonations() {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/donations/my-donations/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },

  async create(donationData: any) {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(donationData),
    });
    
    return handleResponse(response);
  },

  async update(id: string, donationData: any) {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/donations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(donationData),
    });
    
    return handleResponse(response);
  },

  async delete(id: string) {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/donations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
};

// Claims API
export const claimsAPI = {
  async claimDonation(donationId: string) {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/claims/claim/${donationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },

  async getMyClaims() {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/claims/my-claims`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },

  async updateStatus(claimId: string, status: string) {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/claims/${claimId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    
    return handleResponse(response);
  },
};

// Pickups API
export const pickupsAPI = {
  async getAvailable() {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/pickups/available`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },

  async accept(id: string) {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/pickups/${id}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },

  async updateStatus(id: string, status: string) {
    const token = getAuthToken();
    
    console.log('Updating pickup status:', { id, status }); // Debug log
    
    const response = await fetch(`${API_BASE_URL}/pickups/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    
    return handleResponse(response);
  },

  async getMyPickups() {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/pickups/my-pickups/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
};

// Notifications API
export const notificationsAPI = {
  async getAll() {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },

  async markAsRead(id: string) {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
};

// Admin API
export const adminAPI = {
  async getStats() {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },

  async getUsers(params?: any) {
    const token = getAuthToken();
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    
    const response = await fetch(`${API_BASE_URL}/admin/users${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
};
