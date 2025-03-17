const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  city: { type: String, required: true, unique: true },
  rank: { type: Number, required: true },
  emergencyNumber: { type: String, required: true },
  ambulances: { type: Number, default: 0 },
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
});

module.exports = mongoose.model('Hospital', HospitalSchema);