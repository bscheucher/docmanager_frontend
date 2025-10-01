// src/utils/roleUtils.ts

/**
 * Normalizes roles from various backend formats to a string array
 */
export const normalizeRoles = (roles: any): string[] => {
  if (!roles) {
    console.warn('No roles provided');
    return [];
  }

  // If it's already a string array, return as-is
  if (Array.isArray(roles) && roles.every(r => typeof r === 'string')) {
    return roles;
  }

  // If it's an array of objects with 'name' property
  if (Array.isArray(roles) && roles.every(r => r && typeof r === 'object' && 'name' in r)) {
    return roles.map(r => r.name);
  }

  // If it's an array of objects with 'authority' property (Spring Security format)
  if (Array.isArray(roles) && roles.every(r => r && typeof r === 'object' && 'authority' in r)) {
    return roles.map(r => r.authority);
  }

  console.error('Unknown roles format:', roles);
  return [];
};

/**
 * Ensures role has the ROLE_ prefix
 */
export const ensureRolePrefix = (role: string): string => {
  if (!role) return '';
  return role.startsWith('ROLE_') ? role : `ROLE_${role}`;
};

/**
 * Checks if a user has a specific role
 */
export const userHasRole = (userRoles: string[], role: string): boolean => {
  if (!userRoles || !Array.isArray(userRoles)) {
    return false;
  }

  const normalizedRole = ensureRolePrefix(role);
  return userRoles.some(r => ensureRolePrefix(r) === normalizedRole);
};

/**
 * Checks if a user is an admin
 */
export const isUserAdmin = (userRoles: string[]): boolean => {
  return userHasRole(userRoles, 'ROLE_ADMIN');
};