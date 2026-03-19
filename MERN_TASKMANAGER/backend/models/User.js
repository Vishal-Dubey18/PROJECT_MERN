const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, required: [true, 'Name is required'],
      trim: true, minlength: 2, maxlength: 50,
    },
    email: {
      type: String, required: [true, 'Email is required'],
      unique: true, lowercase: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String, required: [true, 'Password is required'],
      minlength: 6, select: false,   // never returned by default
    },
    role: {
      type: String, enum: ['user', 'admin'], default: 'user',
    },
  },
  { timestamps: true }
);

// ── Index ────────────────────────────────────────────────────────
userSchema.index({ email: 1 });

// ── Pre-save: hash password ──────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Instance method: compare password ────────────────────────────
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

// ── Remove sensitive fields from JSON output ─────────────────────
userSchema.methods.toSafeObject = function () {
  return {
    _id:       this._id,
    name:      this.name,
    email:     this.email,
    role:      this.role,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
