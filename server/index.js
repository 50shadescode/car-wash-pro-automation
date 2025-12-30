const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Import your Routes
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

dotenv.config();
const app = express();

// 2. Middleware
app.use(express.json()); // Allows server to read data from forms/frontend
app.use(cors());         // Allows your React app to talk to this server

// 3. Define API Endpoints
app.use('/api/auth', authRoutes);       
app.use('/api/bookings', bookingRoutes); 

// 4. Connect to Database (MongoDB)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 MERN Stack Online: Database & CCTV Logic Ready"))
  .catch((err) => console.log("❌ DB Connection Error: ", err));

// 5. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));