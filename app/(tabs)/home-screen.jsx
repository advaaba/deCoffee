import React, { Component } from 'react'
import { View, Text, Button } from "react-native";
import ColorList from '@/components/ColorList'
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken"); // 🔥 מוחקים את הטוקן
      router.replace("/open-screen"); // 🔄 שולחים את המשתמש למסך הפתיחה
    } catch (error) {
      console.error("❌ שגיאה בהתנתקות:", error);
    }
  };

  return (
    <View>
      <ColorList color = "#0891b2"></ColorList>
  </View>
  );
}
