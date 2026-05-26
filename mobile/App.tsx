import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';

// Themes and Screens
import { NavigationTheme, PANDA_THEME } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import { setupPlayer } from './src/services/setupPlayer';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    async function setup() {
      const isSetup = await setupPlayer();
      setIsPlayerReady(isSetup);
    }
    setup();
  }, []);

  if (!isPlayerReady) {
    return (
      <View style={styles.screen}>
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
              borderTopColor: PANDA_THEME.colors.surface 
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PANDA_THEME.colors.obsidian,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: PANDA_THEME.colors.snow,
    fontSize: 20,
    fontWeight: 'bold',
  }
});
