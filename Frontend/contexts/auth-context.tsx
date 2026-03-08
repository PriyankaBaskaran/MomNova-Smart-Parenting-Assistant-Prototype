'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api, { handleApiResponse, handleApiError } from '@/lib/api';
import { getToken, setToken, removeToken, getUser, setUser, removeUser, clearStorage } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/lib/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedToken = getToken();
      const storedUser = getUser();

      if (storedToken && storedUser) {
        setTokenState(storedToken);
        setUserState(storedUser);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>('/Auth/login', credentials);
      const authData = response.data; // Direct response, no wrapper

      setToken(authData.token);
      setUser({ userId: authData.userId, email: authData.email, name: authData.name });
      setTokenState(authData.token);
      setUserState({ userId: authData.userId, email: authData.email, name: authData.name });

      toast.success('Welcome back!');
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      console.log('Registering user:', { email: data.email, name: data.name });
      
      const response = await api.post<AuthResponse>('/Auth/register', data);
      console.log('Register API response:', response);
      console.log('Register response data:', response.data);
      
      const authData = response.data; // Direct response, no wrapper

      // Validate response has required fields
      if (!authData.token) {
        console.error('No token in response:', authData);
        throw new Error('No authentication token received from server');
      }

      if (!authData.userId) {
        console.error('No userId in response:', authData);
        throw new Error('No user ID received from server');
      }

      console.log('Setting token and user data...');
      setToken(authData.token);
      setUser({ userId: authData.userId, email: authData.email, name: authData.name });
      setTokenState(authData.token);
      setUserState({ userId: authData.userId, email: authData.email, name: authData.name });

      console.log('Auth state updated, redirecting to dashboard...');
      toast.success('Account created successfully! Logging you in...');
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        router.push(ROUTES.DASHBOARD);
      }, 100);
    } catch (error) {
      console.error('Registration error:', error);
      const message = handleApiError(error);
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearStorage();
    setTokenState(null);
    setUserState(null);
    toast.success('Logged out successfully');
    router.push(ROUTES.LOGIN);
  };

  const refreshUser = async () => {
    try {
      // Note: The API doesn't have a /me endpoint in swagger
      // You may need to store user data from login/register
      // or add this endpoint to your backend
      const storedUser = getUser();
      if (storedUser) {
        setUserState(storedUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
