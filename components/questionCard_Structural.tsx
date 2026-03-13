import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cardStyles as styles } from '../styles/cardStyles';

interface Question {
  id: string;
  question: string;
  subQuestions?: string[];
}

interface StructuralProps {
  item: Question;
  displayIndex: number;
  onDelete: (id: string) => void;
  onUpdate: (updatedQ: Question) => void;
}

export default function QuestionCard_Structural({ item, displayIndex, onDelete, onUpdate }: StructuralProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.question);
  const [editedSubs, setEditedSubs] = useState(item.subQuestions || []);

  const handleSave = () => {
    onUpdate({ ...item, question: editedText, subQuestions: editedSubs });
    setIsEditing(false);
  };

  const addSub = () => setEditedSubs([...editedSubs, '']);
  const removeSub = (index: number) => setEditedSubs(editedSubs.filter((_, i) => i !== index));

  const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.qType}>Section B: Question {displayIndex}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => (isEditing ? handleSave() : setIsEditing(true))} style={{ marginRight: 15 }}>
            <Ionicons 
              name={isEditing ? "checkmark-circle" : "create-outline"} 
              size={22} 
              color={isEditing ? "#2ecc71" : "#f39c12"} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Ionicons name="trash-outline" size={22} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>

      {isEditing ? (
        <View>
          <Text style={styles.label}>MAIN QUESTION</Text>
          <TextInput style={styles.input} value={editedText} onChangeText={setEditedText} multiline />
          <Text style={styles.label}>SUB-QUESTIONS</Text>
          {editedSubs.map((sub, i) => (
            <View key={i} style={styles.editRow}>
              <Text style={styles.romanLabel}>{romanNumerals[i] || i + 1}.</Text>
              <TextInput 
                style={styles.optInput} 
                value={sub} 
                onChangeText={(t) => {
                  const newSubs = [...editedSubs];
                  newSubs[i] = t;
                  setEditedSubs(newSubs);
                }} 
                multiline
              />
              <TouchableOpacity onPress={() => removeSub(i)}>
                <Ionicons name="remove-circle" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addBtn} onPress={addSub}>
            <Ionicons name="add-circle" size={20} color="#27ae60" />
            <Text style={styles.addText}>Add Sub-part</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.viewContainer}>
          <Text style={styles.mainQuestionText}>{item.question}</Text>
          {item.subQuestions && item.subQuestions.length > 0 && (
            <View style={styles.subListContainer}>
              {item.subQuestions.map((sub, i) => (
                <View key={i} style={styles.subRow}>
                  <Text style={styles.subRoman}>({romanNumerals[i] || i + 1})</Text>
                  <View style={styles.textWrapper}>
                    <Text style={styles.subQuestionText}>{sub}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}