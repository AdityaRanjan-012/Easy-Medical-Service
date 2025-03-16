const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Hospital Admin
  ambulances: { type: Number, default: 0 },
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
});

module.exports = mongoose.model("Hospital", hospitalSchema);
