const express = require('express');
const router = express.Router();
const { adminAuth, hospitalAdmin } = require('../middleware/authMiddleware');
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
router.post('/', adminAuth, hospitalAdmin, addAmbulance);
router.put('/:id/status', adminAuth, hospitalAdmin, updateAmbulanceStatus);
router.delete('/:id', adminAuth, hospitalAdmin, deleteAmbulance);

// Public routes
router.get('/hospital/:hospitalId', getHospitalAmbulances);
router.get('/available/:city', getAvailableAmbulances);

module.exports = router;