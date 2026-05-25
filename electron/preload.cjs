// Pandoos Desktop — Preload Script
// IMPORTANT: This is plain CommonJS. Do NOT use import/export here.
// vite-plugin-electron was outputting ESM import statements even with format:'cjs',
// causing "Cannot use import statement outside a module" in production.
// Solution: write this file directly in CJS and copy it — no compilation needed.

'use strict';

const { contextBridge, ipcRenderer } = require('electron');

// Expose safe IPC methods to the renderer process (React app)
contextBridge.exposeInMainWorld('electronAPI', {
  // Window Controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close:    () => ipcRenderer.send('window-close'),

  // Media Keys
  onMediaPlayPause: (callback) => ipcRenderer.on('media-play-pause', () => callback()),
  onMediaNext:      (callback) => ipcRenderer.on('media-next', () => callback()),
  onMediaPrev:      (callback) => ipcRenderer.on('media-prev', () => callback()),

  // Clean up listeners
  removeMediaListeners: () => {
    ipcRenderer.removeAllListeners('media-play-pause');
    ipcRenderer.removeAllListeners('media-next');
    ipcRenderer.removeAllListeners('media-prev');
  },

  // Notifications
  notifySongChange: (track) => ipcRenderer.send('notify-song', track),

  // API Backend URL
  getApiUrl: () => ipcRenderer.sendSync('get-api-url'),
});
