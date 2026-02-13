import Joi from 'joi';

const phoneRegex = /^[+]?[\d\s()-]{10,20}$/;
const statusEnum = ['new', 'contacted', 'qualified', 'won', 'lost'];
const sourceEnum = ['website', 'referral', 'cold', 'social', 'other'];

export const createLeadSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(phoneRegex).required(),
  email: Joi.string().email().allow('', null),
  source: Joi.string().valid(...sourceEnum).default('other'),
  status: Joi.string().valid(...statusEnum).default('new'),
  notes: Joi.string().allow('', null),
  assignedTo: Joi.string().hex().length(24).allow(null)
});

export const updateLeadSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().pattern(phoneRegex),
  email: Joi.string().email().allow('', null),
  source: Joi.string().valid(...sourceEnum),
  status: Joi.string().valid(...statusEnum),
  notes: Joi.string().allow('', null),
  assignedTo: Joi.string().hex().length(24).allow(null)
}).min(1);

export const listLeadsQuerySchema = Joi.object({
  q: Joi.string().allow(''),
  status: Joi.string().valid(...statusEnum),
  source: Joi.string().valid(...sourceEnum),
  assignedTo: Joi.string().hex().length(24),
  createdFrom: Joi.date().iso(),
  createdTo: Joi.date().iso(),
  sort: Joi.string().pattern(/^(name|createdAt|email|status|source):(asc|desc)$/).default('createdAt:desc'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

export const statsQuerySchema = Joi.object({
  createdFrom: Joi.date().iso(),
  createdTo: Joi.date().iso()
});
