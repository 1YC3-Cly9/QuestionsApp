import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ExamProvider } from '../services/examContext';

export default function RootLayout() {
  
  useEffect(() => {
    const hideNav = async () => {
      if (Platform.OS === 'android') {
        // Hides the bottom navigation bar
        await NavigationBar.setVisibilityAsync('hidden');
      }
    };

    hideNav();
  }, []);

  return (
    <SafeAreaProvider>
      <ExamProvider>
        <View style={styles.container}>
        {/* hidden={true} removes the clock/battery bar at the top */}
        <StatusBar hidden={true} />
        
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        </View>
      </ExamProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
});