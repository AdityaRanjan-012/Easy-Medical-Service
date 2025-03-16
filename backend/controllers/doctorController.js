const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");

exports.addDoctor = async (req, res) => {
  try {
    const { name, specialization, hospitalId, availability } = req.body;
    
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });

    const doctor = new Doctor({ name, specialization, hospital: hospitalId, availability });
    await doctor.save();

    hospital.doctors.push(doctor._id);
    await hospital.save();

    res.status(201).json({ message: "Doctor added successfully", doctor });
  } catch (error) {
    res.status(500).json({ message: "Error adding doctor", error: error.message });
  }
};

exports.getDoctorsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const doctors = await Doctor.find({ hospital: hospitalId });

    if (!doctors.length) return res.status(404).json({ message: "No doctors found in this hospital" });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
