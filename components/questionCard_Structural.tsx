// components/QuestionCard_Structural.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cardStyles as styles } from '../styles/cardStyles';
import { MathRenderer } from './mathRenderer';

export default function QuestionCard_Structural({ item, displayIndex, onDelete, onUpdate }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.question || "");
  const [editedSubs, setEditedSubs] = useState(item.subQuestions || []);

  const handleSave = () => {
    onUpdate({ ...item, question: editedText, subQuestions: editedSubs });
    setIsEditing(false);
  };

  const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.qType}>QUESTION {displayIndex}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => (isEditing ? handleSave() : setIsEditing(true))} style={{ marginRight: 15 }}>
            <Ionicons name={isEditing ? "checkmark-circle" : "create-outline"} size={22} color={isEditing ? "#2ecc71" : "#f39c12"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Ionicons name="trash-outline" size={22} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>

      {isEditing ? (
        <View>
          <TextInput 
            style={styles.input} 
            value={editedText} 
            onChangeText={setEditedText} 
            multiline 
          />
          {editedSubs.map((sub: string, i: number) => (
            <TextInput 
              key={i} 
              style={styles.optInput} 
              value={sub} 
              onChangeText={(t) => {
                const newSubs = [...editedSubs];
                newSubs[i] = t;
                setEditedSubs(newSubs);
              }}
              multiline
            />
          ))}
        </View>
      ) : (
        <View style={styles.viewContainer}>
          {/* SAFE RENDER: Passing content string directly */}
          <MathRenderer content={item.question} />
          
          <View style={{ marginTop: 10 }}>
            {item.subQuestions?.map((sub: string, i: number) => (
              <View key={i} style={styles.subRow}>
                <Text style={styles.subRoman}>({romanNumerals[i] || i + 1})</Text>
                <View style={styles.textWrapper}>
                  <MathRenderer content={sub} />
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}