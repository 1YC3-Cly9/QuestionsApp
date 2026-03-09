import { Stack } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';

import { ExamProvider } from '../services/examContext';

export default function RootLayout() {
  
  useEffect(() => {
    const hideNav = async () => {
      if (Platform.OS === 'android') {
        // Hides the bottom navigation bar
        await NavigationBar.setVisibilityAsync('hidden');
        
        // FIXED: Using the string as a literal type to satisfy TypeScript
        await NavigationBar.setBehaviorAsync('sticky-immersive' as NavigationBar.NavigationBarBehavior);
      }
    };

    hideNav();
  }, []);

  return (
    <ExamProvider>
      <View style={styles.container}>
        {/* hidden={true} removes the clock/battery bar at the top */}
        <StatusBar hidden={true} />
        
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </ExamProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
});