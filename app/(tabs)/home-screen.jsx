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

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
          `http://172.20.10.10:5000/api/auth/get-user/${userId}`
          // `http://localhost:5000/api/auth/get-user/${userId}`
        );
        if (response.data.success) {
          setUser(response.data.user);
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

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#4CAF50"
        style={{ marginTop: 40 }}
      />
    );

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
            <View style={styles.section}>
              <Text style={styles.subTitle}>📊 מצב יומי:</Text>
              <Text style={styles.text}>
                עוד לא התחלת לעקוב אחרי הקפה שלך היום.
              </Text>
              {/* <TouchableOpacity onPress={handleLogout} style={styles.backLink}>
              <Text style={styles.linkText}>התנתקות מהחשבון</Text>
            </TouchableOpacity> */}
            </View>
            <Button
              title="התחילי מעקב יומי"
              onPress={() => router.push("/create")}
              color="#4CAF50"
            />
          </>
        ) : (
          <Text style={styles.text}>לא נמצאו נתוני משתמש.</Text>
        )}
      </ScrollView>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.linkText}>התנתקות מהחשבון</Text>
      </TouchableOpacity>
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
