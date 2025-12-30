const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if staff already exists
    const existingStaff = await User.findOne({ email: 'staff@carwash.com' });
    if (existingStaff) {
      console.log("Staff user already exists!");
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Staff123!', salt);

    const staff = new User({
      name: 'John Staff',
      email: 'staff@carwash.com',
      password: hashedPassword,
      role: 'staff' // <--- THIS IS THE KEY
    });

    await staff.save();
    console.log("✅ Staff User Created: staff@carwash.com | Password: Staff123!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createStaff();