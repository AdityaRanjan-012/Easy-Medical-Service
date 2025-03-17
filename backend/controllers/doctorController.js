const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.user.id }).populate('appointments');
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    const appointments = await Appointment.find({ doctor: doctor._id }).populate('customer');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};