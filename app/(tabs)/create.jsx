import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import Slider from "@react-native-community/slider";

export default function Create() {
  const [amount, setAmount] = useState("");
  const [tiredness, setTiredness] = useState(5);
  const [focus, setFocus] = useState(5);
  const [mood, setMood] = useState(5);
  const [reason, setReason] = useState("");

  const submitDataToAPI = () => {
    const data = {
      amount,
      tiredness,
      focus,
      mood,
      reason,
      timestamp: new Date().toISOString(),
    };

    // שליחה לשרת (תעדכני את הכתובת בהתאם)
    fetch("https://your-api-url.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(() => alert("המידע נשלח בהצלחה!"))
      .catch((err) => alert("שגיאה בשליחה: " + err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>✍️ Create – איסוף מידע</Text>

      <Text style={styles.label}>כמה שתית? (במ"ל)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="לדוגמה: 250"
      />

      <Text style={styles.label}>דרגי עייפות</Text>
      <Slider style={styles.slider} minimumValue={0} maximumValue={10} step={1} value={tiredness} onValueChange={setTiredness} />
      <Text style={styles.label}>דרגי ריכוז</Text>
      <Slider style={styles.slider} minimumValue={0} maximumValue={10} step={1} value={focus} onValueChange={setFocus} />
      <Text style={styles.label}>דרגי מצב רוח</Text>
      <Slider style={styles.slider} minimumValue={0} maximumValue={10} step={1} value={mood} onValueChange={setMood} />

      <Text style={styles.label}>למה שתית עכשיו?</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={reason}
        onChangeText={setReason}
        placeholder="שתיתי כי..."
      />

      <View style={styles.button}>
        <Button title="שלח" onPress={submitDataToAPI} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "white" 
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
    color: "white" 

  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    color: "white" 

  },
  slider: {
    width: "100%",
    height: 40,
    color: "white" 

  },
  button: {
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
    color: "white" 

  },
});
