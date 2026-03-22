const User    = require('../models/User');
const OTP     = require('../models/OTP');
const { signToken } = require('../utils/jwt');
const {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} = require('./email.service');
const crypto  = require('crypto');

// ── helpers ──────────────────────────────────────────────────
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// ── 1. Register (starts unverified, sends OTP) ───────────────
async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });

  if (existing && existing.isVerified) {
    const err = new Error('An account with this email already exists');
    err.statusCode = 409;
    throw err;
  }

  // If unverified account exists, delete it and re-create (user may be retrying)
  if (existing && !existing.isVerified) {
    await User.deleteOne({ email });
  }

  // Create unverified user
  const user = await User.create({ name, email, password, isVerified: false });

  // Generate + save OTP
  const otp = generateOTP();
  await OTP.deleteMany({ email, type: 'verify' });
  await OTP.create({
    email,
    otp,
    type: 'verify',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  // Send verification email
  await sendVerificationEmail({ to: email, name, otp });

  return { requiresVerification: true, email, message: 'Verification code sent to your email.' };
}

// ── 2. Verify email OTP ───────────────────────────────────────
async function verifyEmail({ email, otp }) {
  const record = await OTP.findOne({ email, type: 'verify', used: false });

  if (!record) {
    const err = new Error('No verification code found. Please register again.');
    err.statusCode = 400; throw err;
  }
  if (record.otp !== otp) {
    const err = new Error('Invalid verification code.');
    err.statusCode = 400; throw err;
  }
  if (new Date() > record.expiresAt) {
    await OTP.deleteOne({ _id: record._id });
    const err = new Error('Code expired. Please register again.');
    err.statusCode = 400; throw err;
  }

  // Mark as used and verify user
  record.used = true;
  await record.save();

  const user = await User.findOneAndUpdate(
    { email },
    { isVerified: true },
    { new: true }
  );

  if (!user) {
    const err = new Error('User not found.'); err.statusCode = 404; throw err;
  }

  const token = signToken(user._id);

  // Send welcome email after verification
  sendWelcomeEmail({ to: email, name: user.name }).catch(e =>
    console.warn('Welcome email failed:', e.message)
  );

  return { token, user: user.toSafeObject() };
}

// ── 3. Resend verification OTP ────────────────────────────────
async function resendVerificationOTP({ email }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('No account found with this email.'); err.statusCode = 404; throw err;
  }
  if (user.isVerified) {
    const err = new Error('Email already verified.'); err.statusCode = 400; throw err;
  }

  const otp = generateOTP();
  await OTP.deleteMany({ email, type: 'verify' });
  await OTP.create({
    email, otp, type: 'verify',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });
  await sendVerificationEmail({ to: email, name: user.name, otp });
  return { message: 'New verification code sent.' };
}

// ── 4. Login ──────────────────────────────────────────────────
async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Invalid email or password'); err.statusCode = 401; throw err;
  }

  if (!user.isVerified) {
    // Resend OTP automatically
    const otp = generateOTP();
    await OTP.deleteMany({ email, type: 'verify' });
    await OTP.create({ email, otp, type: 'verify', expiresAt: new Date(Date.now() + 15 * 60 * 1000) });
    sendVerificationEmail({ to: email, name: user.name, otp }).catch(() => {});

    const err = new Error('Email not verified. A new code has been sent to your email.');
    err.statusCode = 403;
    err.requiresVerification = true;
    err.email = email;
    throw err;
  }

  const token = signToken(user._id);
  return { token, user: user.toSafeObject() };
}

// ── 5. Get profile ────────────────────────────────────────────
async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) { const err = new Error('User not found'); err.statusCode = 404; throw err; }
  return user.toSafeObject();
}

// ── 6. Request password reset ─────────────────────────────────
async function requestPasswordReset({ email }) {
  const user = await User.findOne({ email });
  if (!user) return { message: 'If this email exists, a reset code has been sent.' };

  const otp = generateOTP();
  await OTP.deleteMany({ email, type: 'reset' });
  await OTP.create({ email, otp, type: 'reset', expiresAt: new Date(Date.now() + 15 * 60 * 1000) });
  await sendPasswordResetEmail({ to: email, name: user.name, otp });
  return { message: 'If this email exists, a reset code has been sent.' };
}

// ── 7. Reset password ─────────────────────────────────────────
async function resetPassword({ email, otp, newPassword }) {
  const record = await OTP.findOne({ email, type: 'reset', used: false });
  if (!record) { const err = new Error('No reset code found.'); err.statusCode = 400; throw err; }
  if (record.otp !== otp) { const err = new Error('Invalid reset code.'); err.statusCode = 400; throw err; }
  if (new Date() > record.expiresAt) {
    await OTP.deleteOne({ _id: record._id });
    const err = new Error('Code expired. Request a new one.'); err.statusCode = 400; throw err;
  }
  record.used = true;
  await record.save();

  const user = await User.findOne({ email });
  if (!user) { const err = new Error('User not found.'); err.statusCode = 404; throw err; }
  user.password = newPassword;
  await user.save();
  return { message: 'Password reset successfully. Please log in.' };
}

module.exports = {
  registerUser, verifyEmail, resendVerificationOTP,
  loginUser, getProfile, requestPasswordReset, resetPassword,
};
