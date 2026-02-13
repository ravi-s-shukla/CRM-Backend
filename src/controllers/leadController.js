import asyncHandler from '../utils/asyncHandler.js';
import { success, paginated } from '../utils/apiResponse.js';
import * as leadService from '../services/leadService.js';
import * as dashboardService from '../services/dashboardService.js';

const getNotifyFn = (req) => {
  return req.app.get('io') ? (userId, payload) => req.app.get('io').to(`user:${userId}`).emit('notification', payload) : null;
};

export const createLead = asyncHandler(async (req, res) => {
  const lead = await leadService.createLead(req.body, req.user._id, getNotifyFn(req));
  return success(res, {
    message: 'Lead created successfully',
    lead
  }, 201);
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await leadService.getLeadById(req.params.id, req.user);
  return success(res, { lead });
});

export const listLeads = asyncHandler(async (req, res) => {
  const { leads, pagination } = await leadService.listLeads(req.query, req.user);
  return paginated(res, leads, pagination);
});

export const updateLead = asyncHandler(async (req, res) => {
  const lead = await leadService.updateLead(req.params.id, req.body, req.user, getNotifyFn(req));
  return success(res, {
    message: 'Lead updated successfully',
    lead
  });
});

export const deleteLead = asyncHandler(async (req, res) => {
  const result = await leadService.deleteLead(req.params.id, req.user, getNotifyFn(req));
  return success(res, result);
});

export const getStatsSummary = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStatsSummary(req.query, req.user);
  return success(res, stats);
});
