import express from 'express';
import { protect } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validateQuery } from '../middleware/validate.js';
import { listNotificationsQuerySchema } from '../validators/notificationValidator.js';
import { PERMISSIONS } from '../constants/roles.js';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();
router.use(protect);
router.use(requirePermission(PERMISSIONS.NOTIFICATION_READ));

router.get('/', validateQuery(listNotificationsQuerySchema), notificationController.listNotifications);
router.patch('/:id/read', notificationController.markAsRead);

export default router;
