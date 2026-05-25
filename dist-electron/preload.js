import { contextBridge, ipcRenderer } from "electron";
//#region electron/preload.ts
contextBridge.exposeInMainWorld("electronAPI", {
	minimize: () => ipcRenderer.send("window-minimize"),
	maximize: () => ipcRenderer.send("window-maximize"),
	close: () => ipcRenderer.send("window-close"),
	onMediaPlayPause: (callback) => ipcRenderer.on("media-play-pause", () => callback()),
	onMediaNext: (callback) => ipcRenderer.on("media-next", () => callback()),
	onMediaPrev: (callback) => ipcRenderer.on("media-prev", () => callback()),
	removeMediaListeners: () => {
		ipcRenderer.removeAllListeners("media-play-pause");
		ipcRenderer.removeAllListeners("media-next");
		ipcRenderer.removeAllListeners("media-prev");
	},
	notifySongChange: (track) => ipcRenderer.send("notify-song", track)
});
//#endregion
