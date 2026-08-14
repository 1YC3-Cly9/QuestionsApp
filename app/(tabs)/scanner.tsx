import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Context & Style Imports
import { useExam } from '../../services/examContext';
import { extractAllQuestionsFromImage } from '../../services/scannerService';
import { componentStyles as compStyles } from '../../styles/componentStyles';
import { screenStyles as styles } from '../../styles/screenStyles';
import { COLORS, RADIUS } from '../../styles/theme';

interface ScannableDoc extends DocumentPicker.DocumentPickerAsset {
  mode?: 'question' | 'notes';
}

interface ScannableImage extends ImagePicker.ImagePickerAsset {
  mode?: 'question' | 'notes';
}

export default function ScannerTab() {
  const { addQuestions } = useExam();
  const [selectedDocs, setSelectedDocs] = useState<ScannableDoc[]>([]);
  const [selectedImages, setSelectedImages] = useState<ScannableImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notesDifficulty, setNotesDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [notesTargetCount, setNotesTargetCount] = useState(5);
  const [notesQuestionType, setNotesQuestionType] = useState<'MCQ' | 'Structural'>('MCQ');

  // Helper to get Base64 string for the AI
  const getBase64 = async (uri: string) => {
    try {
      return await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleCameraScan = async (mode: 'question' | 'notes') => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) return Alert.alert("Permission", "Camera access required");
    
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true });
    if (!result.canceled) {
      const assetsWithMode = result.assets.map(a => ({ ...a, mode }));
      setSelectedImages(prev => [...prev, ...assetsWithMode]);
    }
  };

  const handlePickDocuments = async (mode: 'question' | 'notes') => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', multiple: true });
    if (!result.canceled) {
      const assetsWithMode = result.assets.map(a => ({ ...a, mode }));
      setSelectedDocs(prev => [...prev, ...assetsWithMode]);
    }
  };

  const handlePickGallery = async (mode: 'question' | 'notes') => {
    const result = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ['images'], 
      allowsMultipleSelection: true,
      selectionLimit: 5 - selectedImages.length
    });
    if (!result.canceled) {
      const assetsWithMode = result.assets.map(a => ({ ...a, mode }));
      setSelectedImages(prev => [...prev, ...assetsWithMode]);
    }
  };

  const handleProcessItems = async () => {
    if (selectedDocs.length === 0 && selectedImages.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Acknowledge that PDF processing is not yet implemented for a better UX.
      if (selectedDocs.length > 0) {
        Alert.alert("Coming Soon!", "Processing notes from PDF documents is not yet supported. Only images will be processed in this version.");
        // In the future, you could implement PDF-to-image conversion here.
      }

      let allExtracted: any[] = [];

      // Process Images (Gallery + Camera) in parallel
      const imageProcessingPromises = selectedImages.map(async (img) => {
        const base64Data = await getBase64(img.uri);
        if (base64Data) {
          const result = await extractAllQuestionsFromImage(
            base64Data, 
            img.uri, 
            img.mode || 'question',
            img.mode === 'notes' ? notesDifficulty : undefined,
            img.mode === 'notes' ? notesTargetCount : undefined,
            img.mode === 'notes' ? notesQuestionType : undefined
          );
          if (result && result.questions) {
            return result.questions;
          }
        }
        return [];
      });

      const results = await Promise.all(imageProcessingPromises);
      allExtracted = results.flat();

      addQuestions(allExtracted);

      Alert.alert("Success", `${allExtracted.length} questions added to your exam paper!`);
      setSelectedDocs([]);
      setSelectedImages([]);
    } catch (error: any) {
      console.error("Process Items Error:", error);
      Alert.alert("Extraction Failed", error.message || "An unknown error occurred. Please check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = (index: number) => setSelectedImages(selectedImages.filter((_, i) => i !== index));
  const removeDoc = (index: number) => setSelectedDocs(selectedDocs.filter((_, i) => i !== index));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.screenTitle}>Scan & Upload</Text>
      <Text style={styles.screenSub}>Choose your files or study notes to extract questions and math symbols.</Text>

      {/* SECTION 1: UPLOAD QUESTION */}
      <Text style={localStyles.sectionHeaderLabel}>Upload Question</Text>
      <View style={compStyles.card}>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => handleCameraScan('question')}>
          <Ionicons name="camera" size={24} color="#fff" />
          <Text style={styles.generateBtnText}>Scan Question with Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadBtn} onPress={() => handlePickDocuments('question')}>
          <Ionicons name="document-attach" size={24} color="#fff" />
          <Text style={styles.generateBtnText}>Upload Question PDF Papers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadBtn} onPress={() => handlePickGallery('question')}>
          <Ionicons name="images" size={24} color="#fff" />
          <Text style={styles.generateBtnText}>Choose Question from Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* SECTION 2: EXTRACT FROM NOTES */}
      <Text style={localStyles.sectionHeaderLabel}>Extract from Notes</Text>
      <View style={compStyles.card}>
        {/* Notes Generation Settings */}
        <Text style={localStyles.settingsLabel}>Difficulty</Text>
        <View style={localStyles.difficultyRow}>
          {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
            <TouchableOpacity
              key={level}
              style={[localStyles.difficultyBtn, notesDifficulty === level && localStyles.difficultyBtnActive]}
              onPress={() => setNotesDifficulty(level)}
            >
              <Text style={notesDifficulty === level ? localStyles.difficultyTextActive : localStyles.difficultyTextInactive}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={localStyles.quantityRow}>
          <Text style={localStyles.settingsLabel}>Number of Questions</Text>
          <TextInput
            style={localStyles.quantityInput}
            keyboardType="numeric"
            value={notesTargetCount.toString()}
            onChangeText={(txt) => setNotesTargetCount(Math.max(1, parseInt(txt) || 1))}
          />
        </View>

        <Text style={localStyles.settingsLabel}>Question Type</Text>
        <View style={localStyles.difficultyRow}>
          {(['MCQ', 'Structural'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[localStyles.difficultyBtn, notesQuestionType === type && localStyles.difficultyBtnActive]}
              onPress={() => setNotesQuestionType(type)}
            >
              <Text style={notesQuestionType === type ? localStyles.difficultyTextActive : localStyles.difficultyTextInactive}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={localStyles.notesDivider} />

        <TouchableOpacity style={localStyles.notesUploadBtn} onPress={() => handleCameraScan('notes')}>
          <Ionicons name="journal" size={24} color="#fff" />
          <Text style={styles.generateBtnText}>Scan Notes with Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={localStyles.notesUploadBtn} onPress={() => handlePickDocuments('notes')}>
          <Ionicons name="document-text" size={24} color="#fff" />
          <Text style={styles.generateBtnText}>Upload Notes PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={localStyles.notesUploadBtn} onPress={() => handlePickGallery('notes')}>
          <Ionicons name="albums" size={24} color="#fff" />
          <Text style={styles.generateBtnText}>Choose Notes from Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* SELECTED ITEMS & PROCESSING SECTION */}
      {(selectedDocs.length > 0 || selectedImages.length > 0) && (
        <View style={compStyles.card}>
          <Text style={styles.sectionLabel}>Selected Files to Process:</Text>

          {/* Selected PDFs List */}
          {selectedDocs.length > 0 && (
            <View style={styles.fileList}>
              <Text style={styles.sectionLabel}>PDFs Selected:</Text>
              {selectedDocs.map((doc, index) => (
                <View key={`doc-${index}`} style={styles.fileItem}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {doc.name} 
                    <Text style={[localStyles.badge, doc.mode === 'notes' ? localStyles.badgeNotes : localStyles.badgeQuestion]}>
                      {doc.mode === 'notes' ? ' [Notes]' : ' [Question]'}
                    </Text>
                  </Text>
                  <TouchableOpacity onPress={() => removeDoc(index)}>
                    <Ionicons name="close-circle" size={22} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Selected Images Grid */}
          {selectedImages.length > 0 && (
            <View style={[styles.fileList, { marginTop: 15 }]}>
              <Text style={styles.sectionLabel}>Images Selected:</Text>
              <View style={styles.imageGrid}>
                {selectedImages.map((img, index) => (
                  <View key={`img-${index}`} style={styles.imageWrapper}>
                    <Image source={{ uri: img.uri }} style={styles.thumbnail} />
                    <TouchableOpacity style={styles.removeBadge} onPress={() => removeImage(index)}>
                      <Ionicons name="close-circle" size={22} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Final Process Button */}
          <TouchableOpacity 
            style={styles.processBtn} 
            onPress={handleProcessItems}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.generateBtnText}>Add to Current Paper</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  sectionHeaderLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2c3e50',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 10,
    marginLeft: 4,
  },
  notesUploadBtn: {
    backgroundColor: '#6c5ce7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: RADIUS.md,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  badge: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  badgeQuestion: {
    color: '#007bff',
  },
  badgeNotes: {
    color: '#6c5ce7',
  },
  settingsLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 6,
  },
  difficultyRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 3,
    marginBottom: 12,
  },
  difficultyBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  difficultyBtnActive: {
    backgroundColor: '#6c5ce7',
  },
  difficultyTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  difficultyTextInactive: {
    color: '#666',
    fontWeight: '600',
    fontSize: 13,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quantityInput: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    width: 60,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  notesDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 14,
    marginTop: 2,
  },
});