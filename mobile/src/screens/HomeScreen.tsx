import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { PANDA_THEME } from '../theme';
import { usePlayerStore } from '@pandoos/shared/stores/usePlayerStore';
import { useSyncPlayerState } from '../hooks/useSyncPlayerState';

export default function HomeScreen() {
  useSyncPlayerState(); // Keeps TrackPlayer and Zustand in perfect sync
  const { currentTrack, isPlaying, togglePlayPause } = usePlayerStore();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Evening</Text>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/100' }} 
          style={styles.avatar} 
        />
      </View>

      <Text style={styles.sectionTitle}>Trending Now</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {[1, 2, 3, 4].map((item) => (
          <TouchableOpacity key={item} style={styles.card}>
            <View style={styles.cardImagePlaceholder} />
            <Text style={styles.cardTitle}>Panda Mix {item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Mini Player demonstrating shared state */}
      <View style={styles.miniPlayer}>
        <View>
          <Text style={styles.trackTitle}>{currentTrack?.title || 'No track playing'}</Text>
          <Text style={styles.artistName}>{currentTrack?.artist || 'Select a song'}</Text>
        </View>
        <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
          <Text style={styles.playButtonText}>{isPlaying ? '||' : '▶'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PANDA_THEME.colors.obsidian,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: PANDA_THEME.spacing.m,
    marginTop: PANDA_THEME.spacing.l,
  },
  greeting: {
    color: PANDA_THEME.colors.snow,
    fontSize: 28,
    fontWeight: 'bold',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: PANDA_THEME.borderRadius.round,
  },
  sectionTitle: {
    color: PANDA_THEME.colors.snow,
    fontSize: 22,
    fontWeight: '600',
    marginHorizontal: PANDA_THEME.spacing.m,
    marginTop: PANDA_THEME.spacing.m,
    marginBottom: PANDA_THEME.spacing.s,
  },
  horizontalScroll: {
    paddingLeft: PANDA_THEME.spacing.m,
  },
  card: {
    marginRight: PANDA_THEME.spacing.m,
    width: 140,
  },
  cardImagePlaceholder: {
    width: 140,
    height: 140,
    backgroundColor: PANDA_THEME.colors.surface,
    borderRadius: PANDA_THEME.borderRadius.m,
    marginBottom: PANDA_THEME.spacing.xs,
  },
  cardTitle: {
    color: PANDA_THEME.colors.snow,
    fontSize: 14,
    fontWeight: '500',
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: PANDA_THEME.colors.surface,
    padding: PANDA_THEME.spacing.m,
    borderRadius: PANDA_THEME.borderRadius.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PANDA_THEME.colors.glass,
  },
  trackTitle: {
    color: PANDA_THEME.colors.snow,
    fontSize: 16,
    fontWeight: 'bold',
  },
  artistName: {
    color: PANDA_THEME.colors.muted,
    fontSize: 14,
  },
  playButton: {
    width: 40,
    height: 40,
    backgroundColor: PANDA_THEME.colors.bamboo,
    borderRadius: PANDA_THEME.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: PANDA_THEME.colors.obsidian,
    fontSize: 18,
    fontWeight: 'bold',
  }
});
