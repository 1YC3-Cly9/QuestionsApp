import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

// 1. SERVICES & CONTEXT
import { useExam } from '../../services/examContext';
import { generateExamPDF, getExamHtmlContent } from '../../services/pdfGenerator';

// 2. EXTERNAL STYLES (The new way)
import { layoutStyles as styles } from '../../styles/layoutStyles';

// 3. COMPONENTS
import ActionButtons from '../../components/header/actionButtons';
import SideDrawer from '../../components/header/sideDrawer';

const { width } = Dimensions.get('window');

export default function TabLayout() {
  const { schoolName, className, totalMarks, logoUri, topic, questions, themeName } = useExam();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current; 

  const isActive = questions.length > 0;

  const toggleDrawer = (open: boolean, callback?: () => void) => {
    if (open) setIsDrawerOpen(true);
    Animated.timing(slideAnim, {
      toValue: open ? 0 : -width,
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start(() => { 
      if (!open) setIsDrawerOpen(false); 
      callback?.(); // Execute the callback after animation completes
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      
      {/* STATIC HEADER BAR */}
      <View style={styles.staticBar}>
        <View style={styles.barLeft}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => toggleDrawer(true)} style={styles.menuTrigger}>
              <Ionicons name="ellipsis-vertical" size={24} color="#2c3e50" />
            </TouchableOpacity>
            <Text style={styles.appName}>ExamGen AI</Text>
          </View>
          <Text style={styles.stats}>{isActive ? `${questions.length} Questions` : 'No questions yet'}</Text>
        </View>

        <ActionButtons 
          isActive={isActive} 
          onPreview={() => setShowPreview(true)} 
          onExport={() => generateExamPDF(themeName, schoolName, className, totalMarks, logoUri, topic, questions)} 
        />
      </View>

      <Tabs screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#007bff',
        tabBarStyle: { height: 65, paddingBottom: 10 }
      }}>
        <Tabs.Screen name="index" options={{ title: 'Quick AI', tabBarIcon: ({color}) => <Ionicons name="flash" size={22} color={color}/> }} />
        <Tabs.Screen name="manual" options={{ title: 'Manual', tabBarIcon: ({color}) => <Ionicons name="create" size={22} color={color}/> }} />
        <Tabs.Screen name="scanner" options={{ title: 'Scanner', tabBarIcon: ({color}) => <Ionicons name="camera" size={22} color={color}/> }} />
      </Tabs>

      {/* MODULAR DRAWER */}
      <SideDrawer 
        isOpen={isDrawerOpen} 
        slideAnim={slideAnim} 
        onClose={(callback) => toggleDrawer(false, callback)}
      />

      {/* PREVIEW MODAL */}
      <Modal visible={showPreview} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Exam Preview</Text>
            <TouchableOpacity onPress={() => setShowPreview(false)}>
              <Ionicons name="close-circle" size={32} color="#e74c3c" />
            </TouchableOpacity>
          </View>
          <WebView source={{ html: getExamHtmlContent(themeName, schoolName, className, totalMarks, logoUri, topic, questions) }} />
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}