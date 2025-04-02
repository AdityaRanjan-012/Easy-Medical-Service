const AmbulanceBooking = require('../models/AmbulanceBooking');
const Ambulance = require('../models/Ambulance');
const HospitalProfile = require('../models/HospitalProfile');
const asyncHandler = require('express-async-handler');
const { createNotification } = require('./notificationController');

// @desc    Book an ambulance
// @route   POST /api/ambulance-bookings/book
// @access  Private
exports.bookAmbulance = asyncHandler(async (req, res) => {
    const { ambulanceId, pickupLocation,  patientAge, emergencyType } = req.body;
    // Check if ambulance exists and is available
    const ambulance = await Ambulance.findById(ambulanceId);
    if (!ambulance) {
        return res.status(404).json({
            status: 'error',
            message: 'Ambulance not found'
        });
    }
    if (ambulance.status !== 'available') {
        return res.status(400).json({
            status: 'error',
            message: 'Ambulance is not available'
        });
    }

    // Create booking with hospital reference
    const booking = await AmbulanceBooking.create({
        ambulance: ambulanceId,
        hospital: ambulance.hospital, // Add hospital reference from ambulance
        user: req.user._id,
        pickupLocation,
        patientAge,
        emergencyType,
        status: 'pending'
    });

    // Send notification to hospital
    await createNotification(
        ambulance.hospital,
        'HospitalProfile',
        req.user._id,
        'User',
        booking._id,
        `New ambulance booking request from ${req.user.name}`,
        'booking_created'
    );

    // Update ambulance status
    // ambulance.status = 'booked';
    // await ambulance.save();
    res.status(201).json({
        status: 'success',
        data: booking
    });
});

// @desc    Get user's ambulance bookings
// @route   GET /api/ambulance-bookings/my-bookings
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await AmbulanceBooking.find({ user: req.user._id })
        .populate('ambulance')
        .populate('hospital')
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        count: bookings.length,
        data: bookings
    });
});

// @desc    Get all bookings for a hospital (Hospital Admin)
// @route   GET /api/ambulance-bookings/hospital/:hospitalId
// @access  Private (Hospital Admin)
exports.getHospitalBookings = asyncHandler(async (req, res) => {
    const hospitalId = req.user._id.toString();
    // console.log(req.user._id.toString());

    const bookings = await AmbulanceBooking.find({ hospital: hospitalId })
        .populate('ambulance')
        .populate('user', 'name email phone')
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        count: bookings.length,
        data: bookings
    });
});

// @desc    Cancel ambulance booking
// @route   PUT /api/ambulance-bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res) => {
    const booking = await AmbulanceBooking.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({
            status: 'error',
            message: 'Booking not found'
        });
    }

    // Check if user owns the booking or is hospital admin
    if (booking.user.toString() !== req.user._id.toString() && 
        booking.hospital.toString() !== req.user.hospital.toString()) {
        return res.status(403).json({
            status: 'error',
            message: 'Not authorized to cancel this booking'
        });
    }

    // Update ambulance status back to available
    // const ambulance = await Ambulance.findById(booking.ambulance);
    // ambulance.status = 'available';
    // await ambulance.save();

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Send notification to hospital about cancellation
    await createNotification(
        booking.hospital,
        'HospitalProfile',
        req.user._id,
        'User',
        booking._id,
        `Ambulance booking has been cancelled by ${req.user.name}`,
        'booking_cancelled'
    );

    res.status(200).json({
        status: 'success',
        data: booking
    });
});

// @desc    Update booking status (for ambulance drivers/hospital staff)
// @route   PUT /api/ambulance-bookings/:id/status
// @access  Private
exports.updateBookingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const booking = await AmbulanceBooking.findById(req.params.id);
    const hospital = await HospitalProfile.findById(req.user._id);
    // console.log(hospital.ambulanceCount.available);
    if (!booking) {
        return res.status(404).json({
            status: 'error',
            message: 'Booking not found'
        });
    }

    // Check if user is hospital admin for this booking's hospital
    if (booking.hospital.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            status: 'error',
            message: 'Not authorized to update this booking'
        });
    }
    booking.status = status;
    await booking.save();

    const ambulance = await Ambulance.findById(booking.ambulance);

    // If booking is completed, update ambulance status
    if (status === 'completed' || status === 'cancelled') {
        ambulance.status = 'available';
        hospital.ambulanceCount.available += 1;
    }
    else if(ambulance.status === 'available' && (status !== 'completed' || status === 'cancelled')) {
        ambulance.status = 'booked';
        hospital.ambulanceCount.available -= 1;
    }
    await ambulance.save();
    await hospital.save();

    // Send notification to user about status update
    await createNotification(
        booking.user,
        'User',
        req.user._id,
        'HospitalProfile',
        booking._id,
        `Your ambulance booking status has been updated to: ${status}`,
        'status_updated'
    );

    res.status(200).json({
        status: 'success',
        data: booking
    });
}); 