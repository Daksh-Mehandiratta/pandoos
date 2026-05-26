import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSpring,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePlayerStore } from '@pandoos/shared/stores/usePlayerStore';
import { PANDA_THEME } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface NowPlayingScreenProps {
  onClose: () => void;
}

export default function NowPlayingScreen({ onClose }: NowPlayingScreenProps) {
  const { currentTrack, isPlaying, togglePlayPause, nextTrack, prevTrack, progress, duration } = usePlayerStore();

  const rotation = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      rotation.value = withRepeat(
        withTiming(rotation.value + 360, { duration: 12000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      const currentRotation = rotation.value;
      rotation.value = currentRotation;
    }
  }, [isPlaying]);

  const animatedArtStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 150 || event.velocityY > 1000) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  const handlePlayPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    togglePlayPause();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    nextTrack();
  };

  const handlePrev = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    prevTrack();
  };

  const progressPercent = duration > 0 ? (progress / duration) : 0;
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const artUri = (currentTrack as any)?.albumArt || (currentTrack as any)?.thumbnail || 'https://i.pravatar.cc/400';

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.container, animatedContainerStyle]}>
          <StatusBar barStyle="light-content" />
          
          <LinearGradient
            colors={[PANDA_THEME.colors.obsidian, '#0a1a0f', PANDA_THEME.colors.obsidian]}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.content}>
            <View style={styles.dragHandle} />
            <Text style={styles.watermark}>🐼 Panda Audio Engine</Text>

            <View style={styles.artContainer}>
              <Animated.View style={[styles.albumArtWrapper, animatedArtStyle]}>
                <Image
                  source={{ uri: artUri }}
                  style={styles.albumArt}
                  contentFit="cover"
                  transition={500}
                />
              </Animated.View>
              <View style={styles.vinylHole} />
            </View>

            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle} numberOfLines={1}>
                {currentTrack?.title ?? 'Nothing playing 🐼'}
              </Text>
              <Text style={styles.artistName} numberOfLines={1}>
                {currentTrack?.artist ?? 'Select a track'}
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressPercent * 100}%` }]} />
                <View style={[styles.progressDot, { left: `${progressPercent * 100}%` }]} />
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>{formatTime(progress ?? 0)}</Text>
                <Text style={styles.timeText}>{formatTime(duration ?? 0)}</Text>
              </View>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity style={styles.controlBtn} onPress={handlePrev}>
                <Text style={styles.controlIcon}>⏮</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.playPauseBtn} onPress={handlePlayPause}>
                <Text style={styles.playPauseIcon}>{isPlaying ? '⏸' : '▶'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlBtn} onPress={handleNext}>
                <Text style={styles.controlIcon}>⏭</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 999,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: PANDA_THEME.spacing.l,
    paddingTop: 60,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: PANDA_THEME.spacing.m,
  },
  watermark: {
    color: PANDA_THEME.colors.bamboo,
    opacity: 0.8,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  artContainer: {
    position: 'relative',
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: PANDA_THEME.spacing.xl,
    shadowColor: PANDA_THEME.colors.bamboo,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  albumArtWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(30, 215, 96, 0.3)',
  },
  albumArt: {
    width: '100%',
    height: '100%',
  },
  vinylHole: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PANDA_THEME.colors.obsidian,
    borderWidth: 2,
    borderColor: '#333',
  },
  trackInfo: {
    width: '100%',
    alignItems: 'center',
    marginBottom: PANDA_THEME.spacing.l,
  },
  trackTitle: {
    color: PANDA_THEME.colors.snow,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  artistName: {
    color: PANDA_THEME.colors.bamboo,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  progressContainer: {
    width: '100%',
    marginVertical: PANDA_THEME.spacing.m,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PANDA_THEME.colors.bamboo,
    borderRadius: 3,
  },
  progressDot: {
    position: 'absolute',
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: PANDA_THEME.colors.snow,
    marginLeft: -7,
    shadowColor: PANDA_THEME.colors.bamboo,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    marginTop: PANDA_THEME.spacing.xl,
  },
  controlBtn: {
    padding: PANDA_THEME.spacing.s,
  },
  controlIcon: {
    fontSize: 32,
    color: PANDA_THEME.colors.snow,
  },
  playPauseBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PANDA_THEME.colors.bamboo,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PANDA_THEME.colors.bamboo,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  playPauseIcon: {
    fontSize: 32,
    color: PANDA_THEME.colors.obsidian,
  },
});
