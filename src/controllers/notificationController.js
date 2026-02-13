import asyncHandler from '../utils/asyncHandler.js';
import { success, paginated } from '../utils/apiResponse.js';
import * as notificationService from '../services/notificationService.js';

export const listNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { notifications, total, totalPages } = await notificationService.listNotifications(req.user._id, page, limit);
  return paginated(res, notifications, {
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);
  return success(res, { message: 'Marked as read', notification });
});
