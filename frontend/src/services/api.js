const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
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

  async getChallengeProgress(authHeaders) {
    return this.request('/challenge/progress', {
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

  async getCurrentDay(authHeaders) {
    return this.request('/tasks/current', {
      method: 'GET',
      headers: authHeaders,
    });
  }
}

export default new ApiService();
