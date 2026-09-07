import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import ColorPicker from 'react-native-wheel-color-picker';
import { useExam } from '../services/examContext';
import { getExamHtmlContent } from '../services/pdfGenerator';
import { createCustomTheme, createDefaultSectionStyles, CustomThemeConfig, registerTheme, themes, ThemeSection, themeSections, ThemeSectionStyle, ThemeSectionStyles } from '../services/pdfThemes';

const SAVED_THEMES_KEY = '@questions_app/custom_themes';

interface SavedTheme {
  key: string;
  config: CustomThemeConfig;
}

export default function ThemeSelectionPage() {
  const { themeName, setThemeName, schoolName, className, date, totalMarks, logoUri, topic, sectionTitle, showSectionRule, sectionRule, sectionStart, sectionEnd, sections, questions } = useExam();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [fontFamily, setFontFamily] = useState('Georgia, serif');
  const [questionColumns, setQuestionColumns] = useState<1 | 2>(1);
  const [answerColumns, setAnswerColumns] = useState<1 | 2>(1);
  const [showQuestionDivider, setShowQuestionDivider] = useState(false);
  const [questionDividerColor, setQuestionDividerColor] = useState('#eeeeee');
  const [sectionRuleColor, setSectionRuleColor] = useState('#202124');
  const [colorTarget, setColorTarget] = useState<'section' | 'question' | 'rule' | null>(null);
  const [colorSection, setColorSection] = useState<ThemeSection | null>(null);
  const [pickerColor, setPickerColor] = useState('#eeeeee');
  const [previewThemeKey, setPreviewThemeKey] = useState<string | null>(null);
  const [sectionStyles, setSectionStyles] = useState<ThemeSectionStyles>(createDefaultSectionStyles());
  const [expandedSection, setExpandedSection] = useState<ThemeSection | null>(null);
  const [editingThemeKey, setEditingThemeKey] = useState<string | null>(null);
  const [, setThemesVersion] = useState(0);

  useEffect(() => {
    const restoreThemes = async () => {
      try {
        const saved = await AsyncStorage.getItem(SAVED_THEMES_KEY);
        if (!saved) return;
        const savedThemes = JSON.parse(saved) as SavedTheme[];
        savedThemes.forEach(({ key, config }) => {
          registerTheme(createCustomTheme(config), key);
        });
        setThemesVersion((version) => version + 1);
      } catch (error) {
        console.error('Theme restore error:', error);
      }
    };

    restoreThemes();
  }, []);

  const handleSelectTheme = (name: string) => {
    setThemeName(name);
    router.back(); // Navigate back to the previous screen
  };

  const openCreateEditor = () => {
    setEditingThemeKey(null);
    setCustomName('');
    setFontFamily('Georgia, serif');
    setQuestionColumns(1);
    setAnswerColumns(1);
    setShowQuestionDivider(false);
    setQuestionDividerColor('#eeeeee');
    setSectionRuleColor('#202124');
    setSectionStyles(createDefaultSectionStyles());
    setExpandedSection(null);
    setShowCreateModal(true);
  };

  const openThemeEditor = (themeKey: string, theme: typeof themes[string]) => {
    const config = theme.editorConfig;
    setEditingThemeKey(themeKey);
    setCustomName(theme.name);
    setFontFamily(config?.fontFamily || 'Georgia, serif');
    setQuestionColumns(config?.columns || 1);
    setAnswerColumns(config?.mcqAnswerColumns || 1);
    setShowQuestionDivider(config?.showQuestionDivider || false);
    setQuestionDividerColor(config?.questionDividerColor || '#eeeeee');
    setSectionRuleColor(config?.sectionRuleColor || '#202124');
    setSectionStyles(config?.sections || createDefaultSectionStyles());
    setExpandedSection(null);
    setShowCreateModal(true);
  };

  const updateSectionStyle = (section: ThemeSection, update: Partial<ThemeSectionStyle>) => {
    setSectionStyles((current) => ({
      ...current,
      [section]: { ...current[section], ...update },
    }));
  };

  const handleSaveTheme = () => {
    const name = customName.trim();
    if (!name) {
      Alert.alert('Theme name required', 'Enter a name for your custom theme.');
      return;
    }

    const newTheme = createCustomTheme({
      name,
      accentColor: '#6c5ce7',
      paperColor: '#ffffff',
      fontFamily: fontFamily.trim() || 'Georgia, serif',
      columns: questionColumns,
      mcqAnswerColumns: answerColumns,
      showQuestionDivider,
      questionDividerColor,
      sectionRuleColor,
      sections: sectionStyles,
    });
    const themeKey = registerTheme(newTheme, editingThemeKey || undefined);
    void persistTheme(themeKey, {
      name,
      accentColor: '#6c5ce7',
      paperColor: '#ffffff',
      fontFamily: fontFamily.trim() || 'Georgia, serif',
      columns: questionColumns,
      mcqAnswerColumns: answerColumns,
      showQuestionDivider,
      questionDividerColor,
      sectionRuleColor,
      sections: sectionStyles,
    }, editingThemeKey || undefined);
    setThemeName(themeKey);
    setShowCreateModal(false);
    setEditingThemeKey(null);
    setCustomName('');
    setExpandedSection(null);
  };

  const persistTheme = async (key: string, config: CustomThemeConfig, previousKey?: string) => {
    try {
      const saved = await AsyncStorage.getItem(SAVED_THEMES_KEY);
      const savedThemes = saved ? JSON.parse(saved) as SavedTheme[] : [];
      const withoutPrevious = savedThemes.filter((theme) => theme.key !== previousKey && theme.key !== key);
      await AsyncStorage.setItem(SAVED_THEMES_KEY, JSON.stringify([...withoutPrevious, { key, config }]));
    } catch (error) {
      console.error('Theme save error:', error);
    }
  };

  const openColorPicker = (target: Exclude<typeof colorTarget, null>, initialColor: string, section?: ThemeSection) => {
    setColorTarget(target);
    setColorSection(section || null);
    setPickerColor(initialColor);
  };

  const chooseColor = (color: string) => {
    if (colorTarget === 'section' && colorSection) updateSectionStyle(colorSection, { color });
    if (colorTarget === 'question') setQuestionDividerColor(color);
    if (colorTarget === 'rule') setSectionRuleColor(color);
    setColorTarget(null);
    setColorSection(null);
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
          <TouchableOpacity onPress={openCreateEditor} style={styles.addButton} accessibilityLabel="Create a custom theme">
            <Ionicons name="add-circle" size={32} color="#2ecc71" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Select a theme for your generated PDF exam paper.</Text>
        
        <View style={styles.themeList}>
          {Object.entries(themes).map(([themeKey, theme]) => (
            <View
              key={themeKey}
              style={[styles.themeCard, themeName === themeKey && styles.activeCard]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.themeName}>{theme.name}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => setPreviewThemeKey(themeKey)} accessibilityLabel={`Preview ${theme.name}`}>
                    <Ionicons name="eye-outline" size={22} color="#0984e3" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleSelectTheme(themeKey)} accessibilityLabel={`Select ${theme.name}`}>
                    <Ionicons name="checkmark-circle" size={28} color={themeName === themeKey ? '#2ecc71' : '#b2bec3'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openThemeEditor(themeKey, theme)} accessibilityLabel={`Edit ${theme.name}`}>
                    <Ionicons name="pencil" size={22} color="#636e72" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.createModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingThemeKey ? 'Edit Theme' : 'Create Your Theme'}</Text>
              <TouchableOpacity onPress={() => { setShowCreateModal(false); setEditingThemeKey(null); }}>
                <Ionicons name="close-circle" size={30} color="#e74c3c" />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Theme name" value={customName} onChangeText={setCustomName} />
            <ScrollView style={styles.editorList} keyboardShouldPersistTaps="handled">
              {themeSections.map(({ key, label }) => {
                const section = sectionStyles[key];
                const isExpanded = expandedSection === key;
                return (
                  <View key={key} style={styles.sectionEditor}>
                    <TouchableOpacity style={styles.sectionHeader} onPress={() => setExpandedSection(isExpanded ? null : key)}>
                      <Text style={styles.sectionLabel}>{label}</Text>
                      <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#636e72" />
                    </TouchableOpacity>
                    {isExpanded && (
                      <View style={styles.sectionControls}>
                        <Text style={styles.controlLabel}>Font</Text>
                        <View style={styles.optionRow}>
                          {['Georgia', 'Arial', 'Times New Roman', 'Courier New'].map((font) => (
                            <TouchableOpacity key={font} style={[styles.option, section.fontFamily.startsWith(font) && styles.selectedOption]} onPress={() => updateSectionStyle(key, { fontFamily: `${font}, serif` })}>
                              <Text style={styles.optionText}>{font}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <Text style={styles.controlLabel}>Size</Text>
                        <View style={styles.pickerWrapper}>
                          <Picker selectedValue={section.fontSize} onValueChange={(size) => updateSectionStyle(key, { fontSize: String(size) })}>
                            {Array.from({ length: 65 }, (_, index) => String(index + 8)).map((size) => (
                              <Picker.Item key={size} label={`${size}px`} value={size} />
                            ))}
                          </Picker>
                        </View>
                        <Text style={styles.controlLabel}>Color</Text>
                        <TouchableOpacity style={styles.colorChoice} onPress={() => openColorPicker('section', section.color, key)}>
                          <View style={[styles.colorDot, { backgroundColor: section.color }]} />
                          <Text style={styles.optionText}>{section.color}</Text>
                        </TouchableOpacity>
                        <Text style={styles.controlLabel}>Alignment</Text>
                        <View style={styles.optionRow}>
                          {(['left', 'center', 'right', 'justify'] as const).map((alignment) => (
                            <TouchableOpacity key={alignment} style={[styles.option, section.alignment === alignment && styles.selectedOption]} onPress={() => updateSectionStyle(key, { alignment })}>
                              <Text style={styles.optionText}>{alignment}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <View style={styles.toggleRow}>
                          {([
                            ['bold', 'B'],
                            ['italic', 'I'],
                            ['underline', 'U'],
                          ] as const).map(([property, icon]) => (
                            <TouchableOpacity key={property} style={[styles.formatToggle, section[property] && styles.activeFormatToggle]} onPress={() => updateSectionStyle(key, { [property]: !section[property] })}>
                              <Text style={[styles.formatText, property === 'bold' && styles.boldText, property === 'italic' && styles.italicText, property === 'underline' && styles.underlineText]}>{icon}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
              <Text style={styles.controlLabel}>MCQ question columns</Text>
              <View style={styles.segmentedControl}>
                {[1, 2].map((value) => (
                  <TouchableOpacity key={value} style={[styles.segment, questionColumns === value && styles.selectedSegment]} onPress={() => setQuestionColumns(value as 1 | 2)}>
                    <Text style={[styles.segmentText, questionColumns === value && styles.selectedSegmentText]}>{value}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={[styles.lineToggle, showQuestionDivider && styles.selectedSegment]} onPress={() => setShowQuestionDivider(!showQuestionDivider)} accessibilityLabel="Toggle MCQ question column line">
                  <Ionicons name="remove" size={22} color={showQuestionDivider ? '#fff' : '#636e72'} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.colorDot, { backgroundColor: questionDividerColor }]} onPress={() => setColorTarget('question')} accessibilityLabel="Choose MCQ question divider color" />
              </View>
              <Text style={styles.controlLabel}>Section rule color</Text>
              <TouchableOpacity style={styles.colorChoice} onPress={() => openColorPicker('rule', sectionRuleColor)}>
                <View style={[styles.colorDot, { backgroundColor: sectionRuleColor }]} />
                <Text style={styles.optionText}>{sectionRuleColor}</Text>
              </TouchableOpacity>
              <Text style={styles.controlLabel}>MCQ answer columns</Text>
              <View style={styles.segmentedControl}>
                {[1, 2].map((value) => (
                  <TouchableOpacity key={value} style={[styles.segment, answerColumns === value && styles.selectedSegment]} onPress={() => setAnswerColumns(value as 1 | 2)}>
                    <Text style={[styles.segmentText, answerColumns === value && styles.selectedSegmentText]}>{value}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.createButton} onPress={handleSaveTheme}>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.createButtonText}>{editingThemeKey ? 'Save Changes' : 'Create Theme'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={colorTarget !== null} animationType="slide" transparent onRequestClose={() => setColorTarget(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.colorModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Divider Color</Text>
              <TouchableOpacity onPress={() => setColorTarget(null)}><Ionicons name="close-circle" size={30} color="#e74c3c" /></TouchableOpacity>
            </View>
            <View style={styles.colorWheel}>
              <ColorPicker
                color={pickerColor}
                onColorChange={setPickerColor}
                thumbSize={30}
                sliderSize={24}
                noSnap
                row={false}
                swatches
                useNativeDriver={false}
                useNativeLayout={false}
              />
            </View>
            <TouchableOpacity style={styles.createButton} onPress={() => chooseColor(pickerColor)}>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.createButtonText}>Apply Color</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={previewThemeKey !== null} animationType="slide" onRequestClose={() => setPreviewThemeKey(null)}>
        <SafeAreaView style={styles.previewModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{previewThemeKey ? themes[previewThemeKey]?.name : 'Preview'}</Text>
            <TouchableOpacity onPress={() => setPreviewThemeKey(null)}><Ionicons name="close-circle" size={32} color="#e74c3c" /></TouchableOpacity>
          </View>
          {previewThemeKey && <WebView source={{ html: getExamHtmlContent(previewThemeKey, schoolName, className, date, totalMarks, logoUri, topic, sectionTitle, showSectionRule, sectionRule, sectionStart, sectionEnd, sections, questions) }} />}
        </SafeAreaView>
      </Modal>
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
  addButton: {
    marginLeft: 'auto',
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
    marginBottom: 0,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  themeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  createModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 10,
    fontSize: 15,
  },
  editorList: {
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  sectionEditor: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: '#f8f9fa',
  },
  sectionLabel: {
    color: '#2c3e50',
    fontSize: 15,
    fontWeight: '600',
  },
  sectionControls: {
    padding: 12,
    backgroundColor: '#fff',
  },
  controlLabel: {
    color: '#636e72',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  option: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  smallOption: {
    minWidth: 38,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 6,
    paddingVertical: 7,
  },
  selectedOption: {
    backgroundColor: '#e8f8ef',
    borderColor: '#2ecc71',
  },
  optionText: {
    color: '#2c3e50',
    fontSize: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  formatToggle: {
    width: 38,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#f1f2f6',
  },
  activeFormatToggle: {
    backgroundColor: '#d5f5e3',
  },
  formatText: {
    color: '#2c3e50',
    fontSize: 17,
  },
  boldText: {
    fontWeight: 'bold',
  },
  italicText: {
    fontStyle: 'italic',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  fieldLabel: {
    color: '#2c3e50',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f1f2f6',
  },
  selectedSegment: {
    backgroundColor: '#6c5ce7',
  },
  segmentText: {
    color: '#2c3e50',
    fontWeight: '600',
  },
  selectedSegmentText: {
    color: '#fff',
  },
  lineToggle: {
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f1f2f6',
  },
  dividerToggle: {
    width: 42,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f1f2f6',
  },
  colorDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#636e72',
  },
  colorChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  colorModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '85%',
  },
  colorWheel: {
    height: 460,
    width: '100%',
    backgroundColor: '#fff',
  },
  previewModal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  createButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    paddingVertical: 13,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});