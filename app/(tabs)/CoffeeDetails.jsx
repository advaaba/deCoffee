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
  const [errors, setErrors] = useState({});

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

  const checkValidate = () => {
    const newErrors = {};
    const { coffeeType, servingSize, cupsPerDay, consumptionTime } = coffeeData;

    if (sleepFromHour === null)
      newErrors.sleepFromHour = "יש לבחור שעת התחלת שינה";
    if (sleepToHour === null) newErrors.sleepToHour = "יש לבחור שעת סיום שינה";
    if (!isWorking) newErrors.isWorking = "יש לציין אם אתה עובד או לא";
    if (
      isWorking === "yes" &&
      (workStartHour === null || workEndHour === null)
    ) {
      if (workStartHour === null)
        newErrors.workStartHour = "יש לבחור שעת התחלת עבודה";
      if (workEndHour === null)
        newErrors.workEndHour = "יש לבחור שעת סיום עבודה";
    }
    if (!consumptionTime || consumptionTime.length === 0)
      newErrors.consumptionTime = "יש לבחור לפחות זמן אחד לצריכת קפה";
    if (cupsPerDay === null) newErrors.cupsPerDay = "יש לבחור כמות כוסות";
    if (!effects) newErrors.effects = "יש לבחור השפעה";
    if (!isTryingToReduce)
      newErrors.isTryingToReduce = "יש לבחור אם אתה מנסה להפחית";
    if (isTryingToReduce === "yes" && reductionExplanation.trim() === "")
      newErrors.reductionExplanation = "יש לפרט איך אתה מנסה להפחית צריכה";
    if (!importanceLevel) newErrors.importanceLevel = "יש לבחור רמת חשיבות";
    if (!coffeeType || coffeeType.length === 0)
      newErrors.coffeeType = "יש לבחור לפחות סוג קפה אחד";
    if (!servingSize) newErrors.servingSize = "יש לבחור סוג הגשה";
    if (!selfDescription) newErrors.selfDescription = "יש לבחור תיאור אישי";

    setErrors(newErrors);

    return Object.keys(newErrors).length > 0;
  };

  const handleInputChange = (key, value) => {
    setCoffeeData((prev) => ({ ...prev, [key]: value }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[key];
      return newErrors;
    });
  };

  const calculateDuration = (start, end) => {
    if (start == null || end == null) return 0;
    return end >= start ? end - start : 24 - start + end;
  };

  const sleepDuration = useMemo(
    () => calculateDuration(sleepFromHour, sleepToHour),
    [sleepFromHour, sleepToHour]
  );
  const workDuration = useMemo(
    () => calculateDuration(workStartHour, workEndHour),
    [workStartHour, workEndHour]
  );

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

  const yesNoOptions = useMemo(
    () => [
      { id: "yes", label: "כן", value: "yes" },
      { id: "no", label: "לא", value: "no" },
    ],
    []
  );

  const effectsOptions = useMemo(
    () => [
      { id: "physically", label: "פיזית", value: "physically" },
      { id: "mentally", label: "רגשית", value: "mentally" },
      { id: "both", label: "שניהם", value: "both" },
      { id: "none", label: "אף אחד מהם", value: "none" },
    ],
    []
  );

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
    {
      label: "אני טיפוס של בוקר, אוהב קפה חזק ומר",
      value: "אני טיפוס של בוקר, אוהב קפה חזק ומר",
    },
    {
      label: "שותה קפה בעיקר כדי להתעורר",
      value: "שותה קפה בעיקר כדי להתעורר",
    },
    { label: "קפה בשבילי הוא רגע של שקט", value: "קפה בשבילי הוא רגע של שקט" },
    { label: "שותה קפה מתוך הרגל", value: "שותה קפה מתוך הרגל" },
    { label: "קפה בשבילי הוא חלק מהחברה", value: "קפה בשבילי הוא חלק מהחברה" },
  ];

  const resetForm = () => {
    setSelfDescription("");
    setIsWorking(null);
    setEffects(null);
    setIsTryingToReduce(null);
    setReductionExplanation("");
    setSleepFromHour(null);
    setSleepToHour(null);
    setWorkStartHour(null);
    setWorkEndHour(null);
    setImportanceLevel(null);
    setIsMotivation(false);
    setCoffeeData({
      coffeeType: [],
      servingSize: null,
      cupsPerDay: null,
      consumptionTime: [],
    });
    setErrors({});
  };

  const handleImportanceChange = (item) => {
    setImportanceLevel(item.value);
    setIsMotivation(item.value >= 3);
  };

  const handleRegister = async () => {
    const hasErrors = checkValidate();
    if (hasErrors) {
      Alert.alert("שגיאה", "אנא תקנ/י את השדות המסומנים באדום");
      return;
    }
  
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
  
      console.log("📦 נתונים שנשלחים לשרת: ", finalData);
      console.log("✅ עדכון הצליח:", response.data);
  
      // ✅ הודעת הצלחה ואז ניתוב חזרה למסך הקודם
      Alert.alert("הצלחה", "✅ הנתונים נשמרו בהצלחה!", [
        {
          text: "אוקיי",
          onPress: () => {
            resetForm();
            router.push("/coffee");
          },
        },
      ]);
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
            style={[
              styles.dropdown,
              styles.sleepDropdown,
              errors.selfDescription && styles.errorField,
            ]}
            data={hoursOptions}
            labelField="label"
            valueField="value"
            placeholder="עד שעה"
            value={sleepToHour}
            onChange={(item) => {
              setSleepToHour(item.value);
              setErrors((prev) => {
                const updated = { ...prev };
                delete updated.selfDescription;
                return updated;
              });
            }}
            placeholderStyle={{ textAlign: "right" }}
            selectedTextStyle={{ textAlign: "right" }}
          />
          {errors.sleepToHour && (
            <Text style={{ color: "red" }}>{errors.sleepToHour}</Text>
          )}

          <Dropdown
            style={[
              styles.dropdown,
              styles.sleepDropdown,
              errors.selfDescription && styles.errorField,
            ]}
            data={hoursOptions}
            labelField="label"
            valueField="value"
            placeholder="משעה"
            value={sleepFromHour}
            onChange={(item) => {
              setSleepFromHour(item.value);
              setErrors((prev) => {
                const updated = { ...prev };
                delete updated.selfDescription;
                return updated;
              });
            }}
            placeholderStyle={{ textAlign: "right" }}
            selectedTextStyle={{ textAlign: "right" }}
          />
          {errors.sleepFromHour && (
            <Text style={{ color: "red" }}>{errors.sleepFromHour}</Text>
          )}
        </View>
        {/* <Text>😴 שעות שינה: {sleepDuration}</Text>
        <Text>👨‍💻 שעות עבודה: {workDuration}</Text> */}
        <Text>💼 האם אתה בשגרת עבודה?</Text>
        <RadioGroup
          radioButtons={yesNoOptions}
          onPress={(val) => {
            setIsWorking(val);
            setErrors((prev) => {
              const updated = { ...prev };
              delete updated.isWorking;
              return updated;
            });
          }}
          selectedId={isWorking}
          layout="row"
        />
        {errors.isWorking && (
          <Text style={{ color: "red" }}>{errors.isWorking}</Text>
        )}
        {isWorking === "yes" && (
          <>
            <Text>🕘 מהן שעות העבודה שלך?</Text>
            <View style={styles.sleepTimeRow}>
              <Dropdown
                style={[
                  styles.dropdown,
                  styles.sleepDropdown,
                  errors.selfDescription && styles.errorField,
                ]}
                data={hoursOptions}
                labelField="label"
                valueField="value"
                placeholder="משעה"
                value={workStartHour}
                onChange={(item) => {
                  setWorkStartHour(item.value);
                  setErrors((prev) => {
                    const updated = { ...prev };
                    delete updated.selfDescription;
                    return updated;
                  });
                }}
                placeholderStyle={{ textAlign: "right" }}
                selectedTextStyle={{ textAlign: "right" }}
              />
              {errors.workStartHour && (
                <Text style={{ color: "red" }}>{errors.workStartHour}</Text>
              )}
              <Dropdown
                style={[
                  styles.dropdown,
                  styles.sleepDropdown,
                  errors.selfDescription && styles.errorField,
                ]}
                data={hoursOptions}
                labelField="label"
                valueField="value"
                placeholder="עד שעה"
                value={workEndHour}
                onChange={(item) => {
                  setWorkEndHour(item.value);
                  setErrors((prev) => {
                    const updated = { ...prev };
                    delete updated.selfDescription;
                    return updated;
                  });
                }}
                placeholderStyle={{ textAlign: "right" }}
                selectedTextStyle={{ textAlign: "right" }}
              />
              {errors.workEndHour && (
                <Text style={{ color: "red" }}>{errors.workEndHour}</Text>
              )}
            </View>
          </>
        )}
        <Text>☕ באילו שעות ביום את/ה בדר״כ שותה קפה?</Text>
        <MultiSelect
          style={[styles.dropdown, errors.selfDescription && styles.errorField]}
          data={timesPerDay}
          labelField="label"
          valueField="value"
          placeholder="בחר זמן"
          value={coffeeData.consumptionTime || []}
          onChange={(item) => {
            handleInputChange("consumptionTime", item);
            setErrors((prev) => {
              const updated = { ...prev };
              delete updated.selfDescription;
              return updated;
            });
          }}
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
        {errors.consumptionTime && (
          <Text style={{ color: "red" }}>{errors.consumptionTime}</Text>
        )}

        <Text>🥤 כמה כוסות קפה ביום?</Text>
        <Dropdown
          style={[styles.dropdown, errors.selfDescription && styles.errorField]}
          data={coffeeConsumption}
          labelField="label"
          placeholder="בחר כמות כוסות"
          valueField="value"
          value={coffeeData.cupsPerDay}
          onChange={(item) => {
            handleInputChange("cupsPerDay", item.value);
            setErrors((prev) => {
              const updated = { ...prev };
              delete updated.selfDescription;
              return updated;
            });
          }}
          placeholderStyle={{ textAlign: "right" }}
          selectedTextStyle={{ textAlign: "right" }}
        />
        {errors.cupsPerDay && (
          <Text style={{ color: "red" }}>{errors.cupsPerDay}</Text>
        )}

        <Text>📌 האם שתיית הקפה משפיעה עליך רגשית / פיזית / שניהם?</Text>
        <Dropdown
          style={[styles.dropdown, errors.effects && styles.errorField]}
          data={effectsOptions}
          labelField="label"
          valueField="value"
          placeholder="בחר אופציה מתאימה"
          value={effects}
          onChange={(item) => {
            setEffects(item.value);
            setErrors((prev) => {
              const updated = { ...prev };
              delete updated.effects;
              return updated;
            });
          }}
          placeholderStyle={{ textAlign: "right" }}
          selectedTextStyle={{ textAlign: "right" }}
        />
        {errors.effects && (
          <Text style={{ color: "red" }}>{errors.effects}</Text>
        )}

        <Text>📉 האם אתה מנסה להפחית צריכת קפה?</Text>
        <RadioGroup
          radioButtons={yesNoOptions}
          onPress={(val) => {
            setIsTryingToReduce(val);
            setErrors((prev) => {
              const updated = { ...prev };
              delete updated.isWorking;
              return updated;
            });
          }}
          selectedId={isTryingToReduce}
          layout="row"
        />
        {errors.isTryingToReduce && (
          <Text style={{ color: "red" }}>{errors.isTryingToReduce}</Text>
        )}
        {isTryingToReduce === "yes" && (
          <View>
            <Text>📝 איך אתה מנסה להפחית צריכת קפה?</Text>
            <TextInput
              placeholder="למשל: מחליף לקפה נטול, שותה תה במקום..."
              value={reductionExplanation}
              onChangeText={(text) => {
                setReductionExplanation(text);
                setErrors((prev) => {
                  const updated = { ...prev };
                  delete updated.reductionExplanation;
                  return updated;
                });
              }}
              style={[
                styles.input,
                errors.reductionExplanation && styles.errorField,
              ]}
            />
            {errors.reductionExplanation && (
              <Text style={{ color: "red" }}>
                {errors.reductionExplanation}
              </Text>
            )}
          </View>
        )}
        <Text>📈 כמה חשוב לך לעקוב אחרי הרגלי צריכת הקפה שלך?</Text>
        <Dropdown
          style={[styles.dropdown, errors.importanceLevel && styles.errorField]}
          data={importanceLevels}
          labelField="label"
          valueField="value"
          placeholder="בחר רמת חשיבות"
          value={importanceLevel}
          onChange={(item) => {
            handleImportanceChange(item); // ← כאן צריך לקרוא לפונקציה
            setErrors((prev) => {
              const updated = { ...prev };
              delete updated.importanceLevel;
              return updated;
            });
          }}
          placeholderStyle={{ textAlign: "right" }}
          selectedTextStyle={{ textAlign: "right" }}
        />
        {errors.importanceLevels && (
          <Text style={{ color: "red" }}>{errors.importanceLevels}</Text>
        )}
        <Text>☕ סוגי קפה מועדפים:</Text>
        <MultiSelect
          style={[styles.dropdown, errors.coffeeType && styles.errorField]}
          data={coffeeTypesFromDb}
          labelField="label"
          valueField="value"
          placeholder="בחר סוגי קפה"
          value={coffeeData.coffeeType}
          onChange={(item) => {
            handleInputChange("coffeeType", item);
            setErrors((prev) => {
              const updated = { ...prev };
              delete updated.selfDescription;
              return updated;
            });
          }}
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
        {errors.coffeeType && (
          <Text style={{ color: "red" }}>{errors.coffeeType}</Text>
        )}
        <Text>📏 מה מידת ההגשה המועדפת?</Text>
        <Dropdown
          style={[styles.dropdown, errors.selfDescription && styles.errorField]}
          data={servingSizes}
          labelField="label"
          valueField="value"
          placeholder="בחר סוג הגשה"
          value={coffeeData.servingSize}
          onChange={(item) => {
            handleInputChange("servingSize", item.value);
            setErrors((prev) => {
              const updated = { ...prev };
              delete updated.selfDescription;
              return updated;
            });
          }}
          placeholderStyle={{ textAlign: "right" }}
          selectedTextStyle={{ textAlign: "right" }}
        />
        {errors.servingSize && (
          <Text style={{ color: "red" }}>{errors.servingSize}</Text>
        )}
        <Text>🔍 תבחר/י את המשפט שאת/ה הכי מזדהה איתו:</Text>
        <Dropdown
          style={[styles.dropdown, errors.selfDescription && styles.errorField]}
          data={selfDescriptions}
          labelField="label"
          valueField="value"
          placeholder="בחר תיאור"
          value={selfDescription}
          onChange={(item) => {
            setSelfDescription(item.value);
            setErrors((prev) => {
              const updated = { ...prev };
              delete updated.selfDescription;
              return updated;
            });
          }}
          placeholderStyle={{ textAlign: "right" }}
          selectedTextStyle={{ textAlign: "right" }}
        />
        {errors.selfDescription && (
          <Text style={{ color: "red" }}>{errors.selfDescription}</Text>
        )}
        <View style={styles.buttonGroup}>
          <Button title="סיום" onPress={handleRegister} color="#4CAF50" />
          <Button
            title="חזור"
            onPress={() => {
              resetForm();
              router.push("/coffee");
            }}
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
  errorField: {
    borderColor: "red",
    borderWidth: 1.5,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: "70%",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
  },
  
});

export default CoffeeDetails;
