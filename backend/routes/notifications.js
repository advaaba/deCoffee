const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

// אוסף טוקנים בזיכרון (אפשר לשדרג למונגו בעתיד)
let tokens = [];

router.post("/register", (req, res) => {
  const { token } = req.body;
  if (token && !tokens.includes(token)) {
    tokens.push(token);
    console.log("🟢 טוקן נרשם:", token);
  }
  res.status(200).json({ message: "Token saved successfully" });
});

router.post("/send", async (req, res) => {
  const { token, message } = req.body;

  const notification = {
    to: token,
    sound: "default",
    title: "DeCoffee",
    body: message || "הגיעה תזכורת ☕",
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    });

    const data = await response.json();
    console.log("📤 נשלחה תזכורת:", data);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("שגיאה בשליחה:", error);
    res.status(500).json({ error: "Sending failed" });
  }
});

module.exports = router;
