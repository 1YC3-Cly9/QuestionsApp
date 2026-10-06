import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Question } from '../services/aiService';
import { mcqQuestionCardStyles as styles } from '../styles/questionCardStyles';
import { ImageRenderer } from './imageRenderer';
import { extractTableAndText, gridToHTMLTable, MathRenderer, parseHTMLTableToGrid, TableEditor } from './mathRenderer';
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
  const [editedOptions, setEditedOptions] = useState<string[]>(item?.options || []);
  const [tableGrid, setTableGrid] = useState<string[][]>([]); // State for the visual table editor
  const [history, setHistory] = useState<Question[]>([]);

  // Multi-step dirty logic
  const isDirty = (() => {
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
  })();

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
  /* eslint-disable react-hooks/set-state-in-effect */
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
  /* eslint-enable react-hooks/set-state-in-effect */

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
          <TableEditor grid={tableGrid} onChange={setTableGrid} />

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
