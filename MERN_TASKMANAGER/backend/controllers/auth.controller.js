const authService = require('../services/auth.service');
const { success } = require('../utils/response');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const data = await authService.registerUser({ name, email, password });
    success(res, data, data.message, 200);
  } catch (err) { next(err); }
}

async function verifyEmail(req, res, next) {
  try {
    const { email, otp } = req.body;
    const data = await authService.verifyEmail({ email, otp });
    success(res, data, 'Email verified successfully');
  } catch (err) { next(err); }
}

async function resendOTP(req, res, next) {
  try {
    const { email } = req.body;
    const data = await authService.resendVerificationOTP({ email });
    success(res, data, data.message);
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser({ email, password });
    success(res, data, 'Login successful');
  } catch (err) {
    // Pass verification required info to frontend
    if (err.requiresVerification) {
      return res.status(403).json({
        success: false,
        message: err.message,
        requiresVerification: true,
        email: err.email,
      });
    }
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await authService.getProfile(req.user._id);
    success(res, { user }, 'Profile fetched');
  } catch (err) { next(err); }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const data = await authService.requestPasswordReset({ email });
    success(res, data, data.message);
  } catch (err) { next(err); }
}

async function resetPassword(req, res, next) {
  try {
    const { email, otp, newPassword } = req.body;
    const data = await authService.resetPassword({ email, otp, newPassword });
    success(res, data, data.message);
  } catch (err) { next(err); }
}

module.exports = { register, verifyEmail, resendOTP, login, getMe, forgotPassword, resetPassword };
