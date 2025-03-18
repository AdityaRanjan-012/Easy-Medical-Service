const User = require('../models/User');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

// Manual Signup
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Validate role
    if (!['customer', 'hospital_admin', 'doctor_admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    // Check if user already exists with the same email
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Manual Login
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Validate role
    if (!['customer', 'hospital_admin', 'doctor_admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    // Check if user exists with the given email and role
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials or role' });
    }

    // If the user has a googleId but no password, they must use Google OAuth
    if (user.googleId && !user.password) {
      return res.status(400).json({ msg: 'Please use Google OAuth to login for this account' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Notifications
exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('notifications');
    res.json(user.notifications);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};