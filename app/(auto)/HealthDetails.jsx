import React, { useMemo, useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useLocalSearchParams, useRouter } from "expo-router";
import RadioGroup from "react-native-radio-buttons-group";

const HealthDetailsScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const days = Array.from({ length: 31 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));
  const months = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));
  const years = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: `${year}`, value: year };
  });

  const weights = Array.from({ length: 171 }, (_, i) => ({
    label: `${i + 30} ק"ג`,
    value: i + 30,
  }));
  const heights = Array.from({ length: 121 }, (_, i) => ({
    label: `${i + 100} ס"מ`,
    value: i + 100,
  }));

  const genders = [
    { label: "זכר", value: "Male" },
    { label: "נקבה", value: "Female" },
    { label: "אחר", value: "Other" },
  ];

  const healthConditions = [
    { label: "בריא בדרך כלל", value: "Healthy" },
    { label: "סוכרת", value: "Diabetes" },
    { label: "לחץ דם גבוה", value: "High Blood Pressure" },
    { label: "אלרגיות", value: "Allergies" },
    { label: "אחר", value: "Other" },
  ];

  const activityLevels = [
    { label: "לא פעיל", value: "Sedentary" },
    { label: "פעילות קלה", value: "Light" },
    { label: "פעילות בינונית", value: "Moderate" },
    { label: "פעילות גבוהה", value: "High" },
  ];

  const dietaryPreferences = [
    { label: "רגיל", value: "Normal" },
    { label: "צמחוני", value: "Vegetarian" },
    { label: "טבעוני", value: "Vegan" },
    { label: "כשר", value: "Kosher" },
  ];

  const radioButtons = useMemo(
    () => [
      {
        id: "yes",
        label: "כן",
        value: "yes",
      },
      {
        id: "no",
        label: "לא",
        value: "no",
      },
    ],
    []
  );

  const [selectedId, setSelectedId] = useState();

  const [healthData, setHealthData] = useState({
    birthDay: null,
    birthMonth: null,
    birthYear: null,
    age: null,
    weight: null,
    height: null,
    gender: null,
    healthCondition: null,
    activityLevel: null,
    dietaryPreferences: null,
    registrationDate: new Date().toISOString().split("T")[0],
    ...params,
  });

  const calculateAge = (year, month, day) => {
    if (!year || !month || !day) return null;
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleInputChange = (key, value) => {
    const newHealthData = { ...healthData, [key]: value };
    if (
      newHealthData.birthDay &&
      newHealthData.birthMonth &&
      newHealthData.birthYear
    ) {
      newHealthData.age = calculateAge(
        newHealthData.birthYear,
        newHealthData.birthMonth,
        newHealthData.birthDay
      );
    }
    setHealthData(newHealthData);
  };

  const handleContinue = () => {
    router.push({
      pathname: "/CoffeeDetails",
      params: { ...healthData, pregnant: healthData.gender === "Female" ? selectedId : null },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>פרטים אישיים</Text>
        <View style={styles.dateContainer}>
          <Dropdown
            style={styles.dropdownBirth}
            data={days}
            labelField="label"
            valueField="value"
            placeholder="יום"
            value={healthData.birthDay}
            onChange={(item) => handleInputChange("birthDay", item.value)}
          />
          <Dropdown
            style={styles.dropdownBirth}
            data={months}
            labelField="label"
            valueField="value"
            placeholder="חודש"
            value={healthData.birthMonth}
            onChange={(item) => handleInputChange("birthMonth", item.value)}
          />
          <Dropdown
            style={styles.dropdownBirth}
            data={years}
            labelField="label"
            valueField="value"
            placeholder="שנה"
            value={healthData.birthYear}
            onChange={(item) => handleInputChange("birthYear", item.value)}
          />
        </View>

        <Dropdown
          style={styles.dropdown}
          data={weights}
          labelField="label"
          valueField="value"
          placeholder={'משקל (ק"ג)'}
          value={healthData.weight}
          onChange={(item) => handleInputChange("weight", item.value)}
        />

        <Dropdown
          style={styles.dropdown}
          data={heights}
          labelField="label"
          valueField="value"
          placeholder={'גובה (ס"מ)'}
          value={healthData.height}
          onChange={(item) => handleInputChange("height", item.value)}
        />

        <Dropdown
          style={styles.dropdown}
          data={genders}
          labelField="label"
          valueField="value"
          placeholder="מין"
          value={healthData.gender}
          onChange={(item) => handleInputChange("gender", item.value)}
        />

        {healthData.gender === "Female" && (
          <View style={styles.pregnancyContainer}>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={setSelectedId}
              selectedId={selectedId}
              layout="row"
            />
            <Text style={styles.pregnancyText}>האם את בהיריון?</Text>
          </View>
        )}

        <Dropdown
          style={styles.dropdown}
          data={healthConditions}
          labelField="label"
          valueField="value"
          placeholder="מצב בריאותי"
          value={healthData.healthCondition}
          onChange={(item) => handleInputChange("healthCondition", item.value)}
        />
        <Dropdown
          style={styles.dropdown}
          data={activityLevels}
          labelField="label"
          valueField="value"
          placeholder="רמת פעילות"
          value={healthData.activityLevel}
          onChange={(item) => handleInputChange("activityLevel", item.value)}
        />
        <Dropdown
          style={styles.dropdown}
          data={dietaryPreferences}
          labelField="label"
          valueField="value"
          placeholder="העדפות תזונתיות"
          value={healthData.dietaryPreferences}
          onChange={(item) =>
            handleInputChange("dietaryPreferences", item.value)
          }
        />

        <Button title="המשך" onPress={handleContinue} color="#4CAF50" />
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
  dropdownBirth: {
    width: "30%",
    marginBottom: 15,
    borderBottomWidth: 1,
    paddingHorizontal: 5,
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    textAlign: "right",
  },
  dateContainer: { flexDirection: "row", justifyContent: "space-between" },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
    textAlign: "right",
  },
  pregnancyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  pregnancyText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default HealthDetailsScreen;
