const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Ensure this path is correct
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
  try {
    // 1. Connect to your Atlas Cluster
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB for seeding...");

    // 2. Check if an admin already exists to avoid duplicates
    const existingAdmin = await User.findOne({ email: 'admin@carwash.com' });
    if (existingAdmin) {
      console.log("Admin already exists! You can use admin@carwash.com to log in.");
      process.exit();
    }

    // 3. Hash the password (Security Best Practice)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin123!', salt);

    // 4. Create the Admin Object
    const admin = new User({
      name: 'System Administrator',
      email: 'admin@carwash.com',
      password: hashedPassword,
      role: 'admin'
    });

    // 5. Save to the Cloud
    await admin.save();
    console.log("🚀 Success: Admin User created!");
    console.log("Email: admin@carwash.com | Password: Admin123!");
    
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err.message);
    process.exit(1);
  }
};

seedAdmin();