const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  specialties: [{ type: String }],
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
});

module.exports = mongoose.model('Doctor', DoctorSchema);