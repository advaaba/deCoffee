const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const User = require('../models/User');

// מסלול קיים:
router.post('/register', registerUser);
router.post('/login', loginUser);

// ✅ מסלול חדש לשליפת נתוני משתמש לפי userId
router.get('/get-user/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "משתמש לא נמצא" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ שגיאה בשליפת משתמש:", err);
    res.status(500).json({ success: false, message: "שגיאה בשרת" });
  }
});

module.exports = router;
