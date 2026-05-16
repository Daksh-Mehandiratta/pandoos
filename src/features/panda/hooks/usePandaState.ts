import { useState, useEffect } from 'react';
import { usePlayerStore } from '@/stores/usePlayerStore';

export type PandaState = 'idle' | 'loading' | 'listening' | 'nodding';

/**
 * usePandaState — Maps the player state to the mascot's emotional state.
 * 
 * - 'idle': Music stopped, waiting.
 * - 'loading': Track is buffering.
 * - 'listening': Music is playing, but low intensity (future expansion for BPM).
 * - 'nodding': Music is playing with high energy (currently used for all active playback).
 */
export function usePandaState(): PandaState {
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const isLoading = usePlayerStore((state) => state.isLoading);

  const [state, setState] = useState<PandaState>('idle');

  useEffect(() => {
    if (isLoading) {
      setState('loading');
    } else if (isPlaying) {
      // In the future, we can hook up an audio analyzer or BPM detection here.
      // For now, if it's playing, the Panda is vibing (nodding with shades).
      setState('nodding');
    } else {
      setState('idle');
    }
  }, [isPlaying, isLoading]);

  return state;
}
