import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Context & Style Imports
import { useExam } from '../services/examContext';
// Change this import
import { extractAllQuestionsFromImage } from '../services/scannerService';
import { componentStyles as compStyles } from '../styles/componentStyles';
import { screenStyles as styles } from '../styles/screenStyles';
import { COLORS } from '../styles/theme';

export default function ScannerTab() {
  const { addQuestions } = useExam();
  const [selectedDocs, setSelectedDocs] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [selectedImages, setSelectedImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to get Base64 string for the AI
  const getBase64 = async (uri: string) => {
    try {
      return await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleCameraScan = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) return Alert.alert("Permission", "Camera access required");
    
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true });
    if (!result.canceled) {
      setSelectedImages([...selectedImages, ...result.assets]);
    }
  };

  const handlePickDocuments = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', multiple: true });
    if (!result.canceled) {
      setSelectedDocs([...selectedDocs, ...result.assets]);
    }
  };

  const handlePickGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ['images'], 
      allowsMultipleSelection: true,
      selectionLimit: 5 - selectedImages.length
    });
    if (!result.canceled) {
      setSelectedImages([...selectedImages, ...result.assets]);
    }
  };

  const handleProcessItems = async () => {
    if (selectedDocs.length === 0 && selectedImages.length === 0) return;
    
    setIsProcessing(true);
    try {
      let allExtracted: any[] = [];

      // Process Images (Gallery + Camera) in parallel
      const imageProcessingPromises = selectedImages.map(async (img) => {
        const base64Data = await getBase64(img.uri);
        if (base64Data) {
          const result = await extractAllQuestionsFromImage(base64Data, img.uri);
          if (result && result.questions) {
            return result.questions;
          }
        }
        return []; // Return empty array if no questions extracted or base64 failed
      });
      const results = await Promise.all(imageProcessingPromises);
      allExtracted = results.flat(); // Flatten the array of arrays into a single array

      // Note: Original logic focused on images; we append results to context
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
      <Text style={styles.screenSub}>Choose your files to extract questions and math symbols.</Text>

      <View style={compStyles.card}>
        {/* All Action Buttons (Blue) */}
        <TouchableOpacity style={styles.uploadBtn} onPress={handleCameraScan}>
          <Ionicons name="camera" size={24} color="#fff" />
          <Text style={styles.generateBtnText}>Scan with Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadBtn} onPress={handlePickDocuments}>
          <Ionicons name="document-attach" size={24} color="#fff" />
          <Text style={styles.generateBtnText}>Upload PDF Papers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadBtn} onPress={handlePickGallery}>
          <Ionicons name="images" size={24} color="#fff" />
          <Text style={styles.generateBtnText}>Choose from Gallery</Text>
        </TouchableOpacity>

        {/* Selected PDFs List */}
        {selectedDocs.length > 0 && (
          <View style={styles.fileList}>
            <Text style={styles.sectionLabel}>PDFs Selected:</Text>
            {selectedDocs.map((doc, index) => (
              <View key={`doc-${index}`} style={styles.fileItem}>
                <Text style={styles.fileName} numberOfLines={1}>{doc.name}</Text>
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
        {(selectedDocs.length > 0 || selectedImages.length > 0) && (
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
        )}
      </View>
    </ScrollView>
  );
}