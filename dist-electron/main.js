import { BrowserWindow as e, Menu as t, Tray as n, app as r, dialog as i, globalShortcut as a, ipcMain as o, nativeImage as s } from "electron";
import c from "path";
import { fileURLToPath as l } from "url";
//#region \0rolldown/runtime.js
var u = Object.create, d = Object.defineProperty, f = Object.getOwnPropertyDescriptor, p = Object.getOwnPropertyNames, m = Object.getPrototypeOf, h = Object.prototype.hasOwnProperty, g = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), _ = (e, t, n, r) => {
	if (t && typeof t == "object" || typeof t == "function") for (var i = p(t), a = 0, o = i.length, s; a < o; a++) s = i[a], !h.call(e, s) && s !== n && d(e, s, {
		get: ((e) => t[e]).bind(null, s),
		enumerable: !(r = f(t, s)) || r.enumerable
	});
	return e;
}, v = (e, t, n) => (n = e == null ? {} : u(m(e)), _(t || !e || !e.__esModule ? d(n, "default", {
	value: e,
	enumerable: !0
}) : n, e)), y = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), b = l(import.meta.url), x = c.dirname(b), S = null;
r.isPackaged && import("./main-DAjFmjRn.js").then((e) => /* @__PURE__ */ v(e.default, 1)).then(({ autoUpdater: e }) => {
	S = e, S.autoDownload = !0, S.autoInstallOnAppQuit = !0, S.on("update-available", () => {
		C?.webContents.send("update-available");
	}), S.on("update-downloaded", () => {
		i.showMessageBoxSync(C, {
			type: "info",
			title: "Update Ready",
			message: "🐼 A new version of Pandoos is ready! Restart to install.",
			buttons: ["Restart Now", "Later"],
			defaultId: 0
		}) === 0 && S.quitAndInstall();
	}), setTimeout(() => S.checkForUpdates(), 5e3), setInterval(() => S.checkForUpdates(), 3600 * 1e3);
}).catch(() => {});
var C = null, w = null, T = process.env.VITE_DEV_SERVER_URL;
function E() {
	C = new e({
		width: 1200,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		frame: !1,
		titleBarStyle: "hidden",
		transparent: !0,
		backgroundColor: "#00000000",
		webPreferences: {
			preload: c.join(x, "preload.mjs"),
			nodeIntegration: !1,
			contextIsolation: !0,
			backgroundThrottling: !1
		},
		icon: c.join(x, "../public/logo.png")
	}), T ? C.loadURL(T) : C.loadFile(c.join(x, "../dist/index.html")), C.on("close", (e) => {
		r.isQuitting || (e.preventDefault(), C?.hide());
	});
}
function D() {
	w = new n(s.createFromPath(c.join(x, "../public/logo.png")).resize({
		width: 16,
		height: 16
	}));
	let e = t.buildFromTemplate([
		{
			label: "Show Pandoos",
			click: () => C?.show()
		},
		{
			label: "Play / Pause",
			click: () => C?.webContents.send("media-play-pause")
		},
		{
			label: "Next Track",
			click: () => C?.webContents.send("media-next")
		},
		{
			label: "Previous Track",
			click: () => C?.webContents.send("media-prev")
		},
		{ type: "separator" },
		{
			label: "Quit",
			click: () => {
				r.isQuitting = !0, r.quit();
			}
		}
	]);
	w.setToolTip("Pandoos Music"), w.setContextMenu(e), w.on("click", () => {
		C?.isVisible() ? C.hide() : (C?.show(), C?.focus());
	});
}
function O() {
	a.register("MediaPlayPause", () => {
		C?.webContents.send("media-play-pause");
	}), a.register("MediaNextTrack", () => {
		C?.webContents.send("media-next");
	}), a.register("MediaPreviousTrack", () => {
		C?.webContents.send("media-prev");
	});
}
r.isQuitting = !1, r.whenReady().then(() => {
	E(), D(), O(), r.on("activate", () => {
		e.getAllWindows().length === 0 ? E() : C?.show();
	});
}), r.on("will-quit", () => {
	a.unregisterAll();
}), r.on("window-all-closed", () => {
	process.platform !== "darwin" && r.quit();
}), o.on("window-minimize", () => C?.minimize()), o.on("window-maximize", () => {
	C?.isMaximized() ? C.restore() : C?.maximize();
}), o.on("window-close", () => C?.hide());
//#endregion
export { y as n, g as t };
