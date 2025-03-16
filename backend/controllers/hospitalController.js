const Hospital = require("../models/Hospital");

exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate("doctors");
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateAmbulanceCount = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { ambulances } = req.body;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) return res.status(404).json({ message: "Hospital not found" });

    hospital.ambulances = ambulances;
    await hospital.save();

    res.json({ message: "Ambulance count updated", hospital });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
