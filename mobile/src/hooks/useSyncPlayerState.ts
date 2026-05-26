import { useEffect, useRef } from 'react';
import TrackPlayer, { useProgress, State } from 'react-native-track-player';
import { usePlayerStore } from '@pandoos/shared/stores/usePlayerStore';

export function useSyncPlayerState() {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const seekVersion = usePlayerStore((s) => s.seekVersion);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const nextTrack = usePlayerStore((s) => s.nextTrack);
  const progressState = usePlayerStore((s) => s.progress);

  const { position, duration } = useProgress(500);

  // 1. Sync Track (Zustand -> TrackPlayer)
  useEffect(() => {
    async function loadTrack() {
      if (!currentTrack) {
        await TrackPlayer.reset();
        return;
      }
      
      const audioUrl = (currentTrack as any).audioUrl || (currentTrack as any).streamUrl || currentTrack.localUri || '';
      
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: currentTrack.videoId || currentTrack.id,
        url: audioUrl,
        title: currentTrack.title,
        artist: currentTrack.artist || 'Unknown Artist',
        artwork: (currentTrack as any).thumbnail || (currentTrack as any).albumArt,
      });
      
      if (isPlaying) {
        await TrackPlayer.play();
      }
    }
    loadTrack();
  }, [currentTrack]);

  // 2. Sync Play/Pause
  useEffect(() => {
    async function syncPlayState() {
      const stateObj = await TrackPlayer.getPlaybackState();
      const isTrackPlayerPlaying = stateObj.state === State.Playing;
      
      if (isPlaying && !isTrackPlayerPlaying) {
        await TrackPlayer.play();
      } else if (!isPlaying && isTrackPlayerPlaying) {
        await TrackPlayer.pause();
      }
    }
    syncPlayState();
  }, [isPlaying]);

  // 3. Sync Seeks
  const lastSeekVersion = useRef(seekVersion);
  useEffect(() => {
    if (seekVersion > lastSeekVersion.current) {
      TrackPlayer.seekTo(progressState);
      lastSeekVersion.current = seekVersion;
    }
  }, [seekVersion, progressState]);

  // 4. Sync Progress & Auto-Next
  const autoNextFired = useRef(false);
  useEffect(() => {
    if (position > 0) setProgress(position);
    if (duration > 0) setDuration(duration);
    
    // Auto next track when finished
    if (position > 0 && duration > 0 && duration - position < 0.5) {
      if (!autoNextFired.current) {
        autoNextFired.current = true;
        nextTrack();
      }
    } else {
      autoNextFired.current = false;
    }
  }, [position, duration, setProgress, setDuration, nextTrack]);
}
