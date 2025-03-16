const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

exports.bookAppointment = async (req, res) => {
  try {
    const { customerId, doctorId, date, timeSlot } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const existingAppointment = await Appointment.findOne({ doctor: doctorId, date, timeSlot });
    if (existingAppointment) return res.status(400).json({ message: "Time slot already booked" });

    const appointment = new Appointment({ customer: customerId, doctor: doctorId, date, timeSlot });
    await appointment.save();

    doctor.appointments.push(appointment._id);
    await doctor.save();

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error: error.message });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctor: doctorId }).populate("customer");

    if (!appointments.length) return res.status(404).json({ message: "No appointments found" });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.confirmAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = "confirmed";
    await appointment.save();

    res.json({ message: "Appointment confirmed", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
