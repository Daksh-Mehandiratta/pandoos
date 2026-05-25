import { BrowserWindow as e, Menu as t, Tray as n, app as r, globalShortcut as i, ipcMain as a, nativeImage as o } from "electron";
import s from "path";
import { fileURLToPath as c } from "url";
//#region electron/main.ts
var l = c(import.meta.url), u = s.dirname(l), d = null, f = null, p = process.env.VITE_DEV_SERVER_URL;
function m() {
	d = new e({
		width: 1200,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		frame: !1,
		titleBarStyle: "hidden",
		transparent: !0,
		backgroundColor: "#00000000",
		webPreferences: {
			preload: s.join(u, "preload.mjs"),
			nodeIntegration: !1,
			contextIsolation: !0,
			backgroundThrottling: !1
		},
		icon: s.join(u, "../public/logo.png")
	}), p ? d.loadURL(p) : d.loadFile(s.join(u, "../dist/index.html")), d.on("close", (e) => {
		r.isQuitting || (e.preventDefault(), d?.hide());
	});
}
function h() {
	f = new n(o.createFromPath(s.join(u, "../public/logo.png")).resize({
		width: 16,
		height: 16
	}));
	let e = t.buildFromTemplate([
		{
			label: "Show Pandoos",
			click: () => d?.show()
		},
		{
			label: "Play / Pause",
			click: () => d?.webContents.send("media-play-pause")
		},
		{
			label: "Next Track",
			click: () => d?.webContents.send("media-next")
		},
		{
			label: "Previous Track",
			click: () => d?.webContents.send("media-prev")
		},
		{ type: "separator" },
		{
			label: "Quit",
			click: () => {
				r.isQuitting = !0, r.quit();
			}
		}
	]);
	f.setToolTip("Pandoos Music"), f.setContextMenu(e), f.on("click", () => {
		d?.isVisible() ? d.hide() : (d?.show(), d?.focus());
	});
}
function g() {
	i.register("MediaPlayPause", () => {
		d?.webContents.send("media-play-pause");
	}), i.register("MediaNextTrack", () => {
		d?.webContents.send("media-next");
	}), i.register("MediaPreviousTrack", () => {
		d?.webContents.send("media-prev");
	});
}
r.isQuitting = !1, r.whenReady().then(() => {
	m(), h(), g(), r.on("activate", () => {
		e.getAllWindows().length === 0 ? m() : d?.show();
	});
}), r.on("will-quit", () => {
	i.unregisterAll();
}), r.on("window-all-closed", () => {
	process.platform !== "darwin" && r.quit();
}), a.on("window-minimize", () => d?.minimize()), a.on("window-maximize", () => {
	d?.isMaximized() ? d.restore() : d?.maximize();
}), a.on("window-close", () => d?.hide());
//#endregion
