const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || "03122002";

const registerUser = async (req, res) => {
  try {
    const {
      userId, firstName, lastName, email, password, birthDate,
      weight, height, gender, phoneNumber, age,
      healthCondition, activityLevel, dietaryPreferences, coffeeConsumption,
      caffeineRecommendationMin, caffeineRecommendationMax, pregnant
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
      caffeineRecommendationMin, caffeineRecommendationMax, pregnant
    });

    await newUser.save();

    const userToReturn = {
      userId: newUser.userId,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      birthDate: newUser.birthDate,
      age: newUser.age,
      weight: newUser.weight,
      height: newUser.height,
      gender: newUser.gender,
      phoneNumber: newUser.phoneNumber,
      healthCondition: newUser.healthCondition,
      activityLevel: newUser.activityLevel,
      dietaryPreferences: newUser.dietaryPreferences,
      coffeeConsumption: newUser.coffeeConsumption,
      caffeineRecommendationMin: newUser.caffeineRecommendationMin,
      caffeineRecommendationMax: newUser.caffeineRecommendationMax,
      pregnant: newUser.pregnant
    };

    res.status(201).json({
      success: true,
      message: '✅ המשתמש נרשם בהצלחה!',
      user: userToReturn
    });
  }catch (err) {
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

    const userToReturn = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate,
      age: user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      healthCondition: user.healthCondition,
      activityLevel: user.activityLevel,
      dietaryPreferences: user.dietaryPreferences,
      coffeeConsumption: user.coffeeConsumption,
      caffeineRecommendationMin: user.caffeineRecommendationMin,
      caffeineRecommendationMax: user.caffeineRecommendationMax,
      pregnant: user.pregnant
    };

    res.json({
      success: true,
      message: "✅ התחברת בהצלחה!",
      token,
      user: userToReturn
    });
  } catch (error) {
    console.error("❌ שגיאה בהתחברות:", error);
    res.status(500).json({ success: false, message: "❌ שגיאה בהתחברות" });
  }
};

module.exports = { registerUser, loginUser };