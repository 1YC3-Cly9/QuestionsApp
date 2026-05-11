// components/QuestionCard_Structural.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cardStyles as styles } from '../styles/cardStyles';
import { MathRenderer } from './mathRenderer';

export default function QuestionCard_Structural({ item, displayIndex, onDelete, onUpdate }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item?.question || "");
  const [editedSubs, setEditedSubs] = useState(item?.subQuestions || []);

  const handleSave = useCallback(() => {
    onUpdate({ ...item, question: editedText, subQuestions: editedSubs });
    setIsEditing(false);
  }, [item, editedText, editedSubs, onUpdate]);

  const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

  return (
    <View style={styles.card}>
      {/* Header Panel */}
      <View style={styles.header}>
        <Text style={styles.qType}>QUESTION {displayIndex}</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity 
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))} 
            style={{ marginRight: 15 }}
          >
            <Ionicons 
              name={isEditing ? "checkmark-circle" : "create-outline"} 
              size={22} 
              color={isEditing ? "#2ecc71" : "#f39c12"} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(item?.id)}>
            <Ionicons name="trash-outline" size={22} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>

      {isEditing ? (
        <View style={{ padding: 10 }}>
          <TextInput 
            style={styles.input} 
            value={editedText} 
            onChangeText={setEditedText} 
            multiline 
          />
          {Array.isArray(editedSubs) && editedSubs.map((sub: any, i: number) => {
            const displaySub = (sub !== null && sub !== undefined) ? String(sub) : "";
            return (
              <View key={`edit-${item?.id || i}-${i}`} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ width: 30, fontWeight: 'bold', color: '#2c3e50' }}>{romanNumerals[i]}.</Text>
                <TextInput 
                  style={[styles.optInput, { flex: 1 }]} 
                  value={displaySub} 
                  onChangeText={(t) => {
                    const newSubs = [...editedSubs];
                    newSubs[i] = t;
                    setEditedSubs(newSubs);
                  }}
                  multiline
                />
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.viewContainer}>
          {/* Main Question Display (Handles text, inline math, and scrollable tables) */}
          <MathRenderer content={item?.question} key={`main-${item?.id || 'default'}`} />
          
          {/* Sub-Questions Map Display */}
          {item?.subQuestions && Array.isArray(item.subQuestions) && item.subQuestions.length > 0 && (
            <View style={{ marginTop: 10 }}>
              {item.subQuestions.map((sub: any, i: number) => {
                if (sub === null || sub === undefined || typeof sub !== 'string' || sub.trim() === "") return null;
                return (
                  <View key={`subrow-${item?.id || i}-${i}`} style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' }}>
                    <Text style={[styles.subRoman, { width: 35, fontWeight: 'bold', color: '#34495e' }]}>
                      ({romanNumerals[i]})
                    </Text>
                    <View style={{ flex: 1 }}>
                      <MathRenderer content={sub} key={`submath-${item?.id || i}-${i}`} />
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
}