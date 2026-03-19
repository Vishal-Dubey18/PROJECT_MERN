const taskService = require('../services/task.service');
const { success } = require('../utils/response');

/**
 * GET /api/tasks
 * Query params: status, priority, search, page, limit, sortBy
 */
async function getAll(req, res, next) {
  try {
    const result = await taskService.getAllTasks(req.user._id, req.query);
    success(res, result, 'Tasks fetched');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/tasks/stats
 */
async function getStats(req, res, next) {
  try {
    const stats = await taskService.getTaskStats(req.user._id);
    success(res, { stats }, 'Stats fetched');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/tasks/:id
 */
async function getOne(req, res, next) {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user._id);
    success(res, { task }, 'Task fetched');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/tasks
 */
async function create(req, res, next) {
  try {
    const task = await taskService.createTask(req.user._id, req.body);
    success(res, { task }, 'Task created', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/tasks/:id
 */
async function update(req, res, next) {
  try {
    const task = await taskService.updateTask(req.params.id, req.user._id, req.body);
    success(res, { task }, 'Task updated');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/tasks/:id
 */
async function remove(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id, req.user._id);
    success(res, {}, 'Task deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getStats, getOne, create, update, remove };
