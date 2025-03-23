const jwt = require('jsonwebtoken');
const Hospital = require('../models/HospitalProfile');
const asyncHandler = require('express-async-handler');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await Hospital.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Hospital admin middleware
exports.hospitalAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'hospital') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as hospital admin');
    }
}); 