import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Question } from '../services/aiService';

interface MCQProps {
  item: Question;
  displayIndex: number;
  onDelete: (id: string) => void;
  onUpdate: (updatedQ: Question) => void;
}

export default function QuestionCard_MCQs({ item, displayIndex, onDelete, onUpdate }: MCQProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.question);
  // Ensure we have a valid array of strings
  const [editedOptions, setEditedOptions] = useState<string[]>(item.options || []);

  const handleSave = () => {
    onUpdate({ 
      ...item, 
      question: editedText, 
      options: editedOptions 
    });
    setIsEditing(false);
  };

  const updateOptionText = (text: string, index: number) => {
    const newOptions = [...editedOptions];
    newOptions[index] = text;
    setEditedOptions(newOptions);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.qType}>Question {displayIndex} (MCQ)</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))} 
            style={styles.iconBtn}
          >
            <Ionicons 
              name={isEditing ? "checkmark-circle" : "create-outline"} 
              size={22} 
              color={isEditing ? "#2ecc71" : "#3498db"} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Ionicons name="trash-outline" size={22} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>

      {isEditing ? (
        <View style={styles.editForm}>
          <Text style={styles.label}>Question Text:</Text>
          <TextInput 
            style={styles.input} 
            value={editedText} 
            onChangeText={setEditedText} 
            multiline 
          />
          
          <Text style={styles.label}>Options:</Text>
          {editedOptions.map((opt, i) => (
            <View key={i} style={styles.optionEditRow}>
              <Text style={styles.optionLabel}>{String.fromCharCode(65 + i)})</Text>
              <TextInput 
                style={styles.optInput} 
                value={opt.replace(/^[A-Z][\).]\s*/i, "")} // Strip A) while editing
                onChangeText={(t) => updateOptionText(t, i)} 
              />
            </View>
          ))}
        </View>
      ) : (
        <View>
          <Text style={styles.questionText}>{item.question}</Text>
          <View style={styles.optionsList}>
            {editedOptions.map((opt, i) => (
              <Text key={i} style={styles.optionText}>
                <Text style={styles.boldLabel}>{String.fromCharCode(65 + i)})</Text> {opt.replace(/^[A-Z][\).]\s*/i, "")}
              </Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#007bff', elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  actionButtons: { flexDirection: 'row' },
  iconBtn: { marginRight: 15 },
  qType: { fontSize: 10, fontWeight: 'bold', color: '#007bff', textTransform: 'uppercase' },
  questionText: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  label: { fontSize: 10, color: '#999', marginBottom: 5, marginTop: 10, fontWeight: 'bold' },
  input: { borderBottomWidth: 1, borderBottomColor: '#3498db', paddingVertical: 5, fontSize: 16, color: '#2c3e50' },
  optionEditRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  optionLabel: { fontWeight: 'bold', marginRight: 10, color: '#3498db' },
  optInput: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 3, fontSize: 14 },
  optionsList: { marginTop: 5 },
  optionText: { fontSize: 14, color: '#555', marginBottom: 5 },
  boldLabel: { fontWeight: 'bold', color: '#333' },
  editForm: { paddingBottom: 10 }
});