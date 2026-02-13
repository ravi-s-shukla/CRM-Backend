import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Lead from '../models/Lead.js';
import { ROLES } from '../constants/roles.js';

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({});
  await Lead.deleteMany({});
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@crm.com',
    password: 'admin123',
    role: ROLES.ADMIN
  });
  const manager = await User.create({
    name: 'Manager User',
    email: 'manager@crm.com',
    password: 'manager123',
    role: ROLES.MANAGER
  });
  const sales = await User.create({
    name: 'Sales User',
    email: 'sales@crm.com',
    password: 'sales123',
    role: ROLES.SALES
  });
  await Lead.insertMany([
    { name: 'John Doe', phone: '+1234567890', email: 'john@example.com', source: 'website', status: 'new', createdBy: admin._id },
    { name: 'Jane Smith', phone: '+1987654321', email: 'jane@example.com', source: 'referral', status: 'contacted', assignedTo: sales._id, createdBy: manager._id },
    { name: 'Bob Wilson', phone: '+1555123456', email: 'bob@example.com', source: 'cold', status: 'qualified', assignedTo: sales._id, createdBy: sales._id },
    { name: 'Alice Brown', phone: '+1555987654', email: 'alice@example.com', source: 'website', status: 'won', createdBy: sales._id },
    { name: 'Charlie Davis', phone: '+1555111222', email: 'charlie@example.com', source: 'social', status: 'lost', createdBy: manager._id }
  ]);
  console.log('Seed completed');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
