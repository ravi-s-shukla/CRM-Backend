import asyncHandler from '../utils/asyncHandler.js';
import { success } from '../utils/apiResponse.js';
import * as userService from '../services/userService.js';

export const listUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers();
  const formatted = users.map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role
  }));
  return success(res, { users: formatted });
});

export const updateRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role);
  return success(res, {
    message: 'Role updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});
