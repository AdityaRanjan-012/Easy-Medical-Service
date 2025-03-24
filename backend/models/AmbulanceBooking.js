const mongoose = require('mongoose');

const ambulanceBookingSchema = new mongoose.Schema({
    ambulance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ambulance',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pickupLocation: {
        type: String,
        required: true
    },
    patientAge: {
        type: Number,
        required: true
    },
    emergencyType: {
        type: String,
        required: true,
        enum: ['emergency', 'non-emergency', 'transfer']
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'in-transit', 'completed', 'cancelled'],
        default: 'pending'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AmbulanceBooking', ambulanceBookingSchema); 