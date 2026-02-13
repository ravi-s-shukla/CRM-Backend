import asyncHandler from '../utils/asyncHandler.js';
import { success } from '../utils/apiResponse.js';
import * as authService from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return success(res, {
    message: 'User registered successfully',
    user: {
      id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role
    }
  }, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return success(res, {
    token: result.token,
    user: {
      id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role
    }
  });
});

export const logout = asyncHandler(async (req, res) => {
  return success(res, { message: 'Logged out successfully' });
});
