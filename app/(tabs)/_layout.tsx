import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useState } from 'react';
import { Animated, Dimensions, Easing, Modal, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

// 1. SERVICES & CONTEXT
import { useExam } from '../../services/examContext';
import { getExamHtmlContent } from '../../services/pdfGenerator';
import { generateExamPDF } from '../../services/pdfServices';

// 2. EXTERNAL STYLES (The new way)
import { tabLayoutInlineStyles as inlineStyles } from '../../styles/appStyles';
import { layoutStyles as styles } from '../../styles/layoutStyles';

// 3. COMPONENTS
import ActionButtons from '../../components/header/actionButtons';
import SideDrawer from '../../components/header/sideDrawer';

const { width } = Dimensions.get('window');

export default function TabLayout() {
  const { schoolName, className, date, totalMarks, logoUri, topic, sectionTitle, showSectionRule, sectionRule, sectionStart, sectionEnd, sections, questions, themeName } = useExam();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [slideAnim] = useState(() => new Animated.Value(-width));

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
    <SafeAreaView style={inlineStyles.rootSafeArea}>
      
      {/* STATIC HEADER BAR */}
      <View style={styles.staticBar}>
        <View style={styles.barLeft}>
          <View style={inlineStyles.headerBrandRow}>
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
          onExport={() => generateExamPDF(themeName, schoolName, className, date, totalMarks, logoUri, topic, sectionTitle, showSectionRule, sectionRule, sectionStart, sectionEnd, sections, questions)} 
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
        <SafeAreaView style={inlineStyles.previewSafeArea}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Exam Preview</Text>
            <TouchableOpacity onPress={() => setShowPreview(false)}>
              <Ionicons name="close-circle" size={32} color="#e74c3c" />
            </TouchableOpacity>
          </View>
          <WebView source={{ html: getExamHtmlContent(themeName, schoolName, className, date, totalMarks, logoUri, topic, sectionTitle, showSectionRule, sectionRule, sectionStart, sectionEnd, sections, questions) }} />
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}