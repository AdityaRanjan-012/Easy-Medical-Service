const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/userAuthMiddleware');
const {
    bookAmbulance,
    getMyBookings,
    cancelBooking,
    updateBookingStatus
} = require('../controllers/ambulanceBookingController');

// Protected routes (require authentication)
router.post('/book', protect, bookAmbulance);
router.get('/my-bookings', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router; 