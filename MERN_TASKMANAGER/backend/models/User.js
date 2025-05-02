const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    maxlength: 10,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: props => `${props.value} is not a valid username! Only letters, numbers and underscores allowed.`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Add static method for login
userSchema.statics.login = async function(identifier, password) {
  const user = await this.findOne({
    $or: [
      { username: identifier },
      { email: identifier }
    ]
  });
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);