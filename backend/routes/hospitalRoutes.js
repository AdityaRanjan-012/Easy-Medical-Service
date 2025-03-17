const express = require('express');
const router = express.Router();
const { addDoctor, updateAmbulanceCount } = require('../controllers/hospitalController');
const auth = require('../middleware/auth');

router.post('/doctors', auth, addDoctor);
router.put('/ambulances', auth, updateAmbulanceCount);

module.exports = router;