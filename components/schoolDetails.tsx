import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SchoolDetailsProps {
  data: {
    schoolName: string;
    className: string;
    date: string;
    totalMarks: string;
    logoUri: string;
  };
  setters: {
    setSchoolName: (text: string) => void;
    setClassName: (text: string) => void;
    setDate: (text: string) => void;
    setTotalMarks: (text: string) => void;
  };
  onPickImage: () => void;
}

export default function SchoolDetails({ data, setters, onPickImage }: SchoolDetailsProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dateValue = data.date ? new Date(`${data.date}T00:00:00`) : new Date();

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type === 'dismissed' || !selectedDate) return;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    setters.setDate(`${year}-${month}-${day}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Institutional Information</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="School Name" 
        value={data.schoolName} 
        onChangeText={setters.setSchoolName} 
      />
      
      <View style={styles.row}>
        <TextInput 
          style={[styles.input, { flex: 1, marginRight: 10 }]} 
          placeholder="Class" 
          value={data.className} 
          onChangeText={setters.setClassName} 
        />
        <TouchableOpacity style={[styles.input, styles.dateInput, { flex: 1, marginRight: 10 }]} onPress={() => setShowDatePicker(true)}>
          <Text style={data.date ? styles.dateText : styles.placeholderText}>{data.date || 'Date'}</Text>
        </TouchableOpacity>
        <TextInput 
          style={[styles.input, { width: 80 }]} 
          placeholder="Marks" 
          value={data.totalMarks} 
          onChangeText={setters.setTotalMarks}
          keyboardType="numeric"
        />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity style={styles.logoBtn} onPress={onPickImage}>
        <Text style={styles.logoBtnText}>
          {data.logoUri ? "✓ Logo Selected" : "+ Upload School Logo"}
        </Text>
      </TouchableOpacity>

      {data.logoUri !== '' && (
        <Image source={{ uri: data.logoUri }} style={styles.preview} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#007bff', marginBottom: 10 },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  dateInput: { justifyContent: 'center' },
  dateText: { color: '#222' },
  placeholderText: { color: '#999' },
  row: { flexDirection: 'row' },
  logoBtn: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' },
  logoBtnText: { color: '#666', fontSize: 13 },
  preview: { width: 50, height: 50, alignSelf: 'center', marginTop: 10, borderRadius: 5 }
});