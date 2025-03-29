const User = require('../models/User');
const HospitalProfile = require('../models/HospitalProfile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register hospital
// @route   POST /api/hospitals/register
// @access  Public
exports.registerHospital = asyncHandler(async (req, res) => {
    const { name, email, password, address, contact } = req.body;

    if (!name || !email || !password || !address || !contact) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }
    
    // Check if hospital exists
    const hospitalExists = await HospitalProfile.findOne({ email });
    if (hospitalExists) {
        res.status(400);
        throw new Error('Hospital already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create hospital
    const hospital = await HospitalProfile.create({
        name,
        email,
        password: hashedPassword,
        address,
        contact,
        role: 'hospital'
    });

    if (hospital) {
        res.status(201).json({
            _id: hospital._id,
            name: hospital.name,
            email: hospital.email,
            token: generateToken(hospital._id),
        });
    } else {
        
        res.status(400);
        throw new Error('Invalid hospital data');
    }
});

// @desc    Login hospital
// @route   POST /api/hospitals/login
// @access  Public
exports.loginHospital = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for hospital email
    const hospital = await HospitalProfile.findOne({ email });

    if (hospital && (await bcrypt.compare(password, hospital.password))) {
        res.json({
            _id: hospital._id,
            name: hospital.name,
            email: hospital.email,
            token: generateToken(hospital._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get hospital profile
// @route   GET /api/hospitals/profile
// @access  Private
exports.getHospitalProfile = asyncHandler(async (req, res) => {
    const hospital = await HospitalProfile.findById(req.user._id)
        .select('-password')
        .populate('ambulances');

    if (!hospital) {
        res.status(404);
        throw new Error('Hospital not found');
    }

    res.json(hospital);
});

// @desc    Update hospital profile
// @route   PUT /api/hospitals/profile
// @access  Private
exports.updateHospitalProfile = asyncHandler(async (req, res) => {
    const hospital = await HospitalProfile.findById(req.user._id);

    if (!hospital) {
        res.status(404);
        throw new Error('Hospital not found');
    }

    const { name, address, contact } = req.body;

    hospital.name = name || hospital.name;
    hospital.address = address || hospital.address;
    hospital.contact = contact || hospital.contact;

    const updatedHospital = await hospital.save();

    res.json({
        _id: updatedHospital._id,
        name: updatedHospital.name,
        address: updatedHospital.address,
        contact: updatedHospital.contact
    });
});

// @desc    Get hospitals by city
// @route   GET /api/hospitals/city/:city
// @access  Public
exports.getHospitalsByCity = asyncHandler(async (req, res) => {
    const hospitals = await HospitalProfile.find({ 'address.city': req.params.city })
        .select('name address contact ambulanceCount')
        .populate({
            path: 'ambulances',
            match: { status: 'available' }
        });

    res.json(hospitals);
});

// @desc    Get hospital by ID
// @route   GET /api/hospitals/:id
// @access  Public
exports.getHospitalById = asyncHandler(async (req, res) => {
    const hospital = await HospitalProfile.findById(req.params.id)
        .select('name address contact ambulanceCount')
        .populate({
            path: 'ambulances',
            match: { status: 'available' }
        });

    if (!hospital) {
        res.status(404);
        throw new Error('Hospital not found');
    }

    res.json(hospital);
});