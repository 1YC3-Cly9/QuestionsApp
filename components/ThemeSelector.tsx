import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useExam } from '../services/examContext';
import { themes } from '../services/pdfThemes';

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export default function ThemeSelector({ visible, onClose }: ThemeSelectorProps) {
  const { themeName, setThemeName } = useExam();

  const handleSelectTheme = (name: string) => {
    setThemeName(name);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackdrop}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Select a Theme</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={32} color="#e74c3c" />
            </TouchableOpacity>
          </View>
          <View style={styles.themeList}>
            {Object.values(themes).map((theme) => (
              <TouchableOpacity
                key={theme.name}
                style={[styles.themeCard, themeName === theme.name.toLowerCase() && styles.activeCard]}
                onPress={() => handleSelectTheme(theme.name.toLowerCase())}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.themeName}>{theme.name}</Text>
                  {themeName === theme.name.toLowerCase() && (
                    <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
                  )}
                </View>
                <Text style={styles.themeDescription}>{theme.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  themeList: {
    flex: 1,
  },
  themeCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#eee',
  },
  activeCard: {
    borderColor: '#6c5ce7',
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  themeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  themeDescription: {
    fontSize: 14,
    color: '#555',
  },
});