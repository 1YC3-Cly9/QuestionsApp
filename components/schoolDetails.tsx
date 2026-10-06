import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { schoolDetailsStyles as styles } from '../styles/featureStyles';

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

