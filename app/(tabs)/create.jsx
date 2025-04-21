import React, { useState, useMemo, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import RadioGroup from "react-native-radio-buttons-group";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import YesCoffeeToday from "./YesCoffeeToday";
import NoCoffeeToday from "./NoCoffeeToday";

export default function Create() {
  const [sleepFromHour, setSleepFromHour] = useState(null);
  const [sleepToHour, setSleepToHour] = useState(null);

  const [mood, setMood] = useState(null);
  const [focusLevel, setFocusLevel] = useState(null);
  const [tirednessLevel, setTirednessLevel] = useState(null);
  const [isDrinking, setIsDrinking] = useState(null);
  const ratingOptions = [
    { label: "נמוך", value: 1 },
    { label: "בינוני", value: 2 },
    { label: "גבוה", value: 3 },
  ];

  const hoursOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = (i % 2) * 30;
    return {
      label: `${hour.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`,
      value: hour + minutes / 60,
    };
  });

  const [radioButtons, setRadioButtons] = useState([
    { id: "yes", label: "כן", value: "yes" },
    { id: "no", label: "לא", value: "no" },
  ]);

  const calculateDuration = (start, end) => {
    if (start == null || end == null) return 0;
    return end >= start ? end - start : 24 - start + end;
  };

  const sleepDurationAverage = useMemo(
    () => calculateDuration(sleepFromHour, sleepToHour),
    [sleepFromHour, sleepToHour]
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>סקירת הקפה היומי</Text>
        <Text>כמה שעות ישנת היום?</Text>
        <View style={styles.sleepTimeRow}>
          <Dropdown
            style={[styles.dropdown, styles.sleepDropdown]}
            data={hoursOptions}
            labelField="label"
            valueField="value"
            placeholder="עד שעה"
            value={sleepToHour}
            onChange={(item) => {
              setSleepToHour(item.value);
            }}
            placeholderStyle={styles.placeholderText}
            selectedTextStyle={styles.selectedText}
          />
          <Dropdown
            style={[styles.dropdown, styles.sleepDropdown]}
            data={hoursOptions}
            labelField="label"
            valueField="value"
            placeholder="משעה"
            value={sleepFromHour}
            onChange={(item) => {
              setSleepFromHour(item.value);
            }}
            placeholderStyle={styles.placeholderText}
            selectedTextStyle={styles.selectedText}
          />
        </View>
        <Text style={styles.label}>מה מצב הרוח שלך היום?</Text>
        <Dropdown
          style={styles.dropdown}
          data={ratingOptions}
          labelField="label"
          valueField="value"
          placeholder="בחרי מצב רוח"
          value={mood}
          onChange={(item) => setMood(item.value)}
          placeholderStyle={styles.placeholderText}
          selectedTextStyle={styles.selectedText}
        />
        <Text style={styles.label}>מה רמת הריכוז שלך היום?</Text>
        <Dropdown
          style={styles.dropdown}
          data={ratingOptions}
          labelField="label"
          valueField="value"
          placeholder="בחרי רמת ריכוז"
          value={focusLevel}
          onChange={(item) => setFocusLevel(item.value)}
          placeholderStyle={styles.placeholderText}
          selectedTextStyle={styles.selectedText}
        />

        <Text style={styles.label}>מה רמת העייפות שלך היום?</Text>
        <Dropdown
          style={styles.dropdown}
          data={ratingOptions}
          labelField="label"
          valueField="value"
          placeholder="בחרי רמת עייפות"
          value={tirednessLevel}
          onChange={(item) => setTirednessLevel(item.value)}
          placeholderStyle={styles.placeholderText}
          selectedTextStyle={styles.selectedText}
        />
        <Text>האם שתית קפה היום?</Text>
        <RadioGroup
          radioButtons={radioButtons}
          onPress={(selectedId) => {
            setIsDrinking(selectedId);
          }}
          selectedId={isDrinking}
          layout="row"
        />
        {isDrinking === "yes" && <YesCoffeeToday />}
        {isDrinking === "no" && <NoCoffeeToday />}
        <Button
          title="שליחה"
          color="#4CAF50"
          onPress={() => {
            // פעולה שתבצעי כשמשתמשת לוחצת (לדוגמה שמירה או מעבר)
            console.log("התחלת מעקב יומי");
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingBottom: 20 },
  container: {
    flex: 1,
    alignItems: "flex-start",
    padding: 20,
    gap: 8,
    flexDirection: "column",
    alignItems: "stretch",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  button: {
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  sleepDropdown: {
    flex: 1,
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
  sleepTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 15,
  },
  placeholderText: {
    textAlign: "right",
    color: "#999",
  },
  selectedText: {
    textAlign: "right",
    color: "#333",
  },
});
