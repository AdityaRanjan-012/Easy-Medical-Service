const mongoose = require('mongoose');

const DoctorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialist: { type: [String], required: true }, // Array of specialties (e.g., ['Cardiology', 'Surgery'])
  location: { type: String, required: true }, // e.g., "Clinic Address" or "Hospital Name"
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'HospitalProfile', required: false }, // Links to hospital if affiliated
});

module.exports = mongoose.model('DoctorProfile', DoctorProfileSchema);