import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useExam } from '../services/examContext';
import { themes } from '../services/pdfThemes';

export default function ThemeSelectionPage() {
  const { themeName, setThemeName } = useExam();

  const handleSelectTheme = (name: string) => {
    setThemeName(name);
    router.back(); // Navigate back to the previous screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Select a Theme' }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back-circle" size={36} color="#6c5ce7" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose a Layout</Text>
        </View>
        <Text style={styles.headerSubtitle}>Select a theme for your generated PDF exam paper.</Text>
        
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    paddingLeft: 5,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 10, // Adds padding above the header
  },
  backButton: {
    marginRight: 15,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activeCard: {
    borderColor: '#6c5ce7',
    backgroundColor: '#f4f2ff',
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