import { createContext, useContext, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useLoginMutation } from '@/store/features/auth/authApiSlice';
import { setCredentials, logOut, selectCurrentUser } from '@/store/features/auth/authSlice';

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

// Mock users removed as we are using API


export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [loginApi, { isLoading }] = useLoginMutation();

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await loginApi({ email, password }).unwrap();
      
      // Backend response structure:
      // {
      //   "message": "Login successful.",
      //   "data": {
      //     "user": { ... },
      //     "token": "...",
      //     "token_type": "Bearer"
      //   }
      // }
      
      const data = response.data;
      const token = data?.token;
      let userData = data?.user;

      if (token && userData) {
        // Map API roles array to frontend single role
        // Backend returns: roles: [{ name: 'admin' }, ...]
        // Frontend expects: role: 'admin'
        if (userData.roles && Array.isArray(userData.roles) && userData.roles.length > 0) {
           const roleName = userData.roles[0].name;
           console.log('Mapping role:', roleName);
           userData = { ...userData, role: roleName };
        } else {
           console.warn('No roles found in user data or format incorrect', userData);
        }
        
        console.log('Dispatching credentials with:', userData);
        dispatch(setCredentials({ user: userData, token }));
      } else {
        // Fallback for debugging if structure is different
        console.error('Invalid API response structure', response);
        throw new Error('Login failed: Invalid server response');
      }
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }, [dispatch, loginApi]);

  const logout = useCallback(() => {
    dispatch(logOut());
  }, [dispatch]);

  const register = useCallback(async (name: string, email: string, _password: string, role: UserRole) => {
    // Placeholder for register implementation
    console.log('Register not yet implemented via API', { name, email, role });
    // Keep mock behavior removed or throw error?
    // For now, let's just log.
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
     // Placeholder for profile update
     console.log('Update profile not yet implemented via API', data);
  }, []);

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
