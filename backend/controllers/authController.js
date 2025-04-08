const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateInsights, generateRecommendations } = require("../algorithms/prediction");

const SECRET_KEY = process.env.JWT_SECRET || "03122002";

const getInsights = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "❌ המשתמש לא נמצא" });
    }
    const insights = generateInsights(user.coffeeConsumption);
    const recommendations = generateRecommendations(user.coffeeConsumption);

    res.status(200).json({ insights, recommendations });
  } catch (error) {
    console.error("❌ שגיאה בהפקת תובנות:", error.message);
    res.status(500).json({ message: "❌ שגיאה בשרת", error: error.message });
  }
};


const registerUser = async (req, res) => {
  try {
    const {
      userId, firstName, lastName, email, password, birthDate,
      weight, height, gender, phoneNumber, age,
      healthCondition, activityLevel, dietaryPreferences, coffeeConsumption,
      caffeineRecommendationMin, caffeineRecommendationMax, pregnant,
      averageCaffeineRecommendation, customHealthDescription, 
      customDietaryPreference   
    } = req.body;
    

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: '⚠ המשתמש כבר קיים במערכת' });
    }

    if (!userId || !firstName || !lastName || !email || !password || !birthDate || !age || !weight || !height || !gender || !phoneNumber) {
      return res.status(400).json({ success: false, message: '⚠ אנא מלאי את כל השדות החיוניים' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userId, firstName, lastName, email, password: hashedPassword, birthDate,
      age, weight, height, gender, phoneNumber,
      healthCondition, activityLevel, dietaryPreferences, coffeeConsumption,
      caffeineRecommendationMin, caffeineRecommendationMax, pregnant,
      averageCaffeineRecommendation,
      customHealthDescription, 
      customDietaryPreference   
    });
    

    await newUser.save();

    res.status(201).json({
      success: true,
      message: '✅ המשתמש נרשם בהצלחה!',
      user: newUser
    });
  } catch (err) {
    console.error('❌ שגיאה בהרשמה:', err.message, err);
    res.status(500).json({
      success: false,
      message: '❌ שגיאה בהרשמה',
      error: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "❌ המשתמש לא נמצא במערכת" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "❌ סיסמה שגויה" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    res.json({
      success: true,
      message: "✅ התחברת בהצלחה!",
      token,
      user
    });
  } catch (error) {
    console.error("❌ שגיאה בהתחברות:", error);
    res.status(500).json({ success: false, message: "❌ שגיאה בהתחברות" });
  }
};

const updateCoffeeConsumption = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: '❌ חסר מזהה משתמש' });
    }

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ success: false, message: "❌ המשתמש לא נמצא" });
    }

    user.coffeeConsumption = {
      ...user.coffeeConsumption,
      ...updateData,
    };

    await user.save();

    res.json({
      success: true,
      message: "✅ פרטי הקפה עודכנו בהצלחה",
      user,
    });
  } catch (error) {
    console.error("❌ שגיאה בעדכון צריכת קפה:", error);
    res.status(500).json({ success: false, message: "❌ שגיאה בעדכון", error: error.message });
  }
};


module.exports = { registerUser, loginUser, updateCoffeeConsumption, getInsights };
