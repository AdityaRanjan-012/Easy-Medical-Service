import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  role: { type: String, enum: ['customer', 'hospital_admin', 'doctor_admin'], default: 'customer' }
});

export default mongoose.model('User', UserSchema);
