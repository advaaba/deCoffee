import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet, Button } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";

const SERVER_URL = "http://localhost:5000/api/auth/register";

const CoffeeDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log("📦 נתונים שהתקבלו:", params);
  }, [params]);

  const handleRegister = async () => {
    console.log("📩 נתונים שנשלחים לשרת:", finalData);

    try {
      const response = await axios.post(SERVER_URL, finalData);
      console.log("✅ הרשמה הצליחה:", response.data);
      setModalMessage("✅ ההרשמה בוצעה בהצלחה!");
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        router.push("/home-screen");
      }, 2000);
    } catch (error) {
      console.error("❌ שגיאה בהרשמה:", error.response?.data || error.message);
      Alert.alert("❌ שגיאה", "הרשמה נכשלה, נסה שוב.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* <Text>{JSON.stringify(params, null, 2)}</Text> */}
        <Button title="המשך" onPress={handleRegister} color="#4CAF50" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingBottom: 20 },
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default CoffeeDetails;
