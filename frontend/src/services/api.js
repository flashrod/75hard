class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
    console.log('🔧 API Service initialized with baseURL:', this.baseURL);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`📡 Making ${options.method || 'GET'} request to:`, url);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log(`📡 Response status: ${response.status} for ${url}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error(`❌ API Error for ${url}:`, error);
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

  async completeDay(dayNumber, authHeaders) {
    return this.request('/tasks/complete-day', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ dayNumber }),
    });
  }

  async getDayHistory(authHeaders, page = 1, limit = 100) {
    return this.request(`/tasks/history?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: authHeaders,
    });
  }

  // Photo upload endpoints
  async uploadProgressPhoto(formData, authHeaders) {
    const headers = { ...authHeaders };
    delete headers['Content-Type'];

    return this.request('/upload/progress-photo', {
      method: 'POST',
      headers: headers,
      body: formData,
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

  async healthCheck() {
    return this.request('/health', {
      method: 'GET',
    });
  }
}

export default new ApiService();
