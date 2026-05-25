import { contextBridge as e, ipcRenderer as t } from "electron";
//#region electron/preload.ts
e.exposeInMainWorld("electronAPI", {
	minimize: () => t.send("window-minimize"),
	maximize: () => t.send("window-maximize"),
	close: () => t.send("window-close"),
	onMediaPlayPause: (e) => t.on("media-play-pause", () => e()),
	onMediaNext: (e) => t.on("media-next", () => e()),
	onMediaPrev: (e) => t.on("media-prev", () => e()),
	removeMediaListeners: () => {
		t.removeAllListeners("media-play-pause"), t.removeAllListeners("media-next"), t.removeAllListeners("media-prev");
	}
});
//#endregion
