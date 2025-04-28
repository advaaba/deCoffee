import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  View,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import BASE_URL from "../../utils/apiConfig";
import * as Notifications from "expo-notifications";

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dailyStatus, setDailyStatus] = useState(null);
  const router = useRouter();

  const saveExpoPushToken = async (token) => {
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) return;

    try {
      await axios.put(`${BASE_URL}/api/auth/save-push-token`, {
        userId,
        expoPushToken: token,
      });
      console.log("✅ Expo Push Token נשמר במסד הנתונים");
    } catch (error) {
      console.error("❌ שגיאה בשמירת הטוקן:", error);
    }
  };

  const checkDailyData = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const today = new Date().toISOString().split("T")[0]; // תאריך היום בתבנית yyyy-mm-dd

    try {
      const response = await axios.get(`${BASE_URL}/api/dailyData/check`, {
        params: { userId, date: today },
      });

      if (response.data.exists) {
        setDailyStatus("מילאת את הסקירה היומית!"); // אם מילא, הצג את המצב החיובי
      } else {
        setDailyStatus("עוד לא התחלת לעקוב אחרי צריכת הקפה שלך היום."); // אם לא מילא, הצג הודעה שתעודד את המשתמש למלא
      }
    } catch (error) {
      console.error("❌ שגיאה בבדיקת הסקירה היומית:", error);
    }
  };

  const scheduleNotificationsForConsumptionTimes = async (consumptionTimes) => {
    if (!consumptionTimes || consumptionTimes.length === 0) {
      console.log("⚠️ אין זמני שתיית קפה להגדיר תזכורות.");
      return;
    }

    const notificationTimes = {
      Morning: { hour: 9, minute: 0 },
      Afternoon: { hour: 15, minute: 0 },
      evening: { hour: 19, minute: 0 },
      night: { hour: 22, minute: 0 },
    };

    for (const time of consumptionTimes) {
      const { hour, minute } = notificationTimes[time];

      // מחשב את השעה המדויקת הבאה
      const now = new Date();
      let triggerDate = new Date();
      triggerDate.setHours(hour, minute, 0, 0);

      // אם השעה כבר חלפה היום, תקבע למחר
      if (triggerDate <= now) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "☕ זמן קפה הגיע!",
          body: `זה הזמן המושלם להפסקת קפה (${time}) 🌟`,
        },
        trigger: triggerDate,
      });

      console.log(`✅ תזכורת לתזמון ${time} נקבעה ל: ${triggerDate}`);
    }
  };

  const sendImmediateNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "☕ בדיקה מיידית!",
          body: "זו תזכורת שנשלחה עכשיו 🎯",
        },
        trigger: null, // שולח את ההתראה מיידית
      });
      console.log("✅ נשלחה תזכורת מיידית");
    } catch (error) {
      console.error("❌ שגיאה בשליחת תזכורת מיידית:", error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          Alert.alert(
            "\u05e9\u05d2\u05d9\u05d0\u05d4",
            "\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0\u05d5 \u05e4\u05e8\u05d8\u05d9 \u05de\u05e9\u05ea\u05de\u05e9."
          );
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/api/auth/get-user/${userId}`
        );
        if (response.data.success) {
          setUser(response.data.user);
          await checkDailyData();
          await scheduleNotificationsForConsumptionTimes(
            response.data.user.coffeeConsumption.consumptionTime || []
          );
        } else {
          Alert.alert(
            "\u05e9\u05d2\u05d9\u05d0\u05d4",
            "\u05dc\u05d0 \u05e0\u05d9\u05ea\u05df \u05dc\u05d8\u05e2\u05d5\u05df \u05d0\u05ea \u05e4\u05e8\u05d8\u05d9 \u05d4\u05de\u05e9\u05ea\u05de\u05e9"
          );
        }
      } catch (err) {
        console.error(
          "\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d8\u05e2\u05d9\u05e0\u05ea \u05e4\u05e8\u05d8\u05d9 \u05d4\u05de\u05e9\u05ea\u05de\u05e9:",
          err
        );
      } finally {
        setLoading(false);
      }
    };
    loadUser();
    Toast.show({
      type: "success",
      text1: "ברוכה הבאה אדוה 🌟",
      text2: "כיף לראות אותך שוב!",
    });
  }, []);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const alreadyAsked = await AsyncStorage.getItem(
          "hasAskedNotificationPermission"
        );
        if (alreadyAsked) {
          console.log("🔔 כבר ביקשנו הרשאה להתראות.");
          return;
        }

        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus === "granted") {
          console.log("🔔 קיבלנו הרשאת Notifications! שולחים הודעת תודה...");
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log("Expo Push Token:", token);
          await saveExpoPushToken(token);
        } else {
          Alert.alert(
            "שים לב",
            "כדי לקבל תזכורות יומיות, נא לאשר קבלת התראות."
          );
        }

        await AsyncStorage.setItem("hasAskedNotificationPermission", "true");
      } catch (error) {
        console.error("❌ שגיאה בבקשת הרשאות Notifications:", error);
      }
    };

    requestNotificationPermission();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      " התנתקות",
      "האם את בטוחה שברצונך להתנתק?",
      [
        {
          text: "ביטול",
          style: "cancel",
        },
        {
          text: "התנתק/י",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userToken");
              await AsyncStorage.removeItem("userId");
              router.replace("/open-screen");
            } catch (error) {
              console.error("❌ שגיאה בהתנתקות:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("התראה התקבלה:", notification);
        Alert.alert("התראה התקבלה", notification.request.content.body);
      }
    );

    return () => subscription.remove();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#4CAF50"
        style={{ marginTop: 40 }}
      />
    );
  }

  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        {user ? (
          <>
            <Text style={styles.title}>שלום, {user.firstName} 👋</Text>
            <Text style={styles.text}>ברוכה הבאה ל־DeCoffee 🌿</Text>
            <Text style={styles.text}>
              האפליקצייה שתעזור לך לעקוב אחרי הרגלי שתיית הקפה שלך, להבין איך
              קפאין משפיע עלייך ולבנות הרגלים שמתאימים לך אישית
            </Text>

            {/* <View style={styles.section}>
              <Text style={styles.subTitle}>📊 מצב יומי:</Text>
              <Text style={styles.text}>{dailyStatus}</Text> {/* הצגת מצב הסקירה */}
            {/* </View> */}

            {/* {dailyStatus !== "מילאת את הסקירה היומית!" && (
              <Button
                title="התחילי מעקב יומי"
                onPress={() => router.push("/create")}
                color="#4CAF50"
              />
            )} */} 
            <View style={styles.section}>
              <Text style={styles.subTitle}>📊 מצב יומי:</Text>
              <Text style={styles.text}>
                עוד לא התחלת לעקוב אחרי הקפה שלך היום.
              </Text>
            </View>
            <Button
              title="התחילי מעקב יומי"
              onPress={() => router.push("/create")}
              color="#4CAF50"
            />
            <Button
              title="שלח לי תזכורת עכשיו 🚀"
              onPress={sendImmediateNotification}
              color="#2196F3"
              style={{ marginTop: 10 }}
            />
            <TouchableOpacity onPress={handleLogout} style={styles.backLink}>
              <Text style={styles.linkText}>התנתקות מהחשבון</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.text}>לא נמצאו נתוני משתמש.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    // backgroundColor: "#fff",
    minHeight: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    // color: "white"
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#a3d9a5",
    marginBottom: 5,
  },
  text: {
    // color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  section: { marginTop: 30, marginBottom: 20, width: "100%" },
  backLink: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#2196F3",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  logoutButton: {
    position: "absolute",
    bottom: 0,
    left: 20,
  },
});
