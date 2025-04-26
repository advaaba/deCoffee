const DailyData = require('../models/dailyData');

const createDailyEntry = async (req, res) => {
  try {
    const {
      userId,
      date,
      sleepHours,
      mood,
      focusLevel,
      tirednessLevel,
      drankCoffee,
      coffeeDetails,
      noCoffeeDetails,
    } = req.body;

    const newEntry = new DailyData({
      userId,
      date,
      sleepHours,
      mood,
      focusLevel,
      tirednessLevel,
      drankCoffee,
      coffeeDetails,
      noCoffeeDetails,
    });

    await newEntry.save();

    res.status(201).json({ success: true, message: "✅ נתוני היום נשמרו בהצלחה!", data: newEntry });
  } catch (error) {
    console.error("❌ שגיאה בשמירת נתוני יומיום:", error);
    res.status(500).json({ success: false, message: "❌ שגיאה בשמירה", error: error.message });
  }
};

module.exports = { createDailyEntry };
