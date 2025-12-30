const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// 1. GET ALL BOOKINGS (For Admin & Staff Dashboards)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREATE A NEW BOOKING (From Customer Portal)
router.post('/', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. CCTV INTEGRATION: Update status via License Plate
router.get('/scan/:plate', async (req, res) => {
  try {
    const plate = req.params.plate.toUpperCase();
    const booking = await Booking.findOneAndUpdate(
      { licensePlate: plate, status: 'pending' },
      { status: 'arrived' },
      { new: true }
    );

    if (!booking) return res.status(404).json({ msg: "No pending booking found for this plate." });
    res.json({ msg: "Car Arrived!", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. MANUAL UPDATE (When Staff clicks "Complete" on Dashboard)
router.put('/:id', async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;