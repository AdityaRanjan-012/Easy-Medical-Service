const express = require('express');
const router = express.Router();
const { dispatchAmbulance } = require('../controllers/ambulanceController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/dispatch', auth, role('customer'), dispatchAmbulance);

module.exports = router;