// @ts-nocheck
import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { PROGRESS_INTERVAL_MS } from '@/utils/constants';

/**
 * useAudioEngine — The core bridge between Zustand and the YouTube IFrame API.
 * 
 * Architecture:
 * - This hook mounts EXACTLY ONCE (in App.tsx).
 * - It creates a hidden YouTube IFrame.
 * - It subscribes to usePlayerStore and commands the IFrame.
 * - It listens to IFrame events and updates usePlayerStore.
 * - This decoupled design means UI components NEVER touch the audio directly;
 *   they just call `playTrack()` on the store, and this hook handles the rest.
 */
export function useAudioEngine() {
  const playerRef = useRef<YT.Player | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Read state we need to react to
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const volume = usePlayerStore((state) => state.volume);
  const isMuted = usePlayerStore((state) => state.isMuted);
  const progress = usePlayerStore((state) => state.progress);

  // Store actions
  const setDuration = usePlayerStore((state) => state.setDuration);
  const setProgress = usePlayerStore((state) => state.setProgress);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const setIsLoading = usePlayerStore((state) => state.setIsLoading);
  const nextTrack = usePlayerStore((state) => state.nextTrack);

  // 1. Initialize YouTube IFrame API
  useEffect(() => {
    // The script is loaded in index.html. We wait for it to be ready.
    const initPlayer = () => {
      playerRef.current = new window.YT.Player('yt-player-root', {
        height: '1',
        width: '1',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          playsinline: 1, // Crucial for iOS WebView background play
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            // Apply initial volume
            event.target.setVolume(volume * 100);
            if (isMuted) event.target.mute();
          },
          onStateChange: (event) => {
            switch (event.data) {
              case window.YT.PlayerState.PLAYING:
                setIsLoading(false);
                setIsPlaying(true);
                setDuration(event.target.getDuration());
                startProgressTracker();
                break;
              case window.YT.PlayerState.PAUSED:
                setIsPlaying(false);
                stopProgressTracker();
                break;
              case window.YT.PlayerState.ENDED:
                setIsPlaying(false);
                stopProgressTracker();
                nextTrack(); // Auto-advance queue
                break;
              case window.YT.PlayerState.BUFFERING:
                setIsLoading(true);
                break;
            }
          },
          onError: (event) => {
            console.error('YouTube Player Error:', event.data);
            setIsLoading(false);
            // On unplayable track, skip to next to prevent dead lock
            setTimeout(nextTrack, 1000);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      stopProgressTracker();
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Track Progress Tracker
  const startProgressTracker = () => {
    stopProgressTracker();
    progressIntervalRef.current = window.setInterval(() => {
      if (playerRef.current && playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        if (duration > 0) {
          setProgress(currentTime / duration);
        }
      }
    }, PROGRESS_INTERVAL_MS);
  };

  const stopProgressTracker = () => {
    if (progressIntervalRef.current !== null) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // 3. React to Track Changes
  useEffect(() => {
    if (!playerRef.current || !currentTrack) return;
    
    // loadVideoById automatically starts playback.
    // cueVideoById prepares it without playing (if we want paused state).
    if (isPlaying) {
      playerRef.current.loadVideoById(currentTrack.videoId);
      setIsLoading(true);
    } else {
      playerRef.current.cueVideoById(currentTrack.videoId);
    }
  }, [currentTrack?.videoId]); // Only run when the ID changes

  // 4. React to Play/Pause (when toggled via UI without changing track)
  useEffect(() => {
    if (!playerRef.current || !currentTrack) return;
    
    const state = playerRef.current.getPlayerState();
    if (isPlaying && state !== window.YT.PlayerState.PLAYING && state !== window.YT.PlayerState.BUFFERING) {
      playerRef.current.playVideo();
    } else if (!isPlaying && state === window.YT.PlayerState.PLAYING) {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying, currentTrack]);

  // 5. React to Volume/Mute Changes
  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.setVolume(volume * 100);
    if (isMuted) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
    }
  }, [volume, isMuted]);

  // 6. React to UI Seeking
  // We use a ref to track the last programmatic progress so we don't seek loop
  const lastSetProgress = useRef(progress);
  useEffect(() => {
    if (!playerRef.current || !currentTrack) return;
    
    // If the difference is large, it was a manual UI seek, not the interval tracker
    if (Math.abs(progress - lastSetProgress.current) > 0.02) {
      const duration = playerRef.current.getDuration();
      if (duration > 0) {
        playerRef.current.seekTo(progress * duration, true);
      }
    }
    lastSetProgress.current = progress;
  }, [progress, currentTrack]);
}
