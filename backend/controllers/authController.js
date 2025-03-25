const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || "03122002"; // מפתח סודי

// ✅ פונקציה לרישום משתמש חדש
const registerUser = async (req, res) => {
    try {
        const {
            userId, firstName, lastName, email, password, birthDate,
            weight, height, gender, phoneNumber, goal,
            healthCondition, activityLevel, dietaryPreferences, coffeeConsumption, age
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
            age, weight, height, gender, phoneNumber, goal,
            healthCondition, activityLevel, dietaryPreferences, coffeeConsumption
        });

        await newUser.save();

        console.log('✅ משתמש נוסף בהצלחה:', newUser);

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
            goal: newUser.goal,
            healthCondition: newUser.healthCondition,
            activityLevel: newUser.activityLevel,
            dietaryPreferences: newUser.dietaryPreferences,
            coffeeConsumption: newUser.coffeeConsumption
        };

        res.status(201).json({
            success: true,
            message: '✅ המשתמש נרשם בהצלחה!',
            user: userToReturn
        });

    } catch (err) {
        console.error('❌ שגיאה בהרשמה:', err);
        res.status(500).json({ success: false, message: '❌ שגיאה בהרשמה' });
    }
};

// ✅ פונקציה להתחברות משתמש קיים
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
            goal: user.goal,
            healthCondition: user.healthCondition,
            activityLevel: user.activityLevel,
            dietaryPreferences: user.dietaryPreferences,
            coffeeConsumption: user.coffeeConsumption
        };

        res.json({
            success: true,
            message: "✅ התחברת בהצלחה!",
            token,
            user: userToReturn  // <<< זה החלק הקריטי!
        });
    } catch (error) {
        console.error("❌ שגיאה בהתחברות:", error);
        res.status(500).json({ success: false, message: "❌ שגיאה בהתחברות" });
    }
};


module.exports = { registerUser, loginUser };
