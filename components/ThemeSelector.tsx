import { Ionicons } from '@expo/vector-icons';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExam } from '../services/examContext';
import { themes } from '../services/pdfThemes';
import { themeSelectorStyles as styles } from '../styles/themeSelectorStyles';

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

