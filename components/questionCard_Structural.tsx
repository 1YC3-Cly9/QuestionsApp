// components/QuestionCard_Structural.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Question } from '../services/aiService';
import { MathRenderer } from './mathRenderer';

interface StructuralProps {
  item: Question;
  displayIndex: number;
  onDelete: (id: string) => void;
  onUpdate: (updatedQ: Question) => void;
}

export default function QuestionCard_Structural({ item, displayIndex, onDelete, onUpdate }: StructuralProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item?.question || "");
  const [editedSubs, setEditedSubs] = useState(item?.subQuestions || []);

  const handleSave = useCallback(() => {
    onUpdate({ ...item, question: editedText, subQuestions: editedSubs });
    setIsEditing(false);
  }, [item, editedText, editedSubs, onUpdate]); 

  // Sync state if item changes (Fixes Stale State Bug)
  useEffect(() => {
    setEditedText(item?.question || "");
    setEditedSubs(item?.subQuestions || []);
  }, [item]);

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
            // Extract text from object or fallback to string representation
            const displaySub = typeof sub === 'object' ? (sub.question || sub.text || JSON.stringify(sub)) : String(sub || "");
            return (
              <View key={`edit-${item?.id || i}-${i}`} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ width: 30, fontWeight: 'bold', color: '#2c3e50' }}>{romanNumerals[i] || i + 1}.</Text>
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
                // Extract content string before rendering
                const subContent = typeof sub === 'object' ? (sub.question || sub.text || JSON.stringify(sub)) : String(sub || "");
                if (!subContent || subContent.trim() === "") return null;
                
                return (
                  <View key={`subrow-${item?.id || i}-${i}`} style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' }}>
                    <Text style={[styles.subRoman, { width: 35, fontWeight: 'bold', color: '#34495e' }]}>
                      ({romanNumerals[i] || i + 1})
                    </Text>
                    <View style={styles.mathWrapper}>
                      <MathRenderer content={subContent} key={`submath-${item?.id || i}-${i}`} />
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

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#f39c12', elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  qType: { fontSize: 10, fontWeight: 'bold', color: '#e67e22', textTransform: 'uppercase' },
  input: { borderBottomWidth: 1, borderBottomColor: '#f39c12', paddingVertical: 5, fontSize: 16, color: '#2c3e50', marginBottom: 10 },
  optInput: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 3, fontSize: 14, marginBottom: 8 },
  viewContainer: { 
    paddingVertical: 5,
    flexDirection: 'column'
  },
  subRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 8
  },
  subRoman: { marginRight: 5, fontSize: 14, color: '#555' },
  mathWrapper: { 
    flex: 1, 
    minHeight: 30, // Increased baseline
    alignSelf: 'stretch' 
  },
});