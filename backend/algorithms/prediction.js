function generateInsights(user) {
    const insights = [];
  
    // 1. צריכת קפאין
    if (user.averageCaffeinePerDay > user.caffeineRecommendationMax) {
      insights.push("⚠️ צריכת הקפאין שלך גבוהה מהמומלץ. שקול/י להפחית או להחליף חלק מהכוסות.");
    } else if (user.averageCaffeinePerDay < user.caffeineRecommendationMin) {
      insights.push("🟢 את/ה צורך/ת פחות קפאין מהמינימום – אם את/ה מרגיש/ה טוב, זה נהדר.");
    } else {
      insights.push("✅ צריכת הקפאין שלך מאוזנת לפי ההמלצות עבורך.");
    }
  
    // 2. השפעות הקפה
    switch (user.effects) {
      case "physically":
        insights.push("💪 הקפה משפיע עליך פיזית – כדאי לבדוק אם זה מעורר או אולי גורם לתחושות לא נעימות.");
        break;
      case "mentally":
        insights.push("🧠 הקפה משפיע עליך מנטלית – אולי משפר ריכוז או מצב רוח.");
        break;
      case "both":
        insights.push("🔁 הקפה משפיע גם פיזית וגם מנטלית – חשוב לשים לב למינון ולעיתוי.");
        break;
      default:
        insights.push("❓ לא צוינה השפעה – שווה לשים לב איך את/ה מרגיש/ה אחרי שתייה.");
    }
  
    // 3. שעות שינה
    if (user.sleepDurationAverage < 6) {
      insights.push("😴 את/ה ישן/ה פחות מדי – שווה לבדוק אם שתיית הקפה מאוחרת מדי או משפיעה על איכות השינה.");
    } else if (user.sleepDurationAverage > 9) {
      insights.push("🛌 את/ה ישן/ה הרבה – האם הקפה עוזר להתעורר, או שהוא שתייה מתוך הרגל?");
    } else {
      insights.push("✅ זמן השינה שלך מאוזן.");
    }
  
    // 4. מוטיבציה והפחתה
    if (user.isTryingToReduce === "yes") {
      insights.push("📉 מעולה שאת/ה מנסה להפחית. עקוב/י אחרי ההשפעה על ההרגשה האישית.");
    } else if (user.isMotivation === true && user.isTryingToReduce === "no") {
      insights.push("✨ נראה שיש לך מוטיבציה לעקוב אחרי ההרגלים שלך – אולי שווה לשקול הפחתה קלה.");
    } else {
      insights.push("☕ את/ה לא מנסה להפחית – וזה בסדר גמור, כל עוד את/ה מרגיש/ה טוב עם ההרגלים שלך.");
    }
  
    // 5. תיאור אישי
    if (user.selfDescription?.includes("שקט")) {
      insights.push("🧘 הקפה עבורך הוא טקס אישי מרגיע – אולי תשלב/י עוד טקסים כאלה ביום?");
    }
    if (user.selfDescription?.includes("הרגל")) {
      insights.push("🔁 הקפה אצלך הפך להרגל – שווה לבדוק אם הוא באמת עוזר או פשוט משהו אוטומטי.");
    }
    if (user.selfDescription === "other" && user.customDescription?.trim()) {
      insights.push("🗣️ תיאור אישי מותאם – זה מעולה! זה יעזור לדייק עבורך המלצות.");
    }
  
    // 6. שעות קפה מול עבודה
    const timeRangeMap = {
        Morning: { from: 6, to: 11.99 },
        Afternoon: { from: 12, to: 16 },
        evening: { from: 16.01, to: 21 },
        night: { from: 21.01, to: 29.99 }, // חישוב לילה: 21:01 עד 5:59 = 21.01 עד 5.99 + 24
      };
      
      
  
      if (user.isWorking === "yes" && user.workStartHour != null && user.workEndHour != null) {
        const start = user.workStartHour;
        const end = user.workEndHour;
      
        const workRange = start < end
          ? { from: start, to: end }
          : { from: start, to: end + 24 }; // למשל: מ־22 עד 6 → 22 עד 30
      
        if (start === end) {
          insights.push("📌 הזנת אותה שעה לתחילת וסיום עבודה – אולי כדאי לבדוק שוב.");
        } else {
          user.consumptionTime?.forEach((label) => {
            const drinkRange = timeRangeMap[label];
            if (!drinkRange) return;
      
            // אם לילה – נוסיף 24 לסיום כדי לא לשבור את ההשוואה
            const adjustedDrinkRange = label === "night"
              ? { from: drinkRange.from, to: drinkRange.to }
              : drinkRange;
      
            const overlap = isRangeOverlap(workRange, adjustedDrinkRange);
      
            if (overlap) {
              insights.push(`☕ שות/ה קפה ב־${label} (${drinkRange.from}:00–${drinkRange.to}:00) – במהלך שעות העבודה.`);
            } else {
              insights.push(`🕒 שות/ה קפה ב־${label} (${drinkRange.from}:00–${drinkRange.to}:00), מחוץ לשעות העבודה.`);
            }
          });
        }
      }      
  
    return [...new Set(insights)];
  }

  function generateRecommendations(user) {
    const recs = [];
  
    if (user.averageCaffeinePerDay > user.caffeineRecommendationMax) {
      recs.push("🧃 נסה להפחית כוס אחת ביום או להחליף לקפה נטול קפאין.");
    }
  
    if (user.effects === "physically" && user.consumptionTime?.includes("night")) {
      recs.push("🌙 הימנע משתיית קפה בלילה – נסה תה קמומיל במקום.");
    }
  
    if (user.sleepDurationAverage < 6) {
      recs.push("😴 שפר את איכות השינה – הגבֵר שינה ושתה פחות קפה בשעות ערב.");
    }
  
    if (user.isTryingToReduce === "no" && user.isMotivation) {
      recs.push("📉 התחל בקטן – נסה להפחית כוס אחת או להחליף את קפה הצהריים בתה ירוק.");
    }
  
    if (user.selfDescription?.includes("שקט")) {
      recs.push("🧘 נסה להכניס עוד טקסי שקט כמו מדיטציה או הליכה קצרה – זה עשוי להוריד את הצורך בקפה.");
    }
  
    return recs;
  }
  function isRangeOverlap(range1, range2) {
    return range1.from <= range2.to && range2.from <= range1.to;
  }
  
  module.exports = { generateInsights, generateRecommendations };

  