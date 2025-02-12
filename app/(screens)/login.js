import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      setErrorMessage("❌ יש למלא את כל השדות!");
      return;
    }

    // כאן אפשר לשלוח בקשה לשרת לבדוק את שם המשתמש והסיסמה
    console.log("📤 שולח נתונים לשרת:", { username, password });

    // אם התחברות מוצלחת:
    setErrorMessage(""); // מנקה הודעות שגיאה
    alert("✅ התחברת בהצלחה!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 התחברות</Text>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="שם משתמש"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>כניסה</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#2196F3",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default LoginScreen;
