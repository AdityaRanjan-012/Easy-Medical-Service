const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointments } = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

router.post('/book', auth, bookAppointment);
router.get('/', auth, getAppointments);

module.exports = router;