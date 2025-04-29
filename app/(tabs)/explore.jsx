// ExploreScreen.jsx
import React from "react";
import { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import RadioGroup from "react-native-radio-buttons-group";

export default function ExploreScreen() {
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [relevanceAnswer, setRelevanceAnswer] = useState(null);
  const [appliedAnswer, setAppliedAnswer] = useState(null);
  
  const yesNoMaybeOptions = [
    { id: "yes", label: "כן", value: "yes" },
    { id: "no", label: "לא", value: "no" },
    { id: "don't know", label: "לא יודע/ת", value: "don't know" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 תובנות:</Text>
      {insights.map((text, idx) => (
        <Text key={idx}>• {text}</Text>
      ))}

      <Text style={styles.title}>🎯 המלצות:</Text>
      {recommendations.map((text, idx) => (
        <Text key={idx}>• {text}</Text>
      ))}
      <Text style={styles.label}>האם ההמלצה רלוונטית עבורך?</Text>
      <RadioGroup
        radioButtons={yesNoMaybeOptions}
        onPress={setRelevanceAnswer}
        selectedId={relevanceAnswer}
        layout="row"
      />
      <Text style={styles.label}>האם יישמת את ההמלצה?</Text>
      <RadioGroup
        radioButtons={yesNoMaybeOptions}
        onPress={setAppliedAnswer}
        selectedId={appliedAnswer}
        layout="row"
      />
      <Text style={styles.text}>היסטוריית תובנות & המלצות</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // backgroundColor: "#fff",
    minHeight: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    // color: "#ffc8dd",
    textAlign: "center",
  },
  text: {
    // color: "white",
    marginBottom: 10,
    fontSize: 20,
    textAlign: "center"
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    textAlign: "right"
  },
});
