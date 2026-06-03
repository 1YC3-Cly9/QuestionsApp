// components/QuestionCard_Structural.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Question } from '../services/aiService';
import { ImageRenderer } from './imageRenderer';
import { MathRenderer } from './mathRenderer';
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

/**
 * UTILITY: Parses a simple HTML table string into a 2D array of strings
 * Handles basic <table><tr><td>...</td></tr></table> structure.
 */
const parseHTMLTableToGrid = (html: string): string[][] => {
  const rows: string[][] = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const tdRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
  
  let trMatch;
  while ((trMatch = trRegex.exec(html)) !== null) {
    const rowContent = trMatch[1];
    const cells: string[] = [];
    let tdMatch;
    while ((tdMatch = tdRegex.exec(rowContent)) !== null) {
      // Remove <br> tags and trim whitespace
      cells.push(tdMatch[1].replace(/<br\s*\/?>/gi, '\n').trim());
    }
    if (cells.length > 0) rows.push(cells);
  }
  return rows;
};

/**
 * UTILITY: Rebuilds HTML table from a 2D grid of strings
 */
const gridToHTMLTable = (grid: string[][]): string => {
  if (!grid || grid.length === 0) return "";
  const rows = grid.map(row => 
    `  <tr>${(row || []).map(cell => `<td>${cell || ""}</td>`).join('')}</tr>`
  ).join('\n');
  return `<table>\n${rows}\n</table>`;
};

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
    const tableRegex = /<table>[\s\S]*?<\/table>/gi;

    // Check if the question text contains an HTML table
    if (questionText.includes('<table>')) {
      const tableHtmlMatch = questionText.match(tableRegex);
      if (tableHtmlMatch && tableHtmlMatch[0]) {
        setTableGrid(parseHTMLTableToGrid(tableHtmlMatch[0]));
        // Remove the table HTML from editedText so user only edits plain text
        setEditedText(questionText.replace(tableHtmlMatch[0], '').trim());
      } else {
        setTableGrid([]);
        setEditedText(questionText.trim());
      }
    } else {
      setTableGrid([]);
      setEditedText(questionText.trim());
    }
    setIsEditing(true);
  };

  // Sync state if item changes (Fixes Stale State Bug)
  useEffect(() => {
    // Only update these when not actively editing to avoid jumping cursor or leaking tags
    if (!isEditing) {
      const tableRegex = /<table>[\s\S]*?<\/table>/gi;
      const questionText = item?.question || "";
      
      setEditedText(questionText.replace(tableRegex, "").trim());
      setEditedSubs(item?.subQuestions || []);
      
      if (questionText.includes('<table>')) {
        const tableHtmlMatch = questionText.match(tableRegex);
        if (tableHtmlMatch && tableHtmlMatch[0]) {
          setTableGrid(parseHTMLTableToGrid(tableHtmlMatch[0]));
        }
      } else {
        setTableGrid([]);
      }
    }
  }, [item, isEditing]);

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
          {tableGrid.length > 0 && (
            <View style={styles.tableEditorContainer}>
              <Text style={styles.label}>Edit Table (Swipe slider below to scroll):</Text>
              <ScrollView style={{ maxHeight: 250 }}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={true} 
                  persistentScrollbar={true}
                  keyboardShouldPersistTaps="always"
                >
                  <View style={{ paddingBottom: 10 }}>
                    {tableGrid.map((row, rowIndex) => (
                      <View key={`row-${rowIndex}`} style={{ flexDirection: 'row' }}>
                        {row.map((cell, colIndex) => (
                          <TextInput
                            key={`cell-${rowIndex}-${colIndex}`}
                            style={[
                              styles.tableCellInput,
                              colIndex > 0 && { borderLeftWidth: 0 },
                              rowIndex > 0 && { borderTopWidth: 0 },
                            ]}
                            value={cell}
                            onChangeText={(text) => {
                              const newGrid = [...tableGrid];
                              newGrid[rowIndex] = [...newGrid[rowIndex]]; 
                              newGrid[rowIndex][colIndex] = text;
                              setTableGrid(newGrid);
                            }}
                          />
                        ))}
                      </View>
                    ))}
                    {/* Highlighted Slider Track */}
                    <View style={styles.tableScrollSlider} />
                  </View>
                </ScrollView>
              </ScrollView>
            </View>
          )}

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

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#f39c12', elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  qType: { fontSize: 10, fontWeight: 'bold', color: '#e67e22', textTransform: 'uppercase' },
  input: { borderBottomWidth: 1, borderBottomColor: '#f39c12', paddingVertical: 5, fontSize: 16, color: '#2c3e50', marginBottom: 10 },
  optInput: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 3, fontSize: 14, marginBottom: 8 },
  label: { fontSize: 10, color: '#999', marginBottom: 5, marginTop: 10, fontWeight: 'bold' },
  tableEditorContainer: { 
    marginVertical: 10, 
    padding: 5, 
    backgroundColor: '#f8f9fa', 
    borderRadius: 4, 
    borderWidth: 1, 
    borderColor: '#ddd' 
  },
  tableCellInput: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    backgroundColor: '#fff', 
    padding: 10, 
    width: 110, 
    textAlign: 'center', 
    fontSize: 14,
    minHeight: 48,
    color: '#2c3e50'
  },
  tableScrollSlider: { 
    height: 15, // Increased height for better visibility
    backgroundColor: '#bdc3c7', 
    borderRadius: 7.5, 
    marginTop: 15, 
    width: '100%',
    opacity: 0.8
  },
  dynamicRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  addBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 10, alignSelf: 'flex-start' },
  addBtnText: { color: '#27ae60', fontWeight: 'bold', marginLeft: 5 },
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
    minHeight: 24, // Optimized height
    alignSelf: 'stretch' 
  },
  moveButton: {
    marginRight: 10,
    padding: 2,
  },
  moveButtonDisabled: {
    opacity: 0.5,
  },
  actionButtons: { // New style to group and align action buttons
    flexDirection: 'row',
    alignItems: 'center',
  },
  undoButtonWrapper: { // Wrapper for UndoButton to apply consistent margin
    marginRight: 10,
  },
  editSaveButton: { // Style for Edit/Save button
    marginRight: 10,
  },
});