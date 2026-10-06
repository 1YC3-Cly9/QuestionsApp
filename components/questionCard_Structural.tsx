// components/QuestionCard_Structural.tsx
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Question } from '../services/aiService';
import { structuralQuestionCardStyles as styles } from '../styles/questionCardStyles';
import { ImageRenderer } from './imageRenderer';
import { extractTableAndText, gridToHTMLTable, MathRenderer, parseHTMLTableToGrid, TableEditor } from './mathRenderer';
import { UndoButton } from './undoButton';

interface StructuralProps {
  item: Question;
  displayIndex: number;
  onDelete: (id: string) => void;
  onUpdate: (updatedQ: Question) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  totalQuestions?: number;
}


export default function QuestionCard_Structural({ item, displayIndex, onDelete, onUpdate, onMoveUp, onMoveDown, totalQuestions }: StructuralProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item?.question || "");
  const [editedSubs, setEditedSubs] = useState(item?.subQuestions || []);
  const [tableGrid, setTableGrid] = useState<string[][]>([]); // State for the visual table editor
  const [history, setHistory] = useState<Question[]>([]); // Multi-step history stack

  // Logic to determine if the question has been changed from its original state
  const isDirty = useMemo(() => {
    if (isEditing) {
      let currentTotalText = editedText;
      if (tableGrid.length > 0) {
        currentTotalText = ((editedText || "").trim() + "\n" + gridToHTMLTable(tableGrid)).trim();
      }
      const textChanged = (currentTotalText || "").trim() !== (item?.question || "").trim();
      const subsChanged = JSON.stringify(editedSubs) !== JSON.stringify(item?.subQuestions || []);
      
      return textChanged || subsChanged || history.length > 0;
    }
    return history.length > 0;
  }, [isEditing, editedText, editedSubs, tableGrid, item?.question, item?.subQuestions, history]);

  const handleSave = useCallback(() => {
    let finalQuestionText = editedText;
    if (tableGrid.length > 0) {
      const newTableHtml = gridToHTMLTable(tableGrid);
      finalQuestionText = ((editedText || "").trim() + "\n" + newTableHtml).trim();
    }

    // Pushes current state to history before saving new changes (step-by-step undo)
    const hasChanged = (finalQuestionText || "").trim() !== (item?.question || "").trim() || 
                     JSON.stringify(editedSubs) !== JSON.stringify(item?.subQuestions || []);
    
    if (hasChanged) {
      setHistory(prev => [...prev, item]);
    }

    onUpdate({ ...item, question: finalQuestionText, subQuestions: editedSubs });
    setIsEditing(false);
  }, [item, editedText, editedSubs, tableGrid, onUpdate]);

  const addSub = () => setEditedSubs([...editedSubs, '']);
  const removeSub = (index: number) => {
    if (editedSubs.length > 1) {
      setEditedSubs(editedSubs.filter((_, i) => i !== index));
    } else {
      setEditedSubs(['']);
    }
  };

  const handleUndo = () => {
    if (isEditing) {
      // If undoing while editing, discard current unsaved changes and reset to the last saved state
      enterEditMode();
      setIsEditing(false);
      return;
    }

    if (history.length > 0) {
      const prevState = history[history.length - 1];
      onUpdate(prevState);
      setHistory(prev => prev.slice(0, -1)); // Remove the last state from history
    }
  };

  // Function to prepare for editing
  const enterEditMode = () => {
    const questionText = item?.question || "";
    const { plainText, tableHtml } = extractTableAndText(questionText);

    if (tableHtml) {
      setTableGrid(parseHTMLTableToGrid(tableHtml));
    } else {
      setTableGrid([]);
    }
    setEditedText(plainText);
    setIsEditing(true);
  };

  // Sync state if item changes (Fixes Stale State Bug)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    // Only update these when not actively editing to avoid jumping cursor or leaking tags
    if (!isEditing) {
      const questionText = item?.question || "";
      const { plainText, tableHtml } = extractTableAndText(questionText);
      
      setEditedText(plainText);
      setEditedSubs(item?.subQuestions || []);
      
      if (tableHtml) {
        setTableGrid(parseHTMLTableToGrid(tableHtml));
      } else {
        setTableGrid([]);
      }
    }
  }, [item, isEditing]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

  return (
    <View style={styles.card}>
      {/* Header Panel */}
      <View style={styles.header}>
        <Text style={styles.qType}>Question {displayIndex + 1}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={() => onMoveUp?.(item.id)} 
            disabled={displayIndex === 0}
            style={[styles.moveButton, displayIndex === 0 && styles.moveButtonDisabled]}
          >
            <Ionicons name="arrow-up-outline" size={22} color={displayIndex === 0 ? "#bdc3c7" : "#f39c12"} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => onMoveDown?.(item.id)} 
            disabled={totalQuestions !== undefined && displayIndex === totalQuestions - 1}
            style={[styles.moveButton, (totalQuestions !== undefined && displayIndex === totalQuestions - 1) && styles.moveButtonDisabled]}
          >
            <Ionicons name="arrow-down-outline" size={22} color={(totalQuestions !== undefined && displayIndex === totalQuestions - 1) ? "#bdc3c7" : "#f39c12"} />
          </TouchableOpacity>
          <View style={styles.undoButtonWrapper}>
            <UndoButton 
              isDirty={isDirty} 
              onPress={handleUndo}
              activeColor="#f39c12"
            />
          </View>
          <TouchableOpacity 
            onPress={() => (isEditing ? handleSave() : enterEditMode())} // Call enterEditMode here
            style={styles.editSaveButton}
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
          <Text style={styles.label}>Question Text:</Text>
          <TextInput 
            style={styles.input} 
            value={editedText} 
            onChangeText={setEditedText} 
            multiline 
          />

          {/* Visual Table Editor: Direct editing of cells */}
          <TableEditor grid={tableGrid} onChange={setTableGrid} />

          <Text style={styles.label}>Sub-Questions:</Text>
          {Array.isArray(editedSubs) && editedSubs.map((sub: any, i: number) => {
            // Extract text from object or fallback to string representation
            const displaySub = typeof sub === 'object' ? (sub.question || sub.text || JSON.stringify(sub)) : String(sub || "");
            return (
              <View key={`edit-sub-${item.id}-${i}`} style={styles.dynamicRow}>
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
                <TouchableOpacity onPress={() => removeSub(i)}>
                  <Ionicons name="remove-circle" size={24} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            );
          })}

          <TouchableOpacity style={styles.addBtn} onPress={addSub}>
            <Ionicons name="add-circle" size={20} color="#27ae60" />
            <Text style={styles.addBtnText}>Add Sub-question</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.viewContainer}>
          {/* Main Question Display (Handles text, inline math, and scrollable tables) */}
          <MathRenderer content={item?.question} key={`main-${item?.id || 'default'}`} />

          {/* Render Diagrams using the shared component */}
          <ImageRenderer images={item?.images} imageScales={item?.imageScales} questionId={item.id} />
          
          {/* Sub-Questions Map Display */}
          {item?.subQuestions && Array.isArray(item.subQuestions) && item.subQuestions.length > 0 && (
            <View style={{ marginTop: 10 }}>
              {item.subQuestions.map((sub: any, i: number) => {
                // Extract content string before rendering
                const subContent = typeof sub === 'object' ? (sub.question || sub.text || JSON.stringify(sub)) : String(sub || "");
                if (!subContent || subContent.trim() === "") return null;
                
                return (
                  <View key={`view-sub-${item.id}-${i}`} style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' }}>
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

