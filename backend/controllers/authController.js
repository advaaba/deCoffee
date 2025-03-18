const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || "03122002"; // שמירת המפתח בקובץ .env

// ✅ פונקציה לרישום משתמש חדש
const registerUser = async (req, res) => {
    try {
        const { userId, firstName, lastName, email, password, birthDate, weight, height, gender, phoneNumber, goal, healthCondition, activityLevel, dietaryPreferences, coffeeConsumption, age } = req.body;

        // ❌ בדיקה אם המשתמש כבר קיים
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: '⚠ המשתמש כבר קיים במערכת' });
        }

        // ❌ בדיקה שכל השדות חובה מולאו
        if (!userId || !firstName || !lastName || !email || !password || !birthDate || !age || !weight || !height || !gender || !phoneNumber) {
            return res.status(400).json({ success: false, message: '⚠ אנא מלאי את כל השדות החיוניים' });
        }

        // 🔒 הצפנת סיסמה
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ יצירת משתמש חדש ושמירתו במסד הנתונים
        const newUser = new User({
            userId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            birthDate,
            age,  // ✅ הוספת שדה גיל
            weight,
            height,
            gender,
            phoneNumber,
            goal,
            healthCondition,
            activityLevel,
            dietaryPreferences,
            coffeeConsumption
        });

        await newUser.save();

        console.log('✅ משתמש נוסף בהצלחה:', newUser);
        res.status(201).json({ success: true, message: '✅ המשתמש נרשם בהצלחה!' });

    } catch (err) {
        console.error('❌ שגיאה בהרשמה:', err);
        res.status(500).json({ success: false, message: '❌ שגיאה בהרשמה' });
    }
};

// ✅ פונקציה להתחברות משתמש קיים


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("📩 בקשת התחברות:", { email, password });

        // 🔍 חיפוש המשתמש במסד הנתונים
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ המשתמש לא נמצא במערכת");
            return res.status(404).json({ success: false, message: "❌ המשתמש לא נמצא במערכת" });
        }

        // 🔍 השוואת הסיסמה
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔑 האם הסיסמה תואמת?", isMatch);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "❌ סיסמה שגויה" });
        }

        // ✅ יצירת טוקן לאחר אימות מוצלח
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET, // 📌 ודאי שקיים בקובץ `.env`
            { expiresIn: "1h" }
        );

        console.log("🔑 טוקן שנוצר:", token);

        res.json({ success: true, message: "✅ התחברת בהצלחה!", token });
    } catch (error) {
        console.error("❌ שגיאה בהתחברות:", error);
        res.status(500).json({ success: false, message: "❌ שגיאה בהתחברות" });
    }
};


module.exports = { registerUser, loginUser };
