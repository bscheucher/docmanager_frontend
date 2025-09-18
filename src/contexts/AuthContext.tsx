// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthContextType, User, LoginRequest, RegisterRequest } from '../types/auth.types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const user = await authService.getCurrentUser();
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      authService.logout();
    } finally {
      dispatch({ type: 'LOADING', payload: false });
    }
  };

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      dispatch({ type: 'LOADING', payload: true });
      const response = await authService.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    } catch (error: any) {
      dispatch({ type: 'LOADING', payload: false });
      const apiError = {
        message: error.response?.data?.message || 'Login failed',
        status: error.response?.status || 500,
        validationErrors: error.response?.data?.validationErrors
      };
      throw apiError;
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      dispatch({ type: 'LOADING', payload: true });
      const response = await authService.register(userData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    } catch (error: any) {
      dispatch({ type: 'LOADING', payload: false });
      const apiError = {
        message: error.response?.data?.message || 'Registration failed',
        status: error.response?.status || 500,
        validationErrors: error.response?.data?.validationErrors
      };
      throw apiError;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const hasRole = (role: string): boolean => {
    return state.user?.roles?.some(r => r.name === role) || false;
  };

  const isAdmin = (): boolean => {
    return hasRole('ROLE_ADMIN');
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};