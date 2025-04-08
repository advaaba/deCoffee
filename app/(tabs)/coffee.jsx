import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function CoffeeScreen() {
  const router = useRouter();
  const [isFilled, setIsFilled] = useState(false);

  const [caffeineMin, setCaffeineMin] = useState(null);
  const [caffeineMax, setCaffeineMax] = useState(null);
  const [finalCaffeine, setCaffeine] = useState(null);
  
  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");

        if (!userId) return;
        const response = await axios.get(
          `http://localhost:5000/api/auth/get-user/${userId}`
        );

        const userData = response.data.user;
        const caffeineMin = userData.caffeineRecommendationMin;
        const caffeineMax = userData.caffeineRecommendationMax;
        const coffeeData = userData.coffeeConsumption;
        const finalCaffeine = userData.averageCaffeineRecommendation;
        
        setCaffeineMin(caffeineMin);
        setCaffeineMax(caffeineMax);
        setCaffeine(finalCaffeine);
        
        const hasData =
          coffeeData &&
          Object.values(coffeeData).some((value) =>
            Array.isArray(value) ? value.length > 0 : !!value
          );

        if (hasData) {
          setIsFilled(true);
        }
      } catch (error) {
        console.error("שגיאה בשליפת נתוני coffeeConsumption:", error);
      }
    };

    fetchSurveyData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>מסך נתוני הקפה</Text>
      {caffeineMin !== null && caffeineMax !== null ? (
        <Text>
          כמות הקפאין המומלצת עבורך: {caffeineMin} - {caffeineMax} מ"ג ביום 
           {finalCaffeine} סה"כ
        </Text>
      ) : (
        <Text>טוען נתונים...</Text>
      )}

      <TouchableOpacity
        style={[styles.button, isFilled && styles.disabledButton]}
        onPress={() => router.push("/CoffeeDetails")}
        disabled={isFilled}
      >
        <Text style={styles.buttonText}>
          {isFilled ? "כבר מילאת את הסקירה" : "שאלון סקירה כללית לקפה"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9E9E9E",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
