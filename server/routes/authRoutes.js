const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const User = require('../models/User'); // Import the User model

// Public Routes
// URL: http://localhost:5000/api/auth/register
router.post('/register', register);

// URL: http://localhost:5000/api/auth/login
router.post('/login', login);

// Admin Only Routes
// URL: http://localhost:5000/api/auth/users
router.get('/users', async (req, res) => {
  try {
    // 🛡️ Security: .select('-password') ensures we don't send hashes to the frontend
    const users = await User.find().select('-password'); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch staff list" });
  }
});

module.exports = router;