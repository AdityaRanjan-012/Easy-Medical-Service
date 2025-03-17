import Appointment from "../models/Appointment.js";

// Get all appointments for a doctor
export const getDoctorAppointments = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const appointments = await Appointment.find({ doctor: doctorId }).populate("customer", "name email");

        if (!appointments.length) {
            return res.status(404).json({ message: "No appointments found for this doctor" });
        }

        res.status(200).json({ doctorId, appointments });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
