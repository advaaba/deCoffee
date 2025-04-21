import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import RadioGroup from "react-native-radio-buttons-group";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";

export default function YesCoffeeToday() {
  const yesNoOptions = [
    { id: "yes", label: "כן", value: "yes" },
    { id: "no", label: "לא", value: "no" },
  ];

  const coffeeConsumption = Array.from({ length: 11 }, (_, i) => ({
    label: `כוסות ${i}`,
    value: i,
  }));

  const timesPerDay = [
    { label: "בוקר", value: "Morning" },
    { label: "צהריים", value: "Afternoon" },
    { label: "ערב", value: "evening" },
    { label: "לילה", value: "night" },
  ];

  const [cups, setCups] = useState("");
  const [coffeeType, setCoffeeType] = useState("");
  const [timesDrank, setTimesDrank] = useState("");
  const [reason, setReason] = useState("");
  const [feltEffect, setFeltEffect] = useState(null);
  const [specialNeed, setSpecialNeed] = useState(null);
  const [consideredReducing, setConsideredReducing] = useState(null);
  const [wantToReduceTomorrow, setWantToReduceTomorrow] = useState(null);
  const [consumptionTime, setConsumptionTime] = useState([]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        🟢 שתית קפה היום – מעולה! נרשום את הנתונים
      </Text>

      <Text style={styles.label}>כמה כוסות קפה שתית היום?</Text>
      <Dropdown
        style={styles.dropdown}
        data={coffeeConsumption}
        labelField="label"
        valueField="value"
        placeholder="בחר כמות"
        value={cups}
        onChange={(item) => setCups(item.value)}
        placeholderStyle={{ textAlign: "right" }}
        selectedTextStyle={{ textAlign: "right" }}
      />

      <Text style={styles.label}>איזה סוג קפה שתית?</Text>
      <TextInput
        style={styles.input}
        value={coffeeType}
        onChangeText={setCoffeeType}
        placeholder="לדוג' אספרסו, נס, מקיאטו..."
      />

      <Text style={styles.label}>באילו שעות שתית קפה?</Text>

      <MultiSelect
        style={styles.dropdown}
        data={timesPerDay}
        labelField="label"
        valueField="value"
        placeholder="בחר זמן"
        value={consumptionTime}
        onChange={setConsumptionTime}
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

      <Text style={styles.label}>מה הסיבה ששתית קפה היום?</Text>
      <TextInput
        style={styles.input}
        value={reason}
        onChangeText={setReason}
        placeholder="ריכוז, הרגל, עייפות, מצב רוח וכו'"
        multiline
      />

      <Text style={styles.label}>האם הרגשת את השפעת הקפה לסיבה?</Text>
      <RadioGroup
        radioButtons={yesNoOptions}
        onPress={setFeltEffect}
        selectedId={feltEffect}
        layout="row"
      />

      <Text style={styles.label}>
        האם הרגשת צורך מיוחד בקפה היום לעומת ימים רגילים?
      </Text>
      <RadioGroup
        radioButtons={yesNoOptions}
        onPress={setSpecialNeed}
        selectedId={specialNeed}
        layout="row"
      />

      <Text style={styles.label}>האם שקלת להפחית את צריכת הקפה היום?</Text>
      <RadioGroup
        radioButtons={yesNoOptions}
        onPress={setConsideredReducing}
        selectedId={consideredReducing}
        layout="row"
      />

      <Text style={styles.label}>האם תרצה לשתות קפה פחות מחר?</Text>
      <RadioGroup
        radioButtons={yesNoOptions}
        onPress={setWantToReduceTomorrow}
        selectedId={wantToReduceTomorrow}
        layout="row"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
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
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
    width: "100%",
  },
});
