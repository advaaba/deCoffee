import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  View,
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
          `http://localhost:5000/api/auth/get-user/${userId}`
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");
      router.replace("/open-screen");
    } catch (error) {
      console.error(
        "\u274c \u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d4\u05ea\u05e0\u05ea\u05e7\u05d5\u05ea:",
        error
      );
    }
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
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>שלום, {user.firstName} 👋</Text>
          <Text style={styles.text}>ברוכה הבאה ל־DeCoffee 🌿</Text>
          <Text style={styles.text}>המסע שלך לקפה מודע מתחיל כאן.</Text>
          <View style={styles.section}>
            <Text style={styles.subTitle}>📊 מצב יומי:</Text>
            <Text style={styles.text}>
              עוד לא התחלת לעקוב אחרי הקפה שלך היום.
            </Text>
          </View>
        </>
      ) : (
        <Text style={styles.text}>לא נמצאו נתוני משתמש.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    // backgroundColor: "#fff",
    minHeight: "100%",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, 
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
    textAlign: "center", marginBottom: 10 },
  section: { marginTop: 30, marginBottom: 20, width: "100%" },
});
