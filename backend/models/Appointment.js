const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g., "10:30 AM - 11:00 AM"
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
