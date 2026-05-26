import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';

// Placeholder Screens
const HomeScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Home - Pandoos Native</Text>
  </View>
);

const SearchScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Search</Text>
  </View>
);

const LibraryScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Library</Text>
  </View>
);

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#0a0a0f' },
            headerTintColor: '#fff',
            tabBarStyle: { backgroundColor: '#0a0a0f', borderTopColor: '#222' },
            tabBarActiveTintColor: '#1DB954',
            tabBarInactiveTintColor: '#888',
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
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
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  }
});
