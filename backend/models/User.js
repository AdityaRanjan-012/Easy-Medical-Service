import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Required for manual signup
  role: { type: String, enum: ["customer", "hospital_admin", "doctor_admin"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema); // ✅ Use 'export default'
