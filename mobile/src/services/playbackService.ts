import TrackPlayer, { Event } from 'react-native-track-player';
import { usePlayerStore } from '@pandoos/shared/stores/usePlayerStore';

export const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => usePlayerStore.getState().resumeTrack());
  TrackPlayer.addEventListener(Event.RemotePause, () => usePlayerStore.getState().pauseTrack());
  TrackPlayer.addEventListener(Event.RemoteNext, () => usePlayerStore.getState().nextTrack());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => usePlayerStore.getState().prevTrack());
  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => usePlayerStore.getState().seekTo(position));
};
