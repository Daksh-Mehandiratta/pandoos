// @ts-nocheck
import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useGamificationStore } from '@/stores/useGamificationStore';
import { useTasteStore } from '@/stores/useTasteStore';
import { PROGRESS_INTERVAL_MS } from '@/utils/constants';
import audioClock from '@/services/audioClock';
import { getTrackBlob } from '@/services/offlineDB';

/**
 * useAudioEngine — Dual Engine Architecture (YouTube IFrame + HTML5 Audio)
 *
 * ARCHITECTURE NOTE — Stale Closure Safety:
 * The YouTube IFrame player is initialized ONCE inside a useEffect([], []).
 * Its onStateChange callback cannot be replaced after creation, which means
 * it will forever hold references to whatever was in scope at init time.
 *
 * To avoid stale closures we store ALL mutable helpers in refs. The one-time
 * closure calls `fnsRef.current.startProgressTracker()` — which always
 * points to the latest function body and has access to fresh refs.
 */
export function useAudioEngine() {
  const playerRef = useRef<YT.Player | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeEngineRef = useRef<'youtube' | 'local'>('youtube');

  const progressIntervalRef = useRef<number | null>(null);
  const timeSyncRafRef = useRef<number | null>(null);
  const sessionStartRef = useRef<number | null>(null);
  const ignoreProgressUpdatesRef = useRef<number>(0);

  // ── Stable store-action refs (Zustand setters are stable, but we use
  //    getState() everywhere inside intervals/RAFs to be 100% safe) ──────────
  const seekVersion = usePlayerStore((state) => state.seekVersion);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const volume = usePlayerStore((state) => state.volume);
  const isMuted = usePlayerStore((state) => state.isMuted);

  // ── Helper functions stored in a ref so the one-time YT closure is safe ───
  // We declare the ref first, then populate it below (after the functions are
  // defined). The ref object itself is stable; only .current changes.
  const fnsRef = useRef<{
    startProgressTracker: () => void;
    stopProgressTracker: () => void;
    startTimeSync: () => void;
    stopTimeSync: () => void;
    handleEnded: () => void;
  }>({
    startProgressTracker: () => {},
    stopProgressTracker: () => {},
    startTimeSync: () => {},
    stopTimeSync: () => {},
    handleEnded: () => {},
  });

  // ── Define helpers and immediately write them into fnsRef.current ──────────
  // Using useEffect with no deps ensures they update on every render but the
  // ref pointer is always current when called from the one-time YT closure.

  // Progress tracker — polls the active engine and pushes to the store
  const stopProgressTracker = () => {
    if (progressIntervalRef.current !== null) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const startProgressTracker = () => {
    stopProgressTracker();
    progressIntervalRef.current = window.setInterval(() => {
      // Sleep timer check
      const storeState = usePlayerStore.getState();
      if (storeState.sleepTimerEnd && Date.now() >= storeState.sleepTimerEnd) {
        storeState.pauseTrack();
        storeState.clearSleepTimer();
        return;
      }

      // Suppressed during a user-initiated seek
      if (Date.now() < ignoreProgressUpdatesRef.current) return;

      if (activeEngineRef.current === 'local') {
        const audio = audioRef.current;
        if (audio && !audio.paused) {
          const d = audio.duration;
          if (d > 0 && Number.isFinite(d)) {
            if (usePlayerStore.getState().duration === 0) {
              usePlayerStore.getState().setDuration(d);
            }
            usePlayerStore.getState().setProgress(audio.currentTime / d);
          }
        }
      } else {
        const player = playerRef.current;
        if (player?.getPlayerState) {
          try {
            // YouTube PlayerState.PLAYING is 1
            if (player.getPlayerState() === 1) {
              const d = player.getDuration();
              if (d > 0 && Number.isFinite(d)) {
                if (usePlayerStore.getState().duration === 0) {
                  usePlayerStore.getState().setDuration(d);
                }
                usePlayerStore.getState().setProgress(player.getCurrentTime() / d);
              }
            }
          } catch(e) {}
        }
      }
    }, PROGRESS_INTERVAL_MS);
  };

  // Time sync — high-frequency RAF for lyrics interpolation
  const stopTimeSync = () => {
    if (timeSyncRafRef.current !== null) {
      cancelAnimationFrame(timeSyncRafRef.current);
      timeSyncRafRef.current = null;
    }
    audioClock.isPlaying = false;
  };

  const startTimeSync = () => {
    stopTimeSync();
    let lastReportedTime = -1;
    let lastUpdateTs = performance.now();

    const tick = (ts: number) => {
      if (activeEngineRef.current === 'local') {
        const audio = audioRef.current;
        if (audio) {
          audioClock.isPlaying = !audio.paused;
          if (audioClock.isPlaying) {
            const t = audio.currentTime * 1000;
            if (t !== lastReportedTime) {
              lastReportedTime = t;
              lastUpdateTs = ts;
              audioClock.currentTimeMs = t;
            } else {
              audioClock.currentTimeMs = lastReportedTime + (ts - lastUpdateTs);
            }
          }
        }
      } else {
        const player = playerRef.current;
        if (player?.getCurrentTime && player?.getPlayerState) {
          try {
            audioClock.isPlaying = player.getPlayerState() === 1; // 1 = PLAYING
            if (audioClock.isPlaying) {
              const t = player.getCurrentTime() * 1000;
              if (t !== lastReportedTime) {
                lastReportedTime = t;
                lastUpdateTs = ts;
                audioClock.currentTimeMs = t;
              } else {
                audioClock.currentTimeMs = lastReportedTime + (ts - lastUpdateTs);
              }
            }
          } catch(e) {}
        }
      }
      timeSyncRafRef.current = requestAnimationFrame(tick);
    };
    timeSyncRafRef.current = requestAnimationFrame(tick);
  };

  const handleEnded = () => {
    usePlayerStore.getState().setIsPlaying(false);
    stopProgressTracker();
    stopTimeSync();

    if (sessionStartRef.current) {
      const listenedSec = (Date.now() - sessionStartRef.current) / 1000;
      if (listenedSec > 5) {
        useGamificationStore.getState().recordListenSession(listenedSec);
      }
      const curTrack = usePlayerStore.getState().currentTrack;
      if (curTrack) {
        if (listenedSec < 30) useTasteStore.getState().recordSkip(curTrack);
        else useTasteStore.getState().recordPlay(curTrack);
      }
      sessionStartRef.current = null;
    }
    usePlayerStore.getState().nextTrack();
  };

  // Keep fnsRef.current up to date on every render so the YT closure is safe
  useEffect(() => {
    fnsRef.current = {
      startProgressTracker,
      stopProgressTracker,
      startTimeSync,
      stopTimeSync,
      handleEnded,
    };
  });

  // ── 1. ONE-TIME ENGINE INITIALISATION ─────────────────────────────────────
  useEffect(() => {
    // A. HTML5 Audio (Offline Engine)
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    audio.oncanplay = () => {
      if (activeEngineRef.current !== 'local') return;
      usePlayerStore.getState().setIsLoading(false);
      const d = audio.duration;
      if (d > 0 && Number.isFinite(d)) {
        usePlayerStore.getState().setDuration(d);
      }
      if (usePlayerStore.getState().isPlaying) {
        audio.play().catch(console.error);
      }
    };

    audio.onplay = () => {
      if (activeEngineRef.current !== 'local') return;
      usePlayerStore.getState().setIsLoading(false);
      usePlayerStore.getState().setIsPlaying(true);
      fnsRef.current.startProgressTracker();
      fnsRef.current.startTimeSync();
      if (!sessionStartRef.current) sessionStartRef.current = Date.now();
    };

    audio.onpause = () => {
      if (activeEngineRef.current !== 'local') return;
      usePlayerStore.getState().setIsPlaying(false);
      fnsRef.current.stopProgressTracker();
      fnsRef.current.stopTimeSync();
      if (sessionStartRef.current) {
        const secs = (Date.now() - sessionStartRef.current) / 1000;
        if (secs > 5) useGamificationStore.getState().recordListenSession(secs);
        sessionStartRef.current = null;
      }
    };

    audio.onended = () => {
      if (activeEngineRef.current === 'local') fnsRef.current.handleEnded();
    };

    // B. YouTube IFrame (Online Engine)
    const initYT = () => {
      playerRef.current = new window.YT.Player('yt-player-root', {
        height: '200',
        width: '200',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            const vol = usePlayerStore.getState().volume;
            const muted = usePlayerStore.getState().isMuted;
            event.target.setVolume(vol * 100);
            if (muted) event.target.mute();
            try {
              const iframe = document.querySelector('#yt-player-root iframe') as HTMLIFrameElement;
              if (iframe) iframe.setAttribute('tabindex', '-1');
            } catch (_) {}
          },

          // All calls here go through fnsRef.current — NEVER stale
          onStateChange: (event) => {
            if (activeEngineRef.current !== 'youtube') return;
            switch (event.data) {
              case window.YT.PlayerState.PLAYING: {
                usePlayerStore.getState().setIsLoading(false);
                usePlayerStore.getState().setIsPlaying(true);
                // Set duration immediately — getDuration() is reliable on PLAYING
                const dur = event.target.getDuration();
                if (dur > 0 && Number.isFinite(dur)) {
                  usePlayerStore.getState().setDuration(dur);
                }
                fnsRef.current.startProgressTracker();
                fnsRef.current.startTimeSync();
                if (!sessionStartRef.current) sessionStartRef.current = Date.now();
                break;
              }
              case window.YT.PlayerState.PAUSED: {
                usePlayerStore.getState().setIsLoading(false);
                usePlayerStore.getState().setIsPlaying(false);
                fnsRef.current.stopProgressTracker();
                fnsRef.current.stopTimeSync();
                if (sessionStartRef.current) {
                  const secs = (Date.now() - sessionStartRef.current) / 1000;
                  if (secs > 5) useGamificationStore.getState().recordListenSession(secs);
                  sessionStartRef.current = null;
                }
                break;
              }
              case window.YT.PlayerState.CUED:
              case window.YT.PlayerState.UNSTARTED: {
                usePlayerStore.getState().setIsLoading(false);
                break;
              }
              case window.YT.PlayerState.ENDED: {
                fnsRef.current.handleEnded();
                break;
              }
              case window.YT.PlayerState.BUFFERING: {
                usePlayerStore.getState().setIsLoading(true);
                break;
              }
            }
          },

          onError: async (event) => {
            if (activeEngineRef.current !== 'youtube') return;
            console.error('YouTube Player Error:', event.data);
            const state = usePlayerStore.getState();
            const current = state.currentTrack;
            if (!current) {
              state.setIsLoading(false);
              setTimeout(state.nextTrack, 1000);
              return;
            }
            // Error 150/101: video blocked from embedding — fallback to proxy
            console.log('Falling back to proxy stream for', current.videoId);
            activeEngineRef.current = 'local';
            const a = audioRef.current;
            if (a) {
              a.src = `/api/download?videoId=${current.videoId}`;
              a.load();
              if (state.isPlaying) a.play().catch(console.error);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) initYT();
    else window.onYouTubeIframeAPIReady = initYT;

    return () => {
      fnsRef.current.stopProgressTracker();
      fnsRef.current.stopTimeSync();
      playerRef.current?.destroy();
      audio.pause();
      audio.src = '';
    };
  }, []);

  // ── 2. TRACK CHANGE — Dual Engine Switcher ────────────────────────────────
  useEffect(() => {
    if (!currentTrack) return;

    // OS notification (Electron)
    if (typeof window !== 'undefined' && (window as any).electronAPI?.notifySongChange) {
      (window as any).electronAPI.notifySongChange(currentTrack);
    }

    usePlayerStore.getState().setIsLoading(true);

    getTrackBlob(currentTrack.videoId).then((blob) => {
      // Race-condition guard: abort if the user already changed songs
      if (usePlayerStore.getState().currentTrack?.videoId !== currentTrack.videoId) return;

      if (blob) {
        // ── Offline (HTML5 Audio) engine ──
        activeEngineRef.current = 'local';
        playerRef.current?.pauseVideo?.();

        const audio = audioRef.current;
        if (audio) {
          if (audio.src?.startsWith('blob:')) URL.revokeObjectURL(audio.src);
          audio.src = URL.createObjectURL(blob);
          audio.load();
          if (usePlayerStore.getState().isPlaying) audio.play().catch(console.error);
        }
      } else {
        // ── Online (YouTube IFrame) engine ──
        activeEngineRef.current = 'youtube';
        const audio = audioRef.current;
        if (audio) { audio.pause(); audio.src = ''; }

        playerRef.current?.loadVideoById?.(currentTrack.videoId);
      }

      // Smart Queue: append radio tracks when near the end of queue
      const state = usePlayerStore.getState();
      const idx = state.queue.findIndex((t) => t.id === currentTrack.id);
      if (idx >= state.queue.length - 3) {
        import('@/services/youtube').then(({ getRadioTracks }) => {
          getRadioTracks(currentTrack.videoId).then((tracks) => {
            if (tracks.length > 0) usePlayerStore.getState().addTracksToQueue(tracks);
          });
        });
      }
    });
  }, [currentTrack?.videoId]);

  // ── 3. VOLUME / MUTE ──────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.muted = isMuted;
    }
    const player = playerRef.current;
    if (player?.setVolume) {
      player.setVolume(volume * 100);
      isMuted ? player.mute?.() : player.unMute?.();
    }
  }, [volume, isMuted]);

  // ── 4. PLAY / PAUSE ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentTrack) return;

    // VERY IMPORTANT FAILSAFE: If the engine misses the PLAYING event in onStateChange 
    // due to iframe race conditions on the very first song, this guarantees the UI tracking starts.
    if (isPlaying) {
      fnsRef.current.startProgressTracker();
      fnsRef.current.startTimeSync();
    } else {
      fnsRef.current.stopProgressTracker();
      fnsRef.current.stopTimeSync();
    }

    if (activeEngineRef.current === 'local') {
      const audio = audioRef.current;
      if (audio) {
        if (isPlaying && audio.paused) audio.play().catch(console.error);
        else if (!isPlaying && !audio.paused) audio.pause();
      }
    } else {
      const player = playerRef.current;
      if (player?.getPlayerState) {
        try {
          const state = player.getPlayerState();
          // 1 = PLAYING, 3 = BUFFERING
          if (isPlaying && state !== 1 && state !== 3) {
            player.playVideo();
          } else if (!isPlaying && state === 1) {
            player.pauseVideo();
          }
        } catch(e) {}
      }
    }
  }, [isPlaying, currentTrack]);

  // ── 5. USER SEEK ──────────────────────────────────────────────────────────
  // Watches seekVersion — a counter incremented ONLY by seekTo(), never by
  // setProgress(). This eliminates 100% of false-positive / false-negative
  // seeks that plagued the old delta-threshold approach.
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    if (!usePlayerStore.getState().currentTrack) return;

    const targetProgress = usePlayerStore.getState().progress;

    // Pause engine progress updates for 1.5 s after seek
    ignoreProgressUpdatesRef.current = Date.now() + 1500;

    const applySeek = () => {
      if (activeEngineRef.current === 'local') {
        const audio = audioRef.current;
        if (!audio) return;
        const d = audio.duration;
        if (d > 0 && Number.isFinite(d)) {
          audio.currentTime = targetProgress * d;
        } else {
          // Audio not decoded yet — apply once it is
          const retry = () => {
            const dur = audioRef.current?.duration;
            if (dur && dur > 0 && Number.isFinite(dur)) {
              audioRef.current!.currentTime = targetProgress * dur;
            }
          };
          audio.addEventListener('canplay', retry, { once: true });
          audio.addEventListener('durationchange', retry, { once: true });
        }
      } else {
        const player = playerRef.current;
        if (!player) return;
        const d = player.getDuration?.();
        if (d && d > 0 && Number.isFinite(d)) {
          player.seekTo(targetProgress * d, true);
        } else {
          // Player not ready yet — retry with back-off
          let attempts = 0;
          const retry = () => {
            const dur = playerRef.current?.getDuration?.();
            if (dur && dur > 0 && Number.isFinite(dur)) {
              playerRef.current?.seekTo(targetProgress * dur, true);
            } else if (++attempts < 10) {
              setTimeout(retry, 300);
            }
          };
          setTimeout(retry, 300);
        }
      }
    };

    applySeek();
  }, [seekVersion]);
}
