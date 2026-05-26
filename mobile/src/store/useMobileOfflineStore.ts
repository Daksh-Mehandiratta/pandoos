import * as FileSystem from 'expo-file-system/legacy';
import { create } from 'zustand';

const DOWNLOAD_DIR = `${(FileSystem as any).documentDirectory}pandoos_offline/`;

export interface OfflineTrack {
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
  localUri: string;
}

interface MobileOfflineState {
  downloadedTracks: OfflineTrack[];
  downloadingIds: string[];
}

interface MobileOfflineActions {
  initDownloadDir: () => Promise<void>;
  downloadTrack: (track: {
    videoId: string;
    title: string;
    artist: string;
    thumbnail: string;
    streamUrl: string;
  }) => Promise<void>;
  removeTrack: (videoId: string) => Promise<void>;
  isDownloading: (videoId: string) => boolean;
  isDownloaded: (videoId: string) => boolean;
  getLocalUri: (videoId: string) => string | null;
}

export const useMobileOfflineStore = create<MobileOfflineState & MobileOfflineActions>()((set, get) => ({
  downloadedTracks: [],
  downloadingIds: [],

  initDownloadDir: async () => {
    const info = await FileSystem.getInfoAsync(DOWNLOAD_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(DOWNLOAD_DIR, { intermediates: true });
    }
    // Load manifest from disk
    const manifestPath = `${DOWNLOAD_DIR}manifest.json`;
    const manifestInfo = await FileSystem.getInfoAsync(manifestPath);
    if (manifestInfo.exists) {
      const content = await FileSystem.readAsStringAsync(manifestPath);
      const tracks: OfflineTrack[] = JSON.parse(content);
      set({ downloadedTracks: tracks });
    }
  },

  downloadTrack: async (track) => {
    if (get().isDownloading(track.videoId)) return;
    if (get().isDownloaded(track.videoId)) return;

    set((s) => ({ downloadingIds: [...s.downloadingIds, track.videoId] }));

    try {
      const localUri = `${DOWNLOAD_DIR}${track.videoId}.mp3`;
      const downloadResult = await FileSystem.downloadAsync(track.streamUrl, localUri);

      if (downloadResult.status === 200) {
        const newTrack: OfflineTrack = {
          videoId: track.videoId,
          title: track.title,
          artist: track.artist,
          thumbnail: track.thumbnail,
          localUri,
        };
        const updated = [...get().downloadedTracks, newTrack];
        set({ downloadedTracks: updated });

        // Persist manifest
        await FileSystem.writeAsStringAsync(
          `${DOWNLOAD_DIR}manifest.json`,
          JSON.stringify(updated)
        );
      }
    } catch (err) {
      console.error('[Offline] Download failed:', err);
    } finally {
      set((s) => ({ downloadingIds: s.downloadingIds.filter((id) => id !== track.videoId) }));
    }
  },

  removeTrack: async (videoId) => {
    const localUri = `${DOWNLOAD_DIR}${videoId}.mp3`;
    await FileSystem.deleteAsync(localUri, { idempotent: true });

    const updated = get().downloadedTracks.filter((t) => t.videoId !== videoId);
    set({ downloadedTracks: updated });
    await FileSystem.writeAsStringAsync(
      `${DOWNLOAD_DIR}manifest.json`,
      JSON.stringify(updated)
    );
  },

  isDownloading: (videoId) => get().downloadingIds.includes(videoId),
  isDownloaded: (videoId) => get().downloadedTracks.some((t) => t.videoId === videoId),
  getLocalUri: (videoId) => get().downloadedTracks.find((t) => t.videoId === videoId)?.localUri ?? null,
}));
