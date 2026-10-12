import apiClient from './api';
import { DEFAULT_DEMO_USERS } from '../context/AuthContext';

/**
 * Helper to fetch all available demo accounts (default + user-created)
 */
export function getAvailableDemoUsers() {
  try {
    const raw = localStorage.getItem('findit_demo_users');
    const custom = raw ? JSON.parse(raw) : [];
    const combined = [...DEFAULT_DEMO_USERS];
    custom.forEach((u) => {
      if (!combined.some((c) => c.studentId === u.studentId || c.email === u.email)) {
        combined.push(u);
      }
    });
    return combined;
  } catch {
    return DEFAULT_DEMO_USERS;
  }
}

/**
 * Find demo user by Student ID or Email
 */
export function findDemoUser(identifier) {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();
  const allUsers = getAvailableDemoUsers();
  return (
    allUsers.find(
      (u) =>
        u.studentId.toLowerCase() === clean ||
        u.email.toLowerCase() === clean ||
        u.id.toLowerCase() === clean
    ) || null
  );
}

export const authService = {
  /**
   * Scan student ID barcode/QR code payload
   * Endpoint: POST /api/auth/scan (or simulated in demo mode)
   */
  async scanQr(qrPayload) {
    // If backend is active, try real API first
    const isRealApiConfigured = Boolean(import.meta.env.VITE_API_BASE_URL);
    if (isRealApiConfigured) {
      try {
        const response = await apiClient.post('/api/auth/scan', { qrPayload });
        return response.data;
      } catch (err) {
        // If real API is explicitly targeted and failed, rethrow error
        if (err.response) throw err;
      }
    }

    // Demo Mode Handler
    let studentId = '';
    let name = '';
    let department = '';

    if (typeof qrPayload === 'string') {
      try {
        const parsed = JSON.parse(qrPayload);
        studentId = parsed.studentId || qrPayload;
        name = parsed.name || '';
        department = parsed.department || '';
      } catch {
        studentId = qrPayload;
      }
    } else if (qrPayload && typeof qrPayload === 'object') {
      studentId = qrPayload.studentId || '';
      name = qrPayload.name || '';
      department = qrPayload.department || '';
    }

    // Match against known demo accounts
    const matched = findDemoUser(studentId) || (name ? findDemoUser(name) : null);
    if (matched) {
      return {
        success: true,
        isSimulated: true,
        student: {
          studentId: matched.studentId,
          name: matched.name,
          email: matched.email,
          phone: matched.phone,
          department: matched.department,
          semester: matched.semester,
          residence: matched.residence,
          role: matched.role,
          avatar: matched.avatar,
          cardStatus: "Active",
          issuedDate: matched.verifiedDate || "2024-08-01"
        }
      };
    }

    // If a clean student ID was entered but not registered in demo
    if (studentId && studentId.trim()) {
      const cleanId = studentId.trim().toUpperCase();
      return {
        success: true,
        isSimulated: true,
        student: {
          studentId: cleanId,
          name: name || `Student (${cleanId})`,
          email: `${cleanId.toLowerCase()}@campus.edu`,
          phone: "+91 98765 00000",
          department: department || "General Engineering",
          semester: "2nd Semester",
          residence: "Campus Hall",
          role: "student",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
          cardStatus: "Active",
          issuedDate: new Date().toISOString().split('T')[0]
        }
      };
    }

    throw new Error('Unable to extract student record from this code or identifier.');
  },

  /**
   * Request one-time password to verified email/phone
   * Endpoint: POST /api/auth/send-otp
   */
  async sendOtp(studentId, target) {
    const isRealApiConfigured = Boolean(import.meta.env.VITE_API_BASE_URL);
    if (isRealApiConfigured) {
      try {
        const response = await apiClient.post('/api/auth/send-otp', { studentId, target });
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    return {
      success: true,
      isSimulated: true,
      message: `Demo OTP dispatched to registered college email (${target || 'student email'})`,
      demoCode: "482910",
      expiresInSeconds: 300
    };
  },

  /**
   * Verify six-digit OTP
   * Endpoint: POST /api/auth/verify-otp
   */
  async verifyOtp(studentId, otp) {
    const isRealApiConfigured = Boolean(import.meta.env.VITE_API_BASE_URL);
    if (isRealApiConfigured) {
      try {
        const response = await apiClient.post('/api/auth/verify-otp', { studentId, otp });
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    // In demo mode, accept the demo OTP '482910'
    const isValid = otp === '482910';
    if (!isValid) {
      throw new Error("Invalid verification code. Please check your simulated OTP passcode (Hint: 482910).");
    }

    // Resolve the actual student record for this studentId
    const matched = findDemoUser(studentId);
    const userProfile = matched || {
      id: studentId,
      studentId: studentId,
      name: `Student (${studentId})`,
      email: `${studentId.toLowerCase()}@campus.edu`,
      phone: "+91 98765 00000",
      department: "Computer Science & Eng.",
      semester: "1st Semester",
      residence: "Campus Hall",
      role: "student",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      verifiedAt: new Date().toISOString()
    };

    return {
      success: true,
      token: `demo_jwt_token_sample_${userProfile.studentId}`,
      user: userProfile
    };
  },

  /**
   * Direct login by credentials (Student ID or Email)
   */
  async loginWithCredentials(identifier, passcode = '') {
    if (!identifier || !identifier.trim()) {
      throw new Error('Please enter your Student ID or Campus Email.');
    }

    const matched = findDemoUser(identifier);
    if (!matched) {
      throw new Error(`Invalid credentials: No account found for '${identifier.trim()}'. Please create a demo account or choose a preset user.`);
    }

    return {
      success: true,
      token: `demo_jwt_token_sample_${matched.studentId}`,
      user: matched
    };
  },

  /**
   * Fetch current authenticated student profile
   * Endpoint: GET /api/auth/me
   */
  async getProfile() {
    try {
      const response = await apiClient.get('/api/auth/me');
      return response.data;
    } catch {
      return null;
    }
  }
};

export default authService;

