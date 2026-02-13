export const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json(data);
};

export const error = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ message });
};

export const paginated = (res, data, pagination, statusCode = 200) => {
  return res.status(statusCode).json({
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages
    }
  });
};
