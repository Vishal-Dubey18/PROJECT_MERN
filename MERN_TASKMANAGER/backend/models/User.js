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
      unique: true,              // ← this already creates the index
      lowercase: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String, required: [true, 'Password is required'],
      minlength: 6, select: false,
    },
    role: {
      type: String, enum: ['user', 'admin'], default: 'user',
    },
    isVerified: {
      type: Boolean, default: false,   // ← email verification flag
    },
  },
  { timestamps: true }
);

// ── NO manual index here — unique:true above already creates it ──

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Safe object (no password)
userSchema.methods.toSafeObject = function () {
  return {
    _id:        this._id,
    name:       this.name,
    email:      this.email,
    role:       this.role,
    isVerified: this.isVerified,
    createdAt:  this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
