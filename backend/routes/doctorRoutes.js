const express = require('express');
const router = express.Router();
const { getDoctorAppointments } = require('../controllers/doctorController');
const auth = require('../middleware/auth');

router.get('/appointments', auth, getDoctorAppointments);

module.exports = router;