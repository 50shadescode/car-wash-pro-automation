const mongoose = require('mongoose');
const Booking = require('./models/Booking');
require('dotenv').config();

const seedBookings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing bookings
    await Booking.deleteMany({});

    const mockBookings = [
      {
        customerName: "Alice Mwangi",
        email: "alice@example.com",
        phone: "0712345678",
        licensePlate: "KDA 442Z",
        vehicleType: "Sedan",
        service: "Executive Wash",
        totalPrice: 1500,
        status: "pending",
        date: "2025-12-30",
        time: "10:15 AM"
      },
      {
        customerName: "Brian Omondi",
        email: "brian@example.com",
        phone: "0722334455",
        licensePlate: "KCC 110Y",
        vehicleType: "SUV",
        service: "Basic Wash",
        totalPrice: 800,
        status: "in-progress",
        date: "2025-12-30",
        time: "10:30 AM"
      },
      {
        customerName: "Catherine Njeri",
        email: "kate@example.com",
        phone: "0733445566",
        licensePlate: "KBB 999X",
        vehicleType: "Small Car",
        service: "Full Detail",
        totalPrice: 3000,
        status: "pending",
        date: "2025-12-30",
        time: "11:00 AM"
      }
    ];

    await Booking.insertMany(mockBookings);
    console.log("✅ Database Seeded Successfully with full validation!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err.message);
    process.exit(1);
  }
};

seedBookings();