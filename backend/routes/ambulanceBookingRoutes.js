const express = require('express');
const router = express.Router();
const {customerAuth,adminAuth, hospitalAdmin} = require('../middleware/authMiddleware');
const {
    bookAmbulance,
    getMyBookings,
    cancelBooking,
    updateBookingStatus
} = require('../controllers/ambulanceBookingController');

// Protected routes (require authentication)
router.post('/book', customerAuth, bookAmbulance);
router.get('/my-bookings', customerAuth, getMyBookings);
router.put('/:id/cancel', customerAuth, cancelBooking);
router.put('/:id/status',adminAuth, hospitalAdmin, updateBookingStatus);

module.exports = router; 