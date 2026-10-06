import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { actionButtonStyles as styles } from '../../styles/appStyles';

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
        style={[styles.btn, styles.exportBtn, { backgroundColor: isActive ? '#2ecc71' : '#dfe6e9' }]} 
        onPress={onExport}
      >
        <Ionicons name="cloud-download-outline" size={20} color={isActive ? "#fff" : "#b2bec3"} />
      </TouchableOpacity>
    </View>
  );
}

