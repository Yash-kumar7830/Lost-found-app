import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEFAULT_DEMO_USERS = [
  {
    id: "STU-2024-8842",
    studentId: "STU-2024-8842",
    name: "Aarav Sharma",
    email: "aarav.s@campus.edu",
    phone: "+91 98765 43842",
    department: "Computer Science & Eng.",
    semester: "6th Semester",
    residence: "North Campus Block B",
    role: "student", // 'student' | 'admin'
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    isVerified: true,
    verifiedDate: "2024-08-15"
  },
  {
    id: "STU-2024-9102",
    studentId: "STU-2024-9102",
    name: "Priya Patel",
    email: "priya.p@campus.edu",
    phone: "+91 98765 12102",
    department: "Electronics & Comm. Eng.",
    semester: "4th Semester",
    residence: "South Campus Block A",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    isVerified: true,
    verifiedDate: "2024-09-01"
  },
  {
    id: "ADM-2024-0012",
    studentId: "ADM-2024-0012",
    name: "Inspector Verma",
    email: "security.admin@campus.edu",
    phone: "+91 98765 00012",
    department: "Campus Security & Safety",
    semester: "Administration Staff",
    residence: "Campus Security HQ",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    isVerified: true,
    verifiedDate: "2024-01-10"
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and restore authentication session on application start
  useEffect(() => {
    try {
      const token = localStorage.getItem('findit_auth_token');
      const savedUser = localStorage.getItem('findit_user');

      if (token && token !== 'logged_out' && savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && (parsed.id || parsed.studentId)) {
          setUser(parsed);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('findit_auth_token');
          localStorage.removeItem('findit_user');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.warn('[AuthContext] Failed to restore session from storage:', err);
      localStorage.removeItem('findit_auth_token');
      localStorage.removeItem('findit_user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData, token = 'demo_jwt_token_sample_8842') => {
    const activeUser = userData || DEFAULT_DEMO_USERS[0];
    setUser(activeUser);
    setIsAuthenticated(true);
    localStorage.setItem('findit_auth_token', token);
    localStorage.setItem('findit_user', JSON.stringify(activeUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('findit_auth_token');
    localStorage.removeItem('findit_user');
  };

  const register = (userData) => {
    const generatedId = userData.studentId && userData.studentId.trim()
      ? userData.studentId.trim().toUpperCase()
      : `STU-2024-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = {
      id: generatedId,
      studentId: generatedId,
      name: userData.name ? userData.name.trim() : 'Campus Student',
      email: userData.email ? userData.email.trim().toLowerCase() : `${generatedId.toLowerCase()}@campus.edu`,
      phone: userData.phone ? userData.phone.trim() : '+91 98765 00000',
      department: userData.department || 'Computer Science & Eng.',
      semester: userData.semester || '1st Semester',
      residence: userData.residence || 'Campus Residence',
      role: userData.role || 'student', // 'student' | 'admin'
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      verifiedDate: new Date().toISOString().split('T')[0],
      isCustomDemoUser: true
    };

    // Save to demo accounts storage
    try {
      const existingRaw = localStorage.getItem('findit_demo_users');
      const existingUsers = existingRaw ? JSON.parse(existingRaw) : [];
      const updatedUsers = [...existingUsers.filter(u => u.studentId !== newUser.studentId && u.email !== newUser.email), newUser];
      localStorage.setItem('findit_demo_users', JSON.stringify(updatedUsers));
    } catch (err) {
      console.warn('[AuthContext] Failed to persist demo user:', err);
    }

    login(newUser);
    return newUser;
  };

  const toggleRole = () => {
    setUser((prev) => {
      if (!prev) return null;
      const newRole = prev.role === 'admin' ? 'student' : 'admin';
      const updated = { ...prev, role: newRole };
      localStorage.setItem('findit_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updateProfile = (updates) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('findit_user', JSON.stringify(updated));
      return updated;
    });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isAdmin,
        isDemoMode: true,
        login,
        logout,
        register,
        toggleRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

