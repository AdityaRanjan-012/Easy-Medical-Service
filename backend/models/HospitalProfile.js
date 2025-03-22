const mongoose = require('mongoose');

const HospitalProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  contact: {
    phone: { type: String, required: true },
    emergency: { type: String, required: true }
  },
  ambulances: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambulance'
  }],
  ambulanceCount: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 }
  },
  role: {
    type: String,
    default: 'hospital'
  }
}, {
  timestamps: true
});

// Index for finding nearby hospitals by city and state
HospitalProfileSchema.index({ 
  'address.city': 1,
  'address.state': 1
});

// Index for email searches during authentication
HospitalProfileSchema.index({ email: 1 });

module.exports = mongoose.model('HospitalProfile', HospitalProfileSchema);