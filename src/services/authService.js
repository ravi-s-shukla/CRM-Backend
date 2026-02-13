import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ROLES } from '../constants/roles.js';

export const register = async (data) => {
  const exists = await User.findOne({ email: data.email.toLowerCase() });
  if (exists) {
    const err = new Error('Email already registered');
    err.statusCode = 400;
    throw err;
  }
  const user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    password: data.password,
    role: ROLES.SALES
  });
  const payload = { sub: user._id.toString(), role: user.role };
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

export const login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }
  const payload = {
    sub: user._id.toString(),
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};
