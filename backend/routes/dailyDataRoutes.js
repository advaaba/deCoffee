const express = require('express');
const router = express.Router();
const { createDailyEntry } = require('../controllers/dailyDataController');

router.post('/', createDailyEntry);

module.exports = router;
