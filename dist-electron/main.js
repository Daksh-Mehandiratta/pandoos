import { BrowserWindow, Menu, Notification, Tray, app, dialog, globalShortcut, ipcMain, nativeImage } from "electron";
import path from "path";
import { fileURLToPath } from "url";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
//#endregion
//#region electron/main.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var autoUpdater = null;
if (app.isPackaged) import("./main-9dk3pvTV.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1)).then(({ autoUpdater: updater }) => {
	autoUpdater = updater;
	autoUpdater.autoDownload = true;
	autoUpdater.autoInstallOnAppQuit = true;
	autoUpdater.on("update-available", () => {
		mainWindow?.webContents.send("update-available");
	});
	autoUpdater.on("update-downloaded", () => {
		if (dialog.showMessageBoxSync(mainWindow, {
			type: "info",
			title: "Update Ready",
			message: "🐼 A new version of Pandoos is ready! Restart to install.",
			buttons: ["Restart Now", "Later"],
			defaultId: 0
		}) === 0) autoUpdater.quitAndInstall();
	});
	setTimeout(() => autoUpdater.checkForUpdates(), 5e3);
	setInterval(() => autoUpdater.checkForUpdates(), 3600 * 1e3);
}).catch(() => {});
var mainWindow = null;
var tray = null;
var VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		frame: false,
		titleBarStyle: "hidden",
		transparent: true,
		backgroundColor: "#00000000",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: false,
			contextIsolation: true,
			backgroundThrottling: false
		},
		icon: path.join(__dirname, "../public/logo.png")
	});
	if (VITE_DEV_SERVER_URL) mainWindow.loadURL(VITE_DEV_SERVER_URL);
	else mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
	mainWindow.on("close", (event) => {
		if (!app.isQuitting) {
			event.preventDefault();
			mainWindow?.hide();
		}
	});
}
function createTray() {
	tray = new Tray(nativeImage.createFromPath(path.join(__dirname, "../public/logo.png")).resize({
		width: 16,
		height: 16
	}));
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "Show Pandoos",
			click: () => mainWindow?.show()
		},
		{
			label: "Play / Pause",
			click: () => mainWindow?.webContents.send("media-play-pause")
		},
		{
			label: "Next Track",
			click: () => mainWindow?.webContents.send("media-next")
		},
		{
			label: "Previous Track",
			click: () => mainWindow?.webContents.send("media-prev")
		},
		{ type: "separator" },
		{
			label: "Quit",
			click: () => {
				app.isQuitting = true;
				app.quit();
			}
		}
	]);
	tray.setToolTip("Pandoos Music");
	tray.setContextMenu(contextMenu);
	tray.on("click", () => {
		if (mainWindow?.isVisible()) mainWindow.hide();
		else {
			mainWindow?.show();
			mainWindow?.focus();
		}
	});
}
function registerShortcuts() {
	globalShortcut.register("MediaPlayPause", () => {
		mainWindow?.webContents.send("media-play-pause");
	});
	globalShortcut.register("MediaNextTrack", () => {
		mainWindow?.webContents.send("media-next");
	});
	globalShortcut.register("MediaPreviousTrack", () => {
		mainWindow?.webContents.send("media-prev");
	});
}
app.isQuitting = false;
app.whenReady().then(() => {
	createWindow();
	createTray();
	registerShortcuts();
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
		else mainWindow?.show();
	});
});
app.on("will-quit", () => {
	globalShortcut.unregisterAll();
});
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
ipcMain.on("window-minimize", () => mainWindow?.minimize());
ipcMain.on("window-maximize", () => {
	if (mainWindow?.isMaximized()) mainWindow.restore();
	else mainWindow?.maximize();
});
ipcMain.on("window-close", () => mainWindow?.hide());
ipcMain.on("notify-song", (_, track) => {
	if (Notification.isSupported() && track) new Notification({
		title: "Now Playing",
		body: `${track.title} • ${track.artist}`,
		silent: true
	}).show();
});
//#endregion
export { __require as n, __commonJSMin as t };
