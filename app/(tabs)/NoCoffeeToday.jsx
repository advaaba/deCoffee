import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
} from "react-native";
import RadioGroup from "react-native-radio-buttons-group";
import { useRouter } from "expo-router";

export default function NoCoffeeToday() {
  const router = useRouter();
  const [feltWithoutCoffee, setFeltWithoutCoffee] = useState("");
  const [consideredDrinking, setConsideredDrinking] = useState(null);
  const [willDrinkLater, setWillDrinkLater] = useState(null);
  const [reasonNotDrinking, setReasonNotDrinking] = useState("");
  const [consciousDecision, setConsciousDecision] = useState(null);
  const [willDrinkTomorrow, setWillDrinkTomorrow] = useState(null);
  const [wantToContinueNoCoffee, setWantToContinueNoCoffee] = useState(null);
  const [consideredDrinkingReason, setConsideredDrinkingReason] = useState("");
  const [willDrinkLaterReason, setWillDrinkLaterReason] = useState("");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const data = {
      feltWithoutCoffee,
      consideredDrinking,
      consideredDrinkingReason,
      willDrinkLater,
      willDrinkLaterReason,
      reasonNotDrinking,
      consciousDecision,
      willDrinkTomorrow,
      wantToContinueNoCoffee,
    };
  
    onDataChange && onDataChange(data);
  }, [feltWithoutCoffee, consideredDrinking, consideredDrinkingReason, willDrinkLater, willDrinkLaterReason, reasonNotDrinking, consciousDecision, willDrinkTomorrow, wantToContinueNoCoffee]);
  
  const yesNoOptions = [
    { id: "yes", label: "כן", value: "yes" },
    { id: "no", label: "לא", value: "no" },
  ];

  const handleContinue = () => {
    console.log(formData);
    router.push({ pathname: "/create", params: formData }); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔵 לא שתית קפה היום – בואי נבין למה</Text>

      <Text style={styles.label}>איך הרגשת בלי קפה?</Text>
      <TextInput
        style={styles.input}
        placeholder="תארי איך הרגשת במהלך היום"
        value={feltWithoutCoffee}
        onChangeText={setFeltWithoutCoffee}
        multiline
      />

      <Text style={styles.label}>האם שקלת לשתות קפה במהלך היום?</Text>
      <RadioGroup
        radioButtons={yesNoOptions}
        onPress={setConsideredDrinking}
        selectedId={consideredDrinking}
        layout="row"
      />
      {consideredDrinking === "yes" && (
        <View>
          <Text style={styles.label}>מה גרם לך לשקול לשתות?</Text>
          <TextInput
            style={styles.input}
            placeholder="כתב/י את הסיבה"
            value={consideredDrinkingReason}
            onChangeText={setConsideredDrinkingReason}
            multiline
          />
        </View>
      )}

      <Text style={styles.label}>האם תשתה קפה עוד היום לדעתך?</Text>
      <RadioGroup
        radioButtons={yesNoOptions}
        onPress={setWillDrinkLater}
        selectedId={willDrinkLater}
        layout="row"
      />
      {willDrinkLater === "yes" && (
        <View>
          <Text style={styles.label}>מדוע לדעתך?</Text>
          <TextInput
            style={styles.input}
            placeholder="כתב/י את הסיבה"
            value={willDrinkLaterReason}
            onChangeText={setWillDrinkLaterReason}
            multiline
          />
        </View>
      )}
      <Text style={styles.label}>האם בחרת במודע לא לשתות קפה?</Text>
      <RadioGroup
        radioButtons={yesNoOptions}
        onPress={setConsciousDecision}
        selectedId={consciousDecision}
        layout="row"
      />

      <Text style={styles.label}>מה הסיבה שלא שתית קפה היום?</Text>
      <TextInput
        style={styles.input}
        placeholder="כתבי את הסיבה"
        value={reasonNotDrinking}
        onChangeText={setReasonNotDrinking}
        multiline
      />

      <Text style={styles.label}>האם לדעתך תשתה קפה מחר?</Text>
      <RadioGroup
        radioButtons={yesNoOptions}
        onPress={setWillDrinkTomorrow}
        selectedId={willDrinkTomorrow}
        layout="row"
      />

      <Text style={styles.label}>
        האם היית רוצה להמשיך בלי קפה גם בימים הבאים?
      </Text>
      <RadioGroup
        radioButtons={yesNoOptions}
        onPress={setWantToContinueNoCoffee}
        selectedId={wantToContinueNoCoffee}
        layout="row"
      />
      <Button title="שליחה" color="#4CAF50" onPress={handleContinue} />
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
