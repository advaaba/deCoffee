// ✅ קובץ Profile.jsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          Alert.alert("שגיאה", "לא נמצאו נתוני משתמש");
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/auth/get-user/${userId}`);
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          Alert.alert("שגיאה", "לא ניתן לטעון את פרטי המשתמש");
        }
      } catch (err) {
        console.error("❌ שגיאה בשליפת נתונים:", err);
        Alert.alert("שגיאה", "בעיה בטעינת נתונים מהשרת");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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

  if (!user) return <Text style={styles.text}>לא נמצאו נתוני משתמש.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>הפרופיל שלך:</Text>
      <Text style={styles.text}>שם מלא: {user.firstName} {user.lastName}</Text>
      <Text style={styles.text}>דוא"ל: {user.email}</Text>
      <Text style={styles.text}>טלפון: {user.phoneNumber}</Text>
      <Text style={styles.text}>גיל: {user.age}</Text>
      <Text style={styles.text}>משקל: {user.weight} ק"ג</Text>
      <Text style={styles.text}>גובה: {user.height} ס"מ</Text>
      <Text style={styles.text}>מצב בריאותי: {user.healthCondition}</Text>
      <Text style={styles.text}>רמת פעילות: {user.activityLevel}</Text>
      <Text style={styles.text}>העדפות תזונה: {user.dietaryPreferences}</Text>
      <View style={{ marginTop: 20 }}>
        <Button title="התנתקות" onPress={handleLogout} color="#d9534f" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#1c1c1c", minHeight: "100%" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, color: "white" },
  text: { color: "white", marginBottom: 5 }
});