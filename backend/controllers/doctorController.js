const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const jwt = require('jsonwebtoken');

// Doctor Signup
exports.signup = async (req, res) => {
  const { name, email, password, specialist, location } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: 'doctor',
    });

    await user.save();

    const doctorProfile = new DoctorProfile({
      userId: user._id,
      specialist,
      location,
      hospitalId: null, // Can be updated later
    });

    await doctorProfile.save();

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role }, profile: doctorProfile });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Doctor Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role: 'doctor' });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const doctorProfile = await DoctorProfile.findOne({ userId: user._id });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role }, profile: doctorProfile });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};