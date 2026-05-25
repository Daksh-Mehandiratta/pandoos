import { BrowserWindow as e, Menu as t, Notification as n, Tray as r, app as i, dialog as a, globalShortcut as o, ipcMain as s, nativeImage as c } from "electron";
import l from "path";
import { fileURLToPath as u } from "url";
//#region \0rolldown/runtime.js
var d = Object.create, f = Object.defineProperty, p = Object.getOwnPropertyDescriptor, m = Object.getOwnPropertyNames, h = Object.getPrototypeOf, g = Object.prototype.hasOwnProperty, _ = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), v = (e, t, n, r) => {
	if (t && typeof t == "object" || typeof t == "function") for (var i = m(t), a = 0, o = i.length, s; a < o; a++) s = i[a], !g.call(e, s) && s !== n && f(e, s, {
		get: ((e) => t[e]).bind(null, s),
		enumerable: !(r = p(t, s)) || r.enumerable
	});
	return e;
}, y = (e, t, n) => (n = e == null ? {} : d(h(e)), v(t || !e || !e.__esModule ? f(n, "default", {
	value: e,
	enumerable: !0
}) : n, e)), b = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), x = u(import.meta.url), S = l.dirname(x), C = null;
i.isPackaged && import("./main-DAjFmjRn.js").then((e) => /* @__PURE__ */ y(e.default, 1)).then(({ autoUpdater: e }) => {
	C = e, C.autoDownload = !0, C.autoInstallOnAppQuit = !0, C.on("update-available", () => {
		w?.webContents.send("update-available");
	}), C.on("update-downloaded", () => {
		a.showMessageBoxSync(w, {
			type: "info",
			title: "Update Ready",
			message: "🐼 A new version of Pandoos is ready! Restart to install.",
			buttons: ["Restart Now", "Later"],
			defaultId: 0
		}) === 0 && C.quitAndInstall();
	}), setTimeout(() => C.checkForUpdates(), 5e3), setInterval(() => C.checkForUpdates(), 3600 * 1e3);
}).catch(() => {});
var w = null, T = null, E = process.env.VITE_DEV_SERVER_URL;
function D() {
	w = new e({
		width: 1200,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		frame: !1,
		titleBarStyle: "hidden",
		transparent: !0,
		backgroundColor: "#00000000",
		webPreferences: {
			preload: l.join(S, "preload.js"),
			nodeIntegration: !1,
			contextIsolation: !0,
			backgroundThrottling: !1
		},
		icon: l.join(S, "../public/logo.png")
	}), E ? w.loadURL(E) : w.loadFile(l.join(S, "../dist/index.html")), w.on("close", (e) => {
		i.isQuitting || (e.preventDefault(), w?.hide());
	});
}
function O() {
	T = new r(c.createFromPath(l.join(S, "../public/logo.png")).resize({
		width: 16,
		height: 16
	}));
	let e = t.buildFromTemplate([
		{
			label: "Show Pandoos",
			click: () => w?.show()
		},
		{
			label: "Play / Pause",
			click: () => w?.webContents.send("media-play-pause")
		},
		{
			label: "Next Track",
			click: () => w?.webContents.send("media-next")
		},
		{
			label: "Previous Track",
			click: () => w?.webContents.send("media-prev")
		},
		{ type: "separator" },
		{
			label: "Quit",
			click: () => {
				i.isQuitting = !0, i.quit();
			}
		}
	]);
	T.setToolTip("Pandoos Music"), T.setContextMenu(e), T.on("click", () => {
		w?.isVisible() ? w.hide() : (w?.show(), w?.focus());
	});
}
function k() {
	o.register("MediaPlayPause", () => {
		w?.webContents.send("media-play-pause");
	}), o.register("MediaNextTrack", () => {
		w?.webContents.send("media-next");
	}), o.register("MediaPreviousTrack", () => {
		w?.webContents.send("media-prev");
	});
}
i.isQuitting = !1, i.whenReady().then(() => {
	D(), O(), k(), i.on("activate", () => {
		e.getAllWindows().length === 0 ? D() : w?.show();
	});
}), i.on("will-quit", () => {
	o.unregisterAll();
}), i.on("window-all-closed", () => {
	process.platform !== "darwin" && i.quit();
}), s.on("window-minimize", () => w?.minimize()), s.on("window-maximize", () => {
	w?.isMaximized() ? w.restore() : w?.maximize();
}), s.on("window-close", () => w?.hide()), s.on("notify-song", (e, t) => {
	n.isSupported() && t && new n({
		title: "Now Playing",
		body: `${t.title} • ${t.artist}`,
		silent: !0
	}).show();
});
//#endregion
export { b as n, _ as t };
