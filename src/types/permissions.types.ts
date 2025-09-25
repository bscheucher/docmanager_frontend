// src/types/permissions.types.ts

export enum Permission {
  // Document permissions
  DOCUMENT_VIEW_OWN = 'DOCUMENT_VIEW_OWN',
  DOCUMENT_VIEW_ALL = 'DOCUMENT_VIEW_ALL',
  DOCUMENT_CREATE = 'DOCUMENT_CREATE',
  DOCUMENT_EDIT_OWN = 'DOCUMENT_EDIT_OWN',
  DOCUMENT_EDIT_ALL = 'DOCUMENT_EDIT_ALL',
  DOCUMENT_DELETE_OWN = 'DOCUMENT_DELETE_OWN',
  DOCUMENT_DELETE_ALL = 'DOCUMENT_DELETE_ALL',
  DOCUMENT_DOWNLOAD = 'DOCUMENT_DOWNLOAD',
  
  // Tag permissions
  TAG_VIEW = 'TAG_VIEW',
  TAG_CREATE = 'TAG_CREATE',
  TAG_EDIT = 'TAG_EDIT',
  TAG_DELETE = 'TAG_DELETE',
  
  // User management permissions
  USER_VIEW = 'USER_VIEW',
  USER_CREATE = 'USER_CREATE',
  USER_EDIT = 'USER_EDIT',
  USER_DELETE = 'USER_DELETE',
  
  // System permissions
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  SYSTEM_STATS = 'SYSTEM_STATS',
}

export interface RolePermissions {
  role: string;
  permissions: Permission[];
}

// Define role permissions
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'ROLE_ADMIN',
    permissions: [
      Permission.DOCUMENT_VIEW_ALL,
      Permission.DOCUMENT_CREATE,
      Permission.DOCUMENT_EDIT_ALL,
      Permission.DOCUMENT_DELETE_ALL,
      Permission.DOCUMENT_DOWNLOAD,
      Permission.TAG_VIEW,
      Permission.TAG_CREATE,
      Permission.TAG_EDIT,
      Permission.TAG_DELETE,
      Permission.USER_VIEW,
      Permission.USER_CREATE,
      Permission.USER_EDIT,
      Permission.USER_DELETE,
      Permission.SYSTEM_ADMIN,
      Permission.SYSTEM_STATS,
    ],
  },
  {
    role: 'ROLE_MANAGER',
    permissions: [
      Permission.DOCUMENT_VIEW_ALL,
      Permission.DOCUMENT_CREATE,
      Permission.DOCUMENT_EDIT_ALL,
      Permission.DOCUMENT_DELETE_OWN,
      Permission.DOCUMENT_DOWNLOAD,
      Permission.TAG_VIEW,
      Permission.TAG_CREATE,
      Permission.TAG_EDIT,
      Permission.USER_VIEW,
      Permission.SYSTEM_STATS,
    ],
  },
  {
    role: 'ROLE_USER',
    permissions: [
      Permission.DOCUMENT_VIEW_OWN,
      Permission.DOCUMENT_CREATE,
      Permission.DOCUMENT_EDIT_OWN,
      Permission.DOCUMENT_DELETE_OWN,
      Permission.DOCUMENT_DOWNLOAD,
      Permission.TAG_VIEW,
      Permission.TAG_CREATE,
    ],
  },
  {
    role: 'ROLE_VIEWER',
    permissions: [
      Permission.DOCUMENT_VIEW_OWN,
      Permission.DOCUMENT_DOWNLOAD,
      Permission.TAG_VIEW,
    ],
  },
];