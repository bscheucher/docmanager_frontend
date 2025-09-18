import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthAction, LoginRequest, RegisterRequest, User } from '../types/auth';
import { apiService } from '../services/ApiService';
import { tokenStorage } from '../utils/tokenStorage';

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        error: null,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true for initial auth check
  error: null,
};

interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const initializeAuth = async () => {
    try {
      if (tokenStorage.hasValidTokens()) {
        const token = tokenStorage.getAccessToken();
        const refreshToken = tokenStorage.getRefreshToken();
        
        if (token && refreshToken) {
          try {
            // Verify the token by fetching current user
            const user = await apiService.getCurrentUser();
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { user, token, refreshToken },
            });
          } catch (error) {
            // Token is invalid, clear it
            console.error('Token validation failed:', error);
            tokenStorage.clearTokens();
            dispatch({ type: 'LOGOUT' });
          }
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (credentials: LoginRequest) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await apiService.login(credentials);
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.accessToken,
          refreshToken: response.refreshToken,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await apiService.register(userData);
      tokenStorage.setTokens(response.accessToken, response.refreshToken);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.accessToken,
          refreshToken: response.refreshToken,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    dispatch({ type: 'AUTH_START' });
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout request failed:', error);
      // Continue with local logout even if server request fails
    } finally {
      tokenStorage.clearTokens();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const contextValue: AuthContextType = {
    state,
    login,
    register,
    logout,
    clearError,
    initializeAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};