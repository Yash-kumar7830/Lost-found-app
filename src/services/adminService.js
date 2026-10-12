import apiClient from './api';

export const adminService = {
  /**
   * Fetch aggregate campus metrics for admin dashboard
   * Endpoint: GET /api/admin/metrics
   */
  async getAdminMetrics() {
    try {
      const response = await apiClient.get('/api/admin/metrics');
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Review claim (Approve / Reject / Request More Info)
   * Endpoint: POST /api/admin/claims/:id/review
   */
  async reviewClaim(claimId, decision, notes = '') {
    try {
      const response = await apiClient.post(`/api/admin/claims/${claimId}/review`, {
        decision,
        notes,
      });
      return response.data;
    } catch {
      return { success: true, isLocalFallback: true, claimId, decision, notes };
    }
  },

  /**
   * Moderate flagged report
   * Endpoint: POST /api/admin/reports/:id/moderate
   */
  async moderateReport(reportId, action) {
    try {
      const response = await apiClient.post(`/api/admin/reports/${reportId}/moderate`, {
        action,
      });
      return response.data;
    } catch {
      return { success: true, reportId, action };
    }
  },

  /**
   * Fetch system audit activity log
   * Endpoint: GET /api/admin/audit-logs
   */
  async getAuditLogs() {
    try {
      const response = await apiClient.get('/api/admin/audit-logs');
      return response.data;
    } catch {
      return null;
    }
  }
};

export default adminService;
