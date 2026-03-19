const authService    = require('../services/auth.service');
const { success }    = require('../utils/response');

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const data = await authService.registerUser({ name, email, password });
    success(res, data, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser({ email, password });
    success(res, data, 'Login successful');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me  (protected)
 */
async function getMe(req, res, next) {
  try {
    const user = await authService.getProfile(req.user._id);
    success(res, { user }, 'Profile fetched');
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe };
