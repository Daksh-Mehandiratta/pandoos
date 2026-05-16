/**
 * Global YouTube IFrame API type declarations.
 * The YT IFrame API attaches to the window object when its script loads.
 * These minimal types cover what Pandoos uses — no need for a full @types/youtube package.
 */

declare global {
  interface Window {
    /** Called by the YouTube IFrame API script when it's fully loaded and ready */
    onYouTubeIframeAPIReady: () => void;
    /** The YT namespace injected by the IFrame API script */
    YT: typeof YT;
  }
}

declare namespace YT {
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    playerVars?: {
      autoplay?: 0 | 1;
      controls?: 0 | 1;
      disablekb?: 0 | 1;
      enablejsapi?: 0 | 1;
      iv_load_policy?: 1 | 3;
      modestbranding?: 0 | 1;
      playsinline?: 0 | 1;
      rel?: 0 | 1;
      origin?: string;
    };
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onError?: (event: OnErrorEvent) => void;
    };
  }

  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent {
    target: Player;
    data: PlayerState;
  }

  interface OnErrorEvent {
    target: Player;
    data: number;
  }

  class Player {
    constructor(elementId: string | HTMLElement, options: PlayerOptions);
    loadVideoById(videoId: string, startSeconds?: number): void;
    cueVideoById(videoId: string, startSeconds?: number): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    setVolume(volume: number): void;
    getVolume(): number;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    getDuration(): number;
    getCurrentTime(): number;
    getPlayerState(): PlayerState;
    destroy(): void;
  }
}

export {};
