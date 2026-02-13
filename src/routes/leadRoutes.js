import express from 'express';
import { protect } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { validate, validateQuery } from '../middleware/validate.js';
import { createLeadSchema, updateLeadSchema, listLeadsQuerySchema, statsQuerySchema } from '../validators/leadValidator.js';
import { PERMISSIONS } from '../constants/roles.js';
import * as leadController from '../controllers/leadController.js';

const router = express.Router();
router.use(protect);

router.get('/stats/summary', requirePermission(PERMISSIONS.DASHBOARD_READ), validateQuery(statsQuerySchema), leadController.getStatsSummary);

router
  .route('/')
  .get(requirePermission(PERMISSIONS.LEAD_READ), validateQuery(listLeadsQuerySchema), leadController.listLeads)
  .post(requirePermission(PERMISSIONS.LEAD_WRITE), validate(createLeadSchema), leadController.createLead);

router
  .route('/:id')
  .get(requirePermission(PERMISSIONS.LEAD_READ), leadController.getLead)
  .patch(requirePermission(PERMISSIONS.LEAD_WRITE), validate(updateLeadSchema), leadController.updateLead)
  .delete(requirePermission(PERMISSIONS.LEAD_DELETE), leadController.deleteLead);

export default router;
