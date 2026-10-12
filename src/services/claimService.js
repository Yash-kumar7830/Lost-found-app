import apiClient from './api';

export const claimService = {
  /**
   * Submit an ownership claim for a found item
   * Endpoint: POST /api/claims
   */
  async submitClaim(claimData) {
    try {
      const response = await apiClient.post('/api/claims', claimData);
      return response.data;
    } catch {
      return { success: true, isLocalFallback: true, claim: claimData };
    }
  },

  /**
   * Get all claims for the current student or campus security
   * Endpoint: GET /api/claims
   */
  async getClaims(params = {}) {
    try {
      const response = await apiClient.get('/api/claims', { params });
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Get claim details by ID
   * Endpoint: GET /api/claims/:id
   */
  async getClaimById(id) {
    try {
      const response = await apiClient.get(`/api/claims/${id}`);
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Update claim status (Pending -> Approved / Rejected)
   * Endpoint: PATCH /api/claims/:id
   */
  async updateClaimStatus(id, status, notes = '') {
    try {
      const response = await apiClient.patch(`/api/claims/${id}`, { status, notes });
      return response.data;
    } catch {
      return { success: true, isLocalFallback: true, id, status, notes };
    }
  }
};

export default claimService;
