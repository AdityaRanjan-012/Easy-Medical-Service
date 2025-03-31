const express = require('express');
const router = express.Router();
const {customerAuth,adminAuth,hospitalAdmin} = require('../middleware/authMiddleware');
const {
    bookAmbulance,
    getMyBookings,
    cancelBooking,
    updateBookingStatus,
    getHospitalBookings
} = require('../controllers/ambulanceBookingController');

// Customer routes (protected)
router.post('/book', customerAuth, bookAmbulance);
router.get('/my-bookings', customerAuth, getMyBookings);
router.put('/:id/cancel', customerAuth, cancelBooking);

// Hospital admin routes (protected)
router.get('/hospital', adminAuth, hospitalAdmin, getHospitalBookings);
router.put('/:id/status', adminAuth, hospitalAdmin, updateBookingStatus);

module.exports = router;