import User from '../models/User.js';

export const listUsers = async () => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return users;
};

export const updateUserRole = async (userId, role) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select('-password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};
