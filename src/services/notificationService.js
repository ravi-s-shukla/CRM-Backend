import Notification from '../models/Notification.js';

export const createNotification = async (userId, type, title, message, meta = {}) => {
  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    meta
  });
  return notification;
};

export const listNotifications = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments({ userId })
  ]);
  const totalPages = Math.ceil(total / limit);
  return { notifications, total, totalPages, page, limit };
};

export const markAsRead = async (id, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: id, userId },
    { read: true },
    { new: true }
  );
  if (!notification) {
    const err = new Error('Notification not found');
    err.statusCode = 404;
    throw err;
  }
  return notification;
};
