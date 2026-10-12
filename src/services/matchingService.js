import apiClient from './api';

export const matchingService = {
  /**
   * Fetch smart matching suggestions between lost and found items
   * Endpoint: GET /api/matches
   */
  async getMatches(params = {}) {
    try {
      const response = await apiClient.get('/api/matches', { params });
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Compute similarity comparison between two specific items
   * Endpoint: POST /api/matches/compare
   */
  async compareItems(lostItemId, foundItemId) {
    try {
      const response = await apiClient.post('/api/matches/compare', { lostItemId, foundItemId });
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Dismiss an irrelevant match recommendation
   * Endpoint: POST /api/matches/:id/dismiss
   */
  async dismissMatch(matchId) {
    try {
      const response = await apiClient.post(`/api/matches/${matchId}/dismiss`);
      return response.data;
    } catch {
      return { success: true, isLocalFallback: true, matchId };
    }
  }
};

export default matchingService;
