import { contextBridge, ipcRenderer } from 'electron';

// Expose safe IPC methods to the renderer process (React app)
contextBridge.exposeInMainWorld('electronAPI', {
  // Window Controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  
  // Media Keys (React app listens to these)
  onMediaPlayPause: (callback: () => void) => ipcRenderer.on('media-play-pause', () => callback()),
  onMediaNext: (callback: () => void) => ipcRenderer.on('media-next', () => callback()),
  onMediaPrev: (callback: () => void) => ipcRenderer.on('media-prev', () => callback()),
  
  // Clean up listeners
  removeMediaListeners: () => {
    ipcRenderer.removeAllListeners('media-play-pause');
    ipcRenderer.removeAllListeners('media-next');
    ipcRenderer.removeAllListeners('media-prev');
  },

  // Notifications
  notifySongChange: (track: any) => ipcRenderer.send('notify-song', track),

  // API Backend
  getApiUrl: () => ipcRenderer.sendSync('get-api-url'),
});
