import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
  StatusBar,
} from 'react-native';
import { usePlayerStore } from '@pandoos/shared/stores/usePlayerStore';
import { PANDA_THEME } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface NowPlayingScreenProps {
  onClose: () => void;
}

export default function NowPlayingScreen({ onClose }: NowPlayingScreenProps) {
  // ✅ Use correct store method names: nextTrack/prevTrack (not playNext/playPrev)
  const { currentTrack, isPlaying, togglePlayPause, nextTrack, prevTrack, progress, duration } =
    usePlayerStore();

  // Swipe-down to close gesture
  const translateY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Animated rotating album art
  const rotation = useRef(new Animated.Value(0)).current;
  const rotationLoop = useRef<Animated.CompositeAnimation | null>(null);

  React.useEffect(() => {
    if (isPlaying) {
      rotationLoop.current = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 12000,
          useNativeDriver: true,
        })
      );
      rotationLoop.current.start();
    } else {
      rotationLoop.current?.stop();
    }
  }, [isPlaying]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressPercent = duration > 0 ? (progress / duration) : 0;
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // ✅ Use correct Track field: albumArt (not thumbnail)
  const artUri = currentTrack?.albumArt ?? 'https://i.pravatar.cc/400';

  return (
    // ✅ Use StyleSheet.absoluteFill (not absoluteFillObject)
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.container, { transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      <StatusBar barStyle="light-content" />

      {/* Drag handle */}
      <View style={styles.dragHandle} />

      {/* Album Art — rotating disk */}
      <View style={styles.artContainer}>
        <Animated.Image
          source={{ uri: artUri }}
          style={[styles.albumArt, { transform: [{ rotate: spin }] }]}
        />
        {/* Center hole for vinyl effect */}
        <View style={styles.vinylHole} />
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {currentTrack?.title ?? 'Nothing playing'}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {currentTrack?.artist ?? 'Select a track'}
        </Text>
      </View>

      {/* Progress Bar */}
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

      {/* Controls */}
      <View style={styles.controls}>
        {/* ✅ prevTrack / nextTrack are the correct store actions */}
        <TouchableOpacity style={styles.controlBtn} onPress={prevTrack}>
          <Text style={styles.controlIcon}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playPauseBtn} onPress={togglePlayPause}>
          <Text style={styles.playPauseIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn} onPress={nextTrack}>
          <Text style={styles.controlIcon}>⏭</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PANDA_THEME.colors.obsidian,
    alignItems: 'center',
    paddingHorizontal: PANDA_THEME.spacing.l,
    paddingTop: 60,
    zIndex: 999,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: PANDA_THEME.colors.muted,
    marginBottom: PANDA_THEME.spacing.l,
  },
  artContainer: {
    position: 'relative',
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: PANDA_THEME.spacing.xl,
  },
  albumArt: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    borderWidth: 4,
    borderColor: PANDA_THEME.colors.bamboo,
  },
  vinylHole: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PANDA_THEME.colors.obsidian,
    borderWidth: 2,
    borderColor: PANDA_THEME.colors.muted,
  },
  trackInfo: {
    width: '100%',
    alignItems: 'center',
    marginBottom: PANDA_THEME.spacing.m,
  },
  trackTitle: {
    color: PANDA_THEME.colors.snow,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artistName: {
    color: PANDA_THEME.colors.muted,
    fontSize: 16,
    marginTop: 4,
  },
  progressContainer: {
    width: '100%',
    marginVertical: PANDA_THEME.spacing.m,
  },
  progressBar: {
    height: 4,
    backgroundColor: PANDA_THEME.colors.surface,
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PANDA_THEME.colors.bamboo,
    borderRadius: 2,
  },
  progressDot: {
    position: 'absolute',
    top: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: PANDA_THEME.colors.bamboo,
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
    marginTop: 8,
  },
  timeText: {
    color: PANDA_THEME.colors.muted,
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    marginTop: PANDA_THEME.spacing.l,
  },
  controlBtn: {
    padding: PANDA_THEME.spacing.s,
  },
  controlIcon: {
    fontSize: 32,
    color: PANDA_THEME.colors.snow,
  },
  playPauseBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: PANDA_THEME.colors.bamboo,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PANDA_THEME.colors.bamboo,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  playPauseIcon: {
    fontSize: 28,
    color: PANDA_THEME.colors.obsidian,
  },
});
