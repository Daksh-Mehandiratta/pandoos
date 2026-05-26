import { create } from 'zustand';

interface UIState {
  isPlayerOpen: boolean;
  isQueueOpen: boolean;
  activeArtistId: string | null;
  activeAlbumId: string | null;
  openPlayer: () => void;
  closePlayer: () => void;
  toggleQueue: () => void;
  openArtist: (id: string) => void;
  closeArtist: () => void;
  openAlbum: (id: string) => void;
  closeAlbum: () => void;
  isChatOpen: boolean;
  chatInitialMessage: string;
  openChat: (initialMessage?: string) => void;
  closeChat: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isPlayerOpen: false,
  isQueueOpen: false,
  activeArtistId: null,
  activeAlbumId: null,
  isChatOpen: false,
  chatInitialMessage: '',
  openPlayer: () => set({ isPlayerOpen: true }),
  closePlayer: () => set({ isPlayerOpen: false }),
  toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),
  openArtist: (id) => set({ activeArtistId: id }),
  closeArtist: () => set({ activeArtistId: null }),
  openAlbum: (id) => set({ activeAlbumId: id }),
  closeAlbum: () => set({ activeAlbumId: null }),
  openChat: (initialMessage?: string) => set({ isChatOpen: true, chatInitialMessage: initialMessage || '' }),
  closeChat: () => set({ isChatOpen: false }),
}));

