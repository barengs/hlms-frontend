import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, UserRole, Student, Instructor, Admin } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const mockUsers: Record<string, User> = {
  'student@example.com': {
    id: '1',
    email: 'student@example.com',
    name: 'Ahmad Siswa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    role: 'student',
    bio: 'Seorang siswa yang bersemangat belajar',
    createdAt: '2024-01-15',
    isVerified: true,
    enrolledCourses: ['1', '2', '3'],
    completedCourses: ['4'],
    points: 1250,
    badges: [],
  } as Student,
  'instructor@example.com': {
    id: '2',
    email: 'instructor@example.com',
    name: 'Budi Pengajar',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    role: 'instructor',
    bio: 'Instruktur berpengalaman di bidang web development',
    createdAt: '2023-06-01',
    isVerified: true,
    courses: ['1', '2'],
    totalStudents: 1500,
    totalEarnings: 45000000,
    rating: 4.8,
  } as Instructor,
  'admin@example.com': {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin Platform',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    role: 'admin',
    bio: 'Administrator platform',
    createdAt: '2023-01-01',
    isVerified: true,
    permissions: ['all'],
  } as Admin,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hlms_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api-lms.umediatama.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Map API response to User type
      const apiUser = data.data?.user || data.user || data;

      const loggedInUser: User = {
        id: apiUser.id || Math.random().toString(36).substring(7),
        email: apiUser.email || email,
        name: apiUser.name || 'User',
        role: apiUser.role || 'student',
        avatar: apiUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiUser.name || 'User'}`,
        createdAt: apiUser.created_at || new Date().toISOString(),
        isVerified: !!apiUser.email_verified_at,
        bio: apiUser.bio || '',
      };

      // Ensure we have all necessary fields for specific roles
      const extendedUser: any = {
        ...loggedInUser,
        // Default values if not provided by API
        points: loggedInUser.role === 'student' ? 0 : undefined,
        badges: loggedInUser.role === 'student' ? [] : undefined,
        enrolledCourses: loggedInUser.role === 'student' ? [] : undefined,
        completedCourses: loggedInUser.role === 'student' ? [] : undefined,
        courses: loggedInUser.role === 'instructor' ? [] : undefined,
      };

      setUser(extendedUser);
      localStorage.setItem('hlms_user', JSON.stringify(extendedUser));

      if (data.data?.token || data.token) {
        localStorage.setItem('hlms_token', data.data?.token || data.token);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api-lms.umediatama.com/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Map API response to User type
      const apiUser = data.data?.user || data;

      const newUser: User = {
        id: apiUser.id || Math.random().toString(36).substring(7),
        email: apiUser.email || email,
        name: apiUser.name || name,
        role: apiUser.role || role,
        avatar: apiUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        createdAt: apiUser.created_at || new Date().toISOString(),
        isVerified: !!apiUser.email_verified_at,
        // Default values for Student specific fields to prevent UI errors
        bio: '',
      };

      // Handle specific role fields if necessary (casting to 'any' to bypass strict checks for merged properties)
      const extendedUser: any = {
        ...newUser,
        points: 0,
        badges: [],
        enrolledCourses: [],
        completedCourses: [],
      };

      setUser(extendedUser);
      localStorage.setItem('hlms_user', JSON.stringify(extendedUser));

      if (data.data?.token || data.token) {
        localStorage.setItem('hlms_token', data.data?.token || data.token);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('hlms_token');
      if (token) {
        await fetch('https://api-lms.umediatama.com/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      localStorage.removeItem('hlms_user');
      localStorage.removeItem('hlms_token');
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('hlms_user', JSON.stringify(updatedUser));
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
