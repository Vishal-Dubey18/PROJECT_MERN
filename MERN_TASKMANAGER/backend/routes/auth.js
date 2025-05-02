const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    
    // Validate username length
    if (username.length > 10) {
      return res.status(400).json({ message: 'Username must be 10 characters or less' });
    }

    const user = new User({ username, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ 
        message: `${field === 'username' ? 'Username' : 'Email'} already exists`
      });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.login(identifier, password);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;