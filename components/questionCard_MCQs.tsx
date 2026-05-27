import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Question } from '../services/aiService';
import { MathRenderer } from './mathRenderer';
import { UndoButton } from './undoButton';

interface MCQProps {
  item: Question;
  displayIndex: number;
  onDelete: (id: string) => void;
  onUpdate: (updatedQ: Question) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  totalQuestions?: number;
}

export default function QuestionCard_MCQs({ item, displayIndex, onDelete, onUpdate, onMoveUp, onMoveDown, totalQuestions }: MCQProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item?.question || "");
  // Ensure we have a valid array of strings
  const [editedOptions, setEditedOptions] = useState<string[]>(item?.options || []);
  const [history, setHistory] = useState<Question[]>([]);

  // Multi-step dirty logic
  const isDirty = useMemo(() => {
    if (isEditing) {
      return (editedText || "").trim() !== (item?.question || "").trim() || 
             JSON.stringify(editedOptions) !== JSON.stringify(item?.options || []) ||
             history.length > 0;
    }
    return history.length > 0;
  }, [isEditing, editedText, editedOptions, item?.question, item?.options, history]);

  // Sync state if item changes (Fixes Stale State Bug)
  useEffect(() => {
    setEditedText(item?.question || "");
    setEditedOptions(item?.options || []);
  }, [item]);

  const handleSave = useCallback(() => {
    // Add current saved item to history before updating with new edits
    if ((editedText || "").trim() !== (item?.question || "").trim() || JSON.stringify(editedOptions) !== JSON.stringify(item?.options || [])) {
      setHistory(prev => [...prev, item]);
    }

    onUpdate({ 
      ...item, 
      question: editedText, 
      options: editedOptions 
    });
    setIsEditing(false);
  }, [item, editedText, editedOptions, onUpdate]);

  const updateOptionText = (text: string, index: number) => {
    const newOptions = [...editedOptions];
    newOptions[index] = text;
    setEditedOptions(newOptions);
  };

  const handleUndo = () => {
    if (isEditing) {
      setEditedText(item.question);
      setEditedOptions(item.options || []);
      setIsEditing(false);
      return;
    }

    if (history.length > 0) {
      const prevState = history[history.length - 1];
      onUpdate(prevState);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.qType}>Question {displayIndex + 1}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={() => onMoveUp?.(item.id)} 
            disabled={displayIndex === 0}
            style={[styles.moveButton, displayIndex === 0 && styles.moveButtonDisabled]}
          >
            <Ionicons name="arrow-up-outline" size={22} color={displayIndex === 0 ? "#bdc3c7" : "#007bff"} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => onMoveDown?.(item.id)} 
            disabled={totalQuestions !== undefined && displayIndex === totalQuestions - 1}
            style={[styles.moveButton, (totalQuestions !== undefined && displayIndex === totalQuestions - 1) && styles.moveButtonDisabled]}
          >
            <Ionicons name="arrow-down-outline" size={22} color={(totalQuestions !== undefined && displayIndex === totalQuestions - 1) ? "#bdc3c7" : "#007bff"} />
          </TouchableOpacity>
          <View style={styles.undoButtonWrapper}>
            <UndoButton 
              isDirty={isDirty} 
              onPress={handleUndo} 
              activeColor="#007bff"
            />
          </View>
          <TouchableOpacity 
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))} 
            style={styles.editSaveButton}
          >
            <Ionicons 
              name={isEditing ? "checkmark-circle" : "create-outline"} 
              size={22} 
              color={isEditing ? "#2ecc71" : "#007bff"} 
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
                value={typeof opt === 'string' ? opt.replace(/^[A-Z][\).]\s*/i, "") : ""} 
                onChangeText={(t) => updateOptionText(t, i)} 
              />
            </View>
          ))}
        </View>
      ) : (
        <View>
          {/* Render Question with Math Support */}
          <MathRenderer content={item?.question} key={`main-${item?.id || 'mcq'}`} />
          
          <View style={styles.optionsList}>
            {editedOptions.map((opt, i) => {
              const displayOpt = typeof opt === 'string' ? opt.replace(/^[A-Z][\).]\s*/i, "") : String(opt || "");
              return (
                <View key={`opt-row-${i}`} style={styles.optionRow}>
                  <Text style={styles.boldLabel}>{String.fromCharCode(65 + i)}) </Text>
                  <View style={styles.mathWrapper}>
                    <MathRenderer content={displayOpt} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#007bff', elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  actionButtons: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginRight: 15 },
  qType: { fontSize: 10, fontWeight: 'bold', color: '#007bff', textTransform: 'uppercase' },
  questionText: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  label: { fontSize: 10, color: '#999', marginBottom: 5, marginTop: 10, fontWeight: 'bold' },
  input: { borderBottomWidth: 1, borderBottomColor: '#3498db', paddingVertical: 5, fontSize: 16, color: '#2c3e50' },
  optionEditRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  optionLabel: { fontWeight: 'bold', marginRight: 10, color: '#3498db' },
  optInput: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 3, fontSize: 14 },
  optionsList: { marginTop: 5 },
  optionRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  mathWrapper: { flex: 1, minHeight: 20, justifyContent: 'center' }, // Ensures the WebView has enough baseline space
  boldLabel: { fontWeight: 'bold', color: '#333' },
  editForm: { paddingBottom: 10 },
  moveButton: {
    marginRight: 10,
    padding: 2,
  },
  moveButtonDisabled: {
    opacity: 0.5,
  },
  undoButtonWrapper: { marginRight: 10 },
  editSaveButton: { marginRight: 10 },
});