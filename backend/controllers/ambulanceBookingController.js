const AmbulanceBooking = require('../models/AmbulanceBooking');
const Ambulance = require('../models/Ambulance');
const asyncHandler = require('express-async-handler');
// @desc    Book an ambulance
// @route   POST /api/ambulance-bookings/book
// @access  Private
exports.bookAmbulance = asyncHandler(async (req, res) => {
    const { ambulanceId, pickupLocation, patientAge, emergencyType } = req.body;
    console.log("User Object: ", req.user);  // Debugging

    // Check if ambulance exists and is available
    const ambulance = await Ambulance.findById(ambulanceId);
    if (!ambulance) {
        return res.status(404).json({
            status: 'error',
            message: 'Ambulance not found'
        });
    }
console.log("im above " + ambulance.status);
    if (ambulance.status !== 'Available') {
        return res.status(400).json({
            status: 'error',
            message: 'Ambulance is not available'
        });
    }

    // Create booking
    const booking = await AmbulanceBooking.create({
        ambulance: ambulanceId,
        user: req.user._id,
        pickupLocation,
        patientAge,
        emergencyType,
        status: 'pending'
    });
    // Update ambulance status
    ambulance.status = 'Booked';
    await ambulance.save();
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
// exports.cancelBooking = asyncHandler(async (req, res) => {
//     const booking = await AmbulanceBooking.findById(req.params.id);

//     if (!booking) {
//         return res.status(404).json({
//             status: 'error',
//             message: 'Booking not found'
//         });
//     }

//     // Check if user owns the booking
//     if (booking.user.toString() !== req.user._id.toString()) {
//         return res.status(403).json({
//             status: 'error',
//             message: 'Not authorized to cancel this booking'
//         });
//     }

//     // Update ambulance status back to available
//     const ambulance = await Ambulance.findById(booking.ambulance);
//     ambulance.status = 'available';
//     await ambulance.save();

//     // Update booking status
//     booking.status = 'cancelled';
//     await booking.save();

//     res.status(200).json({
//         status: 'success',
//         data: booking
//     });
// });

// @desc    Update booking status (for ambulance drivers/hospital staff)
// @route   PUT /api/ambulance-bookings/:id/status
// @access  Private
exports.updateBookingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const booking = await AmbulanceBooking.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({
            status: 'error',
            message: 'Booking not found'
        });
    }

    booking.status = status;
    await booking.save();

    // If booking is completed, update ambulance status
    if (status === 'completed') {
        const ambulance = await Ambulance.findById(booking.ambulance);
        ambulance.status = 'available';
        await ambulance.save();
    }

    res.status(200).json({
        status: 'success',
        data: booking
    });
}); 