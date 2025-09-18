// src/hooks/useAuth.ts

import { useAuth as useAuthContext } from '../contexts/AuthContext';

// Re-export the main useAuth hook for consistency
export const useAuth = useAuthContext;

// Helper hook to get just the current user
export const useCurrentUser = () => {
  const { user } = useAuth();
  return user;
};

// Helper hook to check if user has specific role
export const useHasRole = (role: string) => {
  const { hasRole } = useAuth();
  return hasRole(role);
};

// Helper hook to check authentication status
export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

// Helper hook to check if user is admin
export const useIsAdmin = () => {
  const { isAdmin } = useAuth();
  return isAdmin();
};

// Helper hook for logout functionality
export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};