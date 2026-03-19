const User      = require('../models/User');
const { signToken } = require('../utils/jwt');

/**
 * Register a new user.
 * Throws on duplicate email or validation failure.
 */
async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('An account with this email already exists');
    err.statusCode = 409;
    throw err;
  }

  const user  = await User.create({ name, email, password });
  const token = signToken(user._id);

  return { token, user: user.toSafeObject() };
}

/**
 * Log in an existing user.
 * Throws on wrong credentials (deliberate vague message for security).
 */
async function loginUser({ email, password }) {
  // select: false on password field — must explicitly select it here
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(user._id);
  return { token, user: user.toSafeObject() };
}

/**
 * Get current user profile (called from getMe route).
 */
async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user.toSafeObject();
}

module.exports = { registerUser, loginUser, getProfile };
