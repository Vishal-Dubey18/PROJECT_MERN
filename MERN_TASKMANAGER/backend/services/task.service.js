const Task = require('../models/Task');

/**
 * Build a MongoDB filter object from query params.
 */
function buildFilter(userId, { status, priority, search }) {
  const filter = { user: userId };

  if (status)   filter.status   = status;
  if (priority) filter.priority = priority;

  if (search && search.trim()) {
    // Text search if text index exists; otherwise regex fallback
    filter.$or = [
      { title:       { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  return filter;
}

/**
 * Map sortBy param (e.g. "-createdAt") → Mongoose sort object.
 */
function buildSort(sortBy = '-createdAt') {
  const desc  = sortBy.startsWith('-');
  const field = desc ? sortBy.slice(1) : sortBy;
  return { [field]: desc ? -1 : 1 };
}

// ── CRUD ─────────────────────────────────────────────────────────

async function getAllTasks(userId, query) {
  const { page = 1, limit = 9, sortBy, ...filters } = query;

  const pageNum  = Math.max(1, parseInt(page,  10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip     = (pageNum - 1) * limitNum;

  const filter = buildFilter(userId, filters);
  const sort   = buildSort(sortBy);

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      page:       pageNum,
      limit:      limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      hasNext:    pageNum < Math.ceil(total / limitNum),
      hasPrev:    pageNum > 1,
    },
  };
}

async function getTaskById(taskId, userId) {
  const task = await Task.findOne({ _id: taskId, user: userId }).lean();
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }
  return task;
}

async function createTask(userId, data) {
  const task = await Task.create({ ...data, user: userId });
  return task.toObject();
}

async function updateTask(taskId, userId, data) {
  // Prevent user field from being overwritten
  delete data.user;

  const task = await Task.findOneAndUpdate(
    { _id: taskId, user: userId },
    { $set: data },
    { new: true, runValidators: true }
  ).lean();

  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }
  return task;
}

async function deleteTask(taskId, userId) {
  const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }
  return task;
}

async function getTaskStats(userId) {
  const stats = await Task.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id:      '$status',
        count:    { $sum: 1 },
        highPri:  { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
      },
    },
  ]);

  const result = { total: 0, pending: 0, completed: 0, highPriority: 0 };
  stats.forEach(({ _id, count, highPri }) => {
    result[_id]  = count;
    result.total += count;
    result.highPriority += highPri;
  });
  return result;
}

module.exports = {
  getAllTasks, getTaskById, createTask,
  updateTask, deleteTask, getTaskStats,
};
