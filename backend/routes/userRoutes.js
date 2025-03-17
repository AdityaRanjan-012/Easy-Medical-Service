const express = require('express');
const router = express.Router();
const { signup, login, getNotifications } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/notifications', auth, getNotifications);

module.exports = router;