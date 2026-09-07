import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Question } from '../services/aiService';
import { ImageRenderer } from './imageRenderer';
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

const TABLE_REGEX = /<table[^>]*>[\s\S]*?<\/table>/gi;
const TR_BLOCK_REGEX = /<tr[^>]*>[\s\S]*?<\/tr>/gi;

/**
 * UTILITY: Extracts table HTML markup and plain question text separately.
 * Handles <table...>, <tr>...</tr>, attributes, and case variations.
 */
const extractTableAndText = (fullText: string): { plainText: string; tableHtml: string | null } => {
  if (!fullText) return { plainText: "", tableHtml: null };

  const tableMatches = fullText.match(TABLE_REGEX);
  if (tableMatches && tableMatches.length > 0) {
    const tableHtml = tableMatches.join('\n');
    const plainText = fullText.replace(TABLE_REGEX, "").trim();
    return { plainText, tableHtml };
  }

  const trMatches = fullText.match(TR_BLOCK_REGEX);
  if (trMatches && trMatches.length > 0) {
    const tableHtml = `<table>\n${trMatches.join('\n')}\n</table>`;
    const plainText = fullText.replace(TR_BLOCK_REGEX, "").trim();
    return { plainText, tableHtml };
  }

  return { plainText: fullText.trim(), tableHtml: null };
};

/**
 * UTILITY: Parses an HTML table string into a 2D array of strings
 */
const parseHTMLTableToGrid = (html: string): string[][] => {
  if (!html) return [];
  const rows: string[][] = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const tdRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
  
  let trMatch;
  while ((trMatch = trRegex.exec(html)) !== null) {
    const rowContent = trMatch[1];
    const cells: string[] = [];
    let tdMatch;
    while ((tdMatch = tdRegex.exec(rowContent)) !== null) {
      cells.push(
        tdMatch[1]
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .trim()
      );
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

export default function QuestionCard_MCQs({ item, displayIndex, onDelete, onUpdate, onMoveUp, onMoveDown, totalQuestions }: MCQProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item?.question || "");
  const [editedOptions, setEditedOptions] = useState<string[]>(item?.options || []);
  const [tableGrid, setTableGrid] = useState<string[][]>([]); // State for the visual table editor
  const [history, setHistory] = useState<Question[]>([]);

  // Multi-step dirty logic
  const isDirty = useMemo(() => {
    if (isEditing) {
      let currentTotalText = editedText;
      if (tableGrid.length > 0) {
        currentTotalText = ((editedText || "").trim() + "\n" + gridToHTMLTable(tableGrid)).trim();
      }
      const textChanged = (currentTotalText || "").trim() !== (item?.question || "").trim();
      const optionsChanged = JSON.stringify(editedOptions) !== JSON.stringify(item?.options || []);
      return textChanged || optionsChanged || history.length > 0;
    }
    return history.length > 0;
  }, [isEditing, editedText, editedOptions, tableGrid, item?.question, item?.options, history]);

  const handleUpdateScale = (imgIdx: number, newScale: number) => {
    const newScales = [...(item.imageScales || [])];
    newScales[imgIdx] = newScale;
    onUpdate({ ...item, imageScales: newScales });
  };

  const handleManualCrop = async (imgIdx: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const newImages = [...(item.images || [])];
      newImages[imgIdx] = `data:image/jpeg;base64,${result.assets[0].base64}`;
      onUpdate({ ...item, images: newImages });
    }
  };

  // Prepare for edit mode
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

  // Sync state if item changes
  useEffect(() => {
    if (!isEditing) {
      const questionText = item?.question || "";
      const { plainText, tableHtml } = extractTableAndText(questionText);

      setEditedText(plainText);
      setEditedOptions(item?.options || []);
      
      if (tableHtml) {
        setTableGrid(parseHTMLTableToGrid(tableHtml));
      } else {
        setTableGrid([]);
      }
    }
  }, [item, isEditing]);

  const handleSave = useCallback(() => {
    let finalQuestionText = editedText;
    if (tableGrid.length > 0) {
      const newTableHtml = gridToHTMLTable(tableGrid);
      finalQuestionText = ((editedText || "").trim() + "\n" + newTableHtml).trim();
    }

    const hasChanged = (finalQuestionText || "").trim() !== (item?.question || "").trim() ||
                       JSON.stringify(editedOptions) !== JSON.stringify(item?.options || []);

    if (hasChanged) {
      setHistory(prev => [...prev, item]);
    }

    onUpdate({ 
      ...item, 
      question: finalQuestionText, 
      options: editedOptions 
    });
    setIsEditing(false);
  }, [item, editedText, editedOptions, tableGrid, onUpdate]);

  const updateOptionText = (text: string, index: number) => {
    const newOptions = [...editedOptions];
    newOptions[index] = text;
    setEditedOptions(newOptions);
  };

  const handleUndo = () => {
    if (isEditing) {
      enterEditMode();
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
            onPress={() => (isEditing ? handleSave() : enterEditMode())} 
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
          {/* Image Management in Edit Mode */}
          {item.images?.map((img, idx) => (
            <View key={`img-edit-${idx}`} style={styles.imageEditWrapper}>
              <Image source={{ uri: img }} style={styles.previewImage} />
              <View style={styles.imageControls}>
                <Text style={styles.label}>Export Scale:</Text>
                <View style={styles.scaleRow}>
                  {[0.5, 1.0, 1.5].map(s => (
                    <TouchableOpacity 
                      key={s} 
                      onPress={() => handleUpdateScale(idx, s)}
                      style={[styles.scaleBtn, item.imageScales?.[idx] === s && styles.scaleBtnActive]}
                    >
                      <Text style={styles.scaleBtnText}>x{s}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity onPress={() => handleManualCrop(idx)} style={styles.cropBtn}>
                    <Ionicons name="crop-outline" size={16} color="#007bff" />
                    <Text style={styles.cropBtnText}>Recrop</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

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
          
          {/* Render Diagrams using the standardized B&W component */}
          <ImageRenderer images={item?.images} imageScales={item?.imageScales} questionId={item.id} />
          
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
  mathWrapper: { flex: 1, minHeight: 20, justifyContent: 'center' },
  boldLabel: { fontWeight: 'bold', color: '#333' },
  editForm: { paddingBottom: 10 },
  displayImage: { width: '100%', height: 200, marginVertical: 10, borderRadius: 8 },
  imageEditWrapper: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  previewImage: { width: '100%', height: 120, borderRadius: 4 },
  imageControls: { marginTop: 5 },
  scaleRow: { flexDirection: 'row', alignItems: 'center' },
  scaleBtn: { padding: 5, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginRight: 5 },
  scaleBtnActive: { backgroundColor: '#007bff', borderColor: '#007bff' },
  scaleBtnText: { fontSize: 10 },
  cropBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  cropBtnText: { fontSize: 10, color: '#007bff', marginLeft: 3 },
  moveButton: {
    marginRight: 10,
    padding: 2,
  },
  moveButtonDisabled: {
    opacity: 0.5,
  },
  undoButtonWrapper: { marginRight: 10 },
  editSaveButton: { marginRight: 10 },
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
    height: 15, 
    backgroundColor: '#bdc3c7', 
    borderRadius: 7.5, 
    marginTop: 15, 
    width: '100%',
    opacity: 0.8
  },
});