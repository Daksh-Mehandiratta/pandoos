import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
} from 'react-native-track-player';

/**
 * Configures the native audio session for background music playback using react-native-track-player.
 * Must be called once on app startup before any audio is played.
 */
export const setupPlayer = async (): Promise<boolean> => {
  let isSetup = false;
  try {
    // This method will only reject if player has not been setup yet
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 2,
    });
    await TrackPlayer.setRepeatMode(RepeatMode.Off);
    isSetup = true;
  } finally {
    return isSetup;
  }
};
