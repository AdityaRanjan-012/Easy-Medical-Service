const express = require('express');
const router = express.Router();
const { dispatchAmbulance } = require('../controllers/ambulanceController');
const auth = require('../middleware/auth');

router.post('/dispatch', auth, dispatchAmbulance);

module.exports = router;