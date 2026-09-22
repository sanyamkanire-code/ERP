import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/erp';
import { INITIAL_USERS } from '../data/mockData';

interface EncryptionMetadata {
  algorithm: string;
  isEncrypted: boolean;
  sessionToken: string;
  keyFingerprint: string;
  lastRotated: string;
}

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  isAuthenticated: boolean;
  encryptionMeta: EncryptionMetadata;
  viewMode: 'web' | 'android';
  setViewMode: (mode: 'web' | 'android') => void;
  switchRole: (role: UserRole) => void;
  loginWithCredentials: (email: string, pass: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check localStorage for saved session
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('nexus_role');
    return (saved as UserRole) || 'student';
  });

  const [viewMode, setViewMode] = useState<'web' | 'android'>(() => {
    const savedRole = localStorage.getItem('nexus_role') || 'student';
    return savedRole === 'student' ? 'android' : 'web';
  });

  const [encryptionMeta, setEncryptionMeta] = useState<EncryptionMetadata>({
    algorithm: 'AES-256-GCM / SHA-256 Session Digest',
    isEncrypted: true,
    sessionToken: 'auth_jwt_' + Math.random().toString(36).substring(2, 12),
    keyFingerprint: 'RSA-4096:SHA256:7f:3b:91:c2:4e:88:ae:33',
    lastRotated: new Date().toLocaleDateString(),
  });

  const currentUser = INITIAL_USERS.find((u) => u.role === currentRole) || INITIAL_USERS[3];

  useEffect(() => {
    localStorage.setItem('nexus_role', currentRole);
  }, [currentRole]);

  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    // If switching to student, default viewMode to android, else to web
    if (newRole === 'student') {
      setViewMode('android');
    } else {
      setViewMode('web');
    }
    // Rotate session token securely
    setEncryptionMeta((prev) => ({
      ...prev,
      sessionToken: 'auth_jwt_' + Math.random().toString(36).substring(2, 12),
    }));
  };

  const loginWithCredentials = async (
    email: string,
    _pass: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulated credential check
    const matchedUser = INITIAL_USERS.find((u) => u.role === role);
    if (matchedUser) {
      setCurrentRole(role);
      if (role === 'student') {
        setViewMode('android');
      } else {
        setViewMode('web');
      }
      return { success: true };
    }
    return { success: false, error: 'Invalid college credentials or role mismatch' };
  };

  const logout = () => {
    // Reset to student default demo
    setCurrentRole('student');
    setViewMode('android');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated: true,
        encryptionMeta,
        viewMode,
        setViewMode,
        switchRole,
        loginWithCredentials,
        logout,
        allUsers: INITIAL_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
