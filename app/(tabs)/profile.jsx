import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          Alert.alert("שגיאה", "לא נמצאו נתוני משתמש");
          return;
        }
        const response = await axios.get(
          `http://localhost:5000/api/auth/get-user/${userId}`
        );
        if (response.data.success) {
          setUser(response.data.user);
          setEditedUser(response.data.user); // למצב עריכה
        } else {
          Alert.alert("שגיאה", "לא ניתן לטעון את פרטי המשתמש");
        }
      } catch (err) {
        console.error("❌ שגיאה בשליפת נתונים:", err);
        Alert.alert("שגיאה", "בעיה בטעינת נתונים מהשרת");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFieldChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleEditToggle = async () => {
    if (editMode) {
      try {
        await axios.put(
          `http://localhost:5000/api/auth/update-user/${editedUser.userId}`,
          editedUser
        );

        setUser(editedUser);
        Alert.alert("🎉", "הפרטים עודכנו בהצלחה במסד הנתונים");
      } catch (err) {
        Alert.alert("שגיאה", "עדכון נכשל");
        console.error(err);
      }
    }
    setEditMode(!editMode);
  };

  if (loading) return <ActivityIndicator size="large" color="#06b6d4" />;
  if (!user) return <Text style={styles.text}>לא נמצאו נתוני משתמש.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 פרופיל אישי</Text>

      <View style={styles.card}>
        <InfoRow
          label="שם פרטי"
          value={editedUser.firstName}
          field="firstName"
          editMode={editMode}
          onChange={handleFieldChange}
        />
        <InfoRow
          label="שם משפחה"
          value={editedUser.lastName}
          field="lastName"
          editMode={editMode}
          onChange={handleFieldChange}
        />
        <InfoRow
          label='דוא"ל'
          value={editedUser.email}
          field="email"
          editMode={editMode}
          onChange={handleFieldChange}
        />
        <InfoRow
          label="טלפון"
          value={editedUser.phoneNumber}
          field="phoneNumber"
          editMode={editMode}
          onChange={handleFieldChange}
        />
        <InfoRow
          label="גיל"
          value={editedUser.age?.toString()}
          field="age"
          editMode={editMode}
          onChange={handleFieldChange}
        />
        <InfoRow
          label="תאריך יום הולדת"
          value={formatDate(editedUser.birthDate)}
          field="birthDate"
          editMode={false} // לא נערוך תאריך בלייב – רק תצוגה
        />
        <InfoRow
          label="משקל"
          value={editedUser.weight?.toString()}
          field="weight"
          editMode={editMode}
          onChange={handleFieldChange}
        />
        <InfoRow
          label="גובה"
          value={editedUser.height?.toString()}
          field="height"
          editMode={editMode}
          onChange={handleFieldChange}
        />
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={handleEditToggle}>
        <Text style={styles.updateText}>
          {editMode ? "💾 שמור שינויים" : "✏️ עדכון פרטים"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const InfoRow = ({ label, value, field, editMode, onChange }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}:</Text>
    {editMode ? (
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => onChange(field, text)}
        placeholder={`הכנס ${label}`}
      />
    ) : (
      <Text style={styles.value}>{value}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    minHeight: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0f172a",
  },
  card: {
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  row: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: "#0f172a",
  },
  updateButton: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 20,
  },
  updateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
