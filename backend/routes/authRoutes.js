const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController'); // פונקציות מבקר
const router = express.Router();

// נתיב הרשמה
router.post('/register', registerUser);

// נתיב התחברות
router.post('/login', loginUser);

module.exports = router;
