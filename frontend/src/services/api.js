class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Verify Firebase token with backend
  async verifyToken(idToken) {
    return this.request('/auth/verify-token', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  }

  // Get user profile from backend
  async getUserProfile(authHeaders) {
    return this.request('/auth/profile', {
      method: 'GET',
      headers: authHeaders,
    });
  }

  // Update user profile
  async updateUserProfile(profileData, authHeaders) {
    return this.request('/auth/profile', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(profileData),
    });
  }

  // Challenge related endpoints
  async startChallenge(authHeaders) {
    return this.request('/challenge/start', {
      method: 'POST',
      headers: authHeaders,
    });
  }

  async resetChallenge(authHeaders) {
    return this.request('/challenge/reset', {
      method: 'POST',
      headers: authHeaders,
    });
  }

  async completeChallenge(authHeaders) {
    return this.request('/challenge/complete', {
      method: 'POST',
      headers: authHeaders,
    });
  }

  async getChallengeProgress(authHeaders) {
    return this.request('/challenge/progress', {
      method: 'GET',
      headers: authHeaders,
    });
  }

  // Task related endpoints
  async getCurrentDay(authHeaders) {
    return this.request('/tasks/current', {
      method: 'GET',
      headers: authHeaders,
    });
  }

  async updateTasks(taskData, authHeaders) {
    return this.request('/tasks/update', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(taskData),
    });
  }

  async getDayHistory(authHeaders, page = 1, limit = 10) {
    return this.request(`/tasks/history?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: authHeaders,
    });
  }

  // Photo upload endpoints
  async uploadProgressPhoto(formData, authHeaders) {
    // Remove Content-Type header for FormData - let browser set it
    const headers = { ...authHeaders };
    delete headers['Content-Type'];

    return this.request('/upload/progress-photo', {
      method: 'POST',
      headers: headers,
      body: formData, // FormData object
    });
  }

  async getProgressPhotos(authHeaders) {
    return this.request('/upload/progress-photos', {
      method: 'GET',
      headers: authHeaders,
    });
  }

  async deleteProgressPhoto(photoId, authHeaders) {
    return this.request(`/upload/progress-photo/${photoId}`, {
      method: 'DELETE',
      headers: authHeaders,
    });
  }

  // Utility methods
  async healthCheck() {
    return this.request('/health', {
      method: 'GET',
    });
  }

  // Error handling helper
  handleApiError(error) {
    console.error('API Error:', error);
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    
    if (error.message.includes('401')) {
      throw new Error('Authentication failed. Please log in again.');
    }
    
    throw error;
  }
}

export default new ApiService();
