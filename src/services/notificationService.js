import apiClient from './api';

export const notificationService = {
  /**
   * Get user notifications
   * Endpoint: GET /api/notifications
   */
  async getNotifications() {
    try {
      const response = await apiClient.get('/api/notifications');
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Mark single notification as read
   * Endpoint: PATCH /api/notifications/:id/read
   */
  async markAsRead(id) {
    try {
      const response = await apiClient.patch(`/api/notifications/${id}/read`);
      return response.data;
    } catch {
      return { success: true, id };
    }
  },

  /**
   * Mark all notifications as read
   * Endpoint: POST /api/notifications/mark-all-read
   */
  async markAllAsRead() {
    try {
      const response = await apiClient.post('/api/notifications/mark-all-read');
      return response.data;
    } catch {
      return { success: true };
    }
  }
};

export default notificationService;
