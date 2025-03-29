// ExploreScreen.jsx
import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

export default function ExploreScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔍 גלה עוד על קפה</Text>
      <Text style={styles.text}>☕ שתיית קפה יכולה להמריץ אותך, אבל עודף ממנו עלול לגרום לעייפות מוגברת.</Text>
      <Text style={styles.text}>💧 שתה מים בין כוסות קפה כדי לשמור על איזון נוזלים.</Text>
      <Text style={styles.text}>🕒 נסה להימנע מקפה אחרי השעה 16:00 כדי לא להפריע לשינה.</Text>
      <Text style={styles.text}>📚 מחקרים מראים שקפאין משפיע שונה על כל אדם – עקוב אחרי התחושות שלך.</Text>
      <Text style={styles.text}>🌿 נסה להפחית בהדרגה – יום בלי קפה יכול להיות הזדמנות להקשיב לגוף.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // backgroundColor: "#fff",
    minHeight: "100%"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    // color: "#ffc8dd",
    textAlign: "center"
  },
  text: {
    // color: "white",
    marginBottom: 10,
    fontSize: 16
  }
});
