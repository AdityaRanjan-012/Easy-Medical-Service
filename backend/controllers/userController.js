const User = require('../models/User');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

// Customer Signup (Manual)
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: 'customer',
    });

    await user.save();

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Customer Login (Manual)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role: 'customer' });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (user.googleId && !user.password) {
      return res.status(400).json({ msg: 'Please use Google OAuth to login for this account' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

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