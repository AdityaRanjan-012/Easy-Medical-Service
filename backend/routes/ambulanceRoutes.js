const express = require('express');
const router = express.Router();
const { protect, hospitalAdmin } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
    addAmbulanceValidation,
    updateStatusValidation,
    getHospitalAmbulancesValidation,
    getAvailableAmbulancesValidation
} = require('../validations/ambulanceValidations');
const {
    addAmbulance,
    updateAmbulanceStatus,
    getHospitalAmbulances,
    getAvailableAmbulances,
    deleteAmbulance
} = require('../controllers/ambulanceController');

// Hospital admin routes (protected)
router.post('/', protect, hospitalAdmin, addAmbulance);
router.put('/:id/status', protect, hospitalAdmin, updateAmbulanceStatus);
router.delete('/:id', protect, hospitalAdmin, deleteAmbulance);

// Public routes
router.get('/hospital/:hospitalId', getHospitalAmbulances);
router.get('/available/:city', getAvailableAmbulances);

module.exports = router;