import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cardStyles as styles } from '../styles/cardStyles';

interface Question {
  id: string;
  question: string;
  subQuestions?: any[]; // Changed to any[] temporarily to handle potential object data
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
  
  // Normalize subQuestions to strings immediately for the editor
  const [editedSubs, setEditedSubs] = useState<string[]>([]);

  useEffect(() => {
    if (item.subQuestions) {
      const normalized = item.subQuestions.map(sub => 
        typeof sub === 'object' && sub !== null ? (sub.question || JSON.stringify(sub)) : String(sub)
      );
      setEditedSubs(normalized);
    }
  }, [item.subQuestions]);

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
                    <Text style={styles.subQuestionText}>
                      {/* FIX: Check if sub is an object before rendering to prevent React crash */}
                      {typeof sub === 'object' && sub !== null ? sub.question : sub}
                    </Text>
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