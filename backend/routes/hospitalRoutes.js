const express = require('express');
const router = express.Router();
const { adminAuth, hospitalAdmin } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
    updateHospitalProfileValidation,
    getHospitalsByCityValidation,
    getHospitalByIdValidation
} = require('../validations/hospitalValidations');
const {
    registerHospital,
    loginHospital,
    updateHospitalProfile,
    getHospitalProfile,
    getHospitalsByCity,
    getHospitalById
} = require('../controllers/hospitalController');

// Auth routes
router.post('/register', registerHospital);
router.post('/login', loginHospital);

// Protected routes
router.route('/profile')
    .get(adminAuth, hospitalAdmin, getHospitalProfile)
    .put(adminAuth, hospitalAdmin, updateHospitalProfile);

// Public routes
router.get('/city/:city', getHospitalsByCity);
router.get('/:id', getHospitalById);

module.exports = router;