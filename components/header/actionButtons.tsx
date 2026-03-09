import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonsProps {
  isActive: boolean;
  onPreview: () => void;
  onExport: () => void;
}

export default function ActionButtons({ isActive, onPreview, onExport }: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      {/* Preview Button */}
      <TouchableOpacity 
        disabled={!isActive}
        style={[styles.btn, { backgroundColor: isActive ? '#3498db' : '#dfe6e9' }]} 
        onPress={onPreview}
      >
        <Ionicons name="eye-outline" size={20} color={isActive ? "#fff" : "#b2bec3"} />
      </TouchableOpacity>

      {/* Export Button */}
      <TouchableOpacity 
        disabled={!isActive}
        style={[styles.btn, { backgroundColor: isActive ? '#2ecc71' : '#dfe6e9', marginLeft: 10 }]} 
        onPress={onExport}
      >
        <Ionicons name="cloud-download-outline" size={20} color={isActive ? "#fff" : "#b2bec3"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end' },
  btn: { padding: 10, borderRadius: 12, elevation: 2 }
});