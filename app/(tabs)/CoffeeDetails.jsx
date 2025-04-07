import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  TextInput,
} from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { useRouter } from "expo-router";
import RadioGroup from "react-native-radio-buttons-group";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CoffeeDetails = () => {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [selfDescription, setSelfDescription] = useState("");
  const [isWorking, setIsWorking] = useState(null);
  const [effects, setEffects] = useState(null);
  const [isTryingToReduce, setIsTryingToReduce] = useState(null);
  const [reductionExplanation, setReductionExplanation] = useState("");
  const [sleepFromHour, setSleepFromHour] = useState(null);
  const [sleepToHour, setSleepToHour] = useState(null);
  const [workStartHour, setWorkStartHour] = useState(null);
  const [workEndHour, setWorkEndHour] = useState(null);
  const [importanceLevel, setImportanceLevel] = useState(null);
  const [isMotivation, setIsMotivation] = useState(false);
  const [coffeeTypesFromDb, setCoffeeTypesFromDb] = useState([]);

  const [coffeeData, setCoffeeData] = useState({
    coffeeType: [],
    servingSize: null,
    cupsPerDay: null,
    consumptionTime: [],
  });

  useEffect(() => {
    const fetchCoffeeTypes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/drinks");
        const formatted = response.data.map((drink) => ({
          label: drink.name,
          value: drink.value,
        }));
        setCoffeeTypesFromDb(formatted);
      } catch (error) {
        console.error("❌ שגיאה בשליפת סוגי הקפה:", error.message);
      }
    };

    fetchCoffeeTypes();
  }, []);

  const handleInputChange = (key, value) => {
    setCoffeeData((prev) => ({ ...prev, [key]: value }));
  };

  const calculateDuration = (start, end) => {
    if (start == null || end == null) return 0;
    return end >= start ? end - start : 24 - start + end;
  };

  const sleepDuration = useMemo(() => calculateDuration(sleepFromHour, sleepToHour), [sleepFromHour, sleepToHour]);
  const workDuration = useMemo(() => calculateDuration(workStartHour, workEndHour), [workStartHour, workEndHour]);

  const importanceLevels = [
    { label: "במידה מועטה מאוד", value: 1 },
    { label: "במידה מועטה", value: 2 },
    { label: "במידה בינונית", value: 3 },
    { label: "במידה רבה", value: 4 },
    { label: "במידה רבה מאוד", value: 5 },
  ];

  const hoursOptions = Array.from({ length: 24 }, (_, i) => ({
    label: `${i.toString().padStart(2, "0")}:00`,
    value: i,
  }));

  const yesNoOptions = useMemo(() => [
    { id: "yes", label: "כן", value: "yes" },
    { id: "no", label: "לא", value: "no" },
  ], []);

  const effectsOptions = useMemo(() => [
    { id: "physically", label: "פיזית", value: "physically" },
    { id: "mentally", label: "רגשית", value: "mentally" },
    { id: "both", label: "שניהם", value: "both" },
  ], []);

  const servingSizes = [
    { label: 'קטן (160 מ"ל)', value: "Small" },
    { label: 'בינוני (240 מ"ל)', value: "Medium" },
    { label: 'גדול (360 מ"ל)', value: "Large" },
  ];

  const coffeeConsumption = Array.from({ length: 11 }, (_, i) => ({
    label: `כוסות ${i}`,
    value: i,
  }));

  const timesPerDay = [
    { label: "בוקר", value: "Morning Only" },
    { label: "צהריים", value: "Afternoon Only" },
    { label: "ערב", value: "evening only" },
    { label: "במהלך כל היום", value: "Throughout the day" },
  ];

  const selfDescriptions = [
    { label: "אני טיפוס של בוקר, אוהב קפה חזק ומר", value: "אני טיפוס של בוקר, אוהב קפה חזק ומר" },
    { label: "שותה קפה בעיקר כדי להתעורר", value: "שותה קפה בעיקר כדי להתעורר" },
    { label: "קפה בשבילי הוא רגע של שקט", value: "קפה בשבילי הוא רגע של שקט" },
    { label: "שותה קפה מתוך הרגל", value: "שותה קפה מתוך הרגל" },
    { label: "קפה בשבילי הוא חלק מהחברה", value: "קפה בשבילי הוא חלק מהחברה" },
  ];

  const handleImportanceChange = (item) => {
    setImportanceLevel(item.value);
    setIsMotivation(item.value >= 3);
  };

  const handleRegister = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const finalData = {
        coffeeConsumption: {
          ...coffeeData,
          cupsPerDay: Number(coffeeData.cupsPerDay),
          isWorking,
          effects,
          isTryingToReduce,
          selfDescription,
          sleepFromHour,
          sleepToHour,
          workStartHour,
          workEndHour,
          sleepDuration,
          workDuration,
          isMotivation,
          reductionExplanation,
        },
      };
  
      const response = await axios.put(
        `http://localhost:5000/api/auth/update-coffee-consumption/${userId}`,
        finalData.coffeeConsumption
      );
      console.log("📦 נתונים שנשלחים לשרת:", finalData);
      console.log("✅ עדכון הצליח:", response.data);
  
      setModalMessage("✅ הנתונים נשמרו בהצלחה!");
      setModalVisible(true);
    } catch (err) {
      console.error("❌ שגיאה בעדכון המשתמש:", err);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>פרטי צריכת קפה</Text>
        <Text>🛌 כמה שעות את/ה ישנ/ה בממוצע ביממה?</Text>
        <View style={styles.sleepTimeRow}>
          <Dropdown
            style={[styles.dropdown, styles.sleepDropdown]}
            data={hoursOptions}
            labelField="label"
            valueField="value"
            placeholder="עד שעה"
            value={sleepToHour}
            onChange={(item) => setSleepToHour(item.value)}
            placeholderStyle={{ textAlign: "right" }}
            selectedTextStyle={{ textAlign: "right" }}
          />
          <Dropdown
            style={[styles.dropdown, styles.sleepDropdown]}
            data={hoursOptions}
            labelField="label"
            valueField="value"
            placeholder="משעה"
            value={sleepFromHour}
            onChange={(item) => setSleepFromHour(item.value)}
            placeholderStyle={{ textAlign: "right" }}
            selectedTextStyle={{ textAlign: "right" }}
          />
        </View>
        {/* <Text>😴 שעות שינה: {sleepDuration}</Text>
        <Text>👨‍💻 שעות עבודה: {workDuration}</Text> */}
        <Text>💼 האם אתה בשגרת עבודה?</Text>
        <RadioGroup
          radioButtons={yesNoOptions}
          onPress={(val) => setIsWorking(val)}
          selectedId={isWorking}
          layout="row"
        />
        {isWorking === "yes" && (
          <>
            <Text>🕘 מהן שעות העבודה שלך?</Text>
            <View style={styles.sleepTimeRow}>
              <Dropdown
                style={[styles.dropdown, styles.sleepDropdown]}
                data={hoursOptions}
                labelField="label"
                valueField="value"
                placeholder="משעה"
                value={workStartHour}
                onChange={(item) => setWorkStartHour(item.value)}
                placeholderStyle={{ textAlign: "right" }}
                selectedTextStyle={{ textAlign: "right" }}
              />
              <Dropdown
                style={[styles.dropdown, styles.sleepDropdown]}
                data={hoursOptions}
                labelField="label"
                valueField="value"
                placeholder="עד שעה"
                value={workEndHour}
                onChange={(item) => setWorkEndHour(item.value)}
                placeholderStyle={{ textAlign: "right" }}
                selectedTextStyle={{ textAlign: "right" }}
              />
            </View>
          </>
        )}
        <Text>☕ באילו שעות ביום את/ה בדר״כ שותה קפה?</Text>
        <MultiSelect
          style={styles.dropdown}
          data={timesPerDay}
          labelField="label"
          valueField="value"
          placeholder="בחר זמן"
          value={coffeeData.consumptionTime || []}
          onChange={(item) => handleInputChange("consumptionTime", item)}
          placeholderStyle={{ textAlign: "right" }}
          selectedTextStyle={{ textAlign: "right", textDirection: "rtl" }}
          selectedStyle={{
            flexDirection: "row-reverse",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          itemTextStyle={{
            textAlign: "right",
            textDirection: "rtl",
          }}
          containerStyle={{ direction: "rtl" }}
        />
        <Text>🥤 כמה כוסות קפה ביום?</Text>
        <Dropdown
          style={styles.dropdown}
          data={coffeeConsumption}
          labelField="label"
          placeholder="בחר כמות כוסות"
          valueField="value"
          value={coffeeData.cupsPerDay}
          onChange={(item) => handleInputChange("cupsPerDay", item.value)}
          placeholderStyle={{ textAlign: "right" }}
          selectedTextStyle={{ textAlign: "right" }}
        />
        <Text>📌 האם שתיית הקפה משפיעה עליך רגשית / פיזית / שניהם?</Text>
        <RadioGroup
          radioButtons={effectsOptions}
          onPress={(val) => setEffects(val)}
          selectedId={effects}
          layout="row"
        />
        <Text>📉 האם אתה מנסה להפחית צריכת קפה?</Text>
        <RadioGroup
          radioButtons={yesNoOptions}
          onPress={(val) => setIsTryingToReduce(val)}
          selectedId={isTryingToReduce}
          layout="row"
        />
        {isTryingToReduce === "yes" && (
          <View>
            <Text>📝 איך אתה מנסה להפחית צריכת קפה?</Text>
            <TextInput
              style={styles.input}
              placeholder="למשל: מחליף לקפה נטול, שותה תה במקום..."
              value={reductionExplanation}
              onChangeText={setReductionExplanation}
            />
          </View>
        )}
        <Text>📈 כמה חשוב לך לעקוב אחרי הרגלי צריכת הקפה שלך?</Text>
        <Dropdown
          style={styles.dropdown}
          data={importanceLevels}
          labelField="label"
          valueField="value"
          placeholder="בחר רמת חשיבות"
          value={importanceLevel}
          onChange={handleImportanceChange}
          placeholderStyle={{ textAlign: "right" }}
          selectedTextStyle={{ textAlign: "right" }}
        />
        <Text>☕ סוגי קפה מועדפים:</Text>
        <MultiSelect
          style={styles.dropdown}
          data={coffeeTypesFromDb}
          labelField="label"
          valueField="value"
          placeholder="בחר סוגי קפה"
          value={coffeeData.coffeeType}
          onChange={(item) => handleInputChange("coffeeType", item)}
          placeholderStyle={{ textAlign: "right" }}
          selectedTextStyle={{ textAlign: "right" }}
          selectedStyle={{
            flexDirection: "row-reverse",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          itemTextStyle={{
            textAlign: "right",
            textDirection: "rtl",
          }}
          containerStyle={{ direction: "rtl" }}
        />
        <Text>📏 מה מידת ההגשה המועדפת?</Text>
        <Dropdown
          style={styles.dropdown}
          data={servingSizes}
          labelField="label"
          valueField="value"
          placeholder="בחר סוג הגשה"
          value={coffeeData.servingSize}
          onChange={(item) => handleInputChange("servingSize", item.value)}
          placeholderStyle={{ textAlign: "right" }}
          selectedTextStyle={{ textAlign: "right" }}
        />
        <Text>🔍 תבחר/י את המשפט שאת/ה הכי מזדהה איתו:</Text>
        <Dropdown
          style={styles.dropdown}
          data={selfDescriptions}
          labelField="label"
          valueField="value"
          placeholder="בחר תיאור"
          value={selfDescription}
          onChange={(item) => setSelfDescription(item.value)}
          placeholderStyle={{ textAlign: "right" }}
          selectedTextStyle={{ textAlign: "right" }}
        />

        <View style={styles.buttonGroup}>
          <Button title="סיום" onPress={handleRegister} color="#4CAF50" />
          <Button
            title="חזור"
            onPress={() => router.push("/coffee")}
            color="#888"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingBottom: 20 },
  container: {
    flex: 1,
    alignItems: "flex-start",
    padding: 20,
    gap: 8,
    flexDirection: "column",
    alignItems: "stretch",
    // direction: "rtl",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
    width: "100%",
  },

  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 15,
    textAlign: "right",
    fontSize: 16,
    color: "gray",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    gap: 10,
  },
  sleepTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 15,
  },
  sleepDropdown: {
    flex: 1,
  },
});

export default CoffeeDetails;
