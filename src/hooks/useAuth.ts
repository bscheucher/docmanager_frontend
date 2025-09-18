import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Helper hook to get just the current user
export const useCurrentUser = () => {
  const { state } = useAuth();
  return state.user;
};

// Helper hook to check if user has specific role
export const useHasRole = (role: string) => {
  const { state } = useAuth();
  return state.user?.roles.includes(role) || false;
};

// Helper hook to check authentication status
export const useIsAuthenticated = () => {
  const { state } = useAuth();
  return state.isAuthenticated;
};