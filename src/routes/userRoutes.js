import express from 'express';
import { protect } from '../middleware/auth.js';
import { requirePermission, requireRole } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { updateRoleSchema } from '../validators/userValidator.js';
import { PERMISSIONS } from '../constants/roles.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();
router.use(protect);
router.use(requireRole('admin', 'manager'));

router.get('/', requirePermission(PERMISSIONS.USER_READ), userController.listUsers);
router.patch('/:id/role', requirePermission(PERMISSIONS.USER_WRITE), validate(updateRoleSchema), userController.updateRole);

export default router;
