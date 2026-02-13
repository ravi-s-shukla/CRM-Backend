import { ROLE_PERMISSIONS } from '../constants/roles.js';

export const requirePermission = (...permissions) => (req, res, next) => {
  const role = req.user?.role;
  if (!role) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const allowed = ROLE_PERMISSIONS[role] || [];
  const hasPermission = permissions.every((p) => allowed.includes(p));
  if (!hasPermission) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

export const requireRole = (...roles) => (req, res, next) => {
  const userRole = req.user?.role;
  if (!userRole || !roles.includes(userRole)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
