import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface SideDrawerProps {
  isOpen: boolean;
  slideAnim: Animated.Value;
  onClose: () => void;
}

export default function SideDrawer({ isOpen, slideAnim, onClose }: SideDrawerProps) {
  if (!isOpen && (slideAnim as any)._value === -width) return null;

  return (
    <>
      {/* Dark Overlay */}
      <Pressable style={styles.overlay} onPress={onClose} />
      
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
          <TouchableOpacity style={styles.menuItem} onPress={onClose}>
            <Ionicons name="information-circle-outline" size={22} color="#555" />
            <Text style={styles.menuText}>About</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutItem} onPress={onClose}>
            <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.version}>v1.0.4 - 2026 Edition</Text>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99 },
  drawer: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: width * 0.75,
    backgroundColor: '#fff', zIndex: 100, padding: 25, paddingTop: 60,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 10,
  },
  profileSection: { alignItems: 'center', marginBottom: 30, borderBottomWidth: 1, borderColor: '#f0f0f0', paddingBottom: 25 },
  avatarCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#e8f4fd', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  userRole: { fontSize: 13, color: '#95a5a6' },
  menu: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  menuText: { fontSize: 16, marginLeft: 15, color: '#2c3e50', fontWeight: '500' },
  logoutItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, marginTop: 'auto', borderTopWidth: 1, borderColor: '#eee' },
  logoutText: { fontSize: 16, marginLeft: 15, color: '#e74c3c', fontWeight: 'bold' },
  version: { textAlign: 'center', color: '#bdc3c7', fontSize: 10, marginTop: 10 }
});