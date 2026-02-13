import Lead from '../models/Lead.js';
import { ROLES } from '../constants/roles.js';

const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'];
const SOURCES = ['website', 'referral', 'cold', 'social', 'other'];

const normalizeByStatus = (arr) => {
  const map = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  arr.forEach((item) => {
    if (STATUSES.includes(item._id)) map[item._id] = item.count;
  });
  return map;
};

const normalizeBySource = (arr) => {
  const map = Object.fromEntries(SOURCES.map((s) => [s, 0]));
  arr.forEach((item) => {
    if (SOURCES.includes(item._id)) map[item._id] = item.count;
  });
  return map;
};

export const getStatsSummary = async (query, user) => {
  const matchStage = {};
  if (user.role === ROLES.SALES) {
    matchStage.$or = [
      { createdBy: user._id },
      { assignedTo: user._id }
    ];
  }
  if (query.createdFrom) matchStage.createdAt = { ...matchStage.createdAt, $gte: new Date(query.createdFrom) };
  if (query.createdTo) matchStage.createdAt = { ...matchStage.createdAt, $lte: new Date(query.createdTo) };
  const pipeline = [
    ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
    {
      $facet: {
        total: [{ $count: 'count' }],
        byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
        bySource: [{ $group: { _id: '$source', count: { $sum: 1 } } }]
      }
    },
    {
      $project: {
        totalLeads: { $ifNull: [{ $arrayElemAt: ['$total.count', 0] }, 0] },
        byStatus: '$byStatus',
        bySource: '$bySource'
      }
    }
  ];
  const [result] = await Lead.aggregate(pipeline);
  return {
    totalLeads: result?.totalLeads ?? 0,
    byStatus: normalizeByStatus(result?.byStatus ?? []),
    bySource: normalizeBySource(result?.bySource ?? [])
  };
};
