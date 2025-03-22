const { body, param } = require('express-validator');

exports.updateHospitalProfileValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Hospital name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Hospital name must be between 3 and 100 characters'),
    body('address.street')
        .trim()
        .notEmpty().withMessage('Street address is required')
        .isLength({ min: 5, max: 200 }).withMessage('Street address must be between 5 and 200 characters'),
    body('address.city')
        .trim()
        .notEmpty().withMessage('City is required')
        .isLength({ min: 2, max: 50 }).withMessage('City name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('City name can only contain letters and spaces'),
    body('address.state')
        .trim()
        .notEmpty().withMessage('State is required')
        .isLength({ min: 2, max: 50 }).withMessage('State name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('State name can only contain letters and spaces'),
    body('address.pincode')
        .trim()
        .notEmpty().withMessage('Pincode is required')
        .matches(/^[0-9]{6}$/).withMessage('Pincode must be 6 digits'),
    body('contact.phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
    body('contact.emergency')
        .trim()
        .notEmpty().withMessage('Emergency contact number is required')
        .matches(/^[0-9]{10}$/).withMessage('Emergency contact number must be 10 digits')
];

exports.getHospitalsByCityValidation = [
    param('city')
        .trim()
        .notEmpty().withMessage('City is required')
        .isLength({ min: 2, max: 50 }).withMessage('City name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('City name can only contain letters and spaces')
];

exports.getHospitalByIdValidation = [
    param('id')
        .isMongoId().withMessage('Invalid hospital ID')
]; 