import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";

const SERVER_URL = "http://localhost:5000/api/auth/register";

const CoffeeDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errors, setErrors] = useState({});

  const coffeeTypes = [
    { label: "אספרסו", value: "Espresso" },
    { label: "הפוך", value: "Cappuccino" },
    { label: "אמריקנו", value: "Americano" },
    { label: "נס קפה", value: "Instant Coffee" },
  ];

  const foodType = [
    { label: "שוקולד מריר", value: "dark_chocolate" },
    { label: "שוקולד חלב", value: "milk_chocolate" },
    { label: "עוגת שוקולד", value: "chocolate_cake" },
    { label: "גלידת קפה", value: "coffee_ice_cream" },
    { label: "משקאות אנרגיה", value: "energy_drinks" },
    { label: "קולה", value: "cola" },
    { label: "תה ירוק", value: "green_tea" },
    { label: "תה שחור", value: "black_tea" },
    { label: "משקה קקאו", value: "hot_cocoa" },
    { label: "מוס שוקולד", value: "chocolate_mousse" },
    { label: "ממרח שוקולד", value: "chocolate_spread" },
    { label: "עוגיות קפה", value: "coffee_cookies" },
    { label: "בונבוני שוקולד עם קפה", value: "coffee_chocolates" },
    { label: "חטיפי אנרגיה עם קפאין", value: "caffeinated_energy_bars" },
  ];

  const servingSizes = [
    { label: "קטן", value: "Small" },
    { label: "בינוני", value: "Medium" },
    { label: "גדול", value: "Large" },
  ];

  const coffeeConsumption = Array.from({ length: 11 }, (_, i) => ({
    label: `${i} כוסות ביום`,
    value: i,
  }));

  const timesPerDay = [
    { label: "בוקר בלבד", value: "Morning Only" },
    { label: "בוקר וצהריים", value: "Morning and Afternoon" },
    { label: "במהלך כל היום", value: "Throughout the day" },
  ];

  const [coffeeData, setCoffeeData] = useState({
    coffeeType: [],
    foodType: [],
    servingSize: null,
    cupsPerDay: null,
    consumptionTime: null,
  });

  useEffect(() => {
    console.log("📦 נתונים שהתקבלו:", params);
  }, [params]);

  const handleInputChange = (key, value) => {
    setCoffeeData({ ...coffeeData, [key]: value });
  };

  const handleRegister = async () => {
    const finalData = {
      ...params,
      ...coffeeData,
      weight: Number(params.weight),
      height: Number(params.height),
      age: Number(params.age),
      birthDay: Number(params.birthDay),
      birthMonth: Number(params.birthMonth),
      birthYear: Number(params.birthYear),
      caffeineRecommendationMin: Number(params.caffeineRecommendationMin),
      caffeineRecommendationMax: Number(params.caffeineRecommendationMax),
      cupsPerDay: Number(coffeeData.cupsPerDay),
    };
    
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
        <Text style={styles.title}>פרטי צריכת קפה</Text>

        <MultiSelect
          style={styles.dropdown}
          data={coffeeTypes}
          labelField="label"
          valueField="value"
          placeholder="בחר סוגי משקאות מועדפים"
          value={coffeeData.coffeeType}
          onChange={(item) => handleInputChange("coffeeType", item)}
        />

        <Dropdown
          style={styles.dropdown}
          data={servingSizes}
          labelField="label"
          valueField="value"
          placeholder="מידת ההגשה המועדפת"
          value={coffeeData.servingSize}
          onChange={(item) => handleInputChange("servingSize", item.value)}
        />

        <Dropdown
          style={styles.dropdown}
          data={coffeeConsumption}
          labelField="label"
          valueField="value"
          placeholder="כמה כוסות ביום?"
          value={coffeeData.cupsPerDay}
          onChange={(item) => handleInputChange("cupsPerDay", item.value)}
        />

        <Dropdown
          style={styles.dropdown}
          data={timesPerDay}
          labelField="label"
          valueField="value"
          placeholder="מתי את/ה נוהג לשתות קפה?"
          value={coffeeData.consumptionTime}
          onChange={(item) => handleInputChange("consumptionTime", item.value)}
        />

        <Button title="סיום הרשמה" onPress={handleRegister} color="#4CAF50" />
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
    // color: "#fff",
    marginBottom: 20,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    // color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
  },
});

export default CoffeeDetails;
