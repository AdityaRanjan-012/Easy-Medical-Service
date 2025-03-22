const { body, param } = require('express-validator');

exports.addAmbulanceValidation = [
    body('vehicleNumber')
        .trim()
        .notEmpty().withMessage('Vehicle number is required')
        .matches(/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/)
        .withMessage('Invalid vehicle number format (e.g., MH02AB1234)'),
    body('contactNumber')
        .trim()
        .notEmpty().withMessage('Contact number is required')
        .matches(/^[0-9]{10}$/)
        .withMessage('Contact number must be 10 digits')
];

exports.updateStatusValidation = [
    param('id')
        .isMongoId().withMessage('Invalid ambulance ID'),
    body('status')
        .trim()
        .notEmpty().withMessage('Status is required')
        .isIn(['Available', 'Booked']).withMessage('Status must be either Available or Booked')
];

exports.getHospitalAmbulancesValidation = [
    param('hospitalId')
        .isMongoId().withMessage('Invalid hospital ID')
];

exports.getAvailableAmbulancesValidation = [
    param('city')
        .trim()
        .notEmpty().withMessage('City is required')
        .isLength({ min: 2, max: 50 }).withMessage('City name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('City name can only contain letters and spaces')
]; 