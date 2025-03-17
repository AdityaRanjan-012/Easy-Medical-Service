const mongoose = require('mongoose');

const AmbulanceSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model('Ambulance', AmbulanceSchema);