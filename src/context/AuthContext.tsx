import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  type UserProfile,
  getStoredUserToken,
  getStoredUserProfile,
  userLogin as apiUserLogin,
  userRegister as apiUserRegister,
  userGetMe,
  logoutUser as apiLogoutUser,
  ApiError,
} from '../utils/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; notFound?: boolean }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUserProfile());
  const [token, setToken] = useState<string | null>(() => getStoredUserToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const activeToken = getStoredUserToken();
      const activeUser = getStoredUserProfile();

      if (activeToken) {
        setToken(activeToken);
        if (activeUser) {
          setUser(activeUser);
        }

        // Validate token with server in background
        try {
          const res = await userGetMe(activeToken);
          if (res.success && res.user) {
            setUser(res.user);
          }
        } catch (err: any) {
          if (err instanceof ApiError && err.status === 401) {
            // Token expired or invalid
            await apiLogoutUser(activeToken);
            setUser(null);
            setToken(null);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string; notFound?: boolean }> => {
    try {
      const res = await apiUserLogin(email, password, rememberMe);
      if (res.success && res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
        return { success: true };
      }
      return { success: false, error: res.message || 'Login failed' };
    } catch (err: any) {
      const isNotFound = Boolean(err.notFound || err.code === 'USER_NOT_FOUND' || err.status === 404);
      return {
        success: false,
        notFound: isNotFound,
        error: err.message || 'Unable to sign in. Please check your credentials.',
      };
    }
  };

  const register = async (
    email: string,
    password: string,
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await apiUserRegister(email, password, name);
      if (res.success && res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
        return { success: true };
      }
      return { success: false, error: res.message || 'Registration failed' };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to create account. Please try again.',
      };
    }
  };

  const logout = async (): Promise<void> => {
    await apiLogoutUser(token);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
