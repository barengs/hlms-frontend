import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, UserRole, Student, Instructor, Admin } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
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

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers[email];
      if (!foundUser) {
        throw new Error('Email atau password salah');
      }
      
      setUser(foundUser);
      localStorage.setItem('hlms_user', JSON.stringify(foundUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Math.random().toString(36).substring(7),
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
        isVerified: false,
      };
      
      setUser(newUser);
      localStorage.setItem('hlms_user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('hlms_user');
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
