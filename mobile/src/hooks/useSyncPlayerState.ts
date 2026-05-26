import { useEffect } from 'react';
import TrackPlayer, { Event, State, useTrackPlayerEvents } from 'react-native-track-player';
import { usePlayerStore } from '@pandoos/shared/stores/usePlayerStore';

export function useSyncPlayerState() {
  const togglePlayPause = usePlayerStore((state) => state.togglePlayPause);

  // Sync background/lock-screen play/pause events with Zustand
  useTrackPlayerEvents([Event.PlaybackState], async (event: any) => {
    const isZustandPlaying = usePlayerStore.getState().isPlaying;
    
    if (event.state === State.Playing && !isZustandPlaying) {
      togglePlayPause();
    } else if (event.state === State.Paused && isZustandPlaying) {
      togglePlayPause();
    }
  });

  // Watch Zustand state changes and command TrackPlayer accordingly
  useEffect(() => {
    const unsubscribe = usePlayerStore.subscribe(async (state, prevState) => {
      if (state.isPlaying !== prevState.isPlaying) {
        if (state.isPlaying) {
          await TrackPlayer.play();
        } else {
          await TrackPlayer.pause();
        }
      }
    });

    return unsubscribe;
  }, []);
}
