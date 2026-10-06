import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Animated, Dimensions, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { sideDrawerStyles as styles } from '../../styles/appStyles';

const { width } = Dimensions.get('window');

interface SideDrawerProps {
  isOpen: boolean;
  slideAnim: Animated.Value;
  onClose: (callback?: () => void) => void;
}

export default function SideDrawer({ isOpen, slideAnim, onClose }: SideDrawerProps) {
  if (!isOpen && (slideAnim as any)._value === -width) return null;

  return (
    <>
      {/* Dark Overlay */}
      <Pressable style={styles.overlay} onPress={() => onClose()} />
      
      {/* Animated Drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.profileSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color="#007bff" />
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userRole}>Educator</Text>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => onClose(() => router.push('/themes'))}>
            <Ionicons name="color-palette-outline" size={22} color="#555" />
            <Text style={styles.menuText}>Themes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => onClose()}>
            <Ionicons name="information-circle-outline" size={22} color="#555" />
            <Text style={styles.menuText}>About</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutItem} onPress={() => onClose()}>
            <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.version}>v1.0.4 - 2026 Edition</Text>
      </Animated.View>
    </>
  );
}
