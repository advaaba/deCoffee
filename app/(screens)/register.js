import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Modal, TouchableOpacity, Platform } from 'react-native';

const SERVER_URL = 'http://192.168.137.223:5000/api/auth/register';


const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // פונקציה להציג הודעה ב-Modal במקום Alert
  const showAlert = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  // פונקציה לשליחת הנתונים לשרת
  const handleRegister = async () => {
    if (!name || !email || !password) {
        showAlert('❌ אנא מלאי את כל השדות לפני ההרשמה.');
        return;
    }

    const userData = { name, email, password };
    console.log('📤 שולחת נתונים לשרת:', userData);

    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const result = await response.json();
        console.log('📥 תגובה מהשרת:', result);

        if (response.status === 201) {
            showAlert('✅ המשתמש נרשם בהצלחה!');
            setName('');
            setEmail('');
            setPassword('');
        } else if (response.status === 400) {
            showAlert('⚠ המשתמש כבר קיים במערכת.');
        } else {
            showAlert('❌ אירעה תקלה בהרשמה, אנא נסי שוב.');
        }

    } catch (error) {
        console.error('❌ שגיאה בשליחה לשרת:', error);
        showAlert('❌ לא הצלחנו לבצע את ההרשמה. נסי שוב.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>הרשמה</Text>
      
      <TextInput
        style={styles.input}
        placeholder="שם מלא"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="דואל"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button title="הירשם" onPress={handleRegister} />

      {/* מודאל להודעות במקום Alert */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default RegisterScreen;
