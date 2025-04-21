import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function PasswordRecovery() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handlePasswordReset = () => {
    if (!email) {
      Alert.alert("⚠️ שגיאה", "נא להזין כתובת אימייל תקינה.");
      return;
    }

    // כאן תשלחי את ה־email ל־backend שלך
    Alert.alert("📨 אם כתובתך קיימת במערכת – מייל נשלח.");
    router.back(); // חזרה למסך הקודם
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 שחזור סיסמה</Text>

      <TextInput
        style={styles.input}
        placeholder="הכנס/י כתובת מייל"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>איפוס סיסמה</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  backLink: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#2196F3",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
