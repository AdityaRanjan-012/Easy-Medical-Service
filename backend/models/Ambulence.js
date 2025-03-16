const mongoose = require("mongoose");

const ambulanceBookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  requestTime: { type: Date, default: Date.now },
  status: { type: String, enum: ["requested", "on the way", "arrived", "completed"], default: "requested" },
});

module.exports = mongoose.model("AmbulanceBooking", ambulanceBookingSchema);
