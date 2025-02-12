const User = require('../models/User');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || "03122002"; // שמירת המפתח בקובץ .env

// ✅ פונקציה לרישום משתמש חדש
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // בדיקה אם המשתמש כבר קיים
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: '⚠ המשתמש כבר קיים במערכת' });
        }

        // הצפנת סיסמה עם bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // יצירת משתמש חדש עם סיסמה מוצפנת
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        console.log('✅ משתמש נוסף:', newUser);
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

        // 📌 בדיקה אם הנתונים התקבלו מהבקשה
        console.log('📩 קבלת נתוני התחברות:', { email, password });

        // 📌 אם השדות ריקים, מחזירים שגיאה
        if (!email || !password) {
            return res.status(400).json({ success: false, message: '⚠ אנא מלא את כל השדות' });
        }

        // 🔍 בדיקה אם המשתמש קיים במסד הנתונים
        const user = await User.findOne({ email });
        console.log('🔍 חיפוש משתמש:', user);

        if (!user) {
            return res.status(404).json({ success: false, message: '❌ המשתמש לא נמצא במערכת' });
        }

        // 🔑 השוואת סיסמאות עם bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('🔑 האם הסיסמה תואמת?', isMatch);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: '❌ סיסמה שגויה' });
        }

        // 🔒 יצירת טוקן עם JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET, // שימוש במפתח סודי מה- .env
            { expiresIn: "1h" }
        );

        res.json({ success: true, message: '✅ התחברת בהצלחה!', token });

    } catch (err) {
        console.error('❌ שגיאה בהתחברות:', err);
        res.status(500).json({ success: false, message: '❌ שגיאה בהתחברות' });
    }
};




module.exports = { registerUser, loginUser };
