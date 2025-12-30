const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER NEW USER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email: normalizedEmail, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Normalize input email
    const normalizedEmail = email.toLowerCase();

    // Check for user
    const user = await User.findOne({ email: normalizedEmail });
    
    // DEBUG LOGS - Check your terminal after clicking login
    console.log("--- Login Attempt ---");
    console.log("Email provided:", normalizedEmail);
    console.log("User found in DB?:", user ? "YES" : "NO");

    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    // Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password matches?:", isMatch);

    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};