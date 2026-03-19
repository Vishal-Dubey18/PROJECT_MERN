const router     = require('express').Router();
const controller = require('../controllers/auth.controller');
const validator  = require('../validators/auth.validator');
const validate   = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', validator.register, validate, controller.register);

// POST /api/auth/login
router.post('/login', validator.login, validate, controller.login);

// GET /api/auth/me  — protected
router.get('/me', protect, controller.getMe);

module.exports = router;
