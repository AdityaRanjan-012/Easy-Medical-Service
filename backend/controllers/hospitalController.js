import Hospital from "../models/Hospital.js";
import Doctor from "../models/Doctor.js";

// Assign a doctor to an illness in a hospital
export const assignDoctorToIllness = async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const { doctorId, illness } = req.body;

        // Check if hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        // Check if doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Assign doctor to illness
        hospital.doctors.push({ doctor: doctorId, illness });
        await hospital.save();

        res.status(200).json({ message: "Doctor assigned to illness successfully", hospital });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
