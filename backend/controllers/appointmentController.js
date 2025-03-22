const Appointment = require('../models/Appointment');
const Doctor = require('../models/DoctorProfile');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.bookAppointment = async (req, res) => {
  const { doctorId, date, illness } = req.body;
  const customerId = req.user.id;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    if (!doctor.specialties.includes(illness)) {
      return res.status(400).json({ msg: 'Doctor does not specialize in this illness' });
    }

    const appointment = new Appointment({
      customer: customerId,
      doctor: doctorId,
      date,
      illness,
      status: 'confirmed',
    });
    await appointment.save();

    doctor.appointments.push(appointment._id);
    await doctor.save();

    const notification = new Notification({
      user: customerId,
      message: `Your appointment with Dr. ${doctor.name} on ${new Date(date).toLocaleString()} has been confirmed.`,
    });
    await notification.save();

    const user = await User.findById(customerId);
    user.notifications.push(notification._id);
    await user.save();

    res.json({ msg: 'Appointment booked successfully', appointment });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ customer: req.user.id }).populate('doctor');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};