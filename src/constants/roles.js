export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SALES: 'sales'
};

export const PERMISSIONS = {
  LEAD_READ: 'lead:read',
  LEAD_WRITE: 'lead:write',
  LEAD_DELETE: 'lead:delete',
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  DASHBOARD_READ: 'dashboard:read',
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_WRITE: 'notification:write'
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS), //all permissions
  [ROLES.MANAGER]: [
    PERMISSIONS.LEAD_READ,
    PERMISSIONS.LEAD_WRITE,
    PERMISSIONS.LEAD_DELETE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.NOTIFICATION_READ
  ],
  [ROLES.SALES]: [
    PERMISSIONS.LEAD_READ,
    PERMISSIONS.LEAD_WRITE,
    PERMISSIONS.LEAD_DELETE,
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.NOTIFICATION_READ
  ]
};
