import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PANDA_THEME } from '../theme';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search (Panda Theme)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
