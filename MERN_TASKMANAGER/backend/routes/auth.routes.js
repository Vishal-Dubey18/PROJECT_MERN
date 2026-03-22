const router      = require('express').Router();
const controller  = require('../controllers/auth.controller');
const validator   = require('../validators/auth.validator');
const validate    = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { body }    = require('express-validator');
const rateLimit   = require('express-rate-limit');

// Strict rate limit for OTP endpoints (prevent spam)
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: { success: false, message: 'Too many attempts. Please wait 10 minutes.' },
});

router.post('/register',        validator.register, validate, controller.register);
router.post('/verify-email',    otpLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
], validate, controller.verifyEmail);
router.post('/resend-otp',      otpLimiter, [
  body('email').isEmail().normalizeEmail(),
], validate, controller.resendOTP);
router.post('/login',           validator.login, validate, controller.login);
router.get('/me',               protect, controller.getMe);
router.post('/forgot-password', otpLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
], validate, controller.forgotPassword);
router.post('/reset-password',  otpLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password min 6 chars')
    .matches(/\d/).withMessage('Password must contain a number'),
], validate, controller.resetPassword);

module.exports = router;
