import { create } from 'zustand';

interface UIState {
  isPlayerOpen: boolean;
  isQueueOpen: boolean;
  openPlayer: () => void;
  closePlayer: () => void;
  toggleQueue: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isPlayerOpen: false,
  isQueueOpen: false,
  openPlayer: () => set({ isPlayerOpen: true }),
  closePlayer: () => set({ isPlayerOpen: false }),
  toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),
}));
