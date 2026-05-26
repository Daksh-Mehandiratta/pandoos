import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Themes and Screens
import { NavigationTheme, PANDA_THEME } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import NowPlayingScreen from './src/screens/NowPlayingScreen';

// Services & Hooks
import { setupPlayer } from './src/services/setupPlayer';
import { useMobileOfflineStore } from './src/store/useMobileOfflineStore';
import { useNotifications } from './src/hooks/useNotifications';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  const initDownloadDir = useMobileOfflineStore((s) => s.initDownloadDir);

  // Register for push notifications on app launch
  useNotifications();

  useEffect(() => {
    async function setup() {
      // 1. Initialize native audio engine
      const isSetup = await setupPlayer();
      setIsPlayerReady(isSetup);
      // 2. Initialize offline download directory
      await initDownloadDir();
    }
    setup();
  }, []);

  if (!isPlayerReady) {
    return (
      <View style={styles.screen}>
        <Text style={styles.pandaEmoji}>🐼</Text>
        <Text style={styles.text}>Loading Panda Audio Engine...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={NavigationTheme}>
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: PANDA_THEME.colors.obsidian },
            headerTintColor: PANDA_THEME.colors.snow,
            tabBarStyle: {
              backgroundColor: PANDA_THEME.colors.obsidian,
              borderTopColor: PANDA_THEME.colors.surface,
              height: 60,
              paddingBottom: 8,
            },
            tabBarActiveTintColor: PANDA_THEME.colors.bamboo,
            tabBarInactiveTintColor: PANDA_THEME.colors.muted,
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Library" component={LibraryScreen} />
        </Tab.Navigator>
      </NavigationContainer>

      {/* Global floating Now Playing trigger */}
      {!showNowPlaying && (
        <TouchableOpacity
          style={styles.nowPlayingFab}
          onPress={() => setShowNowPlaying(true)}
        >
          <Text style={styles.nowPlayingFabText}>🎵</Text>
        </TouchableOpacity>
      )}

      {/* Full-screen Now Playing overlay */}
      {showNowPlaying && (
        <NowPlayingScreen onClose={() => setShowNowPlaying(false)} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PANDA_THEME.colors.obsidian,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  pandaEmoji: {
    fontSize: 64,
  },
  text: {
    color: PANDA_THEME.colors.muted,
    fontSize: 16,
    fontWeight: '500',
  },
  nowPlayingFab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: PANDA_THEME.colors.bamboo,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PANDA_THEME.colors.bamboo,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 12,
  },
  nowPlayingFabText: {
    fontSize: 24,
  },
});
