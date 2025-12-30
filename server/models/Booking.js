const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  vehicleType: { type: String, required: true },
  
  // CRITICAL: This is what the CCTV camera will look for
  licensePlate: { 
    type: String, 
    required: true, 
    uppercase: true, 
    trim: true 
  }, 
  
  service: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  
  // This allows the CCTV to update the status automatically
  status: { 
    type: String, 
    enum: ['pending', 'arrived', 'in-progress', 'completed'], 
    default: 'pending' 
  },
  
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, default: 'pending' }
}, { timestamps: true }); // Automatically adds "Created At" and "Updated At"

module.exports = mongoose.model('Booking', BookingSchema);