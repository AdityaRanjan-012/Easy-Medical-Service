const Ambulance = require('../models/Ambulance');
const Hospital = require('../models/HospitalProfile');
const asyncHandler = require('express-async-handler');

// @desc    Add a new ambulance
// @route   POST /api/ambulances
// @access  Private (Hospital Admin)
exports.addAmbulance = asyncHandler(async (req, res) => {
    const { vehicleNumber, contactNumber } = req.body;

    // Validate input
    if (!vehicleNumber || !contactNumber) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Check if ambulance already exists
    const existingAmbulance = await Ambulance.findOne({ vehicleNumber });
    if (existingAmbulance) {
        res.status(400);
        throw new Error('Ambulance with this vehicle number already exists');
    }

    const hospital = await Hospital.findOne({ _id : req.user._id });
    if (!hospital) {
        res.status(404);
        throw new Error('Hospital not found');
    }

    const ambulance = await Ambulance.create({
        hospital: hospital._id,
        vehicleNumber,
        contactNumber,
        status: 'Available'
    });

    // Update hospital ambulance counts
    await Hospital.findByIdAndUpdate(hospital._id, {
        $push: { ambulances: ambulance._id },
        $inc: { 'ambulanceCount.total': 1, 'ambulanceCount.available': 1 }
    });

    res.status(201).json(ambulance);
});

// @desc    Update ambulance status
// @route   PUT /api/ambulances/:id/status
// @access  Private (Hospital Admin)
exports.updateAmbulanceStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const ambulance = await Ambulance.findById(req.params.id);
    
    if (!ambulance) {
        res.status(404);
        throw new Error('Ambulance not found');
    }

    const hospital = await Hospital.findOne({ _id : req.user._id });
    if (!hospital || ambulance.hospital.toString() !== hospital._id.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    const oldStatus = ambulance.status;
    ambulance.status = status;
    await ambulance.save();

    // Update hospital's available ambulance count
    const availableChange = (oldStatus === 'Available' && status === 'Booked') ? -1 :
                          (oldStatus === 'Booked' && status === 'Available') ? 1 : 0;
    
    if (availableChange !== 0) {
        await Hospital.findByIdAndUpdate(hospital._id, {
            $inc: { 'ambulanceCount.available': availableChange }
        });
    }

    res.json(ambulance);
});

// @desc    Get all ambulances of a hospital
// @route   GET /api/ambulances/hospital/:hospitalId
// @access  Public
exports.getHospitalAmbulances = asyncHandler(async (req, res) => {
    const hospital = await Hospital.findById(req.params.hospitalId)
        .populate('ambulances');
    
    if (!hospital) {
        res.status(404);
        throw new Error('Hospital not found');
    }

    res.json(hospital.ambulances);
});

// @desc    Get available ambulances by city
// @route   GET /api/ambulances/available/:city
// @access  Public
exports.getAvailableAmbulances = asyncHandler(async (req, res) => {
    const { city } = req.params;
    
    const hospitals = await Hospital.find({ 'address.city': city })
        .populate({
            path: 'ambulances',
            match: { status: 'Available' }
        });

    const availableAmbulances = hospitals.map(hospital => ({
        hospitalName: hospital.name,
        hospitalContact: hospital.contact,
        hospitalAddress: hospital.address,
        availableAmbulances: hospital.ambulances
    }));

    res.json(availableAmbulances);
});

// @desc    Delete an ambulance
// @route   DELETE /api/ambulances/:id
// @access  Private (Hospital Admin)
exports.deleteAmbulance = asyncHandler(async (req, res) => {
    const ambulance = await Ambulance.findById(req.params.id);
    
    if (!ambulance) {
        res.status(404);
        throw new Error('Ambulance not found');
    }

    const hospital = await Hospital.findOne({ _id : req.user._id });
    if (!hospital || ambulance.hospital.toString() !== hospital._id.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    // Update hospital ambulance counts
    await Hospital.findByIdAndUpdate(hospital._id, {
        $pull: { ambulances: ambulance._id },
        $inc: { 
            'ambulanceCount.total': -1,
            'ambulanceCount.available': ambulance.status === 'Available' ? -1 : 0
        }
    });

    await ambulance.remove();
    res.json({ message: 'Ambulance removed' });
});