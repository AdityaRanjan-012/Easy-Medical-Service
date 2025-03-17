const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Ambulance = require('../models/Ambulance');

exports.addDoctor = async (req, res) => {
  const { name, specialties } = req.body;
  const hospitalId = req.user.id;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }

    const doctor = new Doctor({
      name,
      hospital: hospitalId,
      specialties,
    });
    await doctor.save();

    hospital.doctors.push(doctor._id);
    await hospital.save();

    res.json({ msg: 'Doctor added successfully', doctor });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateAmbulanceCount = async (req, res) => {
  const { count } = req.body;
  const hospitalId = req.user.id;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ msg: 'Hospital not found' });
    }

    hospital.ambulances = count;
    await hospital.save();

    const existingAmbulances = await Ambulance.find({ hospital: hospitalId });
    if (existingAmbulances.length < count) {
      for (let i = existingAmbulances.length; i < count; i++) {
        const ambulance = new Ambulance({ hospital: hospitalId });
        await ambulance.save();
      }
    } else if (existingAmbulances.length > count) {
      const toDelete = existingAmbulances.slice(count);
      await Ambulance.deleteMany({ _id: { $in: toDelete.map(a => a._id) } });
    }

    res.json({ msg: 'Ambulance count updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};