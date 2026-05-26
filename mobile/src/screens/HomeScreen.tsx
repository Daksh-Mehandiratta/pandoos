import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { PANDA_THEME } from '../theme';
import { usePlayerStore } from '@pandoos/shared/stores/usePlayerStore';
import { useSyncPlayerState } from '../hooks/useSyncPlayerState';

export default function HomeScreen() {
  useSyncPlayerState(); // Keeps TrackPlayer and Zustand in perfect sync
  const { currentTrack, isPlaying, togglePlayPause } = usePlayerStore();

  const handlePlayPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    togglePlayPause();
  };

  const renderCard = useCallback(({ item }: { item: number }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: `https://picsum.photos/seed/${item}/200` }}
        style={styles.cardImagePlaceholder}
        contentFit="cover"
        transition={300}
      />
      <Text style={styles.cardTitle}>Panda Mix {item} 🐼</Text>
    </TouchableOpacity>
  ), []);

  const data = [1, 2, 3, 4, 5, 6];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Evening, Panda</Text>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100' }} 
            style={styles.avatar} 
            transition={300}
          />
        </View>

        <Text style={styles.sectionTitle}>Trending Now</Text>
        <View style={styles.listContainer}>
          <FlashList
            data={data}
            renderItem={renderCard}
            estimatedItemSize={140}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: PANDA_THEME.spacing.m }}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Made for You</Text>
        <View style={styles.listContainer}>
          <FlashList
            data={[7, 8, 9, 10]}
            renderItem={renderCard}
            estimatedItemSize={140}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: PANDA_THEME.spacing.m }}
          />
        </View>
        
        {/* Padding for mini player */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Mini Player */}
      <TouchableOpacity 
        style={styles.miniPlayer} 
        activeOpacity={0.9}
      >
        <View style={styles.miniPlayerLeft}>
          <Image 
            source={{ uri: (currentTrack as any)?.thumbnail || 'https://i.pravatar.cc/100' }}
            style={styles.miniPlayerArt}
            transition={300}
          />
          <View>
            <Text style={styles.trackTitle}>{currentTrack?.title || 'No track playing'}</Text>
            <Text style={styles.artistName}>{currentTrack?.artist || 'Select a song 🐼'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          <Text style={styles.playButtonText}>{isPlaying ? '||' : '▶'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PANDA_THEME.colors.obsidian,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: PANDA_THEME.spacing.m,
    marginTop: PANDA_THEME.spacing.xl,
  },
  greeting: {
    color: PANDA_THEME.colors.snow,
    fontSize: 28,
    fontWeight: '800',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: PANDA_THEME.colors.bamboo,
  },
  sectionTitle: {
    color: PANDA_THEME.colors.snow,
    fontSize: 22,
    fontWeight: '700',
    marginHorizontal: PANDA_THEME.spacing.m,
    marginTop: PANDA_THEME.spacing.l,
    marginBottom: PANDA_THEME.spacing.m,
  },
  listContainer: {
    height: 180,
  },
  card: {
    marginRight: PANDA_THEME.spacing.m,
    width: 140,
  },
  cardImagePlaceholder: {
    width: 140,
    height: 140,
    backgroundColor: PANDA_THEME.colors.surface,
    borderRadius: PANDA_THEME.borderRadius.l,
    marginBottom: PANDA_THEME.spacing.s,
  },
  cardTitle: {
    color: PANDA_THEME.colors.snow,
    fontSize: 14,
    fontWeight: '600',
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(18, 18, 22, 0.95)',
    padding: PANDA_THEME.spacing.s,
    borderRadius: PANDA_THEME.borderRadius.l,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(30, 215, 96, 0.3)', // Bamboo tint
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  miniPlayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniPlayerArt: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  trackTitle: {
    color: PANDA_THEME.colors.snow,
    fontSize: 15,
    fontWeight: '700',
  },
  artistName: {
    color: PANDA_THEME.colors.bamboo,
    fontSize: 13,
    fontWeight: '500',
  },
  playButton: {
    width: 44,
    height: 44,
    backgroundColor: PANDA_THEME.colors.bamboo,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  playButtonText: {
    color: PANDA_THEME.colors.obsidian,
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 2,
  }
});
