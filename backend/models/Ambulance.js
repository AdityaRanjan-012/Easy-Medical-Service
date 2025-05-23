const mongoose = require('mongoose');

const AmbulanceSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  vehicleNumber: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ['available', 'booked'],
    default: 'available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ambulance', AmbulanceSchema);