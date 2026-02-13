import Lead from '../models/Lead.js';
import User from '../models/User.js';
import { ROLES } from '../constants/roles.js';
import { createNotification } from './notificationService.js';

const canAccessLead = (lead, user) => {
  if (user.role === ROLES.ADMIN || user.role === ROLES.MANAGER) return true;
  return (
    lead.createdBy.toString() === user._id.toString() ||
    (lead.assignedTo && lead.assignedTo.toString() === user._id.toString())
  );
};

const buildLeadFilter = (query, user) => {
  const filter = {};
  const andClauses = [];
  if (user.role === ROLES.SALES) {
    andClauses.push({ $or: [{ createdBy: user._id }, { assignedTo: user._id }] });
  }
  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;
  if (query.assignedTo && (user.role === ROLES.ADMIN || user.role === ROLES.MANAGER)) {
    filter.assignedTo = query.assignedTo;
  }
  if (query.createdFrom) filter.createdAt = { ...filter.createdAt, $gte: new Date(query.createdFrom) };
  if (query.createdTo) filter.createdAt = { ...filter.createdAt, $lte: new Date(query.createdTo) };
  if (query.q && query.q.trim()) {
    const regex = new RegExp(query.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    andClauses.push({ $or: [{ name: regex }, { email: regex }, { phone: regex }] });
  }
  if (andClauses.length) filter.$and = andClauses;
  return filter;
};

const parseSort = (sortStr) => {
  const [field, order] = sortStr.split(':');
  const allowed = ['name', 'createdAt', 'email', 'status', 'source'];
  const f = allowed.includes(field) ? field : 'createdAt';
  const o = order === 'asc' ? 1 : -1;
  return { [f]: o, _id: 1 };
};

export const createLead = async (data, userId, notifyFn) => {
  const lead = await Lead.create({
    ...data,
    createdBy: userId
  });
  const managers = await User.find({ role: { $in: [ROLES.ADMIN, ROLES.MANAGER] } }).select('_id');
  const recipients = new Set(managers.map((m) => m._id.toString()));
  recipients.add(userId.toString());
  if (data.assignedTo) recipients.add(data.assignedTo.toString());
  for (const rid of recipients) {
    await createNotification(
      rid,
      'lead_created',
      'New Lead',
      `Lead "${lead.name}" has been created`,
      { leadId: lead._id }
    );
    notifyFn && notifyFn(rid, { type: 'lead_created', lead });
  }
  return lead;
};

export const getLeadById = async (id, user) => {
  const lead = await Lead.findById(id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');
  if (!lead) {
    const err = new Error('Lead not found');
    err.statusCode = 404;
    throw err;
  }
  if (!canAccessLead(lead, user)) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }
  return lead;
};

export const listLeads = async (query, user) => {
  const filter = buildLeadFilter(query, user);
  const sort = parseSort(query.sort || 'createdAt:desc');
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;
  const [leads, total] = await Promise.all([
    Lead.find(filter).sort(sort).skip(skip).limit(limit)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .lean(),
    Lead.countDocuments(filter)
  ]);
  const totalPages = Math.ceil(total / limit);
  return { leads, pagination: { page, limit, total, totalPages } };
};

export const updateLead = async (id, data, user, notifyFn) => {
  const lead = await Lead.findById(id);
  if (!lead) {
    const err = new Error('Lead not found');
    err.statusCode = 404;
    throw err;
  }
  if (!canAccessLead(lead, user)) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }
  const previousStatus = lead.status;
  const previousAssignedTo = lead.assignedTo?.toString();
  const updated = await Lead.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');
  const newAssignedTo = updated.assignedTo?.toString();
  if (data.assignedTo !== undefined && newAssignedTo !== previousAssignedTo && newAssignedTo) {
    await createNotification(
      newAssignedTo,
      'lead_assigned',
      'Lead Assigned',
      `Lead "${updated.name}" has been assigned to you`,
      { leadId: updated._id }
    );
    notifyFn && notifyFn(newAssignedTo, { type: 'lead_assigned', lead: updated });
  }
  if (data.status !== undefined && data.status !== previousStatus) {
    const managers = await User.find({ role: { $in: [ROLES.ADMIN, ROLES.MANAGER] } }).select('_id');
    const recipients = new Set(managers.map((m) => m._id.toString()));
    if (updated.assignedTo) recipients.add(updated.assignedTo.toString());
    for (const rid of recipients) {
      await createNotification(
        rid,
        'lead_status',
        'Lead Status Changed',
        `Lead "${updated.name}" status changed from ${previousStatus} to ${updated.status}`,
        { leadId: updated._id, previousStatus, newStatus: updated.status }
      );
      notifyFn && notifyFn(rid, { type: 'lead_status', lead: updated });
    }
  }
  return updated;
};

export const deleteLead = async (id, user, notifyFn) => {
  const lead = await Lead.findById(id);
  if (!lead) {
    const err = new Error('Lead not found');
    err.statusCode = 404;
    throw err;
  }
  if (!canAccessLead(lead, user)) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }
  await Lead.findByIdAndDelete(id);
  const managers = await User.find({ role: { $in: [ROLES.ADMIN, ROLES.MANAGER] } }).select('_id');
  for (const m of managers) {
    await createNotification(
      m._id,
      'lead_deleted',
      'Lead Deleted',
      `Lead "${lead.name}" has been deleted`,
      { leadId: lead._id }
    );
    notifyFn && notifyFn(m._id.toString(), { type: 'lead_deleted', lead });
  }
  return { message: 'Lead deleted' };
};
