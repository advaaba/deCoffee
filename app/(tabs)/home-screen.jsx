import React, { useEffect, useState } from "react";
import { ScrollView, Text, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          Alert.alert("שגיאה", "לא נמצאו פרטי משתמש.");
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/auth/get-user/${userId}`);
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          Alert.alert("שגיאה", "לא ניתן לטעון את פרטי המשתמש");
        }
      } catch (err) {
        console.error("שגיאה בטעינת פרטי המשתמש:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");
      router.replace("/open-screen");
    } catch (error) {
      console.error("❌ שגיאה בהתנתקות:", error);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#4CAF50" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>שלום, {user.firstName}!</Text>
          <Text style={styles.text}>ברוכה הבאה ל-DeCoffee 🌿</Text>
          <Text style={styles.text}>
            את יכולה לצפות בנתונים האישיים שלך בטאב "פרופיל"
          </Text>
          <Button title="התנתקות" onPress={handleLogout} color="#d9534f" />
        </>
      ) : (
        <Text style={styles.text}>לא נמצאו נתוני משתמש.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center", backgroundColor: "#1c1c1c", minHeight: "100%" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "white" },
  text: { color: "white", textAlign: "center", marginBottom: 10 }
});
