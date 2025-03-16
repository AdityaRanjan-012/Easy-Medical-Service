const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true }, // e.g., "Cardiologist", "Dermatologist"
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  availability: {
    startTime: { type: String, required: true }, // e.g., "09:00 AM"
    endTime: { type: String, required: true }, // e.g., "05:00 PM"
  },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
});

module.exports = mongoose.model("Doctor", doctorSchema);
