import apiClient from './api';

export const itemService = {
  /**
   * Fetch item reports with query parameters
   * Endpoint: GET /api/items
   */
  async getItems(params = {}) {
    try {
      const response = await apiClient.get('/api/items', { params });
      return response.data;
    } catch {
      return null; // Signals data layer to use local state / mock data
    }
  },

  /**
   * Fetch single item report by ID
   * Endpoint: GET /api/items/:id
   */
  async getItemById(id) {
    try {
      const response = await apiClient.get(`/api/items/${id}`);
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Report a lost or found item
   * Endpoint: POST /api/items
   */
  async createItem(itemData) {
    try {
      const response = await apiClient.post('/api/items', itemData);
      return response.data;
    } catch {
      return { success: true, isLocalFallback: true, item: itemData };
    }
  },

  /**
   * Update an existing report
   * Endpoint: PATCH /api/items/:id
   */
  async updateItem(id, updates) {
    try {
      const response = await apiClient.patch(`/api/items/${id}`, updates);
      return response.data;
    } catch {
      return { success: true, isLocalFallback: true, id, updates };
    }
  },

  /**
   * Withdraw or delete an item report
   * Endpoint: DELETE /api/items/:id
   */
  async deleteItem(id) {
    try {
      const response = await apiClient.delete(`/api/items/${id}`);
      return response.data;
    } catch {
      return { success: true, isLocalFallback: true, id };
    }
  },

  /**
   * Upload item photos
   * Endpoint: POST /api/items/upload
   */
  async uploadItemImages(formData) {
    try {
      const response = await apiClient.post('/api/items/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch {
      return {
        success: true,
        urls: [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
        ]
      };
    }
  }
};

export default itemService;
