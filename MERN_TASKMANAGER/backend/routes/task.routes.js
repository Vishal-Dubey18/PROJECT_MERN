const router     = require('express').Router();
const controller = require('../controllers/task.controller');
const validator  = require('../validators/task.validator');
const validate   = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// All task routes are protected
router.use(protect);

// GET  /api/tasks/stats
router.get('/stats', controller.getStats);

// GET  /api/tasks
router.get('/', validator.getAll, validate, controller.getAll);

// GET  /api/tasks/:id
router.get('/:id', validator.mongoId, validate, controller.getOne);

// POST /api/tasks
router.post('/', validator.create, validate, controller.create);

// PUT  /api/tasks/:id
router.put('/:id', validator.update, validate, controller.update);

// DELETE /api/tasks/:id
router.delete('/:id', validator.mongoId, validate, controller.remove);

module.exports = router;
