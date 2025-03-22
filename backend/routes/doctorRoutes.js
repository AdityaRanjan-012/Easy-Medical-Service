const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;