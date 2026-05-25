import { n as e, t } from "./main.js";
//#region node_modules/universalify/index.js
var n = /* @__PURE__ */ t(((e) => {
	e.fromCallback = function(e) {
		return Object.defineProperty(function(...t) {
			if (typeof t[t.length - 1] == "function") e.apply(this, t);
			else return new Promise((n, r) => {
				t.push((e, t) => e == null ? n(t) : r(e)), e.apply(this, t);
			});
		}, "name", { value: e.name });
	}, e.fromPromise = function(e) {
		return Object.defineProperty(function(...t) {
			let n = t[t.length - 1];
			if (typeof n != "function") return e.apply(this, t);
			t.pop(), e.apply(this, t).then((e) => n(null, e), n);
		}, "name", { value: e.name });
	};
})), r = /* @__PURE__ */ t(((t, n) => {
	var r = e("constants"), i = process.cwd, a = null, o = process.env.GRACEFUL_FS_PLATFORM || process.platform;
	process.cwd = function() {
		return a ||= i.call(process), a;
	};
	try {
		process.cwd();
	} catch {}
	if (typeof process.chdir == "function") {
		var s = process.chdir;
		process.chdir = function(e) {
			a = null, s.call(process, e);
		}, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, s);
	}
	n.exports = c;
	function c(e) {
		r.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = s(e.chown), e.fchown = s(e.fchown), e.lchown = s(e.lchown), e.chmod = i(e.chmod), e.fchmod = i(e.fchmod), e.lchmod = i(e.lchmod), e.chownSync = c(e.chownSync), e.fchownSync = c(e.fchownSync), e.lchownSync = c(e.lchownSync), e.chmodSync = a(e.chmodSync), e.fchmodSync = a(e.fchmodSync), e.lchmodSync = a(e.lchmodSync), e.stat = l(e.stat), e.fstat = l(e.fstat), e.lstat = l(e.lstat), e.statSync = u(e.statSync), e.fstatSync = u(e.fstatSync), e.lstatSync = u(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(e, t, n) {
			n && process.nextTick(n);
		}, e.lchmodSync = function() {}), e.chown && !e.lchown && (e.lchown = function(e, t, n, r) {
			r && process.nextTick(r);
		}, e.lchownSync = function() {}), o === "win32" && (e.rename = typeof e.rename == "function" ? (function(t) {
			function n(n, r, i) {
				var a = Date.now(), o = 0;
				t(n, r, function s(c) {
					if (c && (c.code === "EACCES" || c.code === "EPERM" || c.code === "EBUSY") && Date.now() - a < 6e4) {
						setTimeout(function() {
							e.stat(r, function(e, a) {
								e && e.code === "ENOENT" ? t(n, r, s) : i(c);
							});
						}, o), o < 100 && (o += 10);
						return;
					}
					i && i(c);
				});
			}
			return Object.setPrototypeOf && Object.setPrototypeOf(n, t), n;
		})(e.rename) : e.rename), e.read = typeof e.read == "function" ? (function(t) {
			function n(n, r, i, a, o, s) {
				var c;
				if (s && typeof s == "function") {
					var l = 0;
					c = function(u, d, f) {
						if (u && u.code === "EAGAIN" && l < 10) return l++, t.call(e, n, r, i, a, o, c);
						s.apply(this, arguments);
					};
				}
				return t.call(e, n, r, i, a, o, c);
			}
			return Object.setPrototypeOf && Object.setPrototypeOf(n, t), n;
		})(e.read) : e.read, e.readSync = typeof e.readSync == "function" ? (function(t) {
			return function(n, r, i, a, o) {
				for (var s = 0;;) try {
					return t.call(e, n, r, i, a, o);
				} catch (e) {
					if (e.code === "EAGAIN" && s < 10) {
						s++;
						continue;
					}
					throw e;
				}
			};
		})(e.readSync) : e.readSync;
		function t(e) {
			e.lchmod = function(t, n, i) {
				e.open(t, r.O_WRONLY | r.O_SYMLINK, n, function(t, r) {
					if (t) {
						i && i(t);
						return;
					}
					e.fchmod(r, n, function(t) {
						e.close(r, function(e) {
							i && i(t || e);
						});
					});
				});
			}, e.lchmodSync = function(t, n) {
				var i = e.openSync(t, r.O_WRONLY | r.O_SYMLINK, n), a = !0, o;
				try {
					o = e.fchmodSync(i, n), a = !1;
				} finally {
					if (a) try {
						e.closeSync(i);
					} catch {}
					else e.closeSync(i);
				}
				return o;
			};
		}
		function n(e) {
			r.hasOwnProperty("O_SYMLINK") && e.futimes ? (e.lutimes = function(t, n, i, a) {
				e.open(t, r.O_SYMLINK, function(t, r) {
					if (t) {
						a && a(t);
						return;
					}
					e.futimes(r, n, i, function(t) {
						e.close(r, function(e) {
							a && a(t || e);
						});
					});
				});
			}, e.lutimesSync = function(t, n, i) {
				var a = e.openSync(t, r.O_SYMLINK), o, s = !0;
				try {
					o = e.futimesSync(a, n, i), s = !1;
				} finally {
					if (s) try {
						e.closeSync(a);
					} catch {}
					else e.closeSync(a);
				}
				return o;
			}) : e.futimes && (e.lutimes = function(e, t, n, r) {
				r && process.nextTick(r);
			}, e.lutimesSync = function() {});
		}
		function i(t) {
			return t && function(n, r, i) {
				return t.call(e, n, r, function(e) {
					d(e) && (e = null), i && i.apply(this, arguments);
				});
			};
		}
		function a(t) {
			return t && function(n, r) {
				try {
					return t.call(e, n, r);
				} catch (e) {
					if (!d(e)) throw e;
				}
			};
		}
		function s(t) {
			return t && function(n, r, i, a) {
				return t.call(e, n, r, i, function(e) {
					d(e) && (e = null), a && a.apply(this, arguments);
				});
			};
		}
		function c(t) {
			return t && function(n, r, i) {
				try {
					return t.call(e, n, r, i);
				} catch (e) {
					if (!d(e)) throw e;
				}
			};
		}
		function l(t) {
			return t && function(n, r, i) {
				typeof r == "function" && (i = r, r = null);
				function a(e, t) {
					t && (t.uid < 0 && (t.uid += 4294967296), t.gid < 0 && (t.gid += 4294967296)), i && i.apply(this, arguments);
				}
				return r ? t.call(e, n, r, a) : t.call(e, n, a);
			};
		}
		function u(t) {
			return t && function(n, r) {
				var i = r ? t.call(e, n, r) : t.call(e, n);
				return i && (i.uid < 0 && (i.uid += 4294967296), i.gid < 0 && (i.gid += 4294967296)), i;
			};
		}
		function d(e) {
			return !e || e.code === "ENOSYS" || (!process.getuid || process.getuid() !== 0) && (e.code === "EINVAL" || e.code === "EPERM");
		}
	}
})), i = /* @__PURE__ */ t(((t, n) => {
	var r = e("stream").Stream;
	n.exports = i;
	function i(e) {
		return {
			ReadStream: t,
			WriteStream: n
		};
		function t(n, i) {
			if (!(this instanceof t)) return new t(n, i);
			r.call(this);
			var a = this;
			this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i ||= {};
			for (var o = Object.keys(i), s = 0, c = o.length; s < c; s++) {
				var l = o[s];
				this[l] = i[l];
			}
			if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
				if (typeof this.start != "number") throw TypeError("start must be a Number");
				if (this.end === void 0) this.end = Infinity;
				else if (typeof this.end != "number") throw TypeError("end must be a Number");
				if (this.start > this.end) throw Error("start must be <= end");
				this.pos = this.start;
			}
			if (this.fd !== null) {
				process.nextTick(function() {
					a._read();
				});
				return;
			}
			e.open(this.path, this.flags, this.mode, function(e, t) {
				if (e) {
					a.emit("error", e), a.readable = !1;
					return;
				}
				a.fd = t, a.emit("open", t), a._read();
			});
		}
		function n(t, i) {
			if (!(this instanceof n)) return new n(t, i);
			r.call(this), this.path = t, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i ||= {};
			for (var a = Object.keys(i), o = 0, s = a.length; o < s; o++) {
				var c = a[o];
				this[c] = i[c];
			}
			if (this.start !== void 0) {
				if (typeof this.start != "number") throw TypeError("start must be a Number");
				if (this.start < 0) throw Error("start must be >= zero");
				this.pos = this.start;
			}
			this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([
				this._open,
				this.path,
				this.flags,
				this.mode,
				void 0
			]), this.flush());
		}
	}
})), a = /* @__PURE__ */ t(((e, t) => {
	t.exports = r;
	var n = Object.getPrototypeOf || function(e) {
		return e.__proto__;
	};
	function r(e) {
		if (typeof e != "object" || !e) return e;
		if (e instanceof Object) var t = { __proto__: n(e) };
		else var t = Object.create(null);
		return Object.getOwnPropertyNames(e).forEach(function(n) {
			Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
		}), t;
	}
})), o = /* @__PURE__ */ t(((t, n) => {
	var o = e("fs"), s = r(), c = i(), l = a(), u = e("util"), d, f;
	/* istanbul ignore else - node 0.x polyfill */
	typeof Symbol == "function" && typeof Symbol.for == "function" ? (d = Symbol.for("graceful-fs.queue"), f = Symbol.for("graceful-fs.previous")) : (d = "___graceful-fs.queue", f = "___graceful-fs.previous");
	function p() {}
	function m(e, t) {
		Object.defineProperty(e, d, { get: function() {
			return t;
		} });
	}
	var h = p;
	u.debuglog ? h = u.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (h = function() {
		var e = u.format.apply(u, arguments);
		e = "GFS4: " + e.split(/\n/).join("\nGFS4: "), console.error(e);
	}), o[d] || (m(o, global[d] || []), o.close = (function(e) {
		function t(t, n) {
			return e.call(o, t, function(e) {
				e || y(), typeof n == "function" && n.apply(this, arguments);
			});
		}
		return Object.defineProperty(t, f, { value: e }), t;
	})(o.close), o.closeSync = (function(e) {
		function t(t) {
			e.apply(o, arguments), y();
		}
		return Object.defineProperty(t, f, { value: e }), t;
	})(o.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
		h(o[d]), e("assert").equal(o[d].length, 0);
	})), global[d] || m(global, o[d]), n.exports = g(l(o)), process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !o.__patched && (n.exports = g(o), o.__patched = !0);
	function g(e) {
		s(e), e.gracefulify = g, e.createReadStream = T, e.createWriteStream = E;
		var t = e.readFile;
		e.readFile = n;
		function n(e, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, n, r);
			function i(e, n, r, a) {
				return t(e, n, function(t) {
					t && (t.code === "EMFILE" || t.code === "ENFILE") ? _([
						i,
						[
							e,
							n,
							r
						],
						t,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var r = e.writeFile;
		e.writeFile = i;
		function i(e, t, n, i) {
			return typeof n == "function" && (i = n, n = null), a(e, t, n, i);
			function a(e, t, n, i, o) {
				return r(e, t, n, function(r) {
					r && (r.code === "EMFILE" || r.code === "ENFILE") ? _([
						a,
						[
							e,
							t,
							n,
							i
						],
						r,
						o || Date.now(),
						Date.now()
					]) : typeof i == "function" && i.apply(this, arguments);
				});
			}
		}
		var a = e.appendFile;
		a && (e.appendFile = o);
		function o(e, t, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, t, n, r);
			function i(e, t, n, r, o) {
				return a(e, t, n, function(a) {
					a && (a.code === "EMFILE" || a.code === "ENFILE") ? _([
						i,
						[
							e,
							t,
							n,
							r
						],
						a,
						o || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var l = e.copyFile;
		l && (e.copyFile = u);
		function u(e, t, n, r) {
			return typeof n == "function" && (r = n, n = 0), i(e, t, n, r);
			function i(e, t, n, r, a) {
				return l(e, t, n, function(o) {
					o && (o.code === "EMFILE" || o.code === "ENFILE") ? _([
						i,
						[
							e,
							t,
							n,
							r
						],
						o,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var d = e.readdir;
		e.readdir = p;
		var f = /^v[0-5]\./;
		function p(e, t, n) {
			typeof t == "function" && (n = t, t = null);
			var r = f.test(process.version) ? function(e, t, n, r) {
				return d(e, i(e, t, n, r));
			} : function(e, t, n, r) {
				return d(e, t, i(e, t, n, r));
			};
			return r(e, t, n);
			function i(e, t, n, i) {
				return function(a, o) {
					a && (a.code === "EMFILE" || a.code === "ENFILE") ? _([
						r,
						[
							e,
							t,
							n
						],
						a,
						i || Date.now(),
						Date.now()
					]) : (o && o.sort && o.sort(), typeof n == "function" && n.call(this, a, o));
				};
			}
		}
		if (process.version.substr(0, 4) === "v0.8") {
			var m = c(e);
			x = m.ReadStream, C = m.WriteStream;
		}
		var h = e.ReadStream;
		h && (x.prototype = Object.create(h.prototype), x.prototype.open = S);
		var v = e.WriteStream;
		v && (C.prototype = Object.create(v.prototype), C.prototype.open = w), Object.defineProperty(e, "ReadStream", {
			get: function() {
				return x;
			},
			set: function(e) {
				x = e;
			},
			enumerable: !0,
			configurable: !0
		}), Object.defineProperty(e, "WriteStream", {
			get: function() {
				return C;
			},
			set: function(e) {
				C = e;
			},
			enumerable: !0,
			configurable: !0
		});
		var y = x;
		Object.defineProperty(e, "FileReadStream", {
			get: function() {
				return y;
			},
			set: function(e) {
				y = e;
			},
			enumerable: !0,
			configurable: !0
		});
		var b = C;
		Object.defineProperty(e, "FileWriteStream", {
			get: function() {
				return b;
			},
			set: function(e) {
				b = e;
			},
			enumerable: !0,
			configurable: !0
		});
		function x(e, t) {
			return this instanceof x ? (h.apply(this, arguments), this) : x.apply(Object.create(x.prototype), arguments);
		}
		function S() {
			var e = this;
			O(e.path, e.flags, e.mode, function(t, n) {
				t ? (e.autoClose && e.destroy(), e.emit("error", t)) : (e.fd = n, e.emit("open", n), e.read());
			});
		}
		function C(e, t) {
			return this instanceof C ? (v.apply(this, arguments), this) : C.apply(Object.create(C.prototype), arguments);
		}
		function w() {
			var e = this;
			O(e.path, e.flags, e.mode, function(t, n) {
				t ? (e.destroy(), e.emit("error", t)) : (e.fd = n, e.emit("open", n));
			});
		}
		function T(t, n) {
			return new e.ReadStream(t, n);
		}
		function E(t, n) {
			return new e.WriteStream(t, n);
		}
		var D = e.open;
		e.open = O;
		function O(e, t, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, t, n, r);
			function i(e, t, n, r, a) {
				return D(e, t, n, function(o, s) {
					o && (o.code === "EMFILE" || o.code === "ENFILE") ? _([
						i,
						[
							e,
							t,
							n,
							r
						],
						o,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		return e;
	}
	function _(e) {
		h("ENQUEUE", e[0].name, e[1]), o[d].push(e), b();
	}
	var v;
	function y() {
		for (var e = Date.now(), t = 0; t < o[d].length; ++t) o[d][t].length > 2 && (o[d][t][3] = e, o[d][t][4] = e);
		b();
	}
	function b() {
		if (clearTimeout(v), v = void 0, o[d].length !== 0) {
			var e = o[d].shift(), t = e[0], n = e[1], r = e[2], i = e[3], a = e[4];
			if (i === void 0) h("RETRY", t.name, n), t.apply(null, n);
			else if (Date.now() - i >= 6e4) {
				h("TIMEOUT", t.name, n);
				var s = n.pop();
				typeof s == "function" && s.call(null, r);
			} else {
				var c = Date.now() - a, l = Math.max(a - i, 1);
				c >= Math.min(l * 1.2, 100) ? (h("RETRY", t.name, n), t.apply(null, n.concat([i]))) : o[d].push(e);
			}
			v === void 0 && (v = setTimeout(b, 0));
		}
	}
})), s = /* @__PURE__ */ t(((e) => {
	var t = n().fromCallback, r = o(), i = (/* @__PURE__ */ "access.appendFile.chmod.chown.close.copyFile.fchmod.fchown.fdatasync.fstat.fsync.ftruncate.futimes.lchmod.lchown.link.lstat.mkdir.mkdtemp.open.opendir.readdir.readFile.readlink.realpath.rename.rm.rmdir.stat.symlink.truncate.unlink.utimes.writeFile".split(".")).filter((e) => typeof r[e] == "function");
	Object.assign(e, r), i.forEach((n) => {
		e[n] = t(r[n]);
	}), e.exists = function(e, t) {
		return typeof t == "function" ? r.exists(e, t) : new Promise((t) => r.exists(e, t));
	}, e.read = function(e, t, n, i, a, o) {
		return typeof o == "function" ? r.read(e, t, n, i, a, o) : new Promise((o, s) => {
			r.read(e, t, n, i, a, (e, t, n) => {
				if (e) return s(e);
				o({
					bytesRead: t,
					buffer: n
				});
			});
		});
	}, e.write = function(e, t, ...n) {
		return typeof n[n.length - 1] == "function" ? r.write(e, t, ...n) : new Promise((i, a) => {
			r.write(e, t, ...n, (e, t, n) => {
				if (e) return a(e);
				i({
					bytesWritten: t,
					buffer: n
				});
			});
		});
	}, typeof r.writev == "function" && (e.writev = function(e, t, ...n) {
		return typeof n[n.length - 1] == "function" ? r.writev(e, t, ...n) : new Promise((i, a) => {
			r.writev(e, t, ...n, (e, t, n) => {
				if (e) return a(e);
				i({
					bytesWritten: t,
					buffers: n
				});
			});
		});
	}), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003");
})), c = /* @__PURE__ */ t(((t, n) => {
	var r = e("path");
	n.exports.checkPath = function(e) {
		if (process.platform === "win32" && /[<>:"|?*]/.test(e.replace(r.parse(e).root, ""))) {
			let t = /* @__PURE__ */ Error(`Path contains invalid characters: ${e}`);
			throw t.code = "EINVAL", t;
		}
	};
})), l = /* @__PURE__ */ t(((e, t) => {
	var n = s(), { checkPath: r } = c(), i = (e) => typeof e == "number" ? e : {
		mode: 511,
		...e
	}.mode;
	t.exports.makeDir = async (e, t) => (r(e), n.mkdir(e, {
		mode: i(t),
		recursive: !0
	})), t.exports.makeDirSync = (e, t) => (r(e), n.mkdirSync(e, {
		mode: i(t),
		recursive: !0
	}));
})), u = /* @__PURE__ */ t(((e, t) => {
	var r = n().fromPromise, { makeDir: i, makeDirSync: a } = l(), o = r(i);
	t.exports = {
		mkdirs: o,
		mkdirsSync: a,
		mkdirp: o,
		mkdirpSync: a,
		ensureDir: o,
		ensureDirSync: a
	};
})), d = /* @__PURE__ */ t(((e, t) => {
	var r = n().fromPromise, i = s();
	function a(e) {
		return i.access(e).then(() => !0).catch(() => !1);
	}
	t.exports = {
		pathExists: r(a),
		pathExistsSync: i.existsSync
	};
})), f = /* @__PURE__ */ t(((e, t) => {
	var n = o();
	function r(e, t, r, i) {
		n.open(e, "r+", (e, a) => {
			if (e) return i(e);
			n.futimes(a, t, r, (e) => {
				n.close(a, (t) => {
					i && i(e || t);
				});
			});
		});
	}
	function i(e, t, r) {
		let i = n.openSync(e, "r+");
		return n.futimesSync(i, t, r), n.closeSync(i);
	}
	t.exports = {
		utimesMillis: r,
		utimesMillisSync: i
	};
})), p = /* @__PURE__ */ t(((t, n) => {
	var r = s(), i = e("path"), a = e("util");
	function o(e, t, n) {
		let i = n.dereference ? (e) => r.stat(e, { bigint: !0 }) : (e) => r.lstat(e, { bigint: !0 });
		return Promise.all([i(e), i(t).catch((e) => {
			if (e.code === "ENOENT") return null;
			throw e;
		})]).then(([e, t]) => ({
			srcStat: e,
			destStat: t
		}));
	}
	function c(e, t, n) {
		let i, a = n.dereference ? (e) => r.statSync(e, { bigint: !0 }) : (e) => r.lstatSync(e, { bigint: !0 }), o = a(e);
		try {
			i = a(t);
		} catch (e) {
			if (e.code === "ENOENT") return {
				srcStat: o,
				destStat: null
			};
			throw e;
		}
		return {
			srcStat: o,
			destStat: i
		};
	}
	function l(e, t, n, r, s) {
		a.callbackify(o)(e, t, r, (r, a) => {
			if (r) return s(r);
			let { srcStat: o, destStat: c } = a;
			if (c) {
				if (p(o, c)) {
					let r = i.basename(e), a = i.basename(t);
					return n === "move" && r !== a && r.toLowerCase() === a.toLowerCase() ? s(null, {
						srcStat: o,
						destStat: c,
						isChangingCase: !0
					}) : s(/* @__PURE__ */ Error("Source and destination must not be the same."));
				}
				if (o.isDirectory() && !c.isDirectory()) return s(/* @__PURE__ */ Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
				if (!o.isDirectory() && c.isDirectory()) return s(/* @__PURE__ */ Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
			}
			return o.isDirectory() && m(e, t) ? s(Error(h(e, t, n))) : s(null, {
				srcStat: o,
				destStat: c
			});
		});
	}
	function u(e, t, n, r) {
		let { srcStat: a, destStat: o } = c(e, t, r);
		if (o) {
			if (p(a, o)) {
				let r = i.basename(e), s = i.basename(t);
				if (n === "move" && r !== s && r.toLowerCase() === s.toLowerCase()) return {
					srcStat: a,
					destStat: o,
					isChangingCase: !0
				};
				throw Error("Source and destination must not be the same.");
			}
			if (a.isDirectory() && !o.isDirectory()) throw Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
			if (!a.isDirectory() && o.isDirectory()) throw Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
		}
		if (a.isDirectory() && m(e, t)) throw Error(h(e, t, n));
		return {
			srcStat: a,
			destStat: o
		};
	}
	function d(e, t, n, a, o) {
		let s = i.resolve(i.dirname(e)), c = i.resolve(i.dirname(n));
		if (c === s || c === i.parse(c).root) return o();
		r.stat(c, { bigint: !0 }, (r, i) => r ? r.code === "ENOENT" ? o() : o(r) : p(t, i) ? o(Error(h(e, n, a))) : d(e, t, c, a, o));
	}
	function f(e, t, n, a) {
		let o = i.resolve(i.dirname(e)), s = i.resolve(i.dirname(n));
		if (s === o || s === i.parse(s).root) return;
		let c;
		try {
			c = r.statSync(s, { bigint: !0 });
		} catch (e) {
			if (e.code === "ENOENT") return;
			throw e;
		}
		if (p(t, c)) throw Error(h(e, n, a));
		return f(e, t, s, a);
	}
	function p(e, t) {
		return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
	}
	function m(e, t) {
		let n = i.resolve(e).split(i.sep).filter((e) => e), r = i.resolve(t).split(i.sep).filter((e) => e);
		return n.reduce((e, t, n) => e && r[n] === t, !0);
	}
	function h(e, t, n) {
		return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
	}
	n.exports = {
		checkPaths: l,
		checkPathsSync: u,
		checkParentPaths: d,
		checkParentPathsSync: f,
		isSrcSubdir: m,
		areIdentical: p
	};
})), m = /* @__PURE__ */ t(((t, n) => {
	var r = o(), i = e("path"), a = u().mkdirs, s = d().pathExists, c = f().utimesMillis, l = p();
	function m(e, t, n, r) {
		typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r ||= function() {}, n ||= {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0001"), l.checkPaths(e, t, "copy", n, (i, a) => {
			if (i) return r(i);
			let { srcStat: o, destStat: s } = a;
			l.checkParentPaths(e, o, t, "copy", (i) => i ? r(i) : n.filter ? g(h, s, e, t, n, r) : h(s, e, t, n, r));
		});
	}
	function h(e, t, n, r, o) {
		let c = i.dirname(n);
		s(c, (i, s) => {
			if (i) return o(i);
			if (s) return v(e, t, n, r, o);
			a(c, (i) => i ? o(i) : v(e, t, n, r, o));
		});
	}
	function g(e, t, n, r, i, a) {
		Promise.resolve(i.filter(n, r)).then((o) => o ? e(t, n, r, i, a) : a(), (e) => a(e));
	}
	function _(e, t, n, r, i) {
		return r.filter ? g(v, e, t, n, r, i) : v(e, t, n, r, i);
	}
	function v(e, t, n, i, a) {
		(i.dereference ? r.stat : r.lstat)(t, (r, o) => r ? a(r) : o.isDirectory() ? O(o, e, t, n, i, a) : o.isFile() || o.isCharacterDevice() || o.isBlockDevice() ? y(o, e, t, n, i, a) : o.isSymbolicLink() ? j(e, t, n, i, a) : o.isSocket() ? a(/* @__PURE__ */ Error(`Cannot copy a socket file: ${t}`)) : o.isFIFO() ? a(/* @__PURE__ */ Error(`Cannot copy a FIFO pipe: ${t}`)) : a(/* @__PURE__ */ Error(`Unknown file: ${t}`)));
	}
	function y(e, t, n, r, i, a) {
		return t ? b(e, n, r, i, a) : x(e, n, r, i, a);
	}
	function b(e, t, n, i, a) {
		if (i.overwrite) r.unlink(n, (r) => r ? a(r) : x(e, t, n, i, a));
		else if (i.errorOnExist) return a(/* @__PURE__ */ Error(`'${n}' already exists`));
		else return a();
	}
	function x(e, t, n, i, a) {
		r.copyFile(t, n, (r) => r ? a(r) : i.preserveTimestamps ? S(e.mode, t, n, a) : E(n, e.mode, a));
	}
	function S(e, t, n, r) {
		return C(e) ? w(n, e, (i) => i ? r(i) : T(e, t, n, r)) : T(e, t, n, r);
	}
	function C(e) {
		return (e & 128) == 0;
	}
	function w(e, t, n) {
		return E(e, t | 128, n);
	}
	function T(e, t, n, r) {
		D(t, n, (t) => t ? r(t) : E(n, e, r));
	}
	function E(e, t, n) {
		return r.chmod(e, t, n);
	}
	function D(e, t, n) {
		r.stat(e, (e, r) => e ? n(e) : c(t, r.atime, r.mtime, n));
	}
	function O(e, t, n, r, i, a) {
		return t ? ee(n, r, i, a) : k(e.mode, n, r, i, a);
	}
	function k(e, t, n, i, a) {
		r.mkdir(n, (r) => {
			if (r) return a(r);
			ee(t, n, i, (t) => t ? a(t) : E(n, e, a));
		});
	}
	function ee(e, t, n, i) {
		r.readdir(e, (r, a) => r ? i(r) : te(a, e, t, n, i));
	}
	function te(e, t, n, r, i) {
		let a = e.pop();
		return a ? A(e, a, t, n, r, i) : i();
	}
	function A(e, t, n, r, a, o) {
		let s = i.join(n, t), c = i.join(r, t);
		l.checkPaths(s, c, "copy", a, (t, i) => {
			if (t) return o(t);
			let { destStat: l } = i;
			_(l, s, c, a, (t) => t ? o(t) : te(e, n, r, a, o));
		});
	}
	function j(e, t, n, a, o) {
		r.readlink(t, (t, s) => {
			if (t) return o(t);
			if (a.dereference && (s = i.resolve(process.cwd(), s)), e) r.readlink(n, (t, c) => t ? t.code === "EINVAL" || t.code === "UNKNOWN" ? r.symlink(s, n, o) : o(t) : (a.dereference && (c = i.resolve(process.cwd(), c)), l.isSrcSubdir(s, c) ? o(/* @__PURE__ */ Error(`Cannot copy '${s}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && l.isSrcSubdir(c, s) ? o(/* @__PURE__ */ Error(`Cannot overwrite '${c}' with '${s}'.`)) : M(s, n, o)));
			else return r.symlink(s, n, o);
		});
	}
	function M(e, t, n) {
		r.unlink(t, (i) => i ? n(i) : r.symlink(e, t, n));
	}
	n.exports = m;
})), h = /* @__PURE__ */ t(((t, n) => {
	var r = o(), i = e("path"), a = u().mkdirsSync, s = f().utimesMillisSync, c = p();
	function l(e, t, n) {
		typeof n == "function" && (n = { filter: n }), n ||= {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0002");
		let { srcStat: r, destStat: i } = c.checkPathsSync(e, t, "copy", n);
		return c.checkParentPathsSync(e, r, t, "copy"), d(i, e, t, n);
	}
	function d(e, t, n, o) {
		if (o.filter && !o.filter(t, n)) return;
		let s = i.dirname(n);
		return r.existsSync(s) || a(s), h(e, t, n, o);
	}
	function m(e, t, n, r) {
		if (!(r.filter && !r.filter(t, n))) return h(e, t, n, r);
	}
	function h(e, t, n, i) {
		let a = (i.dereference ? r.statSync : r.lstatSync)(t);
		if (a.isDirectory()) return w(a, e, t, n, i);
		if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return g(a, e, t, n, i);
		if (a.isSymbolicLink()) return O(e, t, n, i);
		throw a.isSocket() ? Error(`Cannot copy a socket file: ${t}`) : a.isFIFO() ? Error(`Cannot copy a FIFO pipe: ${t}`) : Error(`Unknown file: ${t}`);
	}
	function g(e, t, n, r, i) {
		return t ? _(e, n, r, i) : v(e, n, r, i);
	}
	function _(e, t, n, i) {
		if (i.overwrite) return r.unlinkSync(n), v(e, t, n, i);
		if (i.errorOnExist) throw Error(`'${n}' already exists`);
	}
	function v(e, t, n, i) {
		return r.copyFileSync(t, n), i.preserveTimestamps && y(e.mode, t, n), S(n, e.mode);
	}
	function y(e, t, n) {
		return b(e) && x(n, e), C(t, n);
	}
	function b(e) {
		return (e & 128) == 0;
	}
	function x(e, t) {
		return S(e, t | 128);
	}
	function S(e, t) {
		return r.chmodSync(e, t);
	}
	function C(e, t) {
		let n = r.statSync(e);
		return s(t, n.atime, n.mtime);
	}
	function w(e, t, n, r, i) {
		return t ? E(n, r, i) : T(e.mode, n, r, i);
	}
	function T(e, t, n, i) {
		return r.mkdirSync(n), E(t, n, i), S(n, e);
	}
	function E(e, t, n) {
		r.readdirSync(e).forEach((r) => D(r, e, t, n));
	}
	function D(e, t, n, r) {
		let a = i.join(t, e), o = i.join(n, e), { destStat: s } = c.checkPathsSync(a, o, "copy", r);
		return m(s, a, o, r);
	}
	function O(e, t, n, a) {
		let o = r.readlinkSync(t);
		if (a.dereference && (o = i.resolve(process.cwd(), o)), e) {
			let e;
			try {
				e = r.readlinkSync(n);
			} catch (e) {
				if (e.code === "EINVAL" || e.code === "UNKNOWN") return r.symlinkSync(o, n);
				throw e;
			}
			if (a.dereference && (e = i.resolve(process.cwd(), e)), c.isSrcSubdir(o, e)) throw Error(`Cannot copy '${o}' to a subdirectory of itself, '${e}'.`);
			if (r.statSync(n).isDirectory() && c.isSrcSubdir(e, o)) throw Error(`Cannot overwrite '${e}' with '${o}'.`);
			return k(o, n);
		} else return r.symlinkSync(o, n);
	}
	function k(e, t) {
		return r.unlinkSync(t), r.symlinkSync(e, t);
	}
	n.exports = l;
})), g = /* @__PURE__ */ t(((e, t) => {
	var r = n().fromCallback;
	t.exports = {
		copy: r(m()),
		copySync: h()
	};
})), _ = /* @__PURE__ */ t(((t, n) => {
	var r = o(), i = e("path"), a = e("assert"), s = process.platform === "win32";
	function c(e) {
		[
			"unlink",
			"chmod",
			"stat",
			"lstat",
			"rmdir",
			"readdir"
		].forEach((t) => {
			e[t] = e[t] || r[t], t += "Sync", e[t] = e[t] || r[t];
		}), e.maxBusyTries = e.maxBusyTries || 3;
	}
	function l(e, t, n) {
		let r = 0;
		typeof t == "function" && (n = t, t = {}), a(e, "rimraf: missing path"), a.strictEqual(typeof e, "string", "rimraf: path should be a string"), a.strictEqual(typeof n, "function", "rimraf: callback function required"), a(t, "rimraf: invalid options argument provided"), a.strictEqual(typeof t, "object", "rimraf: options should be object"), c(t), u(e, t, function i(a) {
			if (a) {
				if ((a.code === "EBUSY" || a.code === "ENOTEMPTY" || a.code === "EPERM") && r < t.maxBusyTries) {
					r++;
					let n = r * 100;
					return setTimeout(() => u(e, t, i), n);
				}
				a.code === "ENOENT" && (a = null);
			}
			n(a);
		});
	}
	function u(e, t, n) {
		a(e), a(t), a(typeof n == "function"), t.lstat(e, (r, i) => {
			if (r && r.code === "ENOENT") return n(null);
			if (r && r.code === "EPERM" && s) return d(e, t, r, n);
			if (i && i.isDirectory()) return p(e, t, r, n);
			t.unlink(e, (r) => {
				if (r) {
					if (r.code === "ENOENT") return n(null);
					if (r.code === "EPERM") return s ? d(e, t, r, n) : p(e, t, r, n);
					if (r.code === "EISDIR") return p(e, t, r, n);
				}
				return n(r);
			});
		});
	}
	function d(e, t, n, r) {
		a(e), a(t), a(typeof r == "function"), t.chmod(e, 438, (i) => {
			i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (i, a) => {
				i ? r(i.code === "ENOENT" ? null : n) : a.isDirectory() ? p(e, t, n, r) : t.unlink(e, r);
			});
		});
	}
	function f(e, t, n) {
		let r;
		a(e), a(t);
		try {
			t.chmodSync(e, 438);
		} catch (e) {
			if (e.code === "ENOENT") return;
			throw n;
		}
		try {
			r = t.statSync(e);
		} catch (e) {
			if (e.code === "ENOENT") return;
			throw n;
		}
		r.isDirectory() ? g(e, t, n) : t.unlinkSync(e);
	}
	function p(e, t, n, r) {
		a(e), a(t), a(typeof r == "function"), t.rmdir(e, (i) => {
			i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? m(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
		});
	}
	function m(e, t, n) {
		a(e), a(t), a(typeof n == "function"), t.readdir(e, (r, a) => {
			if (r) return n(r);
			let o = a.length, s;
			if (o === 0) return t.rmdir(e, n);
			a.forEach((r) => {
				l(i.join(e, r), t, (r) => {
					if (!s) {
						if (r) return n(s = r);
						--o === 0 && t.rmdir(e, n);
					}
				});
			});
		});
	}
	function h(e, t) {
		let n;
		t ||= {}, c(t), a(e, "rimraf: missing path"), a.strictEqual(typeof e, "string", "rimraf: path should be a string"), a(t, "rimraf: missing options"), a.strictEqual(typeof t, "object", "rimraf: options should be object");
		try {
			n = t.lstatSync(e);
		} catch (n) {
			if (n.code === "ENOENT") return;
			n.code === "EPERM" && s && f(e, t, n);
		}
		try {
			n && n.isDirectory() ? g(e, t, null) : t.unlinkSync(e);
		} catch (n) {
			if (n.code === "ENOENT") return;
			if (n.code === "EPERM") return s ? f(e, t, n) : g(e, t, n);
			if (n.code !== "EISDIR") throw n;
			g(e, t, n);
		}
	}
	function g(e, t, n) {
		a(e), a(t);
		try {
			t.rmdirSync(e);
		} catch (r) {
			if (r.code === "ENOTDIR") throw n;
			if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM") _(e, t);
			else if (r.code !== "ENOENT") throw r;
		}
	}
	function _(e, t) {
		if (a(e), a(t), t.readdirSync(e).forEach((n) => h(i.join(e, n), t)), s) {
			let n = Date.now();
			do
				try {
					return t.rmdirSync(e, t);
				} catch {}
			while (Date.now() - n < 500);
		} else return t.rmdirSync(e, t);
	}
	n.exports = l, l.sync = h;
})), v = /* @__PURE__ */ t(((e, t) => {
	var r = o(), i = n().fromCallback, a = _();
	function s(e, t) {
		if (r.rm) return r.rm(e, {
			recursive: !0,
			force: !0
		}, t);
		a(e, t);
	}
	function c(e) {
		if (r.rmSync) return r.rmSync(e, {
			recursive: !0,
			force: !0
		});
		a.sync(e);
	}
	t.exports = {
		remove: i(s),
		removeSync: c
	};
})), y = /* @__PURE__ */ t(((t, r) => {
	var i = n().fromPromise, a = s(), o = e("path"), c = u(), l = v(), d = i(async function(e) {
		let t;
		try {
			t = await a.readdir(e);
		} catch {
			return c.mkdirs(e);
		}
		return Promise.all(t.map((t) => l.remove(o.join(e, t))));
	});
	function f(e) {
		let t;
		try {
			t = a.readdirSync(e);
		} catch {
			return c.mkdirsSync(e);
		}
		t.forEach((t) => {
			t = o.join(e, t), l.removeSync(t);
		});
	}
	r.exports = {
		emptyDirSync: f,
		emptydirSync: f,
		emptyDir: d,
		emptydir: d
	};
})), b = /* @__PURE__ */ t(((t, r) => {
	var i = n().fromCallback, a = e("path"), s = o(), c = u();
	function l(e, t) {
		function n() {
			s.writeFile(e, "", (e) => {
				if (e) return t(e);
				t();
			});
		}
		s.stat(e, (r, i) => {
			if (!r && i.isFile()) return t();
			let o = a.dirname(e);
			s.stat(o, (e, r) => {
				if (e) return e.code === "ENOENT" ? c.mkdirs(o, (e) => {
					if (e) return t(e);
					n();
				}) : t(e);
				r.isDirectory() ? n() : s.readdir(o, (e) => {
					if (e) return t(e);
				});
			});
		});
	}
	function d(e) {
		let t;
		try {
			t = s.statSync(e);
		} catch {}
		if (t && t.isFile()) return;
		let n = a.dirname(e);
		try {
			s.statSync(n).isDirectory() || s.readdirSync(n);
		} catch (e) {
			if (e && e.code === "ENOENT") c.mkdirsSync(n);
			else throw e;
		}
		s.writeFileSync(e, "");
	}
	r.exports = {
		createFile: i(l),
		createFileSync: d
	};
})), x = /* @__PURE__ */ t(((t, r) => {
	var i = n().fromCallback, a = e("path"), s = o(), c = u(), l = d().pathExists, { areIdentical: f } = p();
	function m(e, t, n) {
		function r(e, t) {
			s.link(e, t, (e) => {
				if (e) return n(e);
				n(null);
			});
		}
		s.lstat(t, (i, o) => {
			s.lstat(e, (i, s) => {
				if (i) return i.message = i.message.replace("lstat", "ensureLink"), n(i);
				if (o && f(s, o)) return n(null);
				let u = a.dirname(t);
				l(u, (i, a) => {
					if (i) return n(i);
					if (a) return r(e, t);
					c.mkdirs(u, (i) => {
						if (i) return n(i);
						r(e, t);
					});
				});
			});
		});
	}
	function h(e, t) {
		let n;
		try {
			n = s.lstatSync(t);
		} catch {}
		try {
			let t = s.lstatSync(e);
			if (n && f(t, n)) return;
		} catch (e) {
			throw e.message = e.message.replace("lstat", "ensureLink"), e;
		}
		let r = a.dirname(t);
		return s.existsSync(r) || c.mkdirsSync(r), s.linkSync(e, t);
	}
	r.exports = {
		createLink: i(m),
		createLinkSync: h
	};
})), S = /* @__PURE__ */ t(((t, n) => {
	var r = e("path"), i = o(), a = d().pathExists;
	function s(e, t, n) {
		if (r.isAbsolute(e)) return i.lstat(e, (t) => t ? (t.message = t.message.replace("lstat", "ensureSymlink"), n(t)) : n(null, {
			toCwd: e,
			toDst: e
		}));
		{
			let o = r.dirname(t), s = r.join(o, e);
			return a(s, (t, a) => t ? n(t) : a ? n(null, {
				toCwd: s,
				toDst: e
			}) : i.lstat(e, (t) => t ? (t.message = t.message.replace("lstat", "ensureSymlink"), n(t)) : n(null, {
				toCwd: e,
				toDst: r.relative(o, e)
			})));
		}
	}
	function c(e, t) {
		let n;
		if (r.isAbsolute(e)) {
			if (n = i.existsSync(e), !n) throw Error("absolute srcpath does not exist");
			return {
				toCwd: e,
				toDst: e
			};
		} else {
			let a = r.dirname(t), o = r.join(a, e);
			if (n = i.existsSync(o), n) return {
				toCwd: o,
				toDst: e
			};
			if (n = i.existsSync(e), !n) throw Error("relative srcpath does not exist");
			return {
				toCwd: e,
				toDst: r.relative(a, e)
			};
		}
	}
	n.exports = {
		symlinkPaths: s,
		symlinkPathsSync: c
	};
})), C = /* @__PURE__ */ t(((e, t) => {
	var n = o();
	function r(e, t, r) {
		if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
		n.lstat(e, (e, n) => {
			if (e) return r(null, "file");
			t = n && n.isDirectory() ? "dir" : "file", r(null, t);
		});
	}
	function i(e, t) {
		let r;
		if (t) return t;
		try {
			r = n.lstatSync(e);
		} catch {
			return "file";
		}
		return r && r.isDirectory() ? "dir" : "file";
	}
	t.exports = {
		symlinkType: r,
		symlinkTypeSync: i
	};
})), w = /* @__PURE__ */ t(((t, r) => {
	var i = n().fromCallback, a = e("path"), o = s(), c = u(), l = c.mkdirs, f = c.mkdirsSync, m = S(), h = m.symlinkPaths, g = m.symlinkPathsSync, _ = C(), v = _.symlinkType, y = _.symlinkTypeSync, b = d().pathExists, { areIdentical: x } = p();
	function w(e, t, n, r) {
		r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, o.lstat(t, (i, a) => {
			!i && a.isSymbolicLink() ? Promise.all([o.stat(e), o.stat(t)]).then(([i, a]) => {
				if (x(i, a)) return r(null);
				T(e, t, n, r);
			}) : T(e, t, n, r);
		});
	}
	function T(e, t, n, r) {
		h(e, t, (i, s) => {
			if (i) return r(i);
			e = s.toDst, v(s.toCwd, n, (n, i) => {
				if (n) return r(n);
				let s = a.dirname(t);
				b(s, (n, a) => {
					if (n) return r(n);
					if (a) return o.symlink(e, t, i, r);
					l(s, (n) => {
						if (n) return r(n);
						o.symlink(e, t, i, r);
					});
				});
			});
		});
	}
	function E(e, t, n) {
		let r;
		try {
			r = o.lstatSync(t);
		} catch {}
		if (r && r.isSymbolicLink() && x(o.statSync(e), o.statSync(t))) return;
		let i = g(e, t);
		e = i.toDst, n = y(i.toCwd, n);
		let s = a.dirname(t);
		return o.existsSync(s) || f(s), o.symlinkSync(e, t, n);
	}
	r.exports = {
		createSymlink: i(w),
		createSymlinkSync: E
	};
})), T = /* @__PURE__ */ t(((e, t) => {
	var { createFile: n, createFileSync: r } = b(), { createLink: i, createLinkSync: a } = x(), { createSymlink: o, createSymlinkSync: s } = w();
	t.exports = {
		createFile: n,
		createFileSync: r,
		ensureFile: n,
		ensureFileSync: r,
		createLink: i,
		createLinkSync: a,
		ensureLink: i,
		ensureLinkSync: a,
		createSymlink: o,
		createSymlinkSync: s,
		ensureSymlink: o,
		ensureSymlinkSync: s
	};
})), E = /* @__PURE__ */ t(((e, t) => {
	function n(e, { EOL: t = "\n", finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
		let a = n ? t : "", o = JSON.stringify(e, r, i);
		if (o === void 0) throw TypeError(`Converting ${typeof e} value to JSON is not supported`);
		return o.replace(/\n/g, t) + a;
	}
	function r(e) {
		return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
	}
	t.exports = {
		stringify: n,
		stripBom: r
	};
})), D = /* @__PURE__ */ t(((t, r) => {
	var i;
	try {
		i = o();
	} catch {
		i = e("fs");
	}
	var a = n(), { stringify: s, stripBom: c } = E();
	async function l(e, t = {}) {
		typeof t == "string" && (t = { encoding: t });
		let n = t.fs || i, r = "throws" in t ? t.throws : !0, o = await a.fromCallback(n.readFile)(e, t);
		o = c(o);
		let s;
		try {
			s = JSON.parse(o, t ? t.reviver : null);
		} catch (t) {
			if (r) throw t.message = `${e}: ${t.message}`, t;
			return null;
		}
		return s;
	}
	var u = a.fromPromise(l);
	function d(e, t = {}) {
		typeof t == "string" && (t = { encoding: t });
		let n = t.fs || i, r = "throws" in t ? t.throws : !0;
		try {
			let r = n.readFileSync(e, t);
			return r = c(r), JSON.parse(r, t.reviver);
		} catch (t) {
			if (r) throw t.message = `${e}: ${t.message}`, t;
			return null;
		}
	}
	async function f(e, t, n = {}) {
		let r = n.fs || i, o = s(t, n);
		await a.fromCallback(r.writeFile)(e, o, n);
	}
	var p = a.fromPromise(f);
	function m(e, t, n = {}) {
		let r = n.fs || i, a = s(t, n);
		return r.writeFileSync(e, a, n);
	}
	r.exports = {
		readFile: u,
		readFileSync: d,
		writeFile: p,
		writeFileSync: m
	};
})), O = /* @__PURE__ */ t(((e, t) => {
	var n = D();
	t.exports = {
		readJson: n.readFile,
		readJsonSync: n.readFileSync,
		writeJson: n.writeFile,
		writeJsonSync: n.writeFileSync
	};
})), k = /* @__PURE__ */ t(((t, r) => {
	var i = n().fromCallback, a = o(), s = e("path"), c = u(), l = d().pathExists;
	function f(e, t, n, r) {
		typeof n == "function" && (r = n, n = "utf8");
		let i = s.dirname(e);
		l(i, (o, s) => {
			if (o) return r(o);
			if (s) return a.writeFile(e, t, n, r);
			c.mkdirs(i, (i) => {
				if (i) return r(i);
				a.writeFile(e, t, n, r);
			});
		});
	}
	function p(e, ...t) {
		let n = s.dirname(e);
		if (a.existsSync(n)) return a.writeFileSync(e, ...t);
		c.mkdirsSync(n), a.writeFileSync(e, ...t);
	}
	r.exports = {
		outputFile: i(f),
		outputFileSync: p
	};
})), ee = /* @__PURE__ */ t(((e, t) => {
	var { stringify: n } = E(), { outputFile: r } = k();
	async function i(e, t, i = {}) {
		await r(e, n(t, i), i);
	}
	t.exports = i;
})), te = /* @__PURE__ */ t(((e, t) => {
	var { stringify: n } = E(), { outputFileSync: r } = k();
	function i(e, t, i) {
		r(e, n(t, i), i);
	}
	t.exports = i;
})), A = /* @__PURE__ */ t(((e, t) => {
	var r = n().fromPromise, i = O();
	i.outputJson = r(ee()), i.outputJsonSync = te(), i.outputJSON = i.outputJson, i.outputJSONSync = i.outputJsonSync, i.writeJSON = i.writeJson, i.writeJSONSync = i.writeJsonSync, i.readJSON = i.readJson, i.readJSONSync = i.readJsonSync, t.exports = i;
})), j = /* @__PURE__ */ t(((t, n) => {
	var r = o(), i = e("path"), a = g().copy, s = v().remove, c = u().mkdirp, l = d().pathExists, f = p();
	function m(e, t, n, r) {
		typeof n == "function" && (r = n, n = {}), n ||= {};
		let a = n.overwrite || n.clobber || !1;
		f.checkPaths(e, t, "move", n, (n, o) => {
			if (n) return r(n);
			let { srcStat: s, isChangingCase: l = !1 } = o;
			f.checkParentPaths(e, s, t, "move", (n) => {
				if (n) return r(n);
				if (h(t)) return _(e, t, a, l, r);
				c(i.dirname(t), (n) => n ? r(n) : _(e, t, a, l, r));
			});
		});
	}
	function h(e) {
		let t = i.dirname(e);
		return i.parse(t).root === t;
	}
	function _(e, t, n, r, i) {
		if (r) return y(e, t, n, i);
		if (n) return s(t, (r) => r ? i(r) : y(e, t, n, i));
		l(t, (r, a) => r ? i(r) : a ? i(/* @__PURE__ */ Error("dest already exists.")) : y(e, t, n, i));
	}
	function y(e, t, n, i) {
		r.rename(e, t, (r) => r ? r.code === "EXDEV" ? b(e, t, n, i) : i(r) : i());
	}
	function b(e, t, n, r) {
		a(e, t, {
			overwrite: n,
			errorOnExist: !0
		}, (t) => t ? r(t) : s(e, r));
	}
	n.exports = m;
})), M = /* @__PURE__ */ t(((t, n) => {
	var r = o(), i = e("path"), a = g().copySync, s = v().removeSync, c = u().mkdirpSync, l = p();
	function d(e, t, n) {
		n ||= {};
		let r = n.overwrite || n.clobber || !1, { srcStat: a, isChangingCase: o = !1 } = l.checkPathsSync(e, t, "move", n);
		return l.checkParentPathsSync(e, a, t, "move"), f(t) || c(i.dirname(t)), m(e, t, r, o);
	}
	function f(e) {
		let t = i.dirname(e);
		return i.parse(t).root === t;
	}
	function m(e, t, n, i) {
		if (i) return h(e, t, n);
		if (n) return s(t), h(e, t, n);
		if (r.existsSync(t)) throw Error("dest already exists.");
		return h(e, t, n);
	}
	function h(e, t, n) {
		try {
			r.renameSync(e, t);
		} catch (r) {
			if (r.code !== "EXDEV") throw r;
			return _(e, t, n);
		}
	}
	function _(e, t, n) {
		return a(e, t, {
			overwrite: n,
			errorOnExist: !0
		}), s(e);
	}
	n.exports = d;
})), N = /* @__PURE__ */ t(((e, t) => {
	var r = n().fromCallback;
	t.exports = {
		move: r(j()),
		moveSync: M()
	};
})), P = /* @__PURE__ */ t(((e, t) => {
	t.exports = {
		...s(),
		...g(),
		...y(),
		...T(),
		...A(),
		...u(),
		...N(),
		...k(),
		...d(),
		...v()
	};
})), ne = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.CancellationError = t.CancellationToken = void 0;
	var n = e("events");
	t.CancellationToken = class extends n.EventEmitter {
		get cancelled() {
			return this._cancelled || this._parent != null && this._parent.cancelled;
		}
		set parent(e) {
			this.removeParentCancelHandler(), this._parent = e, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
		}
		constructor(e) {
			super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, e != null && (this.parent = e);
		}
		cancel() {
			this._cancelled = !0, this.emit("cancel");
		}
		onCancel(e) {
			this.cancelled ? e() : this.once("cancel", e);
		}
		createPromise(e) {
			if (this.cancelled) return Promise.reject(new r());
			let t = () => {
				if (n != null) try {
					this.removeListener("cancel", n), n = null;
				} catch {}
			}, n = null;
			return new Promise((t, i) => {
				let a = null;
				if (n = () => {
					try {
						a != null && (a(), a = null);
					} finally {
						i(new r());
					}
				}, this.cancelled) {
					n();
					return;
				}
				this.onCancel(n), e(t, i, (e) => {
					a = e;
				});
			}).then((e) => (t(), e)).catch((e) => {
				throw t(), e;
			});
		}
		removeParentCancelHandler() {
			let e = this._parent;
			e != null && this.parentCancelHandler != null && (e.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
		}
		dispose() {
			try {
				this.removeParentCancelHandler();
			} finally {
				this.removeAllListeners(), this._parent = null;
			}
		}
	};
	var r = class extends Error {
		constructor() {
			super("cancelled");
		}
	};
	t.CancellationError = r;
})), F = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.newError = t;
	function t(e, t) {
		let n = Error(e);
		return n.code = t, n;
	}
})), re = /* @__PURE__ */ t(((e, t) => {
	var n = 1e3, r = n * 60, i = r * 60, a = i * 24, o = a * 7, s = a * 365.25;
	t.exports = function(e, t) {
		t ||= {};
		var n = typeof e;
		if (n === "string" && e.length > 0) return c(e);
		if (n === "number" && isFinite(e)) return t.long ? u(e) : l(e);
		throw Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e));
	};
	function c(e) {
		if (e = String(e), !(e.length > 100)) {
			var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
			if (t) {
				var c = parseFloat(t[1]);
				switch ((t[2] || "ms").toLowerCase()) {
					case "years":
					case "year":
					case "yrs":
					case "yr":
					case "y": return c * s;
					case "weeks":
					case "week":
					case "w": return c * o;
					case "days":
					case "day":
					case "d": return c * a;
					case "hours":
					case "hour":
					case "hrs":
					case "hr":
					case "h": return c * i;
					case "minutes":
					case "minute":
					case "mins":
					case "min":
					case "m": return c * r;
					case "seconds":
					case "second":
					case "secs":
					case "sec":
					case "s": return c * n;
					case "milliseconds":
					case "millisecond":
					case "msecs":
					case "msec":
					case "ms": return c;
					default: return;
				}
			}
		}
	}
	function l(e) {
		var t = Math.abs(e);
		return t >= a ? Math.round(e / a) + "d" : t >= i ? Math.round(e / i) + "h" : t >= r ? Math.round(e / r) + "m" : t >= n ? Math.round(e / n) + "s" : e + "ms";
	}
	function u(e) {
		var t = Math.abs(e);
		return t >= a ? d(e, t, a, "day") : t >= i ? d(e, t, i, "hour") : t >= r ? d(e, t, r, "minute") : t >= n ? d(e, t, n, "second") : e + " ms";
	}
	function d(e, t, n, r) {
		var i = t >= n * 1.5;
		return Math.round(e / n) + " " + r + (i ? "s" : "");
	}
})), I = /* @__PURE__ */ t(((e, t) => {
	function n(e) {
		n.debug = n, n.default = n, n.coerce = c, n.disable = o, n.enable = i, n.enabled = s, n.humanize = re(), n.destroy = l, Object.keys(e).forEach((t) => {
			n[t] = e[t];
		}), n.names = [], n.skips = [], n.formatters = {};
		function t(e) {
			let t = 0;
			for (let n = 0; n < e.length; n++) t = (t << 5) - t + e.charCodeAt(n), t |= 0;
			return n.colors[Math.abs(t) % n.colors.length];
		}
		n.selectColor = t;
		function n(e) {
			let t, i = null, a, o;
			function s(...e) {
				if (!s.enabled) return;
				let r = s, i = Number(/* @__PURE__ */ new Date());
				r.diff = i - (t || i), r.prev = t, r.curr = i, t = i, e[0] = n.coerce(e[0]), typeof e[0] != "string" && e.unshift("%O");
				let a = 0;
				e[0] = e[0].replace(/%([a-zA-Z%])/g, (t, i) => {
					if (t === "%%") return "%";
					a++;
					let o = n.formatters[i];
					if (typeof o == "function") {
						let n = e[a];
						t = o.call(r, n), e.splice(a, 1), a--;
					}
					return t;
				}), n.formatArgs.call(r, e), (r.log || n.log).apply(r, e);
			}
			return s.namespace = e, s.useColors = n.useColors(), s.color = n.selectColor(e), s.extend = r, s.destroy = n.destroy, Object.defineProperty(s, "enabled", {
				enumerable: !0,
				configurable: !1,
				get: () => i === null ? (a !== n.namespaces && (a = n.namespaces, o = n.enabled(e)), o) : i,
				set: (e) => {
					i = e;
				}
			}), typeof n.init == "function" && n.init(s), s;
		}
		function r(e, t) {
			let r = n(this.namespace + (t === void 0 ? ":" : t) + e);
			return r.log = this.log, r;
		}
		function i(e) {
			n.save(e), n.namespaces = e, n.names = [], n.skips = [];
			let t = (typeof e == "string" ? e : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
			for (let e of t) e[0] === "-" ? n.skips.push(e.slice(1)) : n.names.push(e);
		}
		function a(e, t) {
			let n = 0, r = 0, i = -1, a = 0;
			for (; n < e.length;) if (r < t.length && (t[r] === e[n] || t[r] === "*")) t[r] === "*" ? (i = r, a = n, r++) : (n++, r++);
			else if (i !== -1) r = i + 1, a++, n = a;
			else return !1;
			for (; r < t.length && t[r] === "*";) r++;
			return r === t.length;
		}
		function o() {
			let e = [...n.names, ...n.skips.map((e) => "-" + e)].join(",");
			return n.enable(""), e;
		}
		function s(e) {
			for (let t of n.skips) if (a(e, t)) return !1;
			for (let t of n.names) if (a(e, t)) return !0;
			return !1;
		}
		function c(e) {
			return e instanceof Error ? e.stack || e.message : e;
		}
		function l() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		return n.enable(n.load()), n;
	}
	t.exports = n;
})), L = /* @__PURE__ */ t(((e, t) => {
	e.formatArgs = r, e.save = i, e.load = a, e.useColors = n, e.storage = o(), e.destroy = (() => {
		let e = !1;
		return () => {
			e || (e = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
		};
	})(), e.colors = /* @__PURE__ */ "#0000CC.#0000FF.#0033CC.#0033FF.#0066CC.#0066FF.#0099CC.#0099FF.#00CC00.#00CC33.#00CC66.#00CC99.#00CCCC.#00CCFF.#3300CC.#3300FF.#3333CC.#3333FF.#3366CC.#3366FF.#3399CC.#3399FF.#33CC00.#33CC33.#33CC66.#33CC99.#33CCCC.#33CCFF.#6600CC.#6600FF.#6633CC.#6633FF.#66CC00.#66CC33.#9900CC.#9900FF.#9933CC.#9933FF.#99CC00.#99CC33.#CC0000.#CC0033.#CC0066.#CC0099.#CC00CC.#CC00FF.#CC3300.#CC3333.#CC3366.#CC3399.#CC33CC.#CC33FF.#CC6600.#CC6633.#CC9900.#CC9933.#CCCC00.#CCCC33.#FF0000.#FF0033.#FF0066.#FF0099.#FF00CC.#FF00FF.#FF3300.#FF3333.#FF3366.#FF3399.#FF33CC.#FF33FF.#FF6600.#FF6633.#FF9900.#FF9933.#FFCC00.#FFCC33".split(".");
	function n() {
		if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return !0;
		if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return !1;
		let e;
		return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator < "u" && navigator.userAgent && (e = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(e[1], 10) >= 31 || typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	function r(e) {
		if (e[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + e[0] + (this.useColors ? "%c " : " ") + "+" + t.exports.humanize(this.diff), !this.useColors) return;
		let n = "color: " + this.color;
		e.splice(1, 0, n, "color: inherit");
		let r = 0, i = 0;
		e[0].replace(/%[a-zA-Z%]/g, (e) => {
			e !== "%%" && (r++, e === "%c" && (i = r));
		}), e.splice(i, 0, n);
	}
	e.log = console.debug || console.log || (() => {});
	function i(t) {
		try {
			t ? e.storage.setItem("debug", t) : e.storage.removeItem("debug");
		} catch {}
	}
	function a() {
		let t;
		try {
			t = e.storage.getItem("debug") || e.storage.getItem("DEBUG");
		} catch {}
		return !t && typeof process < "u" && "env" in process && (t = process.env.DEBUG), t;
	}
	function o() {
		try {
			return localStorage;
		} catch {}
	}
	t.exports = I()(e);
	var { formatters: s } = t.exports;
	s.j = function(e) {
		try {
			return JSON.stringify(e);
		} catch (e) {
			return "[UnexpectedJSONParseError]: " + e.message;
		}
	};
})), R = /* @__PURE__ */ t(((e, t) => {
	t.exports = (e, t = process.argv) => {
		let n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
		return r !== -1 && (i === -1 || r < i);
	};
})), z = /* @__PURE__ */ t(((t, n) => {
	var r = e("os"), i = e("tty"), a = R(), { env: o } = process, s;
	a("no-color") || a("no-colors") || a("color=false") || a("color=never") ? s = 0 : (a("color") || a("colors") || a("color=true") || a("color=always")) && (s = 1), "FORCE_COLOR" in o && (s = o.FORCE_COLOR === "true" ? 1 : o.FORCE_COLOR === "false" ? 0 : o.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(o.FORCE_COLOR, 10), 3));
	function c(e) {
		return e === 0 ? !1 : {
			level: e,
			hasBasic: !0,
			has256: e >= 2,
			has16m: e >= 3
		};
	}
	function l(e, t) {
		if (s === 0) return 0;
		if (a("color=16m") || a("color=full") || a("color=truecolor")) return 3;
		if (a("color=256")) return 2;
		if (e && !t && s === void 0) return 0;
		let n = s || 0;
		if (o.TERM === "dumb") return n;
		if (process.platform === "win32") {
			let e = r.release().split(".");
			return Number(e[0]) >= 10 && Number(e[2]) >= 10586 ? Number(e[2]) >= 14931 ? 3 : 2 : 1;
		}
		if ("CI" in o) return [
			"TRAVIS",
			"CIRCLECI",
			"APPVEYOR",
			"GITLAB_CI",
			"GITHUB_ACTIONS",
			"BUILDKITE"
		].some((e) => e in o) || o.CI_NAME === "codeship" ? 1 : n;
		if ("TEAMCITY_VERSION" in o) return +!!/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(o.TEAMCITY_VERSION);
		if (o.COLORTERM === "truecolor") return 3;
		if ("TERM_PROGRAM" in o) {
			let e = parseInt((o.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
			switch (o.TERM_PROGRAM) {
				case "iTerm.app": return e >= 3 ? 3 : 2;
				case "Apple_Terminal": return 2;
			}
		}
		return /-256(color)?$/i.test(o.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(o.TERM) || "COLORTERM" in o ? 1 : n;
	}
	function u(e) {
		return c(l(e, e && e.isTTY));
	}
	n.exports = {
		supportsColor: u,
		stdout: c(l(!0, i.isatty(1))),
		stderr: c(l(!0, i.isatty(2)))
	};
})), B = /* @__PURE__ */ t(((t, n) => {
	var r = e("tty"), i = e("util");
	t.init = d, t.log = c, t.formatArgs = o, t.save = l, t.load = u, t.useColors = a, t.destroy = i.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."), t.colors = [
		6,
		2,
		3,
		4,
		5,
		1
	];
	try {
		let e = z();
		e && (e.stderr || e).level >= 2 && (t.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		]);
	} catch {}
	t.inspectOpts = Object.keys(process.env).filter((e) => /^debug_/i.test(e)).reduce((e, t) => {
		let n = t.substring(6).toLowerCase().replace(/_([a-z])/g, (e, t) => t.toUpperCase()), r = process.env[t];
		return r = /^(yes|on|true|enabled)$/i.test(r) ? !0 : /^(no|off|false|disabled)$/i.test(r) ? !1 : r === "null" ? null : Number(r), e[n] = r, e;
	}, {});
	function a() {
		return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
	}
	function o(e) {
		let { namespace: t, useColors: r } = this;
		if (r) {
			let r = this.color, i = "\x1B[3" + (r < 8 ? r : "8;5;" + r), a = `  ${i};1m${t} \u001B[0m`;
			e[0] = a + e[0].split("\n").join("\n" + a), e.push(i + "m+" + n.exports.humanize(this.diff) + "\x1B[0m");
		} else e[0] = s() + t + " " + e[0];
	}
	function s() {
		return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
	}
	function c(...e) {
		return process.stderr.write(i.formatWithOptions(t.inspectOpts, ...e) + "\n");
	}
	function l(e) {
		e ? process.env.DEBUG = e : delete process.env.DEBUG;
	}
	function u() {
		return process.env.DEBUG;
	}
	function d(e) {
		e.inspectOpts = {};
		let n = Object.keys(t.inspectOpts);
		for (let r = 0; r < n.length; r++) e.inspectOpts[n[r]] = t.inspectOpts[n[r]];
	}
	n.exports = I()(t);
	var { formatters: f } = n.exports;
	f.o = function(e) {
		return this.inspectOpts.colors = this.useColors, i.inspect(e, this.inspectOpts).split("\n").map((e) => e.trim()).join(" ");
	}, f.O = function(e) {
		return this.inspectOpts.colors = this.useColors, i.inspect(e, this.inspectOpts);
	};
})), ie = /* @__PURE__ */ t(((e, t) => {
	typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? t.exports = L() : t.exports = B();
})), V = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.ProgressCallbackTransform = void 0;
	var n = e("stream");
	t.ProgressCallbackTransform = class extends n.Transform {
		constructor(e, t, n) {
			super(), this.total = e, this.cancellationToken = t, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
		}
		_transform(e, t, n) {
			if (this.cancellationToken.cancelled) {
				n(/* @__PURE__ */ Error("cancelled"), null);
				return;
			}
			this.transferred += e.length, this.delta += e.length;
			let r = Date.now();
			r >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = r + 1e3, this.onProgress({
				total: this.total,
				delta: this.delta,
				transferred: this.transferred,
				percent: this.transferred / this.total * 100,
				bytesPerSecond: Math.round(this.transferred / ((r - this.start) / 1e3))
			}), this.delta = 0), n(null, e);
		}
		_flush(e) {
			if (this.cancellationToken.cancelled) {
				e(/* @__PURE__ */ Error("cancelled"));
				return;
			}
			this.onProgress({
				total: this.total,
				delta: this.delta,
				transferred: this.total,
				percent: 100,
				bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
			}), this.delta = 0, e(null);
		}
	};
})), ae = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.DigestTransform = t.HttpExecutor = t.HttpError = void 0, t.createHttpError = d, t.parseJson = m, t.configureRequestOptionsFromUrl = g, t.configureRequestUrl = _, t.safeGetHeader = b, t.configureRequestOptions = S, t.safeStringifyJson = C;
	var n = e("crypto"), r = ie(), i = e("fs"), a = e("stream"), o = e("url"), s = ne(), c = F(), l = V(), u = (0, r.default)("electron-builder");
	function d(e, t = null) {
		return new p(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : "\n" + JSON.stringify(t, null, "  ")) + "\nHeaders: " + C(e.headers), t);
	}
	var f = new Map([
		[429, "Too many requests"],
		[400, "Bad request"],
		[403, "Forbidden"],
		[404, "Not found"],
		[405, "Method not allowed"],
		[406, "Not acceptable"],
		[408, "Request timeout"],
		[413, "Request entity too large"],
		[500, "Internal server error"],
		[502, "Bad gateway"],
		[503, "Service unavailable"],
		[504, "Gateway timeout"],
		[505, "HTTP version not supported"]
	]), p = class extends Error {
		constructor(e, t = `HTTP error: ${f.get(e) || e}`, n = null) {
			super(t), this.statusCode = e, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${e}`;
		}
		isServerError() {
			return this.statusCode >= 500 && this.statusCode <= 599;
		}
	};
	t.HttpError = p;
	function m(e) {
		return e.then((e) => e == null || e.length === 0 ? null : JSON.parse(e));
	}
	t.HttpExecutor = class e {
		constructor() {
			this.maxRedirects = 10;
		}
		request(e, t = new s.CancellationToken(), n) {
			S(e);
			let r = n == null ? void 0 : JSON.stringify(n), i = r ? Buffer.from(r) : void 0;
			if (i != null) {
				u(r);
				let { headers: t, ...n } = e;
				e = {
					method: "post",
					headers: {
						"Content-Type": "application/json",
						"Content-Length": i.length,
						...t
					},
					...n
				};
			}
			return this.doApiRequest(e, t, (e) => e.end(i));
		}
		doApiRequest(e, t, n, r = 0) {
			return u.enabled && u(`Request: ${C(e)}`), t.createPromise((i, a, o) => {
				let s = this.createRequest(e, (o) => {
					try {
						this.handleResponse(o, e, t, i, a, r, n);
					} catch (e) {
						a(e);
					}
				});
				this.addErrorAndTimeoutHandlers(s, a, e.timeout), this.addRedirectHandlers(s, e, a, r, (e) => {
					this.doApiRequest(e, t, n, r).then(i).catch(a);
				}), n(s, a), o(() => s.abort());
			});
		}
		addRedirectHandlers(e, t, n, r, i) {}
		addErrorAndTimeoutHandlers(e, t, n = 60 * 1e3) {
			this.addTimeOutHandler(e, t, n), e.on("error", t), e.on("aborted", () => {
				t(/* @__PURE__ */ Error("Request has been aborted by the server"));
			});
		}
		handleResponse(t, n, r, i, a, o, s) {
			if (u.enabled && u(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${C(n)}`), t.statusCode === 404) {
				a(d(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
				return;
			} else if (t.statusCode === 204) {
				i();
				return;
			}
			let c = t.statusCode ?? 0, l = c >= 300 && c < 400, f = b(t, "location");
			if (l && f != null) {
				if (o > this.maxRedirects) {
					a(this.createMaxRedirectError());
					return;
				}
				this.doApiRequest(e.prepareRedirectUrlOptions(f, n), r, s, o).then(i).catch(a);
				return;
			}
			t.setEncoding("utf8");
			let p = "";
			t.on("error", a), t.on("data", (e) => p += e), t.on("end", () => {
				try {
					if (t.statusCode != null && t.statusCode >= 400) {
						let e = b(t, "content-type"), r = e != null && (Array.isArray(e) ? e.find((e) => e.includes("json")) != null : e.includes("json"));
						a(d(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${r ? JSON.stringify(JSON.parse(p)) : p}
          `));
					} else i(p.length === 0 ? null : p);
				} catch (e) {
					a(e);
				}
			});
		}
		async downloadToBuffer(e, t) {
			return await t.cancellationToken.createPromise((n, r, i) => {
				let a = [], o = {
					headers: t.headers || void 0,
					redirect: "manual"
				};
				_(e, o), S(o), this.doDownload(o, {
					destination: null,
					options: t,
					onCancel: i,
					callback: (e) => {
						e == null ? n(Buffer.concat(a)) : r(e);
					},
					responseHandler: (e, t) => {
						let n = 0;
						e.on("data", (e) => {
							if (n += e.length, n > 524288e3) {
								t(/* @__PURE__ */ Error("Maximum allowed size is 500 MB"));
								return;
							}
							a.push(e);
						}), e.on("end", () => {
							t(null);
						});
					}
				}, 0);
			});
		}
		doDownload(t, n, r) {
			let i = this.createRequest(t, (i) => {
				if (i.statusCode >= 400) {
					n.callback(/* @__PURE__ */ Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${i.statusCode}: ${i.statusMessage}`));
					return;
				}
				i.on("error", n.callback);
				let a = b(i, "location");
				if (a != null) {
					r < this.maxRedirects ? this.doDownload(e.prepareRedirectUrlOptions(a, t), n, r++) : n.callback(this.createMaxRedirectError());
					return;
				}
				n.responseHandler == null ? x(n, i) : n.responseHandler(i, n.callback);
			});
			this.addErrorAndTimeoutHandlers(i, n.callback, t.timeout), this.addRedirectHandlers(i, t, n.callback, r, (e) => {
				this.doDownload(e, n, r++);
			}), i.end();
		}
		createMaxRedirectError() {
			return /* @__PURE__ */ Error(`Too many redirects (> ${this.maxRedirects})`);
		}
		addTimeOutHandler(e, t, n) {
			e.on("socket", (r) => {
				r.setTimeout(n, () => {
					e.abort(), t(/* @__PURE__ */ Error("Request timed out"));
				});
			});
		}
		static prepareRedirectUrlOptions(t, n) {
			let r = g(t, { ...n }), i = r.headers;
			if (i?.authorization) {
				let r = e.reconstructOriginalUrl(n), a = h(t, n);
				e.isCrossOriginRedirect(r, a) && (u.enabled && u(`Given the cross-origin redirect (from ${r.host} to ${a.host}), the Authorization header will be stripped out.`), delete i.authorization);
			}
			return r;
		}
		static reconstructOriginalUrl(e) {
			let t = e.protocol || "https:";
			if (!e.hostname) throw Error("Missing hostname in request options");
			let n = e.hostname, r = e.port ? `:${e.port}` : "", i = e.path || "/";
			return new o.URL(`${t}//${n}${r}${i}`);
		}
		static isCrossOriginRedirect(e, t) {
			return e.hostname.toLowerCase() === t.hostname.toLowerCase() ? e.protocol === "http:" && ["80", ""].includes(e.port) && t.protocol === "https:" && ["443", ""].includes(t.port) ? !1 : e.protocol === t.protocol ? e.port !== t.port : !0 : !0;
		}
		static retryOnServerError(e, t = 3) {
			for (let n = 0;; n++) try {
				return e();
			} catch (e) {
				if (n < t && (e instanceof p && e.isServerError() || e.code === "EPIPE")) continue;
				throw e;
			}
		}
	};
	function h(e, t) {
		try {
			return new o.URL(e);
		} catch {
			let n = t.hostname, r = `${t.protocol || "https:"}//${n}${t.port ? `:${t.port}` : ""}`;
			return new o.URL(e, r);
		}
	}
	function g(e, t) {
		let n = S(t);
		return _(h(e, t), n), n;
	}
	function _(e, t) {
		t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
	}
	var v = class extends a.Transform {
		get actual() {
			return this._actual;
		}
		constructor(e, t = "sha512", r = "base64") {
			super(), this.expected = e, this.algorithm = t, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, n.createHash)(t);
		}
		_transform(e, t, n) {
			this.digester.update(e), n(null, e);
		}
		_flush(e) {
			if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd) try {
				this.validate();
			} catch (t) {
				e(t);
				return;
			}
			e(null);
		}
		validate() {
			if (this._actual == null) throw (0, c.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
			if (this._actual !== this.expected) throw (0, c.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
			return null;
		}
	};
	t.DigestTransform = v;
	function y(e, t, n) {
		return e != null && t != null && e !== t ? (n(/* @__PURE__ */ Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
	}
	function b(e, t) {
		let n = e.headers[t];
		return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
	}
	function x(e, t) {
		if (!y(b(t, "X-Checksum-Sha2"), e.options.sha2, e.callback)) return;
		let n = [];
		if (e.options.onProgress != null) {
			let r = b(t, "content-length");
			r != null && n.push(new l.ProgressCallbackTransform(parseInt(r, 10), e.options.cancellationToken, e.options.onProgress));
		}
		let r = e.options.sha512;
		r == null ? e.options.sha2 != null && n.push(new v(e.options.sha2, "sha256", "hex")) : n.push(new v(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64"));
		let a = (0, i.createWriteStream)(e.destination);
		n.push(a);
		let o = t;
		for (let t of n) t.on("error", (t) => {
			a.close(), e.options.cancellationToken.cancelled || e.callback(t);
		}), o = o.pipe(t);
		a.on("finish", () => {
			a.close(e.callback);
		});
	}
	function S(e, t, n) {
		n != null && (e.method = n), e.headers = { ...e.headers };
		let r = e.headers;
		return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] ??= "electron-builder", (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
	}
	function C(e, t) {
		return JSON.stringify(e, (e, n) => e.endsWith("Authorization") || e.endsWith("authorization") || e.endsWith("Password") || e.endsWith("PASSWORD") || e.endsWith("Token") || e.includes("password") || e.includes("token") || t != null && t.has(e) ? "<stripped sensitive data>" : n, 2);
	}
})), oe = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MemoLazy = void 0, e.MemoLazy = class {
		constructor(e, t) {
			this.selector = e, this.creator = t, this.selected = void 0, this._value = void 0;
		}
		get hasValue() {
			return this._value !== void 0;
		}
		get value() {
			let e = this.selector();
			if (this._value !== void 0 && t(this.selected, e)) return this._value;
			this.selected = e;
			let n = this.creator(e);
			return this.value = n, n;
		}
		set value(e) {
			this._value = e;
		}
	};
	function t(e, n) {
		if (typeof e == "object" && e && typeof n == "object" && n) {
			let r = Object.keys(e), i = Object.keys(n);
			return r.length === i.length && r.every((r) => t(e[r], n[r]));
		}
		return e === n;
	}
})), se = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.githubUrl = t, e.githubTagPrefix = n, e.getS3LikeProviderBaseUrl = r;
	function t(e, t = "github.com") {
		return `${e.protocol || "https"}://${e.host || t}`;
	}
	function n(e) {
		return e.tagNamePrefix ? e.tagNamePrefix : e.vPrefixedTagName ?? !0 ? "v" : "";
	}
	function r(e) {
		let t = e.provider;
		if (t === "s3") return i(e);
		if (t === "spaces") return o(e);
		throw Error(`Not supported provider: ${t}`);
	}
	function i(e) {
		let t;
		if (e.accelerate == 1) t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
		else if (e.endpoint != null) t = `${e.endpoint}/${e.bucket}`;
		else if (e.bucket.includes(".")) {
			if (e.region == null) throw Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
			t = e.region === "us-east-1" ? `https://s3.amazonaws.com/${e.bucket}` : `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
		} else t = e.region === "cn-north-1" ? `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : `https://${e.bucket}.s3.amazonaws.com`;
		return a(t, e.path);
	}
	function a(e, t) {
		return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
	}
	function o(e) {
		if (e.name == null) throw Error("name is missing");
		if (e.region == null) throw Error("region is missing");
		return a(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
	}
})), ce = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.retry = n;
	var t = ne();
	async function n(e, r) {
		let { retries: i, interval: a, backoff: o = 0, attempt: s = 0, shouldRetry: c, cancellationToken: l = new t.CancellationToken() } = r;
		try {
			return await e();
		} catch (t) {
			if (await Promise.resolve(c?.(t) ?? !0) && i > 0 && !l.cancelled) return await new Promise((e) => setTimeout(e, a + o * s)), await n(e, {
				...r,
				retries: i - 1,
				attempt: s + 1
			});
			throw t;
		}
	}
})), le = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.parseDn = t;
	function t(e) {
		let t = !1, n = null, r = "", i = 0;
		e = e.trim();
		let a = /* @__PURE__ */ new Map();
		for (let o = 0; o <= e.length; o++) {
			if (o === e.length) {
				n !== null && a.set(n, r);
				break;
			}
			let s = e[o];
			if (t) {
				if (s === "\"") {
					t = !1;
					continue;
				}
			} else {
				if (s === "\"") {
					t = !0;
					continue;
				}
				if (s === "\\") {
					o++;
					let t = parseInt(e.slice(o, o + 2), 16);
					Number.isNaN(t) ? r += e[o] : (o++, r += String.fromCharCode(t));
					continue;
				}
				if (n === null && s === "=") {
					n = r, r = "";
					continue;
				}
				if (s === "," || s === ";" || s === "+") {
					n !== null && a.set(n, r), n = null, r = "";
					continue;
				}
			}
			if (s === " " && !t) {
				if (r.length === 0) continue;
				if (o > i) {
					let t = o;
					for (; e[t] === " ";) t++;
					i = t;
				}
				if (i >= e.length || e[i] === "," || e[i] === ";" || n === null && e[i] === "=" || n !== null && e[i] === "+") {
					o = i - 1;
					continue;
				}
			}
			r += s;
		}
		return a;
	}
})), ue = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.nil = t.UUID = void 0;
	var n = e("crypto"), r = F(), i = "options.name must be either a string or a Buffer", a = (0, n.randomBytes)(16);
	a[0] |= 1;
	var o = {}, s = [];
	for (let e = 0; e < 256; e++) {
		let t = (e + 256).toString(16).substr(1);
		o[t] = e, s[e] = t;
	}
	var c = class e {
		constructor(t) {
			this.ascii = null, this.binary = null;
			let n = e.check(t);
			if (!n) throw Error("not a UUID");
			this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
		}
		static v5(e, t) {
			return d(e, "sha1", 80, t);
		}
		toString() {
			return this.ascii ??= f(this.binary), this.ascii;
		}
		inspect() {
			return `UUID v${this.version} ${this.toString()}`;
		}
		static check(e, t = 0) {
			if (typeof e == "string") return e = e.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(e) ? e === "00000000-0000-0000-0000-000000000000" ? {
				version: void 0,
				variant: "nil",
				format: "ascii"
			} : {
				version: (o[e[14] + e[15]] & 240) >> 4,
				variant: l((o[e[19] + e[20]] & 224) >> 5),
				format: "ascii"
			} : !1;
			if (Buffer.isBuffer(e)) {
				if (e.length < t + 16) return !1;
				let n = 0;
				for (; n < 16 && e[t + n] === 0; n++);
				return n === 16 ? {
					version: void 0,
					variant: "nil",
					format: "binary"
				} : {
					version: (e[t + 6] & 240) >> 4,
					variant: l((e[t + 8] & 224) >> 5),
					format: "binary"
				};
			}
			throw (0, r.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
		}
		static parse(e) {
			let t = Buffer.allocUnsafe(16), n = 0;
			for (let r = 0; r < 16; r++) t[r] = o[e[n++] + e[n++]], (r === 3 || r === 5 || r === 7 || r === 9) && (n += 1);
			return t;
		}
	};
	t.UUID = c, c.OID = c.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
	function l(e) {
		switch (e) {
			case 0:
			case 1:
			case 3: return "ncs";
			case 4:
			case 5: return "rfc4122";
			case 6: return "microsoft";
			default: return "future";
		}
	}
	var u;
	(function(e) {
		e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
	})(u ||= {});
	function d(e, t, a, o, l = u.ASCII) {
		let d = (0, n.createHash)(t);
		if (typeof e != "string" && !Buffer.isBuffer(e)) throw (0, r.newError)(i, "ERR_INVALID_UUID_NAME");
		d.update(o), d.update(e);
		let f = d.digest(), p;
		switch (l) {
			case u.BINARY:
				f[6] = f[6] & 15 | a, f[8] = f[8] & 63 | 128, p = f;
				break;
			case u.OBJECT:
				f[6] = f[6] & 15 | a, f[8] = f[8] & 63 | 128, p = new c(f);
				break;
			default:
				p = s[f[0]] + s[f[1]] + s[f[2]] + s[f[3]] + "-" + s[f[4]] + s[f[5]] + "-" + s[f[6] & 15 | a] + s[f[7]] + "-" + s[f[8] & 63 | 128] + s[f[9]] + "-" + s[f[10]] + s[f[11]] + s[f[12]] + s[f[13]] + s[f[14]] + s[f[15]];
				break;
		}
		return p;
	}
	function f(e) {
		return s[e[0]] + s[e[1]] + s[e[2]] + s[e[3]] + "-" + s[e[4]] + s[e[5]] + "-" + s[e[6]] + s[e[7]] + "-" + s[e[8]] + s[e[9]] + "-" + s[e[10]] + s[e[11]] + s[e[12]] + s[e[13]] + s[e[14]] + s[e[15]];
	}
	t.nil = new c("00000000-0000-0000-0000-000000000000");
})), de = /* @__PURE__ */ t(((t) => {
	(function(t) {
		t.parser = function(e, t) {
			return new r(e, t);
		}, t.SAXParser = r, t.SAXStream = d, t.createStream = l, t.MAX_BUFFER_LENGTH = 64 * 1024;
		var n = [
			"comment",
			"sgmlDecl",
			"textNode",
			"tagName",
			"doctype",
			"procInstName",
			"procInstBody",
			"entity",
			"attribName",
			"attribValue",
			"cdata",
			"script"
		];
		t.EVENTS = [
			"text",
			"processinginstruction",
			"sgmldeclaration",
			"doctype",
			"comment",
			"opentagstart",
			"attribute",
			"opentag",
			"closetag",
			"opencdata",
			"cdata",
			"closecdata",
			"error",
			"end",
			"ready",
			"script",
			"opennamespace",
			"closenamespace"
		];
		function r(e, n) {
			if (!(this instanceof r)) return new r(e, n);
			var i = this;
			a(i), i.q = i.c = "", i.bufferCheckPosition = t.MAX_BUFFER_LENGTH, i.encoding = null, i.opt = n || {}, i.opt.lowercase = i.opt.lowercase || i.opt.lowercasetags, i.looseCase = i.opt.lowercase ? "toLowerCase" : "toUpperCase", i.opt.maxEntityCount = i.opt.maxEntityCount || 512, i.opt.maxEntityDepth = i.opt.maxEntityDepth || 4, i.entityCount = i.entityDepth = 0, i.tags = [], i.closed = i.closedRoot = i.sawRoot = !1, i.tag = i.error = null, i.strict = !!e, i.noscript = !!(e || i.opt.noscript), i.state = E.BEGIN, i.strictEntities = i.opt.strictEntities, i.ENTITIES = i.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), i.attribList = [], i.opt.xmlns && (i.ns = Object.create(g)), i.opt.unquotedAttributeValues === void 0 && (i.opt.unquotedAttributeValues = !e), i.trackPosition = i.opt.position !== !1, i.trackPosition && (i.position = i.line = i.column = 0), O(i, "onready");
		}
		Object.create || (Object.create = function(e) {
			function t() {}
			return t.prototype = e, new t();
		}), Object.keys || (Object.keys = function(e) {
			var t = [];
			for (var n in e) e.hasOwnProperty(n) && t.push(n);
			return t;
		});
		function i(e) {
			for (var r = Math.max(t.MAX_BUFFER_LENGTH, 10), i = 0, a = 0, o = n.length; a < o; a++) {
				var s = e[n[a]].length;
				if (s > r) switch (n[a]) {
					case "textNode":
						M(e);
						break;
					case "cdata":
						j(e, "oncdata", e.cdata), e.cdata = "";
						break;
					case "script":
						j(e, "onscript", e.script), e.script = "";
						break;
					default: P(e, "Max buffer length exceeded: " + n[a]);
				}
				i = Math.max(i, s);
			}
			e.bufferCheckPosition = t.MAX_BUFFER_LENGTH - i + e.position;
		}
		function a(e) {
			for (var t = 0, r = n.length; t < r; t++) e[n[t]] = "";
		}
		function o(e) {
			M(e), e.cdata !== "" && (j(e, "oncdata", e.cdata), e.cdata = ""), e.script !== "" && (j(e, "onscript", e.script), e.script = "");
		}
		r.prototype = {
			end: function() {
				ne(this);
			},
			write: ae,
			resume: function() {
				return this.error = null, this;
			},
			close: function() {
				return this.write(null);
			},
			flush: function() {
				o(this);
			}
		};
		var s;
		try {
			s = e("stream").Stream;
		} catch {
			s = function() {};
		}
		s ||= function() {};
		var c = t.EVENTS.filter(function(e) {
			return e !== "error" && e !== "end";
		});
		function l(e, t) {
			return new d(e, t);
		}
		function u(e, t) {
			if (e.length >= 2) {
				if (e[0] === 255 && e[1] === 254) return "utf-16le";
				if (e[0] === 254 && e[1] === 255) return "utf-16be";
			}
			return e.length >= 3 && e[0] === 239 && e[1] === 187 && e[2] === 191 ? "utf8" : e.length >= 4 ? e[0] === 60 && e[1] === 0 && e[2] === 63 && e[3] === 0 ? "utf-16le" : e[0] === 0 && e[1] === 60 && e[2] === 0 && e[3] === 63 ? "utf-16be" : "utf8" : t ? "utf8" : null;
		}
		function d(e, t) {
			if (!(this instanceof d)) return new d(e, t);
			s.apply(this), this._parser = new r(e, t), this.writable = !0, this.readable = !0;
			var n = this;
			this._parser.onend = function() {
				n.emit("end");
			}, this._parser.onerror = function(e) {
				n.emit("error", e), n._parser.error = null;
			}, this._decoder = null, this._decoderBuffer = null, c.forEach(function(e) {
				Object.defineProperty(n, "on" + e, {
					get: function() {
						return n._parser["on" + e];
					},
					set: function(t) {
						if (!t) return n.removeAllListeners(e), n._parser["on" + e] = t, t;
						n.on(e, t);
					},
					enumerable: !0,
					configurable: !1
				});
			});
		}
		d.prototype = Object.create(s.prototype, { constructor: { value: d } }), d.prototype._decodeBuffer = function(e, t) {
			if (this._decoderBuffer &&= (e = Buffer.concat([this._decoderBuffer, e]), null), !this._decoder) {
				var n = u(e, t);
				if (!n) return this._decoderBuffer = e, "";
				this._parser.encoding = n, this._decoder = new TextDecoder(n);
			}
			return this._decoder.decode(e, { stream: !t });
		}, d.prototype.write = function(e) {
			if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(e)) e = this._decodeBuffer(e, !1);
			else if (this._decoderBuffer) {
				var t = this._decodeBuffer(Buffer.alloc(0), !0);
				t && (this._parser.write(t), this.emit("data", t));
			}
			return this._parser.write(e.toString()), this.emit("data", e), !0;
		}, d.prototype.end = function(e) {
			if (e && e.length && this.write(e), this._decoderBuffer) {
				var t = this._decodeBuffer(Buffer.alloc(0), !0);
				t && (this._parser.write(t), this.emit("data", t));
			} else if (this._decoder) {
				var n = this._decoder.decode();
				n && (this._parser.write(n), this.emit("data", n));
			}
			return this._parser.end(), !0;
		}, d.prototype.on = function(e, t) {
			var n = this;
			return !n._parser["on" + e] && c.indexOf(e) !== -1 && (n._parser["on" + e] = function() {
				var t = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
				t.splice(0, 0, e), n.emit.apply(n, t);
			}), s.prototype.on.call(n, e, t);
		};
		var f = "[CDATA[", p = "DOCTYPE", m = "http://www.w3.org/XML/1998/namespace", h = "http://www.w3.org/2000/xmlns/", g = {
			xml: m,
			xmlns: h
		}, _ = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, v = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, y = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, b = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
		function x(e) {
			return e === " " || e === "\n" || e === "\r" || e === "	";
		}
		function S(e) {
			return e === "\"" || e === "'";
		}
		function C(e) {
			return e === ">" || x(e);
		}
		function w(e, t) {
			return e.test(t);
		}
		function T(e, t) {
			return !w(e, t);
		}
		var E = 0;
		for (var D in t.STATE = {
			BEGIN: E++,
			BEGIN_WHITESPACE: E++,
			TEXT: E++,
			TEXT_ENTITY: E++,
			OPEN_WAKA: E++,
			SGML_DECL: E++,
			SGML_DECL_QUOTED: E++,
			DOCTYPE: E++,
			DOCTYPE_QUOTED: E++,
			DOCTYPE_DTD: E++,
			DOCTYPE_DTD_QUOTED: E++,
			COMMENT_STARTING: E++,
			COMMENT: E++,
			COMMENT_ENDING: E++,
			COMMENT_ENDED: E++,
			CDATA: E++,
			CDATA_ENDING: E++,
			CDATA_ENDING_2: E++,
			PROC_INST: E++,
			PROC_INST_BODY: E++,
			PROC_INST_ENDING: E++,
			OPEN_TAG: E++,
			OPEN_TAG_SLASH: E++,
			ATTRIB: E++,
			ATTRIB_NAME: E++,
			ATTRIB_NAME_SAW_WHITE: E++,
			ATTRIB_VALUE: E++,
			ATTRIB_VALUE_QUOTED: E++,
			ATTRIB_VALUE_CLOSED: E++,
			ATTRIB_VALUE_UNQUOTED: E++,
			ATTRIB_VALUE_ENTITY_Q: E++,
			ATTRIB_VALUE_ENTITY_U: E++,
			CLOSE_TAG: E++,
			CLOSE_TAG_SAW_WHITE: E++,
			SCRIPT: E++,
			SCRIPT_ENDING: E++
		}, t.XML_ENTITIES = {
			amp: "&",
			gt: ">",
			lt: "<",
			quot: "\"",
			apos: "'"
		}, t.ENTITIES = {
			amp: "&",
			gt: ">",
			lt: "<",
			quot: "\"",
			apos: "'",
			AElig: 198,
			Aacute: 193,
			Acirc: 194,
			Agrave: 192,
			Aring: 197,
			Atilde: 195,
			Auml: 196,
			Ccedil: 199,
			ETH: 208,
			Eacute: 201,
			Ecirc: 202,
			Egrave: 200,
			Euml: 203,
			Iacute: 205,
			Icirc: 206,
			Igrave: 204,
			Iuml: 207,
			Ntilde: 209,
			Oacute: 211,
			Ocirc: 212,
			Ograve: 210,
			Oslash: 216,
			Otilde: 213,
			Ouml: 214,
			THORN: 222,
			Uacute: 218,
			Ucirc: 219,
			Ugrave: 217,
			Uuml: 220,
			Yacute: 221,
			aacute: 225,
			acirc: 226,
			aelig: 230,
			agrave: 224,
			aring: 229,
			atilde: 227,
			auml: 228,
			ccedil: 231,
			eacute: 233,
			ecirc: 234,
			egrave: 232,
			eth: 240,
			euml: 235,
			iacute: 237,
			icirc: 238,
			igrave: 236,
			iuml: 239,
			ntilde: 241,
			oacute: 243,
			ocirc: 244,
			ograve: 242,
			oslash: 248,
			otilde: 245,
			ouml: 246,
			szlig: 223,
			thorn: 254,
			uacute: 250,
			ucirc: 251,
			ugrave: 249,
			uuml: 252,
			yacute: 253,
			yuml: 255,
			copy: 169,
			reg: 174,
			nbsp: 160,
			iexcl: 161,
			cent: 162,
			pound: 163,
			curren: 164,
			yen: 165,
			brvbar: 166,
			sect: 167,
			uml: 168,
			ordf: 170,
			laquo: 171,
			not: 172,
			shy: 173,
			macr: 175,
			deg: 176,
			plusmn: 177,
			sup1: 185,
			sup2: 178,
			sup3: 179,
			acute: 180,
			micro: 181,
			para: 182,
			middot: 183,
			cedil: 184,
			ordm: 186,
			raquo: 187,
			frac14: 188,
			frac12: 189,
			frac34: 190,
			iquest: 191,
			times: 215,
			divide: 247,
			OElig: 338,
			oelig: 339,
			Scaron: 352,
			scaron: 353,
			Yuml: 376,
			fnof: 402,
			circ: 710,
			tilde: 732,
			Alpha: 913,
			Beta: 914,
			Gamma: 915,
			Delta: 916,
			Epsilon: 917,
			Zeta: 918,
			Eta: 919,
			Theta: 920,
			Iota: 921,
			Kappa: 922,
			Lambda: 923,
			Mu: 924,
			Nu: 925,
			Xi: 926,
			Omicron: 927,
			Pi: 928,
			Rho: 929,
			Sigma: 931,
			Tau: 932,
			Upsilon: 933,
			Phi: 934,
			Chi: 935,
			Psi: 936,
			Omega: 937,
			alpha: 945,
			beta: 946,
			gamma: 947,
			delta: 948,
			epsilon: 949,
			zeta: 950,
			eta: 951,
			theta: 952,
			iota: 953,
			kappa: 954,
			lambda: 955,
			mu: 956,
			nu: 957,
			xi: 958,
			omicron: 959,
			pi: 960,
			rho: 961,
			sigmaf: 962,
			sigma: 963,
			tau: 964,
			upsilon: 965,
			phi: 966,
			chi: 967,
			psi: 968,
			omega: 969,
			thetasym: 977,
			upsih: 978,
			piv: 982,
			ensp: 8194,
			emsp: 8195,
			thinsp: 8201,
			zwnj: 8204,
			zwj: 8205,
			lrm: 8206,
			rlm: 8207,
			ndash: 8211,
			mdash: 8212,
			lsquo: 8216,
			rsquo: 8217,
			sbquo: 8218,
			ldquo: 8220,
			rdquo: 8221,
			bdquo: 8222,
			dagger: 8224,
			Dagger: 8225,
			bull: 8226,
			hellip: 8230,
			permil: 8240,
			prime: 8242,
			Prime: 8243,
			lsaquo: 8249,
			rsaquo: 8250,
			oline: 8254,
			frasl: 8260,
			euro: 8364,
			image: 8465,
			weierp: 8472,
			real: 8476,
			trade: 8482,
			alefsym: 8501,
			larr: 8592,
			uarr: 8593,
			rarr: 8594,
			darr: 8595,
			harr: 8596,
			crarr: 8629,
			lArr: 8656,
			uArr: 8657,
			rArr: 8658,
			dArr: 8659,
			hArr: 8660,
			forall: 8704,
			part: 8706,
			exist: 8707,
			empty: 8709,
			nabla: 8711,
			isin: 8712,
			notin: 8713,
			ni: 8715,
			prod: 8719,
			sum: 8721,
			minus: 8722,
			lowast: 8727,
			radic: 8730,
			prop: 8733,
			infin: 8734,
			ang: 8736,
			and: 8743,
			or: 8744,
			cap: 8745,
			cup: 8746,
			int: 8747,
			there4: 8756,
			sim: 8764,
			cong: 8773,
			asymp: 8776,
			ne: 8800,
			equiv: 8801,
			le: 8804,
			ge: 8805,
			sub: 8834,
			sup: 8835,
			nsub: 8836,
			sube: 8838,
			supe: 8839,
			oplus: 8853,
			otimes: 8855,
			perp: 8869,
			sdot: 8901,
			lceil: 8968,
			rceil: 8969,
			lfloor: 8970,
			rfloor: 8971,
			lang: 9001,
			rang: 9002,
			loz: 9674,
			spades: 9824,
			clubs: 9827,
			hearts: 9829,
			diams: 9830
		}, Object.keys(t.ENTITIES).forEach(function(e) {
			var n = t.ENTITIES[e], r = typeof n == "number" ? String.fromCharCode(n) : n;
			t.ENTITIES[e] = r;
		}), t.STATE) t.STATE[t.STATE[D]] = D;
		E = t.STATE;
		function O(e, t, n) {
			e[t] && e[t](n);
		}
		function k(e) {
			var t = e && e.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
			return t ? t[2] : null;
		}
		function ee(e) {
			return e ? e.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
		}
		function te(e, t) {
			let n = ee(e), r = ee(t);
			return !n || !r ? !0 : r === "utf16" ? n === "utf16le" || n === "utf16be" : n === r;
		}
		function A(e, t) {
			if (!(!e.strict || !e.encoding || !t || t.name !== "xml")) {
				var n = k(t.body);
				n && !te(e.encoding, n) && F(e, "XML declaration encoding " + n + " does not match detected stream encoding " + e.encoding.toUpperCase());
			}
		}
		function j(e, t, n) {
			e.textNode && M(e), O(e, t, n);
		}
		function M(e) {
			e.textNode = N(e.opt, e.textNode), e.textNode && O(e, "ontext", e.textNode), e.textNode = "";
		}
		function N(e, t) {
			return e.trim && (t = t.trim()), e.normalize && (t = t.replace(/\s+/g, " ")), t;
		}
		function P(e, t) {
			return M(e), e.trackPosition && (t += "\nLine: " + e.line + "\nColumn: " + e.column + "\nChar: " + e.c), t = Error(t), e.error = t, O(e, "onerror", t), e;
		}
		function ne(e) {
			return e.sawRoot && !e.closedRoot && F(e, "Unclosed root tag"), e.state !== E.BEGIN && e.state !== E.BEGIN_WHITESPACE && e.state !== E.TEXT && P(e, "Unexpected end"), M(e), e.c = "", e.closed = !0, O(e, "onend"), r.call(e, e.strict, e.opt), e;
		}
		function F(e, t) {
			if (typeof e != "object" || !(e instanceof r)) throw Error("bad call to strictFail");
			e.strict && P(e, t);
		}
		function re(e) {
			e.strict || (e.tagName = e.tagName[e.looseCase]());
			var t = e.tags[e.tags.length - 1] || e, n = e.tag = {
				name: e.tagName,
				attributes: {}
			};
			e.opt.xmlns && (n.ns = t.ns), e.attribList.length = 0, j(e, "onopentagstart", n);
		}
		function I(e, t) {
			var n = e.indexOf(":") < 0 ? ["", e] : e.split(":"), r = n[0], i = n[1];
			return t && e === "xmlns" && (r = "xmlns", i = ""), {
				prefix: r,
				local: i
			};
		}
		function L(e) {
			if (e.strict || (e.attribName = e.attribName[e.looseCase]()), e.attribList.indexOf(e.attribName) !== -1 || e.tag.attributes.hasOwnProperty(e.attribName)) {
				e.attribName = e.attribValue = "";
				return;
			}
			if (e.opt.xmlns) {
				var t = I(e.attribName, !0), n = t.prefix, r = t.local;
				if (n === "xmlns") if (r === "xml" && e.attribValue !== m) F(e, "xml: prefix must be bound to " + m + "\nActual: " + e.attribValue);
				else if (r === "xmlns" && e.attribValue !== h) F(e, "xmlns: prefix must be bound to " + h + "\nActual: " + e.attribValue);
				else {
					var i = e.tag, a = e.tags[e.tags.length - 1] || e;
					i.ns === a.ns && (i.ns = Object.create(a.ns)), i.ns[r] = e.attribValue;
				}
				e.attribList.push([e.attribName, e.attribValue]);
			} else e.tag.attributes[e.attribName] = e.attribValue, j(e, "onattribute", {
				name: e.attribName,
				value: e.attribValue
			});
			e.attribName = e.attribValue = "";
		}
		function R(e, t) {
			if (e.opt.xmlns) {
				var n = e.tag, r = I(e.tagName);
				n.prefix = r.prefix, n.local = r.local, n.uri = n.ns[r.prefix] || "", n.prefix && !n.uri && (F(e, "Unbound namespace prefix: " + JSON.stringify(e.tagName)), n.uri = r.prefix);
				var i = e.tags[e.tags.length - 1] || e;
				n.ns && i.ns !== n.ns && Object.keys(n.ns).forEach(function(t) {
					j(e, "onopennamespace", {
						prefix: t,
						uri: n.ns[t]
					});
				});
				for (var a = 0, o = e.attribList.length; a < o; a++) {
					var s = e.attribList[a], c = s[0], l = s[1], u = I(c, !0), d = u.prefix, f = u.local, p = d === "" ? "" : n.ns[d] || "", m = {
						name: c,
						value: l,
						prefix: d,
						local: f,
						uri: p
					};
					d && d !== "xmlns" && !p && (F(e, "Unbound namespace prefix: " + JSON.stringify(d)), m.uri = d), e.tag.attributes[c] = m, j(e, "onattribute", m);
				}
				e.attribList.length = 0;
			}
			e.tag.isSelfClosing = !!t, e.sawRoot = !0, e.tags.push(e.tag), j(e, "onopentag", e.tag), t || (!e.noscript && e.tagName.toLowerCase() === "script" ? e.state = E.SCRIPT : e.state = E.TEXT, e.tag = null, e.tagName = ""), e.attribName = e.attribValue = "", e.attribList.length = 0;
		}
		function z(e) {
			if (!e.tagName) {
				F(e, "Weird empty close tag."), e.textNode += "</>", e.state = E.TEXT;
				return;
			}
			if (e.script) {
				if (e.tagName !== "script") {
					e.script += "</" + e.tagName + ">", e.tagName = "", e.state = E.SCRIPT;
					return;
				}
				j(e, "onscript", e.script), e.script = "";
			}
			var t = e.tags.length, n = e.tagName;
			e.strict || (n = n[e.looseCase]());
			for (var r = n; t-- && e.tags[t].name !== r;) F(e, "Unexpected close tag");
			if (t < 0) {
				F(e, "Unmatched closing tag: " + e.tagName), e.textNode += "</" + e.tagName + ">", e.state = E.TEXT;
				return;
			}
			e.tagName = n;
			for (var i = e.tags.length; i-- > t;) {
				var a = e.tag = e.tags.pop();
				e.tagName = e.tag.name, j(e, "onclosetag", e.tagName);
				var o = {};
				for (var s in a.ns) o[s] = a.ns[s];
				var c = e.tags[e.tags.length - 1] || e;
				e.opt.xmlns && a.ns !== c.ns && Object.keys(a.ns).forEach(function(t) {
					var n = a.ns[t];
					j(e, "onclosenamespace", {
						prefix: t,
						uri: n
					});
				});
			}
			t === 0 && (e.closedRoot = !0), e.tagName = e.attribValue = e.attribName = "", e.attribList.length = 0, e.state = E.TEXT;
		}
		function B(e) {
			var t = e.entity, n = t.toLowerCase(), r, i = "";
			return e.ENTITIES[t] ? e.ENTITIES[t] : e.ENTITIES[n] ? e.ENTITIES[n] : (t = n, t.charAt(0) === "#" && (t.charAt(1) === "x" ? (t = t.slice(2), r = parseInt(t, 16), i = r.toString(16)) : (t = t.slice(1), r = parseInt(t, 10), i = r.toString(10))), t = t.replace(/^0+/, ""), isNaN(r) || i.toLowerCase() !== t || r < 0 || r > 1114111 ? (F(e, "Invalid character entity"), "&" + e.entity + ";") : String.fromCodePoint(r));
		}
		function ie(e, t) {
			t === "<" ? (e.state = E.OPEN_WAKA, e.startTagPosition = e.position) : x(t) || (F(e, "Non-whitespace before first tag."), e.textNode = t, e.state = E.TEXT);
		}
		function V(e, t) {
			var n = "";
			return t < e.length && (n = e.charAt(t)), n;
		}
		function ae(e) {
			var n = this;
			if (this.error) throw this.error;
			if (n.closed) return P(n, "Cannot write after close. Assign an onready handler.");
			if (e === null) return ne(n);
			typeof e == "object" && (e = e.toString());
			for (var r = 0, a = ""; a = V(e, r++), n.c = a, a;) switch (n.trackPosition && (n.position++, a === "\n" ? (n.line++, n.column = 0) : n.column++), n.state) {
				case E.BEGIN:
					if (n.state = E.BEGIN_WHITESPACE, a === "﻿") continue;
					ie(n, a);
					continue;
				case E.BEGIN_WHITESPACE:
					ie(n, a);
					continue;
				case E.TEXT:
					if (n.sawRoot && !n.closedRoot) {
						for (var o = r - 1; a && a !== "<" && a !== "&";) a = V(e, r++), a && n.trackPosition && (n.position++, a === "\n" ? (n.line++, n.column = 0) : n.column++);
						n.textNode += e.substring(o, r - 1);
					}
					a === "<" && !(n.sawRoot && n.closedRoot && !n.strict) ? (n.state = E.OPEN_WAKA, n.startTagPosition = n.position) : (!x(a) && (!n.sawRoot || n.closedRoot) && F(n, "Text data outside of root node."), a === "&" ? n.state = E.TEXT_ENTITY : n.textNode += a);
					continue;
				case E.SCRIPT:
					a === "<" ? n.state = E.SCRIPT_ENDING : n.script += a;
					continue;
				case E.SCRIPT_ENDING:
					a === "/" ? n.state = E.CLOSE_TAG : (n.script += "<" + a, n.state = E.SCRIPT);
					continue;
				case E.OPEN_WAKA:
					if (a === "!") n.state = E.SGML_DECL, n.sgmlDecl = "";
					else if (!x(a)) if (w(_, a)) n.state = E.OPEN_TAG, n.tagName = a;
					else if (a === "/") n.state = E.CLOSE_TAG, n.tagName = "";
					else if (a === "?") n.state = E.PROC_INST, n.procInstName = n.procInstBody = "";
					else {
						if (F(n, "Unencoded <"), n.startTagPosition + 1 < n.position) {
							var s = n.position - n.startTagPosition;
							a = Array(s).join(" ") + a;
						}
						n.textNode += "<" + a, n.state = E.TEXT;
					}
					continue;
				case E.SGML_DECL:
					if (n.sgmlDecl + a === "--") {
						n.state = E.COMMENT, n.comment = "", n.sgmlDecl = "";
						continue;
					}
					n.doctype && n.doctype !== !0 && n.sgmlDecl ? (n.state = E.DOCTYPE_DTD, n.doctype += "<!" + n.sgmlDecl + a, n.sgmlDecl = "") : (n.sgmlDecl + a).toUpperCase() === f ? (j(n, "onopencdata"), n.state = E.CDATA, n.sgmlDecl = "", n.cdata = "") : (n.sgmlDecl + a).toUpperCase() === p ? (n.state = E.DOCTYPE, (n.doctype || n.sawRoot) && F(n, "Inappropriately located doctype declaration"), n.doctype = "", n.sgmlDecl = "") : a === ">" ? (j(n, "onsgmldeclaration", n.sgmlDecl), n.sgmlDecl = "", n.state = E.TEXT) : (S(a) && (n.state = E.SGML_DECL_QUOTED), n.sgmlDecl += a);
					continue;
				case E.SGML_DECL_QUOTED:
					a === n.q && (n.state = E.SGML_DECL, n.q = ""), n.sgmlDecl += a;
					continue;
				case E.DOCTYPE:
					a === ">" ? (n.state = E.TEXT, j(n, "ondoctype", n.doctype), n.doctype = !0) : (n.doctype += a, a === "[" ? n.state = E.DOCTYPE_DTD : S(a) && (n.state = E.DOCTYPE_QUOTED, n.q = a));
					continue;
				case E.DOCTYPE_QUOTED:
					n.doctype += a, a === n.q && (n.q = "", n.state = E.DOCTYPE);
					continue;
				case E.DOCTYPE_DTD:
					a === "]" ? (n.doctype += a, n.state = E.DOCTYPE) : a === "<" ? (n.state = E.OPEN_WAKA, n.startTagPosition = n.position) : S(a) ? (n.doctype += a, n.state = E.DOCTYPE_DTD_QUOTED, n.q = a) : n.doctype += a;
					continue;
				case E.DOCTYPE_DTD_QUOTED:
					n.doctype += a, a === n.q && (n.state = E.DOCTYPE_DTD, n.q = "");
					continue;
				case E.COMMENT:
					a === "-" ? n.state = E.COMMENT_ENDING : n.comment += a;
					continue;
				case E.COMMENT_ENDING:
					a === "-" ? (n.state = E.COMMENT_ENDED, n.comment = N(n.opt, n.comment), n.comment && j(n, "oncomment", n.comment), n.comment = "") : (n.comment += "-" + a, n.state = E.COMMENT);
					continue;
				case E.COMMENT_ENDED:
					a === ">" ? n.doctype && n.doctype !== !0 ? n.state = E.DOCTYPE_DTD : n.state = E.TEXT : (F(n, "Malformed comment"), n.comment += "--" + a, n.state = E.COMMENT);
					continue;
				case E.CDATA:
					for (var o = r - 1; a && a !== "]";) a = V(e, r++), a && n.trackPosition && (n.position++, a === "\n" ? (n.line++, n.column = 0) : n.column++);
					n.cdata += e.substring(o, r - 1), a === "]" && (n.state = E.CDATA_ENDING);
					continue;
				case E.CDATA_ENDING:
					a === "]" ? n.state = E.CDATA_ENDING_2 : (n.cdata += "]" + a, n.state = E.CDATA);
					continue;
				case E.CDATA_ENDING_2:
					a === ">" ? (n.cdata && j(n, "oncdata", n.cdata), j(n, "onclosecdata"), n.cdata = "", n.state = E.TEXT) : a === "]" ? n.cdata += "]" : (n.cdata += "]]" + a, n.state = E.CDATA);
					continue;
				case E.PROC_INST:
					a === "?" ? n.state = E.PROC_INST_ENDING : x(a) ? n.state = E.PROC_INST_BODY : n.procInstName += a;
					continue;
				case E.PROC_INST_BODY:
					if (!n.procInstBody && x(a)) continue;
					a === "?" ? n.state = E.PROC_INST_ENDING : n.procInstBody += a;
					continue;
				case E.PROC_INST_ENDING:
					if (a === ">") {
						let e = {
							name: n.procInstName,
							body: n.procInstBody
						};
						A(n, e), j(n, "onprocessinginstruction", e), n.procInstName = n.procInstBody = "", n.state = E.TEXT;
					} else n.procInstBody += "?" + a, n.state = E.PROC_INST_BODY;
					continue;
				case E.OPEN_TAG:
					w(v, a) ? n.tagName += a : (re(n), a === ">" ? R(n) : a === "/" ? n.state = E.OPEN_TAG_SLASH : (x(a) || F(n, "Invalid character in tag name"), n.state = E.ATTRIB));
					continue;
				case E.OPEN_TAG_SLASH:
					a === ">" ? (R(n, !0), z(n)) : (F(n, "Forward-slash in opening tag not followed by >"), n.state = E.ATTRIB);
					continue;
				case E.ATTRIB:
					if (x(a)) continue;
					a === ">" ? R(n) : a === "/" ? n.state = E.OPEN_TAG_SLASH : w(_, a) ? (n.attribName = a, n.attribValue = "", n.state = E.ATTRIB_NAME) : F(n, "Invalid attribute name");
					continue;
				case E.ATTRIB_NAME:
					a === "=" ? n.state = E.ATTRIB_VALUE : a === ">" ? (F(n, "Attribute without value"), n.attribValue = n.attribName, L(n), R(n)) : x(a) ? n.state = E.ATTRIB_NAME_SAW_WHITE : w(v, a) ? n.attribName += a : F(n, "Invalid attribute name");
					continue;
				case E.ATTRIB_NAME_SAW_WHITE:
					if (a === "=") n.state = E.ATTRIB_VALUE;
					else if (x(a)) continue;
					else F(n, "Attribute without value"), n.tag.attributes[n.attribName] = "", n.attribValue = "", j(n, "onattribute", {
						name: n.attribName,
						value: ""
					}), n.attribName = "", a === ">" ? R(n) : w(_, a) ? (n.attribName = a, n.state = E.ATTRIB_NAME) : (F(n, "Invalid attribute name"), n.state = E.ATTRIB);
					continue;
				case E.ATTRIB_VALUE:
					if (x(a)) continue;
					S(a) ? (n.q = a, n.state = E.ATTRIB_VALUE_QUOTED) : (n.opt.unquotedAttributeValues || P(n, "Unquoted attribute value"), n.state = E.ATTRIB_VALUE_UNQUOTED, n.attribValue = a);
					continue;
				case E.ATTRIB_VALUE_QUOTED:
					if (a !== n.q) {
						a === "&" ? n.state = E.ATTRIB_VALUE_ENTITY_Q : n.attribValue += a;
						continue;
					}
					L(n), n.q = "", n.state = E.ATTRIB_VALUE_CLOSED;
					continue;
				case E.ATTRIB_VALUE_CLOSED:
					x(a) ? n.state = E.ATTRIB : a === ">" ? R(n) : a === "/" ? n.state = E.OPEN_TAG_SLASH : w(_, a) ? (F(n, "No whitespace between attributes"), n.attribName = a, n.attribValue = "", n.state = E.ATTRIB_NAME) : F(n, "Invalid attribute name");
					continue;
				case E.ATTRIB_VALUE_UNQUOTED:
					if (!C(a)) {
						a === "&" ? n.state = E.ATTRIB_VALUE_ENTITY_U : n.attribValue += a;
						continue;
					}
					L(n), a === ">" ? R(n) : n.state = E.ATTRIB;
					continue;
				case E.CLOSE_TAG:
					if (n.tagName) a === ">" ? z(n) : w(v, a) ? n.tagName += a : n.script ? (n.script += "</" + n.tagName + a, n.tagName = "", n.state = E.SCRIPT) : (x(a) || F(n, "Invalid tagname in closing tag"), n.state = E.CLOSE_TAG_SAW_WHITE);
					else {
						if (x(a)) continue;
						T(_, a) ? n.script ? (n.script += "</" + a, n.state = E.SCRIPT) : F(n, "Invalid tagname in closing tag.") : n.tagName = a;
					}
					continue;
				case E.CLOSE_TAG_SAW_WHITE:
					if (x(a)) continue;
					a === ">" ? z(n) : F(n, "Invalid characters in closing tag");
					continue;
				case E.TEXT_ENTITY:
				case E.ATTRIB_VALUE_ENTITY_Q:
				case E.ATTRIB_VALUE_ENTITY_U:
					var c, l;
					switch (n.state) {
						case E.TEXT_ENTITY:
							c = E.TEXT, l = "textNode";
							break;
						case E.ATTRIB_VALUE_ENTITY_Q:
							c = E.ATTRIB_VALUE_QUOTED, l = "attribValue";
							break;
						case E.ATTRIB_VALUE_ENTITY_U:
							c = E.ATTRIB_VALUE_UNQUOTED, l = "attribValue";
							break;
					}
					if (a === ";") {
						var u = B(n);
						n.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(u) ? ((n.entityCount += 1) > n.opt.maxEntityCount && P(n, "Parsed entity count exceeds max entity count"), (n.entityDepth += 1) > n.opt.maxEntityDepth && P(n, "Parsed entity depth exceeds max entity depth"), n.entity = "", n.state = c, n.write(u), --n.entityDepth) : (n[l] += u, n.entity = "", n.state = c);
					} else w(n.entity.length ? b : y, a) ? n.entity += a : (F(n, "Invalid character in entity name"), n[l] += "&" + n.entity + a, n.entity = "", n.state = c);
					continue;
				default: throw Error(n, "Unknown state: " + n.state);
			}
			return n.position >= n.bufferCheckPosition && i(n), n;
		}
		/* istanbul ignore next */
		String.fromCodePoint || (function() {
			var e = String.fromCharCode, t = Math.floor, n = function() {
				var n = 16384, r = [], i, a, o = -1, s = arguments.length;
				if (!s) return "";
				for (var c = ""; ++o < s;) {
					var l = Number(arguments[o]);
					if (!isFinite(l) || l < 0 || l > 1114111 || t(l) !== l) throw RangeError("Invalid code point: " + l);
					l <= 65535 ? r.push(l) : (l -= 65536, i = (l >> 10) + 55296, a = l % 1024 + 56320, r.push(i, a)), (o + 1 === s || r.length > n) && (c += e.apply(null, r), r.length = 0);
				}
				return c;
			};
			/* istanbul ignore next */
			Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
				value: n,
				configurable: !0,
				writable: !0
			}) : String.fromCodePoint = n;
		})();
	})(t === void 0 ? t.sax = {} : t);
})), fe = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.XElement = void 0, e.parseXml = s;
	var t = de(), n = F(), r = class {
		constructor(e) {
			if (this.name = e, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !e) throw (0, n.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
			if (!a(e)) throw (0, n.newError)(`Invalid element name: ${e}`, "ERR_XML_ELEMENT_INVALID_NAME");
		}
		attribute(e) {
			let t = this.attributes === null ? null : this.attributes[e];
			if (t == null) throw (0, n.newError)(`No attribute "${e}"`, "ERR_XML_MISSED_ATTRIBUTE");
			return t;
		}
		removeAttribute(e) {
			this.attributes !== null && delete this.attributes[e];
		}
		element(e, t = !1, r = null) {
			let i = this.elementOrNull(e, t);
			if (i === null) throw (0, n.newError)(r || `No element "${e}"`, "ERR_XML_MISSED_ELEMENT");
			return i;
		}
		elementOrNull(e, t = !1) {
			if (this.elements === null) return null;
			for (let n of this.elements) if (o(n, e, t)) return n;
			return null;
		}
		getElements(e, t = !1) {
			return this.elements === null ? [] : this.elements.filter((n) => o(n, e, t));
		}
		elementValueOrEmpty(e, t = !1) {
			let n = this.elementOrNull(e, t);
			return n === null ? "" : n.value;
		}
	};
	e.XElement = r;
	var i = /* @__PURE__ */ new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
	function a(e) {
		return i.test(e);
	}
	function o(e, t, n) {
		let r = e.name;
		return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
	}
	function s(e) {
		let n = null, i = t.parser(!0, {}), a = [];
		return i.onopentag = (e) => {
			let t = new r(e.name);
			if (t.attributes = e.attributes, n === null) n = t;
			else {
				let e = a[a.length - 1];
				e.elements ??= [], e.elements.push(t);
			}
			a.push(t);
		}, i.onclosetag = () => {
			a.pop();
		}, i.ontext = (e) => {
			a.length > 0 && (a[a.length - 1].value = e);
		}, i.oncdata = (e) => {
			let t = a[a.length - 1];
			t.value = e, t.isCData = !0;
		}, i.onerror = (e) => {
			throw e;
		}, i.write(e), n;
	}
})), H = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = d;
	var t = ne();
	Object.defineProperty(e, "CancellationError", {
		enumerable: !0,
		get: function() {
			return t.CancellationError;
		}
	}), Object.defineProperty(e, "CancellationToken", {
		enumerable: !0,
		get: function() {
			return t.CancellationToken;
		}
	});
	var n = F();
	Object.defineProperty(e, "newError", {
		enumerable: !0,
		get: function() {
			return n.newError;
		}
	});
	var r = ae();
	Object.defineProperty(e, "configureRequestOptions", {
		enumerable: !0,
		get: function() {
			return r.configureRequestOptions;
		}
	}), Object.defineProperty(e, "configureRequestOptionsFromUrl", {
		enumerable: !0,
		get: function() {
			return r.configureRequestOptionsFromUrl;
		}
	}), Object.defineProperty(e, "configureRequestUrl", {
		enumerable: !0,
		get: function() {
			return r.configureRequestUrl;
		}
	}), Object.defineProperty(e, "createHttpError", {
		enumerable: !0,
		get: function() {
			return r.createHttpError;
		}
	}), Object.defineProperty(e, "DigestTransform", {
		enumerable: !0,
		get: function() {
			return r.DigestTransform;
		}
	}), Object.defineProperty(e, "HttpError", {
		enumerable: !0,
		get: function() {
			return r.HttpError;
		}
	}), Object.defineProperty(e, "HttpExecutor", {
		enumerable: !0,
		get: function() {
			return r.HttpExecutor;
		}
	}), Object.defineProperty(e, "parseJson", {
		enumerable: !0,
		get: function() {
			return r.parseJson;
		}
	}), Object.defineProperty(e, "safeGetHeader", {
		enumerable: !0,
		get: function() {
			return r.safeGetHeader;
		}
	}), Object.defineProperty(e, "safeStringifyJson", {
		enumerable: !0,
		get: function() {
			return r.safeStringifyJson;
		}
	});
	var i = oe();
	Object.defineProperty(e, "MemoLazy", {
		enumerable: !0,
		get: function() {
			return i.MemoLazy;
		}
	});
	var a = V();
	Object.defineProperty(e, "ProgressCallbackTransform", {
		enumerable: !0,
		get: function() {
			return a.ProgressCallbackTransform;
		}
	});
	var o = se();
	Object.defineProperty(e, "getS3LikeProviderBaseUrl", {
		enumerable: !0,
		get: function() {
			return o.getS3LikeProviderBaseUrl;
		}
	}), Object.defineProperty(e, "githubUrl", {
		enumerable: !0,
		get: function() {
			return o.githubUrl;
		}
	}), Object.defineProperty(e, "githubTagPrefix", {
		enumerable: !0,
		get: function() {
			return o.githubTagPrefix;
		}
	});
	var s = ce();
	Object.defineProperty(e, "retry", {
		enumerable: !0,
		get: function() {
			return s.retry;
		}
	});
	var c = le();
	Object.defineProperty(e, "parseDn", {
		enumerable: !0,
		get: function() {
			return c.parseDn;
		}
	});
	var l = ue();
	Object.defineProperty(e, "UUID", {
		enumerable: !0,
		get: function() {
			return l.UUID;
		}
	});
	var u = fe();
	Object.defineProperty(e, "parseXml", {
		enumerable: !0,
		get: function() {
			return u.parseXml;
		}
	}), Object.defineProperty(e, "XElement", {
		enumerable: !0,
		get: function() {
			return u.XElement;
		}
	}), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
	function d(e) {
		return e == null ? [] : Array.isArray(e) ? e : [e];
	}
})), pe = /* @__PURE__ */ t(((e, t) => {
	function n(e) {
		return e == null;
	}
	function r(e) {
		return typeof e == "object" && !!e;
	}
	function i(e) {
		return Array.isArray(e) ? e : n(e) ? [] : [e];
	}
	function a(e, t) {
		var n, r, i, a;
		if (t) for (a = Object.keys(t), n = 0, r = a.length; n < r; n += 1) i = a[n], e[i] = t[i];
		return e;
	}
	function o(e, t) {
		var n = "", r;
		for (r = 0; r < t; r += 1) n += e;
		return n;
	}
	function s(e) {
		return e === 0 && 1 / e == -Infinity;
	}
	t.exports.isNothing = n, t.exports.isObject = r, t.exports.toArray = i, t.exports.repeat = o, t.exports.isNegativeZero = s, t.exports.extend = a;
})), me = /* @__PURE__ */ t(((e, t) => {
	function n(e, t) {
		var n = "", r = e.reason || "(unknown reason)";
		return e.mark ? (e.mark.name && (n += "in \"" + e.mark.name + "\" "), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += "\n\n" + e.mark.snippet), r + " " + n) : r;
	}
	function r(e, t) {
		Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = n(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (/* @__PURE__ */ Error()).stack || "";
	}
	r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r.prototype.toString = function(e) {
		return this.name + ": " + n(this, e);
	}, t.exports = r;
})), he = /* @__PURE__ */ t(((e, t) => {
	var n = pe();
	function r(e, t, n, r, i) {
		var a = "", o = "", s = Math.floor(i / 2) - 1;
		return r - t > s && (a = " ... ", t = r - s + a.length), n - r > s && (o = " ...", n = r + s - o.length), {
			str: a + e.slice(t, n).replace(/\t/g, "→") + o,
			pos: r - t + a.length
		};
	}
	function i(e, t) {
		return n.repeat(" ", t - e.length) + e;
	}
	function a(e, t) {
		if (t = Object.create(t || null), !e.buffer) return null;
		t.maxLength ||= 79, typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
		for (var a = /\r?\n|\r|\0/g, o = [0], s = [], c, l = -1; c = a.exec(e.buffer);) s.push(c.index), o.push(c.index + c[0].length), e.position <= c.index && l < 0 && (l = o.length - 2);
		l < 0 && (l = o.length - 1);
		var u = "", d, f, p = Math.min(e.line + t.linesAfter, s.length).toString().length, m = t.maxLength - (t.indent + p + 3);
		for (d = 1; d <= t.linesBefore && !(l - d < 0); d++) f = r(e.buffer, o[l - d], s[l - d], e.position - (o[l] - o[l - d]), m), u = n.repeat(" ", t.indent) + i((e.line - d + 1).toString(), p) + " | " + f.str + "\n" + u;
		for (f = r(e.buffer, o[l], s[l], e.position, m), u += n.repeat(" ", t.indent) + i((e.line + 1).toString(), p) + " | " + f.str + "\n", u += n.repeat("-", t.indent + p + 3 + f.pos) + "^\n", d = 1; d <= t.linesAfter && !(l + d >= s.length); d++) f = r(e.buffer, o[l + d], s[l + d], e.position - (o[l] - o[l + d]), m), u += n.repeat(" ", t.indent) + i((e.line + d + 1).toString(), p) + " | " + f.str + "\n";
		return u.replace(/\n$/, "");
	}
	t.exports = a;
})), U = /* @__PURE__ */ t(((e, t) => {
	var n = me(), r = [
		"kind",
		"multi",
		"resolve",
		"construct",
		"instanceOf",
		"predicate",
		"represent",
		"representName",
		"defaultStyle",
		"styleAliases"
	], i = [
		"scalar",
		"sequence",
		"mapping"
	];
	function a(e) {
		var t = {};
		return e !== null && Object.keys(e).forEach(function(n) {
			e[n].forEach(function(e) {
				t[String(e)] = n;
			});
		}), t;
	}
	function o(e, t) {
		if (t ||= {}, Object.keys(t).forEach(function(t) {
			if (r.indexOf(t) === -1) throw new n("Unknown option \"" + t + "\" is met in definition of \"" + e + "\" YAML type.");
		}), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
			return !0;
		}, this.construct = t.construct || function(e) {
			return e;
		}, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = a(t.styleAliases || null), i.indexOf(this.kind) === -1) throw new n("Unknown kind \"" + this.kind + "\" is specified for \"" + e + "\" YAML type.");
	}
	t.exports = o;
})), ge = /* @__PURE__ */ t(((e, t) => {
	var n = me(), r = U();
	function i(e, t) {
		var n = [];
		return e[t].forEach(function(e) {
			var t = n.length;
			n.forEach(function(n, r) {
				n.tag === e.tag && n.kind === e.kind && n.multi === e.multi && (t = r);
			}), n[t] = e;
		}), n;
	}
	function a() {
		var e = {
			scalar: {},
			sequence: {},
			mapping: {},
			fallback: {},
			multi: {
				scalar: [],
				sequence: [],
				mapping: [],
				fallback: []
			}
		}, t, n;
		function r(t) {
			t.multi ? (e.multi[t.kind].push(t), e.multi.fallback.push(t)) : e[t.kind][t.tag] = e.fallback[t.tag] = t;
		}
		for (t = 0, n = arguments.length; t < n; t += 1) arguments[t].forEach(r);
		return e;
	}
	function o(e) {
		return this.extend(e);
	}
	o.prototype.extend = function(e) {
		var t = [], s = [];
		if (e instanceof r) s.push(e);
		else if (Array.isArray(e)) s = s.concat(e);
		else if (e && (Array.isArray(e.implicit) || Array.isArray(e.explicit))) e.implicit && (t = t.concat(e.implicit)), e.explicit && (s = s.concat(e.explicit));
		else throw new n("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
		t.forEach(function(e) {
			if (!(e instanceof r)) throw new n("Specified list of YAML types (or a single Type object) contains a non-Type object.");
			if (e.loadKind && e.loadKind !== "scalar") throw new n("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
			if (e.multi) throw new n("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
		}), s.forEach(function(e) {
			if (!(e instanceof r)) throw new n("Specified list of YAML types (or a single Type object) contains a non-Type object.");
		});
		var c = Object.create(o.prototype);
		return c.implicit = (this.implicit || []).concat(t), c.explicit = (this.explicit || []).concat(s), c.compiledImplicit = i(c, "implicit"), c.compiledExplicit = i(c, "explicit"), c.compiledTypeMap = a(c.compiledImplicit, c.compiledExplicit), c;
	}, t.exports = o;
})), _e = /* @__PURE__ */ t(((e, t) => {
	t.exports = new (U())("tag:yaml.org,2002:str", {
		kind: "scalar",
		construct: function(e) {
			return e === null ? "" : e;
		}
	});
})), ve = /* @__PURE__ */ t(((e, t) => {
	t.exports = new (U())("tag:yaml.org,2002:seq", {
		kind: "sequence",
		construct: function(e) {
			return e === null ? [] : e;
		}
	});
})), ye = /* @__PURE__ */ t(((e, t) => {
	t.exports = new (U())("tag:yaml.org,2002:map", {
		kind: "mapping",
		construct: function(e) {
			return e === null ? {} : e;
		}
	});
})), be = /* @__PURE__ */ t(((e, t) => {
	t.exports = new (ge())({ explicit: [
		_e(),
		ve(),
		ye()
	] });
})), xe = /* @__PURE__ */ t(((e, t) => {
	var n = U();
	function r(e) {
		if (e === null) return !0;
		var t = e.length;
		return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
	}
	function i() {
		return null;
	}
	function a(e) {
		return e === null;
	}
	t.exports = new n("tag:yaml.org,2002:null", {
		kind: "scalar",
		resolve: r,
		construct: i,
		predicate: a,
		represent: {
			canonical: function() {
				return "~";
			},
			lowercase: function() {
				return "null";
			},
			uppercase: function() {
				return "NULL";
			},
			camelcase: function() {
				return "Null";
			},
			empty: function() {
				return "";
			}
		},
		defaultStyle: "lowercase"
	});
})), W = /* @__PURE__ */ t(((e, t) => {
	var n = U();
	function r(e) {
		if (e === null) return !1;
		var t = e.length;
		return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
	}
	function i(e) {
		return e === "true" || e === "True" || e === "TRUE";
	}
	function a(e) {
		return Object.prototype.toString.call(e) === "[object Boolean]";
	}
	t.exports = new n("tag:yaml.org,2002:bool", {
		kind: "scalar",
		resolve: r,
		construct: i,
		predicate: a,
		represent: {
			lowercase: function(e) {
				return e ? "true" : "false";
			},
			uppercase: function(e) {
				return e ? "TRUE" : "FALSE";
			},
			camelcase: function(e) {
				return e ? "True" : "False";
			}
		},
		defaultStyle: "lowercase"
	});
})), Se = /* @__PURE__ */ t(((e, t) => {
	var n = pe(), r = U();
	function i(e) {
		return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
	}
	function a(e) {
		return 48 <= e && e <= 55;
	}
	function o(e) {
		return 48 <= e && e <= 57;
	}
	function s(e) {
		if (e === null) return !1;
		var t = e.length, n = 0, r = !1, s;
		if (!t) return !1;
		if (s = e[n], (s === "-" || s === "+") && (s = e[++n]), s === "0") {
			if (n + 1 === t) return !0;
			if (s = e[++n], s === "b") {
				for (n++; n < t; n++) if (s = e[n], s !== "_") {
					if (s !== "0" && s !== "1") return !1;
					r = !0;
				}
				return r && s !== "_";
			}
			if (s === "x") {
				for (n++; n < t; n++) if (s = e[n], s !== "_") {
					if (!i(e.charCodeAt(n))) return !1;
					r = !0;
				}
				return r && s !== "_";
			}
			if (s === "o") {
				for (n++; n < t; n++) if (s = e[n], s !== "_") {
					if (!a(e.charCodeAt(n))) return !1;
					r = !0;
				}
				return r && s !== "_";
			}
		}
		if (s === "_") return !1;
		for (; n < t; n++) if (s = e[n], s !== "_") {
			if (!o(e.charCodeAt(n))) return !1;
			r = !0;
		}
		return !(!r || s === "_");
	}
	function c(e) {
		var t = e, n = 1, r;
		if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
		if (r === "0") {
			if (t[1] === "b") return n * parseInt(t.slice(2), 2);
			if (t[1] === "x") return n * parseInt(t.slice(2), 16);
			if (t[1] === "o") return n * parseInt(t.slice(2), 8);
		}
		return n * parseInt(t, 10);
	}
	function l(e) {
		return Object.prototype.toString.call(e) === "[object Number]" && e % 1 == 0 && !n.isNegativeZero(e);
	}
	t.exports = new r("tag:yaml.org,2002:int", {
		kind: "scalar",
		resolve: s,
		construct: c,
		predicate: l,
		represent: {
			binary: function(e) {
				return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
			},
			octal: function(e) {
				return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
			},
			decimal: function(e) {
				return e.toString(10);
			},
			hexadecimal: function(e) {
				return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
			}
		},
		defaultStyle: "decimal",
		styleAliases: {
			binary: [2, "bin"],
			octal: [8, "oct"],
			decimal: [10, "dec"],
			hexadecimal: [16, "hex"]
		}
	});
})), Ce = /* @__PURE__ */ t(((e, t) => {
	var n = pe(), r = U(), i = /* @__PURE__ */ RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
	function a(e) {
		return !(e === null || !i.test(e) || e[e.length - 1] === "_");
	}
	function o(e) {
		var t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1;
		return "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Infinity : -Infinity : t === ".nan" ? NaN : n * parseFloat(t, 10);
	}
	var s = /^[-+]?[0-9]+e/;
	function c(e, t) {
		var r;
		if (isNaN(e)) switch (t) {
			case "lowercase": return ".nan";
			case "uppercase": return ".NAN";
			case "camelcase": return ".NaN";
		}
		else if (e === Infinity) switch (t) {
			case "lowercase": return ".inf";
			case "uppercase": return ".INF";
			case "camelcase": return ".Inf";
		}
		else if (e === -Infinity) switch (t) {
			case "lowercase": return "-.inf";
			case "uppercase": return "-.INF";
			case "camelcase": return "-.Inf";
		}
		else if (n.isNegativeZero(e)) return "-0.0";
		return r = e.toString(10), s.test(r) ? r.replace("e", ".e") : r;
	}
	function l(e) {
		return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 != 0 || n.isNegativeZero(e));
	}
	t.exports = new r("tag:yaml.org,2002:float", {
		kind: "scalar",
		resolve: a,
		construct: o,
		predicate: l,
		represent: c,
		defaultStyle: "lowercase"
	});
})), we = /* @__PURE__ */ t(((e, t) => {
	t.exports = be().extend({ implicit: [
		xe(),
		W(),
		Se(),
		Ce()
	] });
})), G = /* @__PURE__ */ t(((e, t) => {
	t.exports = we();
})), Te = /* @__PURE__ */ t(((e, t) => {
	var n = U(), r = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"), i = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
	function a(e) {
		return e === null ? !1 : r.exec(e) !== null || i.exec(e) !== null;
	}
	function o(e) {
		var t, n, a, o, s, c, l, u = 0, d = null, f, p, m;
		if (t = r.exec(e), t === null && (t = i.exec(e)), t === null) throw Error("Date resolve error");
		if (n = +t[1], a = t[2] - 1, o = +t[3], !t[4]) return new Date(Date.UTC(n, a, o));
		if (s = +t[4], c = +t[5], l = +t[6], t[7]) {
			for (u = t[7].slice(0, 3); u.length < 3;) u += "0";
			u = +u;
		}
		return t[9] && (f = +t[10], p = +(t[11] || 0), d = (f * 60 + p) * 6e4, t[9] === "-" && (d = -d)), m = new Date(Date.UTC(n, a, o, s, c, l, u)), d && m.setTime(m.getTime() - d), m;
	}
	function s(e) {
		return e.toISOString();
	}
	t.exports = new n("tag:yaml.org,2002:timestamp", {
		kind: "scalar",
		resolve: a,
		construct: o,
		instanceOf: Date,
		represent: s
	});
})), Ee = /* @__PURE__ */ t(((e, t) => {
	var n = U();
	function r(e) {
		return e === "<<" || e === null;
	}
	t.exports = new n("tag:yaml.org,2002:merge", {
		kind: "scalar",
		resolve: r
	});
})), De = /* @__PURE__ */ t(((e, t) => {
	var n = U(), r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
	function i(e) {
		if (e === null) return !1;
		var t, n, i = 0, a = e.length, o = r;
		for (n = 0; n < a; n++) if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
			if (t < 0) return !1;
			i += 6;
		}
		return i % 8 == 0;
	}
	function a(e) {
		var t, n, i = e.replace(/[\r\n=]/g, ""), a = i.length, o = r, s = 0, c = [];
		for (t = 0; t < a; t++) t % 4 == 0 && t && (c.push(s >> 16 & 255), c.push(s >> 8 & 255), c.push(s & 255)), s = s << 6 | o.indexOf(i.charAt(t));
		return n = a % 4 * 6, n === 0 ? (c.push(s >> 16 & 255), c.push(s >> 8 & 255), c.push(s & 255)) : n === 18 ? (c.push(s >> 10 & 255), c.push(s >> 2 & 255)) : n === 12 && c.push(s >> 4 & 255), new Uint8Array(c);
	}
	function o(e) {
		var t = "", n = 0, i, a, o = e.length, s = r;
		for (i = 0; i < o; i++) i % 3 == 0 && i && (t += s[n >> 18 & 63], t += s[n >> 12 & 63], t += s[n >> 6 & 63], t += s[n & 63]), n = (n << 8) + e[i];
		return a = o % 3, a === 0 ? (t += s[n >> 18 & 63], t += s[n >> 12 & 63], t += s[n >> 6 & 63], t += s[n & 63]) : a === 2 ? (t += s[n >> 10 & 63], t += s[n >> 4 & 63], t += s[n << 2 & 63], t += s[64]) : a === 1 && (t += s[n >> 2 & 63], t += s[n << 4 & 63], t += s[64], t += s[64]), t;
	}
	function s(e) {
		return Object.prototype.toString.call(e) === "[object Uint8Array]";
	}
	t.exports = new n("tag:yaml.org,2002:binary", {
		kind: "scalar",
		resolve: i,
		construct: a,
		predicate: s,
		represent: o
	});
})), Oe = /* @__PURE__ */ t(((e, t) => {
	var n = U(), r = Object.prototype.hasOwnProperty, i = Object.prototype.toString;
	function a(e) {
		if (e === null) return !0;
		var t = [], n, a, o, s, c, l = e;
		for (n = 0, a = l.length; n < a; n += 1) {
			if (o = l[n], c = !1, i.call(o) !== "[object Object]") return !1;
			for (s in o) if (r.call(o, s)) if (!c) c = !0;
			else return !1;
			if (!c) return !1;
			if (t.indexOf(s) === -1) t.push(s);
			else return !1;
		}
		return !0;
	}
	function o(e) {
		return e === null ? [] : e;
	}
	t.exports = new n("tag:yaml.org,2002:omap", {
		kind: "sequence",
		resolve: a,
		construct: o
	});
})), ke = /* @__PURE__ */ t(((e, t) => {
	var n = U(), r = Object.prototype.toString;
	function i(e) {
		if (e === null) return !0;
		var t, n, i, a, o, s = e;
		for (o = Array(s.length), t = 0, n = s.length; t < n; t += 1) {
			if (i = s[t], r.call(i) !== "[object Object]" || (a = Object.keys(i), a.length !== 1)) return !1;
			o[t] = [a[0], i[a[0]]];
		}
		return !0;
	}
	function a(e) {
		if (e === null) return [];
		var t, n, r, i, a, o = e;
		for (a = Array(o.length), t = 0, n = o.length; t < n; t += 1) r = o[t], i = Object.keys(r), a[t] = [i[0], r[i[0]]];
		return a;
	}
	t.exports = new n("tag:yaml.org,2002:pairs", {
		kind: "sequence",
		resolve: i,
		construct: a
	});
})), Ae = /* @__PURE__ */ t(((e, t) => {
	var n = U(), r = Object.prototype.hasOwnProperty;
	function i(e) {
		if (e === null) return !0;
		var t, n = e;
		for (t in n) if (r.call(n, t) && n[t] !== null) return !1;
		return !0;
	}
	function a(e) {
		return e === null ? {} : e;
	}
	t.exports = new n("tag:yaml.org,2002:set", {
		kind: "mapping",
		resolve: i,
		construct: a
	});
})), je = /* @__PURE__ */ t(((e, t) => {
	t.exports = G().extend({
		implicit: [Te(), Ee()],
		explicit: [
			De(),
			Oe(),
			ke(),
			Ae()
		]
	});
})), Me = /* @__PURE__ */ t(((e, t) => {
	var n = pe(), r = me(), i = he(), a = je(), o = Object.prototype.hasOwnProperty, s = 1, c = 2, l = 3, u = 4, d = 1, f = 2, p = 3, m = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, h = /[\x85\u2028\u2029]/, g = /[,\[\]\{\}]/, _ = /^(?:!|!!|![a-z\-]+!)$/i, v = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
	function y(e) {
		return Object.prototype.toString.call(e);
	}
	function b(e) {
		return e === 10 || e === 13;
	}
	function x(e) {
		return e === 9 || e === 32;
	}
	function S(e) {
		return e === 9 || e === 32 || e === 10 || e === 13;
	}
	function C(e) {
		return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
	}
	function w(e) {
		var t;
		return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
	}
	function T(e) {
		return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
	}
	function E(e) {
		return 48 <= e && e <= 57 ? e - 48 : -1;
	}
	function D(e) {
		return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? "\n" : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? "\"" : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? "\xA0" : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
	}
	function O(e) {
		return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode((e - 65536 >> 10) + 55296, (e - 65536 & 1023) + 56320);
	}
	function k(e, t, n) {
		t === "__proto__" ? Object.defineProperty(e, t, {
			configurable: !0,
			enumerable: !0,
			writable: !0,
			value: n
		}) : e[t] = n;
	}
	for (var ee = Array(256), te = Array(256), A = 0; A < 256; A++) ee[A] = +!!D(A), te[A] = D(A);
	function j(e, t) {
		this.input = e, this.filename = t.filename || null, this.schema = t.schema || a, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
	}
	function M(e, t) {
		var n = {
			name: e.filename,
			buffer: e.input.slice(0, -1),
			position: e.position,
			line: e.line,
			column: e.position - e.lineStart
		};
		return n.snippet = i(n), new r(t, n);
	}
	function N(e, t) {
		throw M(e, t);
	}
	function P(e, t) {
		e.onWarning && e.onWarning.call(null, M(e, t));
	}
	var ne = {
		YAML: function(e, t, n) {
			var r, i, a;
			e.version !== null && N(e, "duplication of %YAML directive"), n.length !== 1 && N(e, "YAML directive accepts exactly one argument"), r = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), r === null && N(e, "ill-formed argument of the YAML directive"), i = parseInt(r[1], 10), a = parseInt(r[2], 10), i !== 1 && N(e, "unacceptable YAML version of the document"), e.version = n[0], e.checkLineBreaks = a < 2, a !== 1 && a !== 2 && P(e, "unsupported YAML version of the document");
		},
		TAG: function(e, t, n) {
			var r, i;
			n.length !== 2 && N(e, "TAG directive accepts exactly two arguments"), r = n[0], i = n[1], _.test(r) || N(e, "ill-formed tag handle (first argument) of the TAG directive"), o.call(e.tagMap, r) && N(e, "there is a previously declared suffix for \"" + r + "\" tag handle"), v.test(i) || N(e, "ill-formed tag prefix (second argument) of the TAG directive");
			try {
				i = decodeURIComponent(i);
			} catch {
				N(e, "tag prefix is malformed: " + i);
			}
			e.tagMap[r] = i;
		}
	};
	function F(e, t, n, r) {
		var i, a, o, s;
		if (t < n) {
			if (s = e.input.slice(t, n), r) for (i = 0, a = s.length; i < a; i += 1) o = s.charCodeAt(i), o === 9 || 32 <= o && o <= 1114111 || N(e, "expected valid JSON character");
			else m.test(s) && N(e, "the stream contains non-printable characters");
			e.result += s;
		}
	}
	function re(e, t, r, i) {
		var a, s, c, l;
		for (n.isObject(r) || N(e, "cannot merge mappings; the provided source object is unacceptable"), a = Object.keys(r), c = 0, l = a.length; c < l; c += 1) s = a[c], o.call(t, s) || (k(t, s, r[s]), i[s] = !0);
	}
	function I(e, t, n, r, i, a, s, c, l) {
		var u, d;
		if (Array.isArray(i)) for (i = Array.prototype.slice.call(i), u = 0, d = i.length; u < d; u += 1) Array.isArray(i[u]) && N(e, "nested arrays are not supported inside keys"), typeof i == "object" && y(i[u]) === "[object Object]" && (i[u] = "[object Object]");
		if (typeof i == "object" && y(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge") if (Array.isArray(a)) for (u = 0, d = a.length; u < d; u += 1) re(e, t, a[u], n);
		else re(e, t, a, n);
		else !e.json && !o.call(n, i) && o.call(t, i) && (e.line = s || e.line, e.lineStart = c || e.lineStart, e.position = l || e.position, N(e, "duplicated mapping key")), k(t, i, a), delete n[i];
		return t;
	}
	function L(e) {
		var t = e.input.charCodeAt(e.position);
		t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : N(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
	}
	function R(e, t, n) {
		for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0;) {
			for (; x(i);) i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
			if (t && i === 35) do
				i = e.input.charCodeAt(++e.position);
			while (i !== 10 && i !== 13 && i !== 0);
			if (b(i)) for (L(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32;) e.lineIndent++, i = e.input.charCodeAt(++e.position);
			else break;
		}
		return n !== -1 && r !== 0 && e.lineIndent < n && P(e, "deficient indentation"), r;
	}
	function z(e) {
		var t = e.position, n = e.input.charCodeAt(t);
		return !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || S(n)));
	}
	function B(e, t) {
		t === 1 ? e.result += " " : t > 1 && (e.result += n.repeat("\n", t - 1));
	}
	function ie(e, t, n) {
		var r, i, a, o, s, c, l, u, d = e.kind, f = e.result, p = e.input.charCodeAt(e.position);
		if (S(p) || C(p) || p === 35 || p === 38 || p === 42 || p === 33 || p === 124 || p === 62 || p === 39 || p === 34 || p === 37 || p === 64 || p === 96 || (p === 63 || p === 45) && (i = e.input.charCodeAt(e.position + 1), S(i) || n && C(i))) return !1;
		for (e.kind = "scalar", e.result = "", a = o = e.position, s = !1; p !== 0;) {
			if (p === 58) {
				if (i = e.input.charCodeAt(e.position + 1), S(i) || n && C(i)) break;
			} else if (p === 35) {
				if (r = e.input.charCodeAt(e.position - 1), S(r)) break;
			} else if (e.position === e.lineStart && z(e) || n && C(p)) break;
			else if (b(p)) if (c = e.line, l = e.lineStart, u = e.lineIndent, R(e, !1, -1), e.lineIndent >= t) {
				s = !0, p = e.input.charCodeAt(e.position);
				continue;
			} else {
				e.position = o, e.line = c, e.lineStart = l, e.lineIndent = u;
				break;
			}
			s &&= (F(e, a, o, !1), B(e, e.line - c), a = o = e.position, !1), x(p) || (o = e.position + 1), p = e.input.charCodeAt(++e.position);
		}
		return F(e, a, o, !1), e.result ? !0 : (e.kind = d, e.result = f, !1);
	}
	function V(e, t) {
		var n = e.input.charCodeAt(e.position), r, i;
		if (n !== 39) return !1;
		for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0;) if (n === 39) if (F(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39) r = e.position, e.position++, i = e.position;
		else return !0;
		else b(n) ? (F(e, r, i, !0), B(e, R(e, !1, t)), r = i = e.position) : e.position === e.lineStart && z(e) ? N(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
		N(e, "unexpected end of the stream within a single quoted scalar");
	}
	function ae(e, t) {
		var n, r, i, a, o, s = e.input.charCodeAt(e.position);
		if (s !== 34) return !1;
		for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (s = e.input.charCodeAt(e.position)) !== 0;) if (s === 34) return F(e, n, e.position, !0), e.position++, !0;
		else if (s === 92) {
			if (F(e, n, e.position, !0), s = e.input.charCodeAt(++e.position), b(s)) R(e, !1, t);
			else if (s < 256 && ee[s]) e.result += te[s], e.position++;
			else if ((o = T(s)) > 0) {
				for (i = o, a = 0; i > 0; i--) s = e.input.charCodeAt(++e.position), (o = w(s)) >= 0 ? a = (a << 4) + o : N(e, "expected hexadecimal character");
				e.result += O(a), e.position++;
			} else N(e, "unknown escape sequence");
			n = r = e.position;
		} else b(s) ? (F(e, n, r, !0), B(e, R(e, !1, t)), n = r = e.position) : e.position === e.lineStart && z(e) ? N(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
		N(e, "unexpected end of the stream within a double quoted scalar");
	}
	function oe(e, t) {
		var n = !0, r, i, a, o = e.tag, c, l = e.anchor, u, d, f, p, m, h = Object.create(null), g, _, v, y = e.input.charCodeAt(e.position);
		if (y === 91) d = 93, m = !1, c = [];
		else if (y === 123) d = 125, m = !0, c = {};
		else return !1;
		for (e.anchor !== null && (e.anchorMap[e.anchor] = c), y = e.input.charCodeAt(++e.position); y !== 0;) {
			if (R(e, !0, t), y = e.input.charCodeAt(e.position), y === d) return e.position++, e.tag = o, e.anchor = l, e.kind = m ? "mapping" : "sequence", e.result = c, !0;
			n ? y === 44 && N(e, "expected the node content, but found ','") : N(e, "missed comma between flow collection entries"), _ = g = v = null, f = p = !1, y === 63 && (u = e.input.charCodeAt(e.position + 1), S(u) && (f = p = !0, e.position++, R(e, !0, t))), r = e.line, i = e.lineStart, a = e.position, H(e, t, s, !1, !0), _ = e.tag, g = e.result, R(e, !0, t), y = e.input.charCodeAt(e.position), (p || e.line === r) && y === 58 && (f = !0, y = e.input.charCodeAt(++e.position), R(e, !0, t), H(e, t, s, !1, !0), v = e.result), m ? I(e, c, h, _, g, v, r, i, a) : f ? c.push(I(e, null, h, _, g, v, r, i, a)) : c.push(g), R(e, !0, t), y = e.input.charCodeAt(e.position), y === 44 ? (n = !0, y = e.input.charCodeAt(++e.position)) : n = !1;
		}
		N(e, "unexpected end of the stream within a flow collection");
	}
	function se(e, t) {
		var r, i, a = d, o = !1, s = !1, c = t, l = 0, u = !1, m, h = e.input.charCodeAt(e.position);
		if (h === 124) i = !1;
		else if (h === 62) i = !0;
		else return !1;
		for (e.kind = "scalar", e.result = ""; h !== 0;) if (h = e.input.charCodeAt(++e.position), h === 43 || h === 45) d === a ? a = h === 43 ? p : f : N(e, "repeat of a chomping mode identifier");
		else if ((m = E(h)) >= 0) m === 0 ? N(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? N(e, "repeat of an indentation width identifier") : (c = t + m - 1, s = !0);
		else break;
		if (x(h)) {
			do
				h = e.input.charCodeAt(++e.position);
			while (x(h));
			if (h === 35) do
				h = e.input.charCodeAt(++e.position);
			while (!b(h) && h !== 0);
		}
		for (; h !== 0;) {
			for (L(e), e.lineIndent = 0, h = e.input.charCodeAt(e.position); (!s || e.lineIndent < c) && h === 32;) e.lineIndent++, h = e.input.charCodeAt(++e.position);
			if (!s && e.lineIndent > c && (c = e.lineIndent), b(h)) {
				l++;
				continue;
			}
			if (e.lineIndent < c) {
				a === p ? e.result += n.repeat("\n", o ? 1 + l : l) : a === d && o && (e.result += "\n");
				break;
			}
			for (i ? x(h) ? (u = !0, e.result += n.repeat("\n", o ? 1 + l : l)) : u ? (u = !1, e.result += n.repeat("\n", l + 1)) : l === 0 ? o && (e.result += " ") : e.result += n.repeat("\n", l) : e.result += n.repeat("\n", o ? 1 + l : l), o = !0, s = !0, l = 0, r = e.position; !b(h) && h !== 0;) h = e.input.charCodeAt(++e.position);
			F(e, r, e.position, !1);
		}
		return !0;
	}
	function ce(e, t) {
		var n, r = e.tag, i = e.anchor, a = [], o, s = !1, c;
		if (e.firstTabInLine !== -1) return !1;
		for (e.anchor !== null && (e.anchorMap[e.anchor] = a), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, N(e, "tab characters must not be used in indentation")), !(c !== 45 || (o = e.input.charCodeAt(e.position + 1), !S(o))));) {
			if (s = !0, e.position++, R(e, !0, -1) && e.lineIndent <= t) {
				a.push(null), c = e.input.charCodeAt(e.position);
				continue;
			}
			if (n = e.line, H(e, t, l, !1, !0), a.push(e.result), R(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && c !== 0) N(e, "bad indentation of a sequence entry");
			else if (e.lineIndent < t) break;
		}
		return s ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = a, !0) : !1;
	}
	function le(e, t, n) {
		var r, i, a, o, s, l, d = e.tag, f = e.anchor, p = {}, m = Object.create(null), h = null, g = null, _ = null, v = !1, y = !1, b;
		if (e.firstTabInLine !== -1) return !1;
		for (e.anchor !== null && (e.anchorMap[e.anchor] = p), b = e.input.charCodeAt(e.position); b !== 0;) {
			if (!v && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, N(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), a = e.line, (b === 63 || b === 58) && S(r)) b === 63 ? (v && (I(e, p, m, h, g, null, o, s, l), h = g = _ = null), y = !0, v = !0, i = !0) : v ? (v = !1, i = !0) : N(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, b = r;
			else {
				if (o = e.line, s = e.lineStart, l = e.position, !H(e, n, c, !1, !0)) break;
				if (e.line === a) {
					for (b = e.input.charCodeAt(e.position); x(b);) b = e.input.charCodeAt(++e.position);
					if (b === 58) b = e.input.charCodeAt(++e.position), S(b) || N(e, "a whitespace character is expected after the key-value separator within a block mapping"), v && (I(e, p, m, h, g, null, o, s, l), h = g = _ = null), y = !0, v = !1, i = !1, h = e.tag, g = e.result;
					else if (y) N(e, "can not read an implicit mapping pair; a colon is missed");
					else return e.tag = d, e.anchor = f, !0;
				} else if (y) N(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
				else return e.tag = d, e.anchor = f, !0;
			}
			if ((e.line === a || e.lineIndent > t) && (v && (o = e.line, s = e.lineStart, l = e.position), H(e, t, u, !0, i) && (v ? g = e.result : _ = e.result), v || (I(e, p, m, h, g, _, o, s, l), h = g = _ = null), R(e, !0, -1), b = e.input.charCodeAt(e.position)), (e.line === a || e.lineIndent > t) && b !== 0) N(e, "bad indentation of a mapping entry");
			else if (e.lineIndent < t) break;
		}
		return v && I(e, p, m, h, g, null, o, s, l), y && (e.tag = d, e.anchor = f, e.kind = "mapping", e.result = p), y;
	}
	function ue(e) {
		var t, n = !1, r = !1, i, a, s = e.input.charCodeAt(e.position);
		if (s !== 33) return !1;
		if (e.tag !== null && N(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (n = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (r = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
			do
				s = e.input.charCodeAt(++e.position);
			while (s !== 0 && s !== 62);
			e.position < e.length ? (a = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : N(e, "unexpected end of the stream within a verbatim tag");
		} else {
			for (; s !== 0 && !S(s);) s === 33 && (r ? N(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), _.test(i) || N(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
			a = e.input.slice(t, e.position), g.test(a) && N(e, "tag suffix cannot contain flow indicator characters");
		}
		a && !v.test(a) && N(e, "tag name cannot contain such characters: " + a);
		try {
			a = decodeURIComponent(a);
		} catch {
			N(e, "tag name is malformed: " + a);
		}
		return n ? e.tag = a : o.call(e.tagMap, i) ? e.tag = e.tagMap[i] + a : i === "!" ? e.tag = "!" + a : i === "!!" ? e.tag = "tag:yaml.org,2002:" + a : N(e, "undeclared tag handle \"" + i + "\""), !0;
	}
	function de(e) {
		var t, n = e.input.charCodeAt(e.position);
		if (n !== 38) return !1;
		for (e.anchor !== null && N(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !S(n) && !C(n);) n = e.input.charCodeAt(++e.position);
		return e.position === t && N(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
	}
	function fe(e) {
		var t, n, r = e.input.charCodeAt(e.position);
		if (r !== 42) return !1;
		for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !S(r) && !C(r);) r = e.input.charCodeAt(++e.position);
		return e.position === t && N(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), o.call(e.anchorMap, n) || N(e, "unidentified alias \"" + n + "\""), e.result = e.anchorMap[n], R(e, !0, -1), !0;
	}
	function H(e, t, n, r, i) {
		var a, d, f, p = 1, m = !1, h = !1, g, _, v, y, b, x;
		if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, a = d = f = u === n || l === n, r && R(e, !0, -1) && (m = !0, e.lineIndent > t ? p = 1 : e.lineIndent === t ? p = 0 : e.lineIndent < t && (p = -1)), p === 1) for (; ue(e) || de(e);) R(e, !0, -1) ? (m = !0, f = a, e.lineIndent > t ? p = 1 : e.lineIndent === t ? p = 0 : e.lineIndent < t && (p = -1)) : f = !1;
		if (f &&= m || i, (p === 1 || u === n) && (b = s === n || c === n ? t : t + 1, x = e.position - e.lineStart, p === 1 ? f && (ce(e, x) || le(e, x, b)) || oe(e, b) ? h = !0 : (d && se(e, b) || V(e, b) || ae(e, b) ? h = !0 : fe(e) ? (h = !0, (e.tag !== null || e.anchor !== null) && N(e, "alias node should not have any properties")) : ie(e, b, s === n) && (h = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : p === 0 && (h = f && ce(e, x))), e.tag === null) e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
		else if (e.tag === "?") {
			for (e.result !== null && e.kind !== "scalar" && N(e, "unacceptable node kind for !<?> tag; it should be \"scalar\", not \"" + e.kind + "\""), g = 0, _ = e.implicitTypes.length; g < _; g += 1) if (y = e.implicitTypes[g], y.resolve(e.result)) {
				e.result = y.construct(e.result), e.tag = y.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
				break;
			}
		} else if (e.tag !== "!") {
			if (o.call(e.typeMap[e.kind || "fallback"], e.tag)) y = e.typeMap[e.kind || "fallback"][e.tag];
			else for (y = null, v = e.typeMap.multi[e.kind || "fallback"], g = 0, _ = v.length; g < _; g += 1) if (e.tag.slice(0, v[g].tag.length) === v[g].tag) {
				y = v[g];
				break;
			}
			y || N(e, "unknown tag !<" + e.tag + ">"), e.result !== null && y.kind !== e.kind && N(e, "unacceptable node kind for !<" + e.tag + "> tag; it should be \"" + y.kind + "\", not \"" + e.kind + "\""), y.resolve(e.result, e.tag) ? (e.result = y.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : N(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
		}
		return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || h;
	}
	function U(e) {
		var t = e.position, n, r, i, a = !1, s;
		for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = Object.create(null), e.anchorMap = Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (R(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37));) {
			for (a = !0, s = e.input.charCodeAt(++e.position), n = e.position; s !== 0 && !S(s);) s = e.input.charCodeAt(++e.position);
			for (r = e.input.slice(n, e.position), i = [], r.length < 1 && N(e, "directive name must not be less than one character in length"); s !== 0;) {
				for (; x(s);) s = e.input.charCodeAt(++e.position);
				if (s === 35) {
					do
						s = e.input.charCodeAt(++e.position);
					while (s !== 0 && !b(s));
					break;
				}
				if (b(s)) break;
				for (n = e.position; s !== 0 && !S(s);) s = e.input.charCodeAt(++e.position);
				i.push(e.input.slice(n, e.position));
			}
			s !== 0 && L(e), o.call(ne, r) ? ne[r](e, r, i) : P(e, "unknown document directive \"" + r + "\"");
		}
		if (R(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, R(e, !0, -1)) : a && N(e, "directives end mark is expected"), H(e, e.lineIndent - 1, u, !1, !0), R(e, !0, -1), e.checkLineBreaks && h.test(e.input.slice(t, e.position)) && P(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && z(e)) {
			e.input.charCodeAt(e.position) === 46 && (e.position += 3, R(e, !0, -1));
			return;
		}
		if (e.position < e.length - 1) N(e, "end of the stream or a document separator is expected");
		else return;
	}
	function ge(e, t) {
		e = String(e), t ||= {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += "\n"), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
		var n = new j(e, t), r = e.indexOf("\0");
		for (r !== -1 && (n.position = r, N(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32;) n.lineIndent += 1, n.position += 1;
		for (; n.position < n.length - 1;) U(n);
		return n.documents;
	}
	function _e(e, t, n) {
		typeof t == "object" && t && n === void 0 && (n = t, t = null);
		var r = ge(e, n);
		if (typeof t != "function") return r;
		for (var i = 0, a = r.length; i < a; i += 1) t(r[i]);
	}
	function ve(e, t) {
		var n = ge(e, t);
		if (n.length !== 0) {
			if (n.length === 1) return n[0];
			throw new r("expected a single document in the stream, but found more");
		}
	}
	t.exports.loadAll = _e, t.exports.load = ve;
})), Ne = /* @__PURE__ */ t(((e, t) => {
	var n = pe(), r = me(), i = je(), a = Object.prototype.toString, o = Object.prototype.hasOwnProperty, s = 65279, c = 9, l = 10, u = 13, d = 32, f = 33, p = 34, m = 35, h = 37, g = 38, _ = 39, v = 42, y = 44, b = 45, x = 58, S = 61, C = 62, w = 63, T = 64, E = 91, D = 93, O = 96, k = 123, ee = 124, te = 125, A = {};
	A[0] = "\\0", A[7] = "\\a", A[8] = "\\b", A[9] = "\\t", A[10] = "\\n", A[11] = "\\v", A[12] = "\\f", A[13] = "\\r", A[27] = "\\e", A[34] = "\\\"", A[92] = "\\\\", A[133] = "\\N", A[160] = "\\_", A[8232] = "\\L", A[8233] = "\\P";
	var j = [
		"y",
		"Y",
		"yes",
		"Yes",
		"YES",
		"on",
		"On",
		"ON",
		"n",
		"N",
		"no",
		"No",
		"NO",
		"off",
		"Off",
		"OFF"
	], M = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
	function N(e, t) {
		var n, r, i, a, s, c, l;
		if (t === null) return {};
		for (n = {}, r = Object.keys(t), i = 0, a = r.length; i < a; i += 1) s = r[i], c = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), l = e.compiledTypeMap.fallback[s], l && o.call(l.styleAliases, c) && (c = l.styleAliases[c]), n[s] = c;
		return n;
	}
	function P(e) {
		var t = e.toString(16).toUpperCase(), i, a;
		if (e <= 255) i = "x", a = 2;
		else if (e <= 65535) i = "u", a = 4;
		else if (e <= 4294967295) i = "U", a = 8;
		else throw new r("code point within a string may not be greater than 0xFFFFFFFF");
		return "\\" + i + n.repeat("0", a - t.length) + t;
	}
	var ne = 1, F = 2;
	function re(e) {
		this.schema = e.schema || i, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = n.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = N(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === "\"" ? F : ne, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
	}
	function I(e, t) {
		for (var r = n.repeat(" ", t), i = 0, a = -1, o = "", s, c = e.length; i < c;) a = e.indexOf("\n", i), a === -1 ? (s = e.slice(i), i = c) : (s = e.slice(i, a + 1), i = a + 1), s.length && s !== "\n" && (o += r), o += s;
		return o;
	}
	function L(e, t) {
		return "\n" + n.repeat(" ", e.indent * t);
	}
	function R(e, t) {
		var n, r, i;
		for (n = 0, r = e.implicitTypes.length; n < r; n += 1) if (i = e.implicitTypes[n], i.resolve(t)) return !0;
		return !1;
	}
	function z(e) {
		return e === d || e === c;
	}
	function B(e) {
		return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== s || 65536 <= e && e <= 1114111;
	}
	function ie(e) {
		return B(e) && e !== s && e !== u && e !== l;
	}
	function V(e, t, n) {
		var r = ie(e), i = r && !z(e);
		return (n ? r : r && e !== y && e !== E && e !== D && e !== k && e !== te) && e !== m && !(t === x && !i) || ie(t) && !z(t) && e === m || t === x && i;
	}
	function ae(e) {
		return B(e) && e !== s && !z(e) && e !== b && e !== w && e !== x && e !== y && e !== E && e !== D && e !== k && e !== te && e !== m && e !== g && e !== v && e !== f && e !== ee && e !== S && e !== C && e !== _ && e !== p && e !== h && e !== T && e !== O;
	}
	function oe(e) {
		return !z(e) && e !== x;
	}
	function se(e, t) {
		var n = e.charCodeAt(t), r;
		return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
	}
	function ce(e) {
		return /^\n* /.test(e);
	}
	var le = 1, ue = 2, de = 3, fe = 4, H = 5;
	function he(e, t, n, r, i, a, o, s) {
		var c, u = 0, d = null, f = !1, p = !1, m = r !== -1, h = -1, g = ae(se(e, 0)) && oe(se(e, e.length - 1));
		if (t || o) for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
			if (u = se(e, c), !B(u)) return H;
			g &&= V(u, d, s), d = u;
		}
		else {
			for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
				if (u = se(e, c), u === l) f = !0, m && (p ||= c - h - 1 > r && e[h + 1] !== " ", h = c);
				else if (!B(u)) return H;
				g &&= V(u, d, s), d = u;
			}
			p ||= m && c - h - 1 > r && e[h + 1] !== " ";
		}
		return !f && !p ? g && !o && !i(e) ? le : a === F ? H : ue : n > 9 && ce(e) ? H : o ? a === F ? H : ue : p ? fe : de;
	}
	function U(e, t, n, i, a) {
		e.dump = function() {
			if (t.length === 0) return e.quotingType === F ? "\"\"" : "''";
			if (!e.noCompatMode && (j.indexOf(t) !== -1 || M.test(t))) return e.quotingType === F ? "\"" + t + "\"" : "'" + t + "'";
			var o = e.indent * Math.max(1, n), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), c = i || e.flowLevel > -1 && n >= e.flowLevel;
			function l(t) {
				return R(e, t);
			}
			switch (he(t, c, e.indent, s, l, e.quotingType, e.forceQuotes && !i, a)) {
				case le: return t;
				case ue: return "'" + t.replace(/'/g, "''") + "'";
				case de: return "|" + ge(t, e.indent) + _e(I(t, o));
				case fe: return ">" + ge(t, e.indent) + _e(I(ve(t, s), o));
				case H: return "\"" + be(t, s) + "\"";
				default: throw new r("impossible error: invalid scalar style");
			}
		}();
	}
	function ge(e, t) {
		var n = ce(e) ? String(t) : "", r = e[e.length - 1] === "\n";
		return n + (r && (e[e.length - 2] === "\n" || e === "\n") ? "+" : r ? "" : "-") + "\n";
	}
	function _e(e) {
		return e[e.length - 1] === "\n" ? e.slice(0, -1) : e;
	}
	function ve(e, t) {
		for (var n = /(\n+)([^\n]*)/g, r = function() {
			var r = e.indexOf("\n");
			return r = r === -1 ? e.length : r, n.lastIndex = r, ye(e.slice(0, r), t);
		}(), i = e[0] === "\n" || e[0] === " ", a, o; o = n.exec(e);) {
			var s = o[1], c = o[2];
			a = c[0] === " ", r += s + (!i && !a && c !== "" ? "\n" : "") + ye(c, t), i = a;
		}
		return r;
	}
	function ye(e, t) {
		if (e === "" || e[0] === " ") return e;
		for (var n = / [^ ]/g, r, i = 0, a, o = 0, s = 0, c = ""; r = n.exec(e);) s = r.index, s - i > t && (a = o > i ? o : s, c += "\n" + e.slice(i, a), i = a + 1), o = s;
		return c += "\n", e.length - i > t && o > i ? c += e.slice(i, o) + "\n" + e.slice(o + 1) : c += e.slice(i), c.slice(1);
	}
	function be(e) {
		for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++) n = se(e, i), r = A[n], !r && B(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || P(n);
		return t;
	}
	function xe(e, t, n) {
		var r = "", i = e.tag, a, o, s;
		for (a = 0, o = n.length; a < o; a += 1) s = n[a], e.replacer && (s = e.replacer.call(n, String(a), s)), (G(e, t, s, !1, !1) || s === void 0 && G(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
		e.tag = i, e.dump = "[" + r + "]";
	}
	function W(e, t, n, r) {
		var i = "", a = e.tag, o, s, c;
		for (o = 0, s = n.length; o < s; o += 1) c = n[o], e.replacer && (c = e.replacer.call(n, String(o), c)), (G(e, t + 1, c, !0, !0, !1, !0) || c === void 0 && G(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += L(e, t)), e.dump && l === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
		e.tag = a, e.dump = i || "[]";
	}
	function Se(e, t, n) {
		var r = "", i = e.tag, a = Object.keys(n), o, s, c, l, u;
		for (o = 0, s = a.length; o < s; o += 1) u = "", r !== "" && (u += ", "), e.condenseFlow && (u += "\""), c = a[o], l = n[c], e.replacer && (l = e.replacer.call(n, c, l)), G(e, t, c, !1, !1) && (e.dump.length > 1024 && (u += "? "), u += e.dump + (e.condenseFlow ? "\"" : "") + ":" + (e.condenseFlow ? "" : " "), G(e, t, l, !1, !1) && (u += e.dump, r += u));
		e.tag = i, e.dump = "{" + r + "}";
	}
	function Ce(e, t, n, i) {
		var a = "", o = e.tag, s = Object.keys(n), c, u, d, f, p, m;
		if (e.sortKeys === !0) s.sort();
		else if (typeof e.sortKeys == "function") s.sort(e.sortKeys);
		else if (e.sortKeys) throw new r("sortKeys must be a boolean or a function");
		for (c = 0, u = s.length; c < u; c += 1) m = "", (!i || a !== "") && (m += L(e, t)), d = s[c], f = n[d], e.replacer && (f = e.replacer.call(n, d, f)), G(e, t + 1, d, !0, !0, !0) && (p = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, p && (e.dump && l === e.dump.charCodeAt(0) ? m += "?" : m += "? "), m += e.dump, p && (m += L(e, t)), G(e, t + 1, f, !0, p) && (e.dump && l === e.dump.charCodeAt(0) ? m += ":" : m += ": ", m += e.dump, a += m));
		e.tag = o, e.dump = a || "{}";
	}
	function we(e, t, n) {
		var i, s = n ? e.explicitTypes : e.implicitTypes, c, l, u, d;
		for (c = 0, l = s.length; c < l; c += 1) if (u = s[c], (u.instanceOf || u.predicate) && (!u.instanceOf || typeof t == "object" && t instanceof u.instanceOf) && (!u.predicate || u.predicate(t))) {
			if (n ? u.multi && u.representName ? e.tag = u.representName(t) : e.tag = u.tag : e.tag = "?", u.represent) {
				if (d = e.styleMap[u.tag] || u.defaultStyle, a.call(u.represent) === "[object Function]") i = u.represent(t, d);
				else if (o.call(u.represent, d)) i = u.represent[d](t, d);
				else throw new r("!<" + u.tag + "> tag resolver accepts not \"" + d + "\" style");
				e.dump = i;
			}
			return !0;
		}
		return !1;
	}
	function G(e, t, n, i, o, s, c) {
		e.tag = null, e.dump = n, we(e, n, !1) || we(e, n, !0);
		var l = a.call(e.dump), u = i, d;
		i &&= e.flowLevel < 0 || e.flowLevel > t;
		var f = l === "[object Object]" || l === "[object Array]", p, m;
		if (f && (p = e.duplicates.indexOf(n), m = p !== -1), (e.tag !== null && e.tag !== "?" || m || e.indent !== 2 && t > 0) && (o = !1), m && e.usedDuplicates[p]) e.dump = "*ref_" + p;
		else {
			if (f && m && !e.usedDuplicates[p] && (e.usedDuplicates[p] = !0), l === "[object Object]") i && Object.keys(e.dump).length !== 0 ? (Ce(e, t, e.dump, o), m && (e.dump = "&ref_" + p + e.dump)) : (Se(e, t, e.dump), m && (e.dump = "&ref_" + p + " " + e.dump));
			else if (l === "[object Array]") i && e.dump.length !== 0 ? (e.noArrayIndent && !c && t > 0 ? W(e, t - 1, e.dump, o) : W(e, t, e.dump, o), m && (e.dump = "&ref_" + p + e.dump)) : (xe(e, t, e.dump), m && (e.dump = "&ref_" + p + " " + e.dump));
			else if (l === "[object String]") e.tag !== "?" && U(e, e.dump, t, s, u);
			else if (l === "[object Undefined]") return !1;
			else {
				if (e.skipInvalid) return !1;
				throw new r("unacceptable kind of an object to dump " + l);
			}
			e.tag !== null && e.tag !== "?" && (d = encodeURI(e.tag[0] === "!" ? e.tag.slice(1) : e.tag).replace(/!/g, "%21"), d = e.tag[0] === "!" ? "!" + d : d.slice(0, 18) === "tag:yaml.org,2002:" ? "!!" + d.slice(18) : "!<" + d + ">", e.dump = d + " " + e.dump);
		}
		return !0;
	}
	function Te(e, t) {
		var n = [], r = [], i, a;
		for (Ee(e, n, r), i = 0, a = r.length; i < a; i += 1) t.duplicates.push(n[r[i]]);
		t.usedDuplicates = Array(a);
	}
	function Ee(e, t, n) {
		var r, i, a;
		if (typeof e == "object" && e) if (i = t.indexOf(e), i !== -1) n.indexOf(i) === -1 && n.push(i);
		else if (t.push(e), Array.isArray(e)) for (i = 0, a = e.length; i < a; i += 1) Ee(e[i], t, n);
		else for (r = Object.keys(e), i = 0, a = r.length; i < a; i += 1) Ee(e[r[i]], t, n);
	}
	function De(e, t) {
		t ||= {};
		var n = new re(t);
		n.noRefs || Te(e, n);
		var r = e;
		return n.replacer && (r = n.replacer.call({ "": r }, "", r)), G(n, 0, r, !0, !0) ? n.dump + "\n" : "";
	}
	t.exports.dump = De;
})), Pe = /* @__PURE__ */ t(((e, t) => {
	var n = Me(), r = Ne();
	function i(e, t) {
		return function() {
			throw Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
		};
	}
	t.exports.Type = U(), t.exports.Schema = ge(), t.exports.FAILSAFE_SCHEMA = be(), t.exports.JSON_SCHEMA = we(), t.exports.CORE_SCHEMA = G(), t.exports.DEFAULT_SCHEMA = je(), t.exports.load = n.load, t.exports.loadAll = n.loadAll, t.exports.dump = r.dump, t.exports.YAMLException = me(), t.exports.types = {
		binary: De(),
		float: Ce(),
		map: ye(),
		null: xe(),
		pairs: ke(),
		set: Ae(),
		timestamp: Te(),
		bool: W(),
		int: Se(),
		merge: Ee(),
		omap: Oe(),
		seq: ve(),
		str: _e()
	}, t.exports.safeLoad = i("safeLoad", "load"), t.exports.safeLoadAll = i("safeLoadAll", "loadAll"), t.exports.safeDump = i("safeDump", "dump");
})), Fe = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.Lazy = void 0, e.Lazy = class {
		constructor(e) {
			this._value = null, this.creator = e;
		}
		get hasValue() {
			return this.creator == null;
		}
		get value() {
			if (this.creator == null) return this._value;
			let e = this.creator();
			return this.value = e, e;
		}
		set value(e) {
			this._value = e, this.creator = null;
		}
	};
})), Ie = /* @__PURE__ */ t(((e, t) => {
	var n = "2.0.0", r = 256;
	t.exports = {
		MAX_LENGTH: r,
		MAX_SAFE_COMPONENT_LENGTH: 16,
		MAX_SAFE_BUILD_LENGTH: r - 6,
		MAX_SAFE_INTEGER: 2 ** 53 - 1 || 9007199254740991,
		RELEASE_TYPES: [
			"major",
			"premajor",
			"minor",
			"preminor",
			"patch",
			"prepatch",
			"prerelease"
		],
		SEMVER_SPEC_VERSION: n,
		FLAG_INCLUDE_PRERELEASE: 1,
		FLAG_LOOSE: 2
	};
})), Le = /* @__PURE__ */ t(((e, t) => {
	t.exports = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {};
})), K = /* @__PURE__ */ t(((e, t) => {
	var { MAX_SAFE_COMPONENT_LENGTH: n, MAX_SAFE_BUILD_LENGTH: r, MAX_LENGTH: i } = Ie(), a = Le();
	e = t.exports = {};
	var o = e.re = [], s = e.safeRe = [], c = e.src = [], l = e.safeSrc = [], u = e.t = {}, d = 0, f = "[a-zA-Z0-9-]", p = [
		["\\s", 1],
		["\\d", i],
		[f, r]
	], m = (e) => {
		for (let [t, n] of p) e = e.split(`${t}*`).join(`${t}{0,${n}}`).split(`${t}+`).join(`${t}{1,${n}}`);
		return e;
	}, h = (e, t, n) => {
		let r = m(t), i = d++;
		a(e, i, t), u[e] = i, c[i] = t, l[i] = r, o[i] = new RegExp(t, n ? "g" : void 0), s[i] = new RegExp(r, n ? "g" : void 0);
	};
	h("NUMERICIDENTIFIER", "0|[1-9]\\d*"), h("NUMERICIDENTIFIERLOOSE", "\\d+"), h("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${f}*`), h("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), h("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), h("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), h("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), h("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), h("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), h("BUILDIDENTIFIER", `${f}+`), h("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), h("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), h("FULL", `^${c[u.FULLPLAIN]}$`), h("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), h("LOOSE", `^${c[u.LOOSEPLAIN]}$`), h("GTLT", "((?:<|>)?=?)"), h("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), h("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), h("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), h("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), h("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), h("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), h("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), h("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), h("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), h("COERCERTL", c[u.COERCE], !0), h("COERCERTLFULL", c[u.COERCEFULL], !0), h("LONETILDE", "(?:~>?)"), h("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), e.tildeTrimReplace = "$1~", h("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), h("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), h("LONECARET", "(?:\\^)"), h("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), e.caretTrimReplace = "$1^", h("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), h("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), h("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), h("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), h("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), e.comparatorTrimReplace = "$1$2$3", h("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), h("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), h("STAR", "(<|>)?=?\\s*\\*"), h("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), h("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})), Re = /* @__PURE__ */ t(((e, t) => {
	var n = Object.freeze({ loose: !0 }), r = Object.freeze({});
	t.exports = (e) => e ? typeof e == "object" ? e : n : r;
})), ze = /* @__PURE__ */ t(((e, t) => {
	var n = /^[0-9]+$/, r = (e, t) => {
		if (typeof e == "number" && typeof t == "number") return e === t ? 0 : e < t ? -1 : 1;
		let r = n.test(e), i = n.test(t);
		return r && i && (e = +e, t = +t), e === t ? 0 : r && !i ? -1 : i && !r ? 1 : e < t ? -1 : 1;
	};
	t.exports = {
		compareIdentifiers: r,
		rcompareIdentifiers: (e, t) => r(t, e)
	};
})), q = /* @__PURE__ */ t(((e, t) => {
	var n = Le(), { MAX_LENGTH: r, MAX_SAFE_INTEGER: i } = Ie(), { safeRe: a, t: o } = K(), s = Re(), { compareIdentifiers: c } = ze();
	t.exports = class e {
		constructor(t, c) {
			if (c = s(c), t instanceof e) {
				if (t.loose === !!c.loose && t.includePrerelease === !!c.includePrerelease) return t;
				t = t.version;
			} else if (typeof t != "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
			if (t.length > r) throw TypeError(`version is longer than ${r} characters`);
			n("SemVer", t, c), this.options = c, this.loose = !!c.loose, this.includePrerelease = !!c.includePrerelease;
			let l = t.trim().match(c.loose ? a[o.LOOSE] : a[o.FULL]);
			if (!l) throw TypeError(`Invalid Version: ${t}`);
			if (this.raw = t, this.major = +l[1], this.minor = +l[2], this.patch = +l[3], this.major > i || this.major < 0) throw TypeError("Invalid major version");
			if (this.minor > i || this.minor < 0) throw TypeError("Invalid minor version");
			if (this.patch > i || this.patch < 0) throw TypeError("Invalid patch version");
			l[4] ? this.prerelease = l[4].split(".").map((e) => {
				if (/^[0-9]+$/.test(e)) {
					let t = +e;
					if (t >= 0 && t < i) return t;
				}
				return e;
			}) : this.prerelease = [], this.build = l[5] ? l[5].split(".") : [], this.format();
		}
		format() {
			return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
		}
		toString() {
			return this.version;
		}
		compare(t) {
			if (n("SemVer.compare", this.version, this.options, t), !(t instanceof e)) {
				if (typeof t == "string" && t === this.version) return 0;
				t = new e(t, this.options);
			}
			return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
		}
		compareMain(t) {
			return t instanceof e || (t = new e(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : +(this.patch > t.patch);
		}
		comparePre(t) {
			if (t instanceof e || (t = new e(t, this.options)), this.prerelease.length && !t.prerelease.length) return -1;
			if (!this.prerelease.length && t.prerelease.length) return 1;
			if (!this.prerelease.length && !t.prerelease.length) return 0;
			let r = 0;
			do {
				let e = this.prerelease[r], i = t.prerelease[r];
				if (n("prerelease compare", r, e, i), e === void 0 && i === void 0) return 0;
				if (i === void 0) return 1;
				if (e === void 0) return -1;
				if (e === i) continue;
				return c(e, i);
			} while (++r);
		}
		compareBuild(t) {
			t instanceof e || (t = new e(t, this.options));
			let r = 0;
			do {
				let e = this.build[r], i = t.build[r];
				if (n("build compare", r, e, i), e === void 0 && i === void 0) return 0;
				if (i === void 0) return 1;
				if (e === void 0) return -1;
				if (e === i) continue;
				return c(e, i);
			} while (++r);
		}
		inc(e, t, n) {
			if (e.startsWith("pre")) {
				if (!t && n === !1) throw Error("invalid increment argument: identifier is empty");
				if (t) {
					let e = `-${t}`.match(this.options.loose ? a[o.PRERELEASELOOSE] : a[o.PRERELEASE]);
					if (!e || e[1] !== t) throw Error(`invalid identifier: ${t}`);
				}
			}
			switch (e) {
				case "premajor":
					this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", t, n);
					break;
				case "preminor":
					this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", t, n);
					break;
				case "prepatch":
					this.prerelease.length = 0, this.inc("patch", t, n), this.inc("pre", t, n);
					break;
				case "prerelease":
					this.prerelease.length === 0 && this.inc("patch", t, n), this.inc("pre", t, n);
					break;
				case "release":
					if (this.prerelease.length === 0) throw Error(`version ${this.raw} is not a prerelease`);
					this.prerelease.length = 0;
					break;
				case "major":
					(this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
					break;
				case "minor":
					(this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
					break;
				case "patch":
					this.prerelease.length === 0 && this.patch++, this.prerelease = [];
					break;
				case "pre": {
					let e = +!!Number(n);
					if (this.prerelease.length === 0) this.prerelease = [e];
					else {
						let r = this.prerelease.length;
						for (; --r >= 0;) typeof this.prerelease[r] == "number" && (this.prerelease[r]++, r = -2);
						if (r === -1) {
							if (t === this.prerelease.join(".") && n === !1) throw Error("invalid increment argument: identifier already exists");
							this.prerelease.push(e);
						}
					}
					if (t) {
						let r = [t, e];
						n === !1 && (r = [t]), c(this.prerelease[0], t) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = r) : this.prerelease = r;
					}
					break;
				}
				default: throw Error(`invalid increment argument: ${e}`);
			}
			return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
		}
	};
})), Be = /* @__PURE__ */ t(((e, t) => {
	var n = q();
	t.exports = (e, t, r = !1) => {
		if (e instanceof n) return e;
		try {
			return new n(e, t);
		} catch (e) {
			if (!r) return null;
			throw e;
		}
	};
})), Ve = /* @__PURE__ */ t(((e, t) => {
	var n = Be();
	t.exports = (e, t) => {
		let r = n(e, t);
		return r ? r.version : null;
	};
})), He = /* @__PURE__ */ t(((e, t) => {
	var n = Be();
	t.exports = (e, t) => {
		let r = n(e.trim().replace(/^[=v]+/, ""), t);
		return r ? r.version : null;
	};
})), Ue = /* @__PURE__ */ t(((e, t) => {
	var n = q();
	t.exports = (e, t, r, i, a) => {
		typeof r == "string" && (a = i, i = r, r = void 0);
		try {
			return new n(e instanceof n ? e.version : e, r).inc(t, i, a).version;
		} catch {
			return null;
		}
	};
})), We = /* @__PURE__ */ t(((e, t) => {
	var n = Be();
	t.exports = (e, t) => {
		let r = n(e, null, !0), i = n(t, null, !0), a = r.compare(i);
		if (a === 0) return null;
		let o = a > 0, s = o ? r : i, c = o ? i : r, l = !!s.prerelease.length;
		if (c.prerelease.length && !l) {
			if (!c.patch && !c.minor) return "major";
			if (c.compareMain(s) === 0) return c.minor && !c.patch ? "minor" : "patch";
		}
		let u = l ? "pre" : "";
		return r.major === i.major ? r.minor === i.minor ? r.patch === i.patch ? "prerelease" : u + "patch" : u + "minor" : u + "major";
	};
})), Ge = /* @__PURE__ */ t(((e, t) => {
	var n = q();
	t.exports = (e, t) => new n(e, t).major;
})), Ke = /* @__PURE__ */ t(((e, t) => {
	var n = q();
	t.exports = (e, t) => new n(e, t).minor;
})), qe = /* @__PURE__ */ t(((e, t) => {
	var n = q();
	t.exports = (e, t) => new n(e, t).patch;
})), Je = /* @__PURE__ */ t(((e, t) => {
	var n = Be();
	t.exports = (e, t) => {
		let r = n(e, t);
		return r && r.prerelease.length ? r.prerelease : null;
	};
})), J = /* @__PURE__ */ t(((e, t) => {
	var n = q();
	t.exports = (e, t, r) => new n(e, r).compare(new n(t, r));
})), Y = /* @__PURE__ */ t(((e, t) => {
	var n = J();
	t.exports = (e, t, r) => n(t, e, r);
})), Ye = /* @__PURE__ */ t(((e, t) => {
	var n = J();
	t.exports = (e, t) => n(e, t, !0);
})), Xe = /* @__PURE__ */ t(((e, t) => {
	var n = q();
	t.exports = (e, t, r) => {
		let i = new n(e, r), a = new n(t, r);
		return i.compare(a) || i.compareBuild(a);
	};
})), Ze = /* @__PURE__ */ t(((e, t) => {
	var n = Xe();
	t.exports = (e, t) => e.sort((e, r) => n(e, r, t));
})), Qe = /* @__PURE__ */ t(((e, t) => {
	var n = Xe();
	t.exports = (e, t) => e.sort((e, r) => n(r, e, t));
})), $e = /* @__PURE__ */ t(((e, t) => {
	var n = J();
	t.exports = (e, t, r) => n(e, t, r) > 0;
})), X = /* @__PURE__ */ t(((e, t) => {
	var n = J();
	t.exports = (e, t, r) => n(e, t, r) < 0;
})), et = /* @__PURE__ */ t(((e, t) => {
	var n = J();
	t.exports = (e, t, r) => n(e, t, r) === 0;
})), tt = /* @__PURE__ */ t(((e, t) => {
	var n = J();
	t.exports = (e, t, r) => n(e, t, r) !== 0;
})), nt = /* @__PURE__ */ t(((e, t) => {
	var n = J();
	t.exports = (e, t, r) => n(e, t, r) >= 0;
})), rt = /* @__PURE__ */ t(((e, t) => {
	var n = J();
	t.exports = (e, t, r) => n(e, t, r) <= 0;
})), it = /* @__PURE__ */ t(((e, t) => {
	var n = et(), r = tt(), i = $e(), a = nt(), o = X(), s = rt();
	t.exports = (e, t, c, l) => {
		switch (t) {
			case "===": return typeof e == "object" && (e = e.version), typeof c == "object" && (c = c.version), e === c;
			case "!==": return typeof e == "object" && (e = e.version), typeof c == "object" && (c = c.version), e !== c;
			case "":
			case "=":
			case "==": return n(e, c, l);
			case "!=": return r(e, c, l);
			case ">": return i(e, c, l);
			case ">=": return a(e, c, l);
			case "<": return o(e, c, l);
			case "<=": return s(e, c, l);
			default: throw TypeError(`Invalid operator: ${t}`);
		}
	};
})), at = /* @__PURE__ */ t(((e, t) => {
	var n = q(), r = Be(), { safeRe: i, t: a } = K();
	t.exports = (e, t) => {
		if (e instanceof n) return e;
		if (typeof e == "number" && (e = String(e)), typeof e != "string") return null;
		t ||= {};
		let o = null;
		if (!t.rtl) o = e.match(t.includePrerelease ? i[a.COERCEFULL] : i[a.COERCE]);
		else {
			let n = t.includePrerelease ? i[a.COERCERTLFULL] : i[a.COERCERTL], r;
			for (; (r = n.exec(e)) && (!o || o.index + o[0].length !== e.length);) (!o || r.index + r[0].length !== o.index + o[0].length) && (o = r), n.lastIndex = r.index + r[1].length + r[2].length;
			n.lastIndex = -1;
		}
		if (o === null) return null;
		let s = o[2];
		return r(`${s}.${o[3] || "0"}.${o[4] || "0"}${t.includePrerelease && o[5] ? `-${o[5]}` : ""}${t.includePrerelease && o[6] ? `+${o[6]}` : ""}`, t);
	};
})), ot = /* @__PURE__ */ t(((e, t) => {
	t.exports = class {
		constructor() {
			this.max = 1e3, this.map = /* @__PURE__ */ new Map();
		}
		get(e) {
			let t = this.map.get(e);
			if (t !== void 0) return this.map.delete(e), this.map.set(e, t), t;
		}
		delete(e) {
			return this.map.delete(e);
		}
		set(e, t) {
			if (!this.delete(e) && t !== void 0) {
				if (this.map.size >= this.max) {
					let e = this.map.keys().next().value;
					this.delete(e);
				}
				this.map.set(e, t);
			}
			return this;
		}
	};
})), Z = /* @__PURE__ */ t(((e, t) => {
	var n = /\s+/g;
	t.exports = class e {
		constructor(t, r) {
			if (r = i(r), t instanceof e) return t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease ? t : new e(t.raw, r);
			if (t instanceof a) return this.raw = t.value, this.set = [[t]], this.formatted = void 0, this;
			if (this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease, this.raw = t.trim().replace(n, " "), this.set = this.raw.split("||").map((e) => this.parseRange(e.trim())).filter((e) => e.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
			if (this.set.length > 1) {
				let e = this.set[0];
				if (this.set = this.set.filter((e) => !h(e[0])), this.set.length === 0) this.set = [e];
				else if (this.set.length > 1) {
					for (let e of this.set) if (e.length === 1 && g(e[0])) {
						this.set = [e];
						break;
					}
				}
			}
			this.formatted = void 0;
		}
		get range() {
			if (this.formatted === void 0) {
				this.formatted = "";
				for (let e = 0; e < this.set.length; e++) {
					e > 0 && (this.formatted += "||");
					let t = this.set[e];
					for (let e = 0; e < t.length; e++) e > 0 && (this.formatted += " "), this.formatted += t[e].toString().trim();
				}
			}
			return this.formatted;
		}
		format() {
			return this.range;
		}
		toString() {
			return this.range;
		}
		parseRange(e) {
			let t = ((this.options.includePrerelease && p) | (this.options.loose && m)) + ":" + e, n = r.get(t);
			if (n) return n;
			let i = this.options.loose, s = i ? c[l.HYPHENRANGELOOSE] : c[l.HYPHENRANGE];
			e = e.replace(s, O(this.options.includePrerelease)), o("hyphen replace", e), e = e.replace(c[l.COMPARATORTRIM], u), o("comparator trim", e), e = e.replace(c[l.TILDETRIM], d), o("tilde trim", e), e = e.replace(c[l.CARETTRIM], f), o("caret trim", e);
			let g = e.split(" ").map((e) => v(e, this.options)).join(" ").split(/\s+/).map((e) => D(e, this.options));
			i && (g = g.filter((e) => (o("loose invalid filter", e, this.options), !!e.match(c[l.COMPARATORLOOSE])))), o("range list", g);
			let _ = /* @__PURE__ */ new Map(), y = g.map((e) => new a(e, this.options));
			for (let e of y) {
				if (h(e)) return [e];
				_.set(e.value, e);
			}
			_.size > 1 && _.has("") && _.delete("");
			let b = [..._.values()];
			return r.set(t, b), b;
		}
		intersects(t, n) {
			if (!(t instanceof e)) throw TypeError("a Range is required");
			return this.set.some((e) => _(e, n) && t.set.some((t) => _(t, n) && e.every((e) => t.every((t) => e.intersects(t, n)))));
		}
		test(e) {
			if (!e) return !1;
			if (typeof e == "string") try {
				e = new s(e, this.options);
			} catch {
				return !1;
			}
			for (let t = 0; t < this.set.length; t++) if (k(this.set[t], e, this.options)) return !0;
			return !1;
		}
	};
	var r = new (ot())(), i = Re(), a = Q(), o = Le(), s = q(), { safeRe: c, t: l, comparatorTrimReplace: u, tildeTrimReplace: d, caretTrimReplace: f } = K(), { FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: m } = Ie(), h = (e) => e.value === "<0.0.0-0", g = (e) => e.value === "", _ = (e, t) => {
		let n = !0, r = e.slice(), i = r.pop();
		for (; n && r.length;) n = r.every((e) => i.intersects(e, t)), i = r.pop();
		return n;
	}, v = (e, t) => (e = e.replace(c[l.BUILD], ""), o("comp", e, t), e = S(e, t), o("caret", e), e = b(e, t), o("tildes", e), e = w(e, t), o("xrange", e), e = E(e, t), o("stars", e), e), y = (e) => !e || e.toLowerCase() === "x" || e === "*", b = (e, t) => e.trim().split(/\s+/).map((e) => x(e, t)).join(" "), x = (e, t) => {
		let n = t.loose ? c[l.TILDELOOSE] : c[l.TILDE];
		return e.replace(n, (t, n, r, i, a) => {
			o("tilde", e, t, n, r, i, a);
			let s;
			return y(n) ? s = "" : y(r) ? s = `>=${n}.0.0 <${+n + 1}.0.0-0` : y(i) ? s = `>=${n}.${r}.0 <${n}.${+r + 1}.0-0` : a ? (o("replaceTilde pr", a), s = `>=${n}.${r}.${i}-${a} <${n}.${+r + 1}.0-0`) : s = `>=${n}.${r}.${i} <${n}.${+r + 1}.0-0`, o("tilde return", s), s;
		});
	}, S = (e, t) => e.trim().split(/\s+/).map((e) => C(e, t)).join(" "), C = (e, t) => {
		o("caret", e, t);
		let n = t.loose ? c[l.CARETLOOSE] : c[l.CARET], r = t.includePrerelease ? "-0" : "";
		return e.replace(n, (t, n, i, a, s) => {
			o("caret", e, t, n, i, a, s);
			let c;
			return y(n) ? c = "" : y(i) ? c = `>=${n}.0.0${r} <${+n + 1}.0.0-0` : y(a) ? c = n === "0" ? `>=${n}.${i}.0${r} <${n}.${+i + 1}.0-0` : `>=${n}.${i}.0${r} <${+n + 1}.0.0-0` : s ? (o("replaceCaret pr", s), c = n === "0" ? i === "0" ? `>=${n}.${i}.${a}-${s} <${n}.${i}.${+a + 1}-0` : `>=${n}.${i}.${a}-${s} <${n}.${+i + 1}.0-0` : `>=${n}.${i}.${a}-${s} <${+n + 1}.0.0-0`) : (o("no pr"), c = n === "0" ? i === "0" ? `>=${n}.${i}.${a}${r} <${n}.${i}.${+a + 1}-0` : `>=${n}.${i}.${a}${r} <${n}.${+i + 1}.0-0` : `>=${n}.${i}.${a} <${+n + 1}.0.0-0`), o("caret return", c), c;
		});
	}, w = (e, t) => (o("replaceXRanges", e, t), e.split(/\s+/).map((e) => T(e, t)).join(" ")), T = (e, t) => {
		e = e.trim();
		let n = t.loose ? c[l.XRANGELOOSE] : c[l.XRANGE];
		return e.replace(n, (n, r, i, a, s, c) => {
			o("xRange", e, n, r, i, a, s, c);
			let l = y(i), u = l || y(a), d = u || y(s), f = d;
			return r === "=" && f && (r = ""), c = t.includePrerelease ? "-0" : "", l ? n = r === ">" || r === "<" ? "<0.0.0-0" : "*" : r && f ? (u && (a = 0), s = 0, r === ">" ? (r = ">=", u ? (i = +i + 1, a = 0, s = 0) : (a = +a + 1, s = 0)) : r === "<=" && (r = "<", u ? i = +i + 1 : a = +a + 1), r === "<" && (c = "-0"), n = `${r + i}.${a}.${s}${c}`) : u ? n = `>=${i}.0.0${c} <${+i + 1}.0.0-0` : d && (n = `>=${i}.${a}.0${c} <${i}.${+a + 1}.0-0`), o("xRange return", n), n;
		});
	}, E = (e, t) => (o("replaceStars", e, t), e.trim().replace(c[l.STAR], "")), D = (e, t) => (o("replaceGTE0", e, t), e.trim().replace(c[t.includePrerelease ? l.GTE0PRE : l.GTE0], "")), O = (e) => (t, n, r, i, a, o, s, c, l, u, d, f) => (n = y(r) ? "" : y(i) ? `>=${r}.0.0${e ? "-0" : ""}` : y(a) ? `>=${r}.${i}.0${e ? "-0" : ""}` : o ? `>=${n}` : `>=${n}${e ? "-0" : ""}`, c = y(l) ? "" : y(u) ? `<${+l + 1}.0.0-0` : y(d) ? `<${l}.${+u + 1}.0-0` : f ? `<=${l}.${u}.${d}-${f}` : e ? `<${l}.${u}.${+d + 1}-0` : `<=${c}`, `${n} ${c}`.trim()), k = (e, t, n) => {
		for (let n = 0; n < e.length; n++) if (!e[n].test(t)) return !1;
		if (t.prerelease.length && !n.includePrerelease) {
			for (let n = 0; n < e.length; n++) if (o(e[n].semver), e[n].semver !== a.ANY && e[n].semver.prerelease.length > 0) {
				let r = e[n].semver;
				if (r.major === t.major && r.minor === t.minor && r.patch === t.patch) return !0;
			}
			return !1;
		}
		return !0;
	};
})), Q = /* @__PURE__ */ t(((e, t) => {
	var n = Symbol("SemVer ANY");
	t.exports = class e {
		static get ANY() {
			return n;
		}
		constructor(t, i) {
			if (i = r(i), t instanceof e) {
				if (t.loose === !!i.loose) return t;
				t = t.value;
			}
			t = t.trim().split(/\s+/).join(" "), s("comparator", t, i), this.options = i, this.loose = !!i.loose, this.parse(t), this.semver === n ? this.value = "" : this.value = this.operator + this.semver.version, s("comp", this);
		}
		parse(e) {
			let t = this.options.loose ? i[a.COMPARATORLOOSE] : i[a.COMPARATOR], r = e.match(t);
			if (!r) throw TypeError(`Invalid comparator: ${e}`);
			this.operator = r[1] === void 0 ? "" : r[1], this.operator === "=" && (this.operator = ""), r[2] ? this.semver = new c(r[2], this.options.loose) : this.semver = n;
		}
		toString() {
			return this.value;
		}
		test(e) {
			if (s("Comparator.test", e, this.options.loose), this.semver === n || e === n) return !0;
			if (typeof e == "string") try {
				e = new c(e, this.options);
			} catch {
				return !1;
			}
			return o(e, this.operator, this.semver, this.options);
		}
		intersects(t, n) {
			if (!(t instanceof e)) throw TypeError("a Comparator is required");
			return this.operator === "" ? this.value === "" ? !0 : new l(t.value, n).test(this.value) : t.operator === "" ? t.value === "" ? !0 : new l(this.value, n).test(t.semver) : (n = r(n), n.includePrerelease && (this.value === "<0.0.0-0" || t.value === "<0.0.0-0") || !n.includePrerelease && (this.value.startsWith("<0.0.0") || t.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && t.operator.startsWith(">") || this.operator.startsWith("<") && t.operator.startsWith("<") || this.semver.version === t.semver.version && this.operator.includes("=") && t.operator.includes("=") || o(this.semver, "<", t.semver, n) && this.operator.startsWith(">") && t.operator.startsWith("<") || o(this.semver, ">", t.semver, n) && this.operator.startsWith("<") && t.operator.startsWith(">")));
		}
	};
	var r = Re(), { safeRe: i, t: a } = K(), o = it(), s = Le(), c = q(), l = Z();
})), st = /* @__PURE__ */ t(((e, t) => {
	var n = Z();
	t.exports = (e, t, r) => {
		try {
			t = new n(t, r);
		} catch {
			return !1;
		}
		return t.test(e);
	};
})), ct = /* @__PURE__ */ t(((e, t) => {
	var n = Z();
	t.exports = (e, t) => new n(e, t).set.map((e) => e.map((e) => e.value).join(" ").trim().split(" "));
})), lt = /* @__PURE__ */ t(((e, t) => {
	var n = q(), r = Z();
	t.exports = (e, t, i) => {
		let a = null, o = null, s = null;
		try {
			s = new r(t, i);
		} catch {
			return null;
		}
		return e.forEach((e) => {
			s.test(e) && (!a || o.compare(e) === -1) && (a = e, o = new n(a, i));
		}), a;
	};
})), ut = /* @__PURE__ */ t(((e, t) => {
	var n = q(), r = Z();
	t.exports = (e, t, i) => {
		let a = null, o = null, s = null;
		try {
			s = new r(t, i);
		} catch {
			return null;
		}
		return e.forEach((e) => {
			s.test(e) && (!a || o.compare(e) === 1) && (a = e, o = new n(a, i));
		}), a;
	};
})), dt = /* @__PURE__ */ t(((e, t) => {
	var n = q(), r = Z(), i = $e();
	t.exports = (e, t) => {
		e = new r(e, t);
		let a = new n("0.0.0");
		if (e.test(a) || (a = new n("0.0.0-0"), e.test(a))) return a;
		a = null;
		for (let t = 0; t < e.set.length; ++t) {
			let r = e.set[t], o = null;
			r.forEach((e) => {
				let t = new n(e.semver.version);
				switch (e.operator) {
					case ">": t.prerelease.length === 0 ? t.patch++ : t.prerelease.push(0), t.raw = t.format();
					case "":
					case ">=":
						(!o || i(t, o)) && (o = t);
						break;
					case "<":
					case "<=": break;
					/* istanbul ignore next */
					default: throw Error(`Unexpected operation: ${e.operator}`);
				}
			}), o && (!a || i(a, o)) && (a = o);
		}
		return a && e.test(a) ? a : null;
	};
})), ft = /* @__PURE__ */ t(((e, t) => {
	var n = Z();
	t.exports = (e, t) => {
		try {
			return new n(e, t).range || "*";
		} catch {
			return null;
		}
	};
})), pt = /* @__PURE__ */ t(((e, t) => {
	var n = q(), r = Q(), { ANY: i } = r, a = Z(), o = st(), s = $e(), c = X(), l = rt(), u = nt();
	t.exports = (e, t, d, f) => {
		e = new n(e, f), t = new a(t, f);
		let p, m, h, g, _;
		switch (d) {
			case ">":
				p = s, m = l, h = c, g = ">", _ = ">=";
				break;
			case "<":
				p = c, m = u, h = s, g = "<", _ = "<=";
				break;
			default: throw TypeError("Must provide a hilo val of \"<\" or \">\"");
		}
		if (o(e, t, f)) return !1;
		for (let n = 0; n < t.set.length; ++n) {
			let a = t.set[n], o = null, s = null;
			if (a.forEach((e) => {
				e.semver === i && (e = new r(">=0.0.0")), o ||= e, s ||= e, p(e.semver, o.semver, f) ? o = e : h(e.semver, s.semver, f) && (s = e);
			}), o.operator === g || o.operator === _ || (!s.operator || s.operator === g) && m(e, s.semver) || s.operator === _ && h(e, s.semver)) return !1;
		}
		return !0;
	};
})), mt = /* @__PURE__ */ t(((e, t) => {
	var n = pt();
	t.exports = (e, t, r) => n(e, t, ">", r);
})), ht = /* @__PURE__ */ t(((e, t) => {
	var n = pt();
	t.exports = (e, t, r) => n(e, t, "<", r);
})), gt = /* @__PURE__ */ t(((e, t) => {
	var n = Z();
	t.exports = (e, t, r) => (e = new n(e, r), t = new n(t, r), e.intersects(t, r));
})), _t = /* @__PURE__ */ t(((e, t) => {
	var n = st(), r = J();
	t.exports = (e, t, i) => {
		let a = [], o = null, s = null, c = e.sort((e, t) => r(e, t, i));
		for (let e of c) n(e, t, i) ? (s = e, o ||= e) : (s && a.push([o, s]), s = null, o = null);
		o && a.push([o, null]);
		let l = [];
		for (let [e, t] of a) e === t ? l.push(e) : !t && e === c[0] ? l.push("*") : t ? e === c[0] ? l.push(`<=${t}`) : l.push(`${e} - ${t}`) : l.push(`>=${e}`);
		let u = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
		return u.length < d.length ? u : t;
	};
})), vt = /* @__PURE__ */ t(((e, t) => {
	var n = Z(), r = Q(), { ANY: i } = r, a = st(), o = J(), s = (e, t, r = {}) => {
		if (e === t) return !0;
		e = new n(e, r), t = new n(t, r);
		let i = !1;
		OUTER: for (let n of e.set) {
			for (let e of t.set) {
				let t = u(n, e, r);
				if (i ||= t !== null, t) continue OUTER;
			}
			if (i) return !1;
		}
		return !0;
	}, c = [new r(">=0.0.0-0")], l = [new r(">=0.0.0")], u = (e, t, n) => {
		if (e === t) return !0;
		if (e.length === 1 && e[0].semver === i) {
			if (t.length === 1 && t[0].semver === i) return !0;
			e = n.includePrerelease ? c : l;
		}
		if (t.length === 1 && t[0].semver === i) {
			if (n.includePrerelease) return !0;
			t = l;
		}
		let r = /* @__PURE__ */ new Set(), s, u;
		for (let t of e) t.operator === ">" || t.operator === ">=" ? s = d(s, t, n) : t.operator === "<" || t.operator === "<=" ? u = f(u, t, n) : r.add(t.semver);
		if (r.size > 1) return null;
		let p;
		if (s && u && (p = o(s.semver, u.semver, n), p > 0 || p === 0 && (s.operator !== ">=" || u.operator !== "<="))) return null;
		for (let e of r) {
			if (s && !a(e, String(s), n) || u && !a(e, String(u), n)) return null;
			for (let r of t) if (!a(e, String(r), n)) return !1;
			return !0;
		}
		let m, h, g, _, v = u && !n.includePrerelease && u.semver.prerelease.length ? u.semver : !1, y = s && !n.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
		v && v.prerelease.length === 1 && u.operator === "<" && v.prerelease[0] === 0 && (v = !1);
		for (let e of t) {
			if (_ = _ || e.operator === ">" || e.operator === ">=", g = g || e.operator === "<" || e.operator === "<=", s) {
				if (y && e.semver.prerelease && e.semver.prerelease.length && e.semver.major === y.major && e.semver.minor === y.minor && e.semver.patch === y.patch && (y = !1), e.operator === ">" || e.operator === ">=") {
					if (m = d(s, e, n), m === e && m !== s) return !1;
				} else if (s.operator === ">=" && !a(s.semver, String(e), n)) return !1;
			}
			if (u) {
				if (v && e.semver.prerelease && e.semver.prerelease.length && e.semver.major === v.major && e.semver.minor === v.minor && e.semver.patch === v.patch && (v = !1), e.operator === "<" || e.operator === "<=") {
					if (h = f(u, e, n), h === e && h !== u) return !1;
				} else if (u.operator === "<=" && !a(u.semver, String(e), n)) return !1;
			}
			if (!e.operator && (u || s) && p !== 0) return !1;
		}
		return !(s && g && !u && p !== 0 || u && _ && !s && p !== 0 || y || v);
	}, d = (e, t, n) => {
		if (!e) return t;
		let r = o(e.semver, t.semver, n);
		return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
	}, f = (e, t, n) => {
		if (!e) return t;
		let r = o(e.semver, t.semver, n);
		return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
	};
	t.exports = s;
})), yt = /* @__PURE__ */ t(((e, t) => {
	var n = K(), r = Ie(), i = q(), a = ze();
	t.exports = {
		parse: Be(),
		valid: Ve(),
		clean: He(),
		inc: Ue(),
		diff: We(),
		major: Ge(),
		minor: Ke(),
		patch: qe(),
		prerelease: Je(),
		compare: J(),
		rcompare: Y(),
		compareLoose: Ye(),
		compareBuild: Xe(),
		sort: Ze(),
		rsort: Qe(),
		gt: $e(),
		lt: X(),
		eq: et(),
		neq: tt(),
		gte: nt(),
		lte: rt(),
		cmp: it(),
		coerce: at(),
		Comparator: Q(),
		Range: Z(),
		satisfies: st(),
		toComparators: ct(),
		maxSatisfying: lt(),
		minSatisfying: ut(),
		minVersion: dt(),
		validRange: ft(),
		outside: pt(),
		gtr: mt(),
		ltr: ht(),
		intersects: gt(),
		simplifyRange: _t(),
		subset: vt(),
		SemVer: i,
		re: n.re,
		src: n.src,
		tokens: n.t,
		SEMVER_SPEC_VERSION: r.SEMVER_SPEC_VERSION,
		RELEASE_TYPES: r.RELEASE_TYPES,
		compareIdentifiers: a.compareIdentifiers,
		rcompareIdentifiers: a.rcompareIdentifiers
	};
})), bt = /* @__PURE__ */ t(((e, t) => {
	var n = 200, r = "__lodash_hash_undefined__", i = 1, a = 2, o = 9007199254740991, s = "[object Arguments]", c = "[object Array]", l = "[object AsyncFunction]", u = "[object Boolean]", d = "[object Date]", f = "[object Error]", p = "[object Function]", m = "[object GeneratorFunction]", h = "[object Map]", g = "[object Number]", _ = "[object Null]", v = "[object Object]", y = "[object Promise]", b = "[object Proxy]", x = "[object RegExp]", S = "[object Set]", C = "[object String]", w = "[object Symbol]", T = "[object Undefined]", E = "[object WeakMap]", D = "[object ArrayBuffer]", O = "[object DataView]", k = "[object Float32Array]", ee = "[object Float64Array]", te = "[object Int8Array]", A = "[object Int16Array]", j = "[object Int32Array]", M = "[object Uint8Array]", N = "[object Uint8ClampedArray]", P = "[object Uint16Array]", ne = "[object Uint32Array]", F = /[\\^$.*+?()[\]{}|]/g, re = /^\[object .+?Constructor\]$/, I = /^(?:0|[1-9]\d*)$/, L = {};
	L[k] = L[ee] = L[te] = L[A] = L[j] = L[M] = L[N] = L[P] = L[ne] = !0, L[s] = L[c] = L[D] = L[u] = L[O] = L[d] = L[f] = L[p] = L[h] = L[g] = L[v] = L[x] = L[S] = L[C] = L[E] = !1;
	var R = typeof global == "object" && global && global.Object === Object && global, z = typeof self == "object" && self && self.Object === Object && self, B = R || z || Function("return this")(), ie = typeof e == "object" && e && !e.nodeType && e, V = ie && typeof t == "object" && t && !t.nodeType && t, ae = V && V.exports === ie, oe = ae && R.process, se = function() {
		try {
			return oe && oe.binding && oe.binding("util");
		} catch {}
	}(), ce = se && se.isTypedArray;
	function le(e, t) {
		for (var n = -1, r = e == null ? 0 : e.length, i = 0, a = []; ++n < r;) {
			var o = e[n];
			t(o, n, e) && (a[i++] = o);
		}
		return a;
	}
	function ue(e, t) {
		for (var n = -1, r = t.length, i = e.length; ++n < r;) e[i + n] = t[n];
		return e;
	}
	function de(e, t) {
		for (var n = -1, r = e == null ? 0 : e.length; ++n < r;) if (t(e[n], n, e)) return !0;
		return !1;
	}
	function fe(e, t) {
		for (var n = -1, r = Array(e); ++n < e;) r[n] = t(n);
		return r;
	}
	function H(e) {
		return function(t) {
			return e(t);
		};
	}
	function pe(e, t) {
		return e.has(t);
	}
	function me(e, t) {
		return e?.[t];
	}
	function he(e) {
		var t = -1, n = Array(e.size);
		return e.forEach(function(e, r) {
			n[++t] = [r, e];
		}), n;
	}
	function U(e, t) {
		return function(n) {
			return e(t(n));
		};
	}
	function ge(e) {
		var t = -1, n = Array(e.size);
		return e.forEach(function(e) {
			n[++t] = e;
		}), n;
	}
	var _e = Array.prototype, ve = Function.prototype, ye = Object.prototype, be = B["__core-js_shared__"], xe = ve.toString, W = ye.hasOwnProperty, Se = function() {
		var e = /[^.]+$/.exec(be && be.keys && be.keys.IE_PROTO || "");
		return e ? "Symbol(src)_1." + e : "";
	}(), Ce = ye.toString, we = RegExp("^" + xe.call(W).replace(F, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), G = ae ? B.Buffer : void 0, Te = B.Symbol, Ee = B.Uint8Array, De = ye.propertyIsEnumerable, Oe = _e.splice, ke = Te ? Te.toStringTag : void 0, Ae = Object.getOwnPropertySymbols, je = G ? G.isBuffer : void 0, Me = U(Object.keys, Object), Ne = $(B, "DataView"), Pe = $(B, "Map"), Fe = $(B, "Promise"), Ie = $(B, "Set"), Le = $(B, "WeakMap"), K = $(Object, "create"), Re = Ft(Ne), ze = Ft(Pe), q = Ft(Fe), Be = Ft(Ie), Ve = Ft(Le), He = Te ? Te.prototype : void 0, Ue = He ? He.valueOf : void 0;
	function We(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.clear(); ++t < n;) {
			var r = e[t];
			this.set(r[0], r[1]);
		}
	}
	function Ge() {
		this.__data__ = K ? K(null) : {}, this.size = 0;
	}
	function Ke(e) {
		var t = this.has(e) && delete this.__data__[e];
		return this.size -= +!!t, t;
	}
	function qe(e) {
		var t = this.__data__;
		if (K) {
			var n = t[e];
			return n === r ? void 0 : n;
		}
		return W.call(t, e) ? t[e] : void 0;
	}
	function Je(e) {
		var t = this.__data__;
		return K ? t[e] !== void 0 : W.call(t, e);
	}
	function J(e, t) {
		var n = this.__data__;
		return this.size += +!this.has(e), n[e] = K && t === void 0 ? r : t, this;
	}
	We.prototype.clear = Ge, We.prototype.delete = Ke, We.prototype.get = qe, We.prototype.has = Je, We.prototype.set = J;
	function Y(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.clear(); ++t < n;) {
			var r = e[t];
			this.set(r[0], r[1]);
		}
	}
	function Ye() {
		this.__data__ = [], this.size = 0;
	}
	function Xe(e) {
		var t = this.__data__, n = pt(t, e);
		return n < 0 ? !1 : (n == t.length - 1 ? t.pop() : Oe.call(t, n, 1), --this.size, !0);
	}
	function Ze(e) {
		var t = this.__data__, n = pt(t, e);
		return n < 0 ? void 0 : t[n][1];
	}
	function Qe(e) {
		return pt(this.__data__, e) > -1;
	}
	function $e(e, t) {
		var n = this.__data__, r = pt(n, e);
		return r < 0 ? (++this.size, n.push([e, t])) : n[r][1] = t, this;
	}
	Y.prototype.clear = Ye, Y.prototype.delete = Xe, Y.prototype.get = Ze, Y.prototype.has = Qe, Y.prototype.set = $e;
	function X(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.clear(); ++t < n;) {
			var r = e[t];
			this.set(r[0], r[1]);
		}
	}
	function et() {
		this.size = 0, this.__data__ = {
			hash: new We(),
			map: new (Pe || Y)(),
			string: new We()
		};
	}
	function tt(e) {
		var t = Et(this, e).delete(e);
		return this.size -= +!!t, t;
	}
	function nt(e) {
		return Et(this, e).get(e);
	}
	function rt(e) {
		return Et(this, e).has(e);
	}
	function it(e, t) {
		var n = Et(this, e), r = n.size;
		return n.set(e, t), this.size += n.size == r ? 0 : 1, this;
	}
	X.prototype.clear = et, X.prototype.delete = tt, X.prototype.get = nt, X.prototype.has = rt, X.prototype.set = it;
	function at(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.__data__ = new X(); ++t < n;) this.add(e[t]);
	}
	function ot(e) {
		return this.__data__.set(e, r), this;
	}
	function Z(e) {
		return this.__data__.has(e);
	}
	at.prototype.add = at.prototype.push = ot, at.prototype.has = Z;
	function Q(e) {
		var t = this.__data__ = new Y(e);
		this.size = t.size;
	}
	function st() {
		this.__data__ = new Y(), this.size = 0;
	}
	function ct(e) {
		var t = this.__data__, n = t.delete(e);
		return this.size = t.size, n;
	}
	function lt(e) {
		return this.__data__.get(e);
	}
	function ut(e) {
		return this.__data__.has(e);
	}
	function dt(e, t) {
		var r = this.__data__;
		if (r instanceof Y) {
			var i = r.__data__;
			if (!Pe || i.length < n - 1) return i.push([e, t]), this.size = ++r.size, this;
			r = this.__data__ = new X(i);
		}
		return r.set(e, t), this.size = r.size, this;
	}
	Q.prototype.clear = st, Q.prototype.delete = ct, Q.prototype.get = lt, Q.prototype.has = ut, Q.prototype.set = dt;
	function ft(e, t) {
		var n = Rt(e), r = !n && Lt(e), i = !n && !r && Bt(e), a = !n && !r && !i && Kt(e), o = n || r || i || a, s = o ? fe(e.length, String) : [], c = s.length;
		for (var l in e) (t || W.call(e, l)) && !(o && (l == "length" || i && (l == "offset" || l == "parent") || a && (l == "buffer" || l == "byteLength" || l == "byteOffset") || At(l, c))) && s.push(l);
		return s;
	}
	function pt(e, t) {
		for (var n = e.length; n--;) if (It(e[n][0], t)) return n;
		return -1;
	}
	function mt(e, t, n) {
		var r = t(e);
		return Rt(e) ? r : ue(r, n(e));
	}
	function ht(e) {
		return e == null ? e === void 0 ? T : _ : ke && ke in Object(e) ? Dt(e) : Pt(e);
	}
	function gt(e) {
		return Gt(e) && ht(e) == s;
	}
	function _t(e, t, n, r, i) {
		return e === t ? !0 : e == null || t == null || !Gt(e) && !Gt(t) ? e !== e && t !== t : vt(e, t, n, r, _t, i);
	}
	function vt(e, t, n, r, a, o) {
		var l = Rt(e), u = Rt(t), d = l ? c : kt(e), f = u ? c : kt(t);
		d = d == s ? v : d, f = f == s ? v : f;
		var p = d == v, m = f == v, h = d == f;
		if (h && Bt(e)) {
			if (!Bt(t)) return !1;
			l = !0, p = !1;
		}
		if (h && !p) return o ||= new Q(), l || Kt(e) ? St(e, t, n, r, a, o) : Ct(e, t, d, n, r, a, o);
		if (!(n & i)) {
			var g = p && W.call(e, "__wrapped__"), _ = m && W.call(t, "__wrapped__");
			if (g || _) {
				var y = g ? e.value() : e, b = _ ? t.value() : t;
				return o ||= new Q(), a(y, b, n, r, o);
			}
		}
		return h ? (o ||= new Q(), wt(e, t, n, r, a, o)) : !1;
	}
	function yt(e) {
		return !Wt(e) || Mt(e) ? !1 : (Ht(e) ? we : re).test(Ft(e));
	}
	function bt(e) {
		return Gt(e) && Ut(e.length) && !!L[ht(e)];
	}
	function xt(e) {
		if (!Nt(e)) return Me(e);
		var t = [];
		for (var n in Object(e)) W.call(e, n) && n != "constructor" && t.push(n);
		return t;
	}
	function St(e, t, n, r, o, s) {
		var c = n & i, l = e.length, u = t.length;
		if (l != u && !(c && u > l)) return !1;
		var d = s.get(e);
		if (d && s.get(t)) return d == t;
		var f = -1, p = !0, m = n & a ? new at() : void 0;
		for (s.set(e, t), s.set(t, e); ++f < l;) {
			var h = e[f], g = t[f];
			if (r) var _ = c ? r(g, h, f, t, e, s) : r(h, g, f, e, t, s);
			if (_ !== void 0) {
				if (_) continue;
				p = !1;
				break;
			}
			if (m) {
				if (!de(t, function(e, t) {
					if (!pe(m, t) && (h === e || o(h, e, n, r, s))) return m.push(t);
				})) {
					p = !1;
					break;
				}
			} else if (!(h === g || o(h, g, n, r, s))) {
				p = !1;
				break;
			}
		}
		return s.delete(e), s.delete(t), p;
	}
	function Ct(e, t, n, r, o, s, c) {
		switch (n) {
			case O:
				if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) return !1;
				e = e.buffer, t = t.buffer;
			case D: return !(e.byteLength != t.byteLength || !s(new Ee(e), new Ee(t)));
			case u:
			case d:
			case g: return It(+e, +t);
			case f: return e.name == t.name && e.message == t.message;
			case x:
			case C: return e == t + "";
			case h: var l = he;
			case S:
				var p = r & i;
				if (l ||= ge, e.size != t.size && !p) return !1;
				var m = c.get(e);
				if (m) return m == t;
				r |= a, c.set(e, t);
				var _ = St(l(e), l(t), r, o, s, c);
				return c.delete(e), _;
			case w: if (Ue) return Ue.call(e) == Ue.call(t);
		}
		return !1;
	}
	function wt(e, t, n, r, a, o) {
		var s = n & i, c = Tt(e), l = c.length;
		if (l != Tt(t).length && !s) return !1;
		for (var u = l; u--;) {
			var d = c[u];
			if (!(s ? d in t : W.call(t, d))) return !1;
		}
		var f = o.get(e);
		if (f && o.get(t)) return f == t;
		var p = !0;
		o.set(e, t), o.set(t, e);
		for (var m = s; ++u < l;) {
			d = c[u];
			var h = e[d], g = t[d];
			if (r) var _ = s ? r(g, h, d, t, e, o) : r(h, g, d, e, t, o);
			if (!(_ === void 0 ? h === g || a(h, g, n, r, o) : _)) {
				p = !1;
				break;
			}
			m ||= d == "constructor";
		}
		if (p && !m) {
			var v = e.constructor, y = t.constructor;
			v != y && "constructor" in e && "constructor" in t && !(typeof v == "function" && v instanceof v && typeof y == "function" && y instanceof y) && (p = !1);
		}
		return o.delete(e), o.delete(t), p;
	}
	function Tt(e) {
		return mt(e, qt, Ot);
	}
	function Et(e, t) {
		var n = e.__data__;
		return jt(t) ? n[typeof t == "string" ? "string" : "hash"] : n.map;
	}
	function $(e, t) {
		var n = me(e, t);
		return yt(n) ? n : void 0;
	}
	function Dt(e) {
		var t = W.call(e, ke), n = e[ke];
		try {
			e[ke] = void 0;
			var r = !0;
		} catch {}
		var i = Ce.call(e);
		return r && (t ? e[ke] = n : delete e[ke]), i;
	}
	var Ot = Ae ? function(e) {
		return e == null ? [] : (e = Object(e), le(Ae(e), function(t) {
			return De.call(e, t);
		}));
	} : Jt, kt = ht;
	(Ne && kt(new Ne(/* @__PURE__ */ new ArrayBuffer(1))) != O || Pe && kt(new Pe()) != h || Fe && kt(Fe.resolve()) != y || Ie && kt(new Ie()) != S || Le && kt(new Le()) != E) && (kt = function(e) {
		var t = ht(e), n = t == v ? e.constructor : void 0, r = n ? Ft(n) : "";
		if (r) switch (r) {
			case Re: return O;
			case ze: return h;
			case q: return y;
			case Be: return S;
			case Ve: return E;
		}
		return t;
	});
	function At(e, t) {
		return t ??= o, !!t && (typeof e == "number" || I.test(e)) && e > -1 && e % 1 == 0 && e < t;
	}
	function jt(e) {
		var t = typeof e;
		return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
	}
	function Mt(e) {
		return !!Se && Se in e;
	}
	function Nt(e) {
		var t = e && e.constructor;
		return e === (typeof t == "function" && t.prototype || ye);
	}
	function Pt(e) {
		return Ce.call(e);
	}
	function Ft(e) {
		if (e != null) {
			try {
				return xe.call(e);
			} catch {}
			try {
				return e + "";
			} catch {}
		}
		return "";
	}
	function It(e, t) {
		return e === t || e !== e && t !== t;
	}
	var Lt = gt(function() {
		return arguments;
	}()) ? gt : function(e) {
		return Gt(e) && W.call(e, "callee") && !De.call(e, "callee");
	}, Rt = Array.isArray;
	function zt(e) {
		return e != null && Ut(e.length) && !Ht(e);
	}
	var Bt = je || Yt;
	function Vt(e, t) {
		return _t(e, t);
	}
	function Ht(e) {
		if (!Wt(e)) return !1;
		var t = ht(e);
		return t == p || t == m || t == l || t == b;
	}
	function Ut(e) {
		return typeof e == "number" && e > -1 && e % 1 == 0 && e <= o;
	}
	function Wt(e) {
		var t = typeof e;
		return e != null && (t == "object" || t == "function");
	}
	function Gt(e) {
		return typeof e == "object" && !!e;
	}
	var Kt = ce ? H(ce) : bt;
	function qt(e) {
		return zt(e) ? ft(e) : xt(e);
	}
	function Jt() {
		return [];
	}
	function Yt() {
		return !1;
	}
	t.exports = Vt;
})), xt = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.DownloadedUpdateHelper = void 0, t.createTempUpdateFile = c;
	var n = e("crypto"), r = e("fs"), i = bt(), a = P(), o = e("path");
	t.DownloadedUpdateHelper = class {
		constructor(e) {
			this.cacheDir = e, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
		}
		get downloadedFileInfo() {
			return this._downloadedFileInfo;
		}
		get file() {
			return this._file;
		}
		get packageFile() {
			return this._packageFile;
		}
		get cacheDirForPendingUpdate() {
			return o.join(this.cacheDir, "pending");
		}
		async validateDownloadedPath(e, t, n, r) {
			if (this.versionInfo != null && this.file === e && this.fileInfo != null) return i(this.versionInfo, t) && i(this.fileInfo.info, n.info) && await (0, a.pathExists)(e) ? e : null;
			let o = await this.getValidCachedUpdateFile(n, r);
			return o === null ? null : (r.info(`Update has already been downloaded to ${e}).`), this._file = o, o);
		}
		async setDownloadedFile(e, t, n, r, i, o) {
			this._file = e, this._packageFile = t, this.versionInfo = n, this.fileInfo = r, this._downloadedFileInfo = {
				fileName: i,
				sha512: r.info.sha512,
				isAdminRightsRequired: r.info.isAdminRightsRequired === !0
			}, o && await (0, a.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
		}
		async clear() {
			this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
		}
		async cleanCacheDirForPendingUpdate() {
			try {
				await (0, a.emptyDir)(this.cacheDirForPendingUpdate);
			} catch {}
		}
		async getValidCachedUpdateFile(e, t) {
			let n = this.getUpdateInfoFile();
			if (!await (0, a.pathExists)(n)) return null;
			let r;
			try {
				r = await (0, a.readJson)(n);
			} catch (e) {
				let n = "No cached update info available";
				return e.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), n += ` (error on read: ${e.message})`), t.info(n), null;
			}
			if (r?.fileName === null) return t.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
			if (e.info.sha512 !== r.sha512) return t.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${r.sha512}, expected: ${e.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
			let i = o.join(this.cacheDirForPendingUpdate, r.fileName);
			if (!await (0, a.pathExists)(i)) return t.info("Cached update file doesn't exist"), null;
			let c = await s(i);
			return e.info.sha512 === c ? (this._downloadedFileInfo = r, i) : (t.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${e.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null);
		}
		getUpdateInfoFile() {
			return o.join(this.cacheDirForPendingUpdate, "update-info.json");
		}
	};
	function s(e, t = "sha512", i = "base64", a) {
		return new Promise((o, s) => {
			let c = (0, n.createHash)(t);
			c.on("error", s).setEncoding(i), (0, r.createReadStream)(e, {
				...a,
				highWaterMark: 1024 * 1024
			}).on("error", s).on("end", () => {
				c.end(), o(c.read());
			}).pipe(c, { end: !1 });
		});
	}
	async function c(e, t, n) {
		let r = 0, i = o.join(t, e);
		for (let s = 0; s < 3; s++) try {
			return await (0, a.unlink)(i), i;
		} catch (a) {
			if (a.code === "ENOENT") return i;
			n.warn(`Error on remove temp update file: ${a}`), i = o.join(t, `${r++}-${e}`);
		}
		return i;
	}
})), St = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.getAppCacheDir = i;
	var n = e("path"), r = e("os");
	function i() {
		let e = (0, r.homedir)(), t;
		return t = process.platform === "win32" ? process.env.LOCALAPPDATA || n.join(e, "AppData", "Local") : process.platform === "darwin" ? n.join(e, "Library", "Caches") : process.env.XDG_CACHE_HOME || n.join(e, ".cache"), t;
	}
})), Ct = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.ElectronAppAdapter = void 0;
	var n = e("path"), r = St();
	t.ElectronAppAdapter = class {
		constructor(t = e("electron").app) {
			this.app = t;
		}
		whenReady() {
			return this.app.whenReady();
		}
		get version() {
			return this.app.getVersion();
		}
		get name() {
			return this.app.getName();
		}
		get isPackaged() {
			return this.app.isPackaged === !0;
		}
		get appUpdateConfigPath() {
			return this.isPackaged ? n.join(process.resourcesPath, "app-update.yml") : n.join(this.app.getAppPath(), "dev-app-update.yml");
		}
		get userDataPath() {
			return this.app.getPath("userData");
		}
		get baseCachePath() {
			return (0, r.getAppCacheDir)();
		}
		quit() {
			this.app.quit();
		}
		relaunch() {
			this.app.relaunch();
		}
		onQuit(e) {
			this.app.once("quit", (t, n) => e(n));
		}
	};
})), wt = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.ElectronHttpExecutor = t.NET_SESSION_NAME = void 0, t.getNetSession = r;
	var n = H();
	t.NET_SESSION_NAME = "electron-updater";
	function r() {
		return e("electron").session.fromPartition(t.NET_SESSION_NAME, { cache: !1 });
	}
	t.ElectronHttpExecutor = class extends n.HttpExecutor {
		constructor(e) {
			super(), this.proxyLoginCallback = e, this.cachedSession = null;
		}
		async download(e, t, r) {
			return await r.cancellationToken.createPromise((i, a, o) => {
				let s = {
					headers: r.headers || void 0,
					redirect: "manual"
				};
				(0, n.configureRequestUrl)(e, s), (0, n.configureRequestOptions)(s), this.doDownload(s, {
					destination: t,
					options: r,
					onCancel: o,
					callback: (e) => {
						e == null ? i(t) : a(e);
					},
					responseHandler: null
				}, 0);
			});
		}
		createRequest(t, n) {
			t.headers && t.headers.Host && (t.host = t.headers.Host, delete t.headers.Host), this.cachedSession ??= r();
			let i = e("electron").net.request({
				...t,
				session: this.cachedSession
			});
			return i.on("response", n), this.proxyLoginCallback != null && i.on("login", this.proxyLoginCallback), i;
		}
		addRedirectHandlers(e, t, r, i, a) {
			e.on("redirect", (o, s, c) => {
				e.abort(), i > this.maxRedirects ? r(this.createMaxRedirectError()) : a(n.HttpExecutor.prepareRedirectUrlOptions(c, t));
			});
		}
	};
})), Tt = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.newBaseUrl = r, t.newUrlFromBase = i, t.getChannelFilename = a;
	var n = e("url");
	function r(e) {
		let t = new n.URL(e);
		return t.pathname.endsWith("/") || (t.pathname += "/"), t;
	}
	function i(e, t, r = !1) {
		let i = new n.URL(e, t), a = t.search;
		return a != null && a.length !== 0 ? i.search = a : r && (i.search = `noCache=${Date.now().toString(32)}`), i;
	}
	function a(e) {
		return `${e}.yml`;
	}
})), Et = /* @__PURE__ */ t(((e, t) => {
	var n = Infinity, r = "[object Symbol]", i = /[\\^$.*+?()[\]{}|]/g, a = RegExp(i.source), o = typeof global == "object" && global && global.Object === Object && global, s = typeof self == "object" && self && self.Object === Object && self, c = o || s || Function("return this")(), l = Object.prototype.toString, u = c.Symbol, d = u ? u.prototype : void 0, f = d ? d.toString : void 0;
	function p(e) {
		if (typeof e == "string") return e;
		if (h(e)) return f ? f.call(e) : "";
		var t = e + "";
		return t == "0" && 1 / e == -n ? "-0" : t;
	}
	function m(e) {
		return !!e && typeof e == "object";
	}
	function h(e) {
		return typeof e == "symbol" || m(e) && l.call(e) == r;
	}
	function g(e) {
		return e == null ? "" : p(e);
	}
	function _(e) {
		return e = g(e), e && a.test(e) ? e.replace(i, "\\$&") : e;
	}
	t.exports = _;
})), $ = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.Provider = void 0, t.findFile = s, t.parseUpdateInfo = c, t.getFileList = l, t.resolveFiles = u;
	var n = H(), r = Pe(), i = e("url"), a = Tt(), o = Et();
	t.Provider = class {
		constructor(e) {
			this.runtimeOptions = e, this.requestHeaders = null, this.executor = e.executor;
		}
		getBlockMapFiles(e, t, n, r = null) {
			let s = (0, a.newUrlFromBase)(`${e.pathname}.blockmap`, e);
			return [(0, a.newUrlFromBase)(`${e.pathname.replace(new RegExp(o(n), "g"), t)}.blockmap`, r ? new i.URL(r) : e), s];
		}
		get isUseMultipleRangeRequest() {
			return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
		}
		getChannelFilePrefix() {
			if (this.runtimeOptions.platform === "linux") {
				let e = process.env.TEST_UPDATER_ARCH || process.arch;
				return "-linux" + (e === "x64" ? "" : `-${e}`);
			} else return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
		}
		getDefaultChannelName() {
			return this.getCustomChannelName("latest");
		}
		getCustomChannelName(e) {
			return `${e}${this.getChannelFilePrefix()}`;
		}
		get fileExtraDownloadHeaders() {
			return null;
		}
		setRequestHeaders(e) {
			this.requestHeaders = e;
		}
		httpRequest(e, t, n) {
			return this.executor.request(this.createRequestOptions(e, t), n);
		}
		createRequestOptions(e, t) {
			let r = {};
			return this.requestHeaders == null ? t != null && (r.headers = t) : r.headers = t == null ? this.requestHeaders : {
				...this.requestHeaders,
				...t
			}, (0, n.configureRequestUrl)(e, r), r;
		}
	};
	function s(e, t, r) {
		if (e.length === 0) throw (0, n.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
		let i = e.filter((e) => e.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`));
		return (i.find((e) => [e.url.pathname, e.info.url].some((e) => e.includes(process.arch))) ?? i.shift()) || (r == null ? e[0] : e.find((e) => !r.some((t) => e.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`))));
	}
	function c(e, t, i) {
		if (e == null) throw (0, n.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${i}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
		let a;
		try {
			a = (0, r.load)(e);
		} catch (r) {
			throw (0, n.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${i}): ${r.stack || r.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
		}
		return a;
	}
	function l(e) {
		let t = e.files;
		if (t != null && t.length > 0) return t;
		if (e.path != null) return [{
			url: e.path,
			sha2: e.sha2,
			sha512: e.sha512
		}];
		throw (0, n.newError)(`No files provided: ${(0, n.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
	}
	function u(e, t, r = (e) => e) {
		let i = l(e).map((e) => {
			if (e.sha2 == null && e.sha512 == null) throw (0, n.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, n.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_CHECKSUM");
			return {
				url: (0, a.newUrlFromBase)(r(e.url), t),
				info: e
			};
		}), o = e.packages, s = o == null ? null : o[process.arch] || o.ia32;
		return s != null && (i[0].packageInfo = {
			...s,
			path: (0, a.newUrlFromBase)(r(s.path), t).href
		}), i;
	}
})), Dt = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.GenericProvider = void 0;
	var t = H(), n = Tt(), r = $();
	e.GenericProvider = class extends r.Provider {
		constructor(e, t, r) {
			super(r), this.configuration = e, this.updater = t, this.baseUrl = (0, n.newBaseUrl)(this.configuration.url);
		}
		get channel() {
			let e = this.updater.channel || this.configuration.channel;
			return e == null ? this.getDefaultChannelName() : this.getCustomChannelName(e);
		}
		async getLatestVersion() {
			let e = (0, n.getChannelFilename)(this.channel), i = (0, n.newUrlFromBase)(e, this.baseUrl, this.updater.isAddNoCacheQuery);
			for (let n = 0;; n++) try {
				return (0, r.parseUpdateInfo)(await this.httpRequest(i), e, i);
			} catch (r) {
				if (r instanceof t.HttpError && r.statusCode === 404) throw (0, t.newError)(`Cannot find channel "${e}" update info: ${r.stack || r.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
				if (r.code === "ECONNREFUSED" && n < 3) {
					await new Promise((e, t) => {
						try {
							setTimeout(e, 1e3 * n);
						} catch (e) {
							t(e);
						}
					});
					continue;
				}
				throw r;
			}
		}
		resolveFiles(e) {
			return (0, r.resolveFiles)(e, this.baseUrl);
		}
	};
})), Ot = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.BitbucketProvider = void 0;
	var t = H(), n = Tt(), r = $();
	e.BitbucketProvider = class extends r.Provider {
		constructor(e, t, r) {
			super({
				...r,
				isUseMultipleRangeRequest: !1
			}), this.configuration = e, this.updater = t;
			let { owner: i, slug: a } = e;
			this.baseUrl = (0, n.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${a}/downloads`);
		}
		get channel() {
			return this.updater.channel || this.configuration.channel || "latest";
		}
		async getLatestVersion() {
			let e = new t.CancellationToken(), i = (0, n.getChannelFilename)(this.getCustomChannelName(this.channel)), a = (0, n.newUrlFromBase)(i, this.baseUrl, this.updater.isAddNoCacheQuery);
			try {
				let t = await this.httpRequest(a, void 0, e);
				return (0, r.parseUpdateInfo)(t, i, a);
			} catch (e) {
				throw (0, t.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
		}
		resolveFiles(e) {
			return (0, r.resolveFiles)(e, this.baseUrl);
		}
		toString() {
			let { owner: e, slug: t } = this.configuration;
			return `Bitbucket (owner: ${e}, slug: ${t}, channel: ${this.channel})`;
		}
	};
})), kt = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.GitHubProvider = t.BaseGitHubProvider = void 0, t.computeReleaseNotes = u;
	var n = H(), r = yt(), i = e("url"), a = Tt(), o = $(), s = /\/tag\/([^/]+)$/, c = class extends o.Provider {
		constructor(e, t, r) {
			super({
				...r,
				isUseMultipleRangeRequest: !1
			}), this.options = e, this.baseUrl = (0, a.newBaseUrl)((0, n.githubUrl)(e, t));
			let i = t === "github.com" ? "api.github.com" : t;
			this.baseApiUrl = (0, a.newBaseUrl)((0, n.githubUrl)(e, i));
		}
		computeGithubBasePath(e) {
			let t = this.options.host;
			return t && !["github.com", "api.github.com"].includes(t) ? `/api/v3${e}` : e;
		}
	};
	t.BaseGitHubProvider = c, t.GitHubProvider = class extends c {
		constructor(e, t, n) {
			super(e, "github.com", n), this.options = e, this.updater = t;
		}
		get channel() {
			let e = this.updater.channel || this.options.channel;
			return e == null ? this.getDefaultChannelName() : this.getCustomChannelName(e);
		}
		async getLatestVersion() {
			let e = new n.CancellationToken(), t = await this.httpRequest((0, a.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), { accept: "application/xml, application/atom+xml, text/xml, */*" }, e), i = (0, n.parseXml)(t), c = i.element("entry", !1, "No published versions on GitHub"), l = null;
			try {
				if (this.updater.allowPrerelease) {
					let e = this.updater?.channel || r.prerelease(this.updater.currentVersion)?.[0] || null;
					if (e === null) l = s.exec(c.element("link").attribute("href"))[1];
					else for (let t of i.getElements("entry")) {
						let n = s.exec(t.element("link").attribute("href"));
						if (n === null) continue;
						let i = n[1], a = r.prerelease(i)?.[0] || null, o = !e || ["alpha", "beta"].includes(e), c = a !== null && !["alpha", "beta"].includes(String(a));
						if (o && !c && !(e === "beta" && a === "alpha")) {
							l = i;
							break;
						}
						if (a && a === e) {
							l = i;
							break;
						}
					}
				} else {
					l = await this.getLatestTagName(e);
					for (let e of i.getElements("entry")) if (s.exec(e.element("link").attribute("href"))[1] === l) {
						c = e;
						break;
					}
				}
			} catch (e) {
				throw (0, n.newError)(`Cannot parse releases feed: ${e.stack || e.message},\nXML:\n${t}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
			}
			if (l == null) throw (0, n.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
			let d, f = "", p = "", m = async (t) => {
				f = (0, a.getChannelFilename)(t), p = (0, a.newUrlFromBase)(this.getBaseDownloadPath(String(l), f), this.baseUrl);
				let r = this.createRequestOptions(p);
				try {
					return await this.executor.request(r, e);
				} catch (e) {
					throw e instanceof n.HttpError && e.statusCode === 404 ? (0, n.newError)(`Cannot find ${f} in the latest release artifacts (${p}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : e;
				}
			};
			try {
				let e = this.channel;
				this.updater.allowPrerelease && r.prerelease(l)?.[0] && (e = this.getCustomChannelName(String(r.prerelease(l)?.[0]))), d = await m(e);
			} catch (e) {
				if (this.updater.allowPrerelease) d = await m(this.getDefaultChannelName());
				else throw e;
			}
			let h = (0, o.parseUpdateInfo)(d, f, p);
			return h.releaseName ??= c.elementValueOrEmpty("title"), h.releaseNotes ??= u(this.updater.currentVersion, this.updater.fullChangelog, i, c), {
				tag: l,
				...h
			};
		}
		async getLatestTagName(e) {
			let t = this.options, r = t.host == null || t.host === "github.com" ? (0, a.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new i.URL(`${this.computeGithubBasePath(`/repos/${t.owner}/${t.repo}/releases`)}/latest`, this.baseApiUrl);
			try {
				let t = await this.httpRequest(r, { Accept: "application/json" }, e);
				return t == null ? null : JSON.parse(t).tag_name;
			} catch (e) {
				throw (0, n.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
		}
		get basePath() {
			return `/${this.options.owner}/${this.options.repo}/releases`;
		}
		resolveFiles(e) {
			return (0, o.resolveFiles)(e, this.baseUrl, (t) => this.getBaseDownloadPath(e.tag, t.replace(/ /g, "-")));
		}
		getBaseDownloadPath(e, t) {
			return `${this.basePath}/download/${e}/${t}`;
		}
	};
	function l(e) {
		let t = e.elementValueOrEmpty("content");
		return t === "No content." ? "" : t;
	}
	function u(e, t, n, i) {
		if (!t) return l(i);
		let a = [];
		for (let t of n.getElements("entry")) {
			let n = /\/tag\/v?([^/]+)$/.exec(t.element("link").attribute("href"))[1];
			r.valid(n) && r.lt(e, n) && a.push({
				version: n,
				note: l(t)
			});
		}
		return a.sort((e, t) => r.rcompare(e.version, t.version));
	}
})), At = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.GitLabProvider = void 0;
	var n = H(), r = e("url"), i = Et(), a = Tt(), o = $();
	t.GitLabProvider = class extends o.Provider {
		normalizeFilename(e) {
			return e.replace(/ |_/g, "-");
		}
		constructor(e, t, n) {
			super({
				...n,
				isUseMultipleRangeRequest: !1
			}), this.options = e, this.updater = t, this.cachedLatestVersion = null;
			let r = e.host || "gitlab.com";
			this.baseApiUrl = (0, a.newBaseUrl)(`https://${r}/api/v4`);
		}
		get channel() {
			let e = this.updater.channel || this.options.channel;
			return e == null ? this.getDefaultChannelName() : this.getCustomChannelName(e);
		}
		async getLatestVersion() {
			let e = new n.CancellationToken(), t = (0, a.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl), i;
			try {
				let r = {
					"Content-Type": "application/json",
					...this.setAuthHeaderForToken(this.options.token || null)
				}, a = await this.httpRequest(t, r, e);
				if (!a) throw (0, n.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
				i = JSON.parse(a);
			} catch (e) {
				throw (0, n.newError)(`Unable to find latest release on GitLab (${t}): ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
			let s = i.tag_name, c = null, l = "", u = null, d = async (t) => {
				l = (0, a.getChannelFilename)(t);
				let o = i.assets.links.find((e) => e.name === l);
				if (!o) throw (0, n.newError)(`Cannot find ${l} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
				u = new r.URL(o.direct_asset_url);
				let s = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
				try {
					let t = await this.httpRequest(u, s, e);
					if (!t) throw (0, n.newError)(`Empty response from ${u}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
					return t;
				} catch (e) {
					throw e instanceof n.HttpError && e.statusCode === 404 ? (0, n.newError)(`Cannot find ${l} in the latest release artifacts (${u}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : e;
				}
			};
			try {
				c = await d(this.channel);
			} catch (e) {
				if (this.channel !== this.getDefaultChannelName()) c = await d(this.getDefaultChannelName());
				else throw e;
			}
			if (!c) throw (0, n.newError)(`Unable to parse channel data from ${l}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
			let f = (0, o.parseUpdateInfo)(c, l, u);
			f.releaseName ??= i.name, f.releaseNotes ??= i.description || null;
			let p = /* @__PURE__ */ new Map();
			for (let e of i.assets.links) p.set(this.normalizeFilename(e.name), e.direct_asset_url);
			let m = {
				tag: s,
				assets: p,
				...f
			};
			return this.cachedLatestVersion = m, m;
		}
		convertAssetsToMap(e) {
			let t = /* @__PURE__ */ new Map();
			for (let n of e.links) t.set(this.normalizeFilename(n.name), n.direct_asset_url);
			return t;
		}
		findBlockMapInAssets(e, t) {
			let n = [`${t}.blockmap`, `${this.normalizeFilename(t)}.blockmap`];
			for (let t of n) {
				let n = e.get(t);
				if (n) return new r.URL(n);
			}
			return null;
		}
		async fetchReleaseInfoByVersion(e) {
			let t = new n.CancellationToken(), r = [`v${e}`, e];
			for (let e of r) {
				let r = (0, a.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(e)}`, this.baseApiUrl);
				try {
					let e = {
						"Content-Type": "application/json",
						...this.setAuthHeaderForToken(this.options.token || null)
					}, n = await this.httpRequest(r, e, t);
					if (n) return JSON.parse(n);
				} catch (t) {
					if (t instanceof n.HttpError && t.statusCode === 404) continue;
					throw (0, n.newError)(`Unable to find release ${e} on GitLab (${r}): ${t.stack || t.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
				}
			}
			throw (0, n.newError)(`Unable to find release with version ${e} (tried: ${r.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
		}
		setAuthHeaderForToken(e) {
			let t = {};
			return e != null && (e.startsWith("Bearer") ? t.authorization = e : t["PRIVATE-TOKEN"] = e), t;
		}
		async getVersionInfoForBlockMap(e) {
			if (this.cachedLatestVersion && this.cachedLatestVersion.version === e) return this.cachedLatestVersion.assets;
			let t = await this.fetchReleaseInfoByVersion(e);
			return t && t.assets ? this.convertAssetsToMap(t.assets) : null;
		}
		async findBlockMapUrlsFromAssets(e, t, n) {
			let r = null, a = null, o = await this.getVersionInfoForBlockMap(t);
			o && (r = this.findBlockMapInAssets(o, n));
			let s = await this.getVersionInfoForBlockMap(e);
			if (s) {
				let r = n.replace(new RegExp(i(t), "g"), e);
				a = this.findBlockMapInAssets(s, r);
			}
			return [a, r];
		}
		async getBlockMapFiles(e, t, r, i = null) {
			if (this.options.uploadTarget === "project_upload") {
				let i = e.pathname.split("/").pop() || "", [a, o] = await this.findBlockMapUrlsFromAssets(t, r, i);
				if (!o) throw (0, n.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
				if (!a) throw (0, n.newError)(`Cannot find blockmap file for ${t} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
				return [a, o];
			} else return super.getBlockMapFiles(e, t, r, i);
		}
		resolveFiles(e) {
			return (0, o.getFileList)(e).map((t) => {
				let i = [t.url, this.normalizeFilename(t.url)].find((t) => e.assets.has(t)), a = i ? e.assets.get(i) : void 0;
				if (!a) throw (0, n.newError)(`Cannot find asset "${t.url}" in GitLab release assets. Available assets: ${Array.from(e.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
				return {
					url: new r.URL(a),
					info: t
				};
			});
		}
		toString() {
			return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
		}
	};
})), jt = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.KeygenProvider = void 0;
	var t = H(), n = Tt(), r = $();
	e.KeygenProvider = class extends r.Provider {
		constructor(e, t, r) {
			super({
				...r,
				isUseMultipleRangeRequest: !1
			}), this.configuration = e, this.updater = t, this.defaultHostname = "api.keygen.sh";
			let i = this.configuration.host || this.defaultHostname;
			this.baseUrl = (0, n.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
		}
		get channel() {
			return this.updater.channel || this.configuration.channel || "stable";
		}
		async getLatestVersion() {
			let e = new t.CancellationToken(), i = (0, n.getChannelFilename)(this.getCustomChannelName(this.channel)), a = (0, n.newUrlFromBase)(i, this.baseUrl, this.updater.isAddNoCacheQuery);
			try {
				let t = await this.httpRequest(a, {
					Accept: "application/vnd.api+json",
					"Keygen-Version": "1.1"
				}, e);
				return (0, r.parseUpdateInfo)(t, i, a);
			} catch (e) {
				throw (0, t.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
		}
		resolveFiles(e) {
			return (0, r.resolveFiles)(e, this.baseUrl);
		}
		toString() {
			let { account: e, product: t, platform: n } = this.configuration;
			return `Keygen (account: ${e}, product: ${t}, platform: ${n}, channel: ${this.channel})`;
		}
	};
})), Mt = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.PrivateGitHubProvider = void 0;
	var n = H(), r = Pe(), i = e("path"), a = e("url"), o = Tt(), s = kt(), c = $();
	t.PrivateGitHubProvider = class extends s.BaseGitHubProvider {
		constructor(e, t, n, r) {
			super(e, "api.github.com", r), this.updater = t, this.token = n;
		}
		createRequestOptions(e, t) {
			let n = super.createRequestOptions(e, t);
			return n.redirect = "manual", n;
		}
		async getLatestVersion() {
			let e = new n.CancellationToken(), t = (0, o.getChannelFilename)(this.getDefaultChannelName()), i = await this.getLatestVersionInfo(e), s = i.assets.find((e) => e.name === t);
			if (s == null) throw (0, n.newError)(`Cannot find ${t} in the release ${i.html_url || i.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
			let c = new a.URL(s.url), l;
			try {
				l = (0, r.load)(await this.httpRequest(c, this.configureHeaders("application/octet-stream"), e));
			} catch (e) {
				throw e instanceof n.HttpError && e.statusCode === 404 ? (0, n.newError)(`Cannot find ${t} in the latest release artifacts (${c}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : e;
			}
			return l.assets = i.assets, l;
		}
		get fileExtraDownloadHeaders() {
			return this.configureHeaders("application/octet-stream");
		}
		configureHeaders(e) {
			return {
				accept: e,
				authorization: `token ${this.token}`
			};
		}
		async getLatestVersionInfo(e) {
			let t = this.updater.allowPrerelease, r = this.basePath;
			t || (r = `${r}/latest`);
			let i = (0, o.newUrlFromBase)(r, this.baseUrl);
			try {
				let n = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), e));
				return t ? n.find((e) => e.prerelease) || n[0] : n;
			} catch (e) {
				throw (0, n.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
		}
		get basePath() {
			return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
		}
		resolveFiles(e) {
			return (0, c.getFileList)(e).map((t) => {
				let r = i.posix.basename(t.url).replace(/ /g, "-"), o = e.assets.find((e) => e != null && e.name === r);
				if (o == null) throw (0, n.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(e.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
				return {
					url: new a.URL(o.url),
					info: t
				};
			});
		}
	};
})), Nt = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.isUrlProbablySupportMultiRangeRequests = c, e.createClient = l;
	var t = H(), n = Ot(), r = Dt(), i = kt(), a = At(), o = jt(), s = Mt();
	function c(e) {
		return !e.includes("s3.amazonaws.com");
	}
	function l(e, l, u) {
		if (typeof e == "string") throw (0, t.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
		let d = e.provider;
		switch (d) {
			case "github": {
				let t = e, n = (t.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || t.token;
				return n == null ? new i.GitHubProvider(t, l, u) : new s.PrivateGitHubProvider(t, l, n, u);
			}
			case "bitbucket": return new n.BitbucketProvider(e, l, u);
			case "gitlab": return new a.GitLabProvider(e, l, u);
			case "keygen": return new o.KeygenProvider(e, l, u);
			case "s3":
			case "spaces": return new r.GenericProvider({
				provider: "generic",
				url: (0, t.getS3LikeProviderBaseUrl)(e),
				channel: e.channel || null
			}, l, {
				...u,
				isUseMultipleRangeRequest: !1
			});
			case "generic": {
				let t = e;
				return new r.GenericProvider(t, l, {
					...u,
					isUseMultipleRangeRequest: t.useMultipleRangeRequest !== !1 && c(t.url)
				});
			}
			case "custom": {
				let n = e, r = n.updateProvider;
				if (!r) throw (0, t.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
				return new r(n, l, u);
			}
			default: throw (0, t.newError)(`Unsupported provider: ${d}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
		}
	}
})), Pt = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.OperationKind = void 0, e.computeOperations = n;
	var t;
	(function(e) {
		e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
	})(t || (e.OperationKind = t = {}));
	function n(e, n, r) {
		let s = o(e.files), c = o(n.files), l = null, u = n.files[0], d = [], f = u.name, p = s.get(f);
		if (p == null) throw Error(`no file ${f} in old blockmap`);
		let m = c.get(f), h = 0, { checksumToOffset: g, checksumToOldSize: _ } = a(s.get(f), p.offset, r), v = u.offset;
		for (let e = 0; e < m.checksums.length; v += m.sizes[e], e++) {
			let n = m.sizes[e], a = m.checksums[e], o = g.get(a);
			o != null && _.get(a) !== n && (r.warn(`Checksum ("${a}") matches, but size differs (old: ${_.get(a)}, new: ${n})`), o = void 0), o === void 0 ? (h++, l != null && l.kind === t.DOWNLOAD && l.end === v ? l.end += n : (l = {
				kind: t.DOWNLOAD,
				start: v,
				end: v + n
			}, i(l, d, a, e))) : l != null && l.kind === t.COPY && l.end === o ? l.end += n : (l = {
				kind: t.COPY,
				start: o,
				end: o + n
			}, i(l, d, a, e));
		}
		return h > 0 && r.info(`File${u.name === "file" ? "" : " " + u.name} has ${h} changed blocks`), d;
	}
	var r = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
	function i(e, n, i, a) {
		if (r && n.length !== 0) {
			let r = n[n.length - 1];
			if (r.kind === e.kind && e.start < r.end && e.start > r.start) {
				let n = [
					r.start,
					r.end,
					e.start,
					e.end
				].reduce((e, t) => e < t ? e : t);
				throw Error(`operation (block index: ${a}, checksum: ${i}, kind: ${t[e.kind]}) overlaps previous operation (checksum: ${i}):\nabs: ${r.start} until ${r.end} and ${e.start} until ${e.end}\nrel: ${r.start - n} until ${r.end - n} and ${e.start - n} until ${e.end - n}`);
			}
		}
		n.push(e);
	}
	function a(e, t, n) {
		let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = t;
		for (let t = 0; t < e.checksums.length; t++) {
			let o = e.checksums[t], s = e.sizes[t], c = i.get(o);
			if (c === void 0) r.set(o, a), i.set(o, s);
			else if (n.debug != null) {
				let e = c === s ? "(same size)" : `(size: ${c}, this size: ${s})`;
				n.debug(`${o} duplicated in blockmap ${e}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
			}
			a += s;
		}
		return {
			checksumToOffset: r,
			checksumToOldSize: i
		};
	}
	function o(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e) t.set(n.name, n);
		return t;
	}
})), Ft = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.DataSplitter = void 0, t.copyData = c;
	var n = H(), r = e("fs"), i = e("stream"), a = Pt(), o = Buffer.from("\r\n\r\n"), s;
	(function(e) {
		e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
	})(s ||= {});
	function c(e, t, n, i, a) {
		let o = (0, r.createReadStream)("", {
			fd: n,
			autoClose: !1,
			start: e.start,
			end: e.end - 1
		});
		o.on("error", i), o.once("end", a), o.pipe(t, { end: !1 });
	}
	t.DataSplitter = class extends i.Writable {
		constructor(e, t, n, r, i, a, o, c) {
			super(), this.out = e, this.options = t, this.partIndexToTaskIndex = n, this.partIndexToLength = i, this.finishHandler = a, this.grandTotalBytes = o, this.onProgress = c, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = s.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = r.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
		}
		get isFinished() {
			return this.partIndex === this.partIndexToLength.length;
		}
		_write(e, t, n) {
			if (this.isFinished) {
				console.error(`Trailing ignored data: ${e.length} bytes`);
				return;
			}
			this.handleData(e).then(() => {
				if (this.onProgress) {
					let e = Date.now();
					(e >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (e - this.start) / 1e3 && (this.nextUpdate = e + 1e3, this.onProgress({
						total: this.grandTotalBytes,
						delta: this.delta,
						transferred: this.transferred,
						percent: this.transferred / this.grandTotalBytes * 100,
						bytesPerSecond: Math.round(this.transferred / ((e - this.start) / 1e3))
					}), this.delta = 0);
				}
				n();
			}).catch(n);
		}
		async handleData(e) {
			let t = 0;
			if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0) throw (0, n.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
			if (this.ignoreByteCount > 0) {
				let n = Math.min(this.ignoreByteCount, e.length);
				this.ignoreByteCount -= n, t = n;
			} else if (this.remainingPartDataCount > 0) {
				let n = Math.min(this.remainingPartDataCount, e.length);
				this.remainingPartDataCount -= n, await this.processPartData(e, 0, n), t = n;
			}
			if (t !== e.length) {
				if (this.readState === s.HEADER) {
					let n = this.searchHeaderListEnd(e, t);
					if (n === -1) return;
					t = n, this.readState = s.BODY, this.headerListBuffer = null;
				}
				for (;;) {
					if (this.readState === s.BODY) this.readState = s.INIT;
					else {
						this.partIndex++;
						let r = this.partIndexToTaskIndex.get(this.partIndex);
						if (r == null) if (this.isFinished) r = this.options.end;
						else throw (0, n.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
						let i = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
						if (i < r) await this.copyExistingData(i, r);
						else if (i > r) throw (0, n.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
						if (this.isFinished) {
							this.onPartEnd(), this.finishHandler();
							return;
						}
						if (t = this.searchHeaderListEnd(e, t), t === -1) {
							this.readState = s.HEADER;
							return;
						}
					}
					let r = this.partIndexToLength[this.partIndex], i = t + r, a = Math.min(i, e.length);
					if (await this.processPartStarted(e, t, a), this.remainingPartDataCount = r - (a - t), this.remainingPartDataCount > 0) return;
					if (t = i + this.boundaryLength, t >= e.length) {
						this.ignoreByteCount = this.boundaryLength - (e.length - i);
						return;
					}
				}
			}
		}
		copyExistingData(e, t) {
			return new Promise((n, r) => {
				let i = () => {
					if (e === t) {
						n();
						return;
					}
					let o = this.options.tasks[e];
					if (o.kind !== a.OperationKind.COPY) {
						r(/* @__PURE__ */ Error("Task kind must be COPY"));
						return;
					}
					c(o, this.out, this.options.oldFileFd, r, () => {
						e++, i();
					});
				};
				i();
			});
		}
		searchHeaderListEnd(e, t) {
			let n = e.indexOf(o, t);
			if (n !== -1) return n + o.length;
			let r = t === 0 ? e : e.slice(t);
			return this.headerListBuffer == null ? this.headerListBuffer = r : this.headerListBuffer = Buffer.concat([this.headerListBuffer, r]), -1;
		}
		onPartEnd() {
			let e = this.partIndexToLength[this.partIndex - 1];
			if (this.actualPartLength !== e) throw (0, n.newError)(`Expected length: ${e} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
			this.actualPartLength = 0;
		}
		processPartStarted(e, t, n) {
			return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(e, t, n);
		}
		processPartData(e, t, n) {
			this.actualPartLength += n - t, this.transferred += n - t, this.delta += n - t;
			let r = this.out;
			return r.write(t === 0 && e.length === n ? e : e.slice(t, n)) ? Promise.resolve() : new Promise((e, t) => {
				r.on("error", t), r.once("drain", () => {
					r.removeListener("error", t), e();
				});
			});
		}
	};
})), It = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.executeTasksUsingMultipleRangeRequests = i, e.checkIsRangesSupported = o;
	var t = H(), n = Ft(), r = Pt();
	function i(e, t, n, r, i) {
		let o = (s) => {
			if (s >= t.length) {
				e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
				return;
			}
			let c = s + 1e3;
			a(e, {
				tasks: t,
				start: s,
				end: Math.min(t.length, c),
				oldFileFd: r
			}, n, () => o(c), i);
		};
		return o;
	}
	function a(e, i, a, s, c) {
		let l = "bytes=", u = 0, d = 0, f = /* @__PURE__ */ new Map(), p = [];
		for (let e = i.start; e < i.end; e++) {
			let t = i.tasks[e];
			t.kind === r.OperationKind.DOWNLOAD && (l += `${t.start}-${t.end - 1}, `, f.set(u, e), u++, p.push(t.end - t.start), d += t.end - t.start);
		}
		if (u <= 1) {
			let t = (l) => {
				if (l >= i.end) {
					s();
					return;
				}
				let u = i.tasks[l++];
				if (u.kind === r.OperationKind.COPY) (0, n.copyData)(u, a, i.oldFileFd, c, () => t(l));
				else {
					let n = e.createRequestOptions();
					n.headers.Range = `bytes=${u.start}-${u.end - 1}`;
					let r = e.httpExecutor.createRequest(n, (e) => {
						e.on("error", c), o(e, c) && (e.pipe(a, { end: !1 }), e.once("end", () => t(l)));
					});
					e.httpExecutor.addErrorAndTimeoutHandlers(r, c), r.end();
				}
			};
			t(i.start);
			return;
		}
		let m = e.createRequestOptions();
		m.headers.Range = l.substring(0, l.length - 2);
		let h = e.httpExecutor.createRequest(m, (r) => {
			if (!o(r, c)) return;
			let l = (0, t.safeGetHeader)(r, "content-type"), u = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(l);
			if (u == null) {
				c(/* @__PURE__ */ Error(`Content-Type "multipart/byteranges" is expected, but got "${l}"`));
				return;
			}
			let m = new n.DataSplitter(a, i, f, u[1] || u[2], p, s, d, e.options.onProgress);
			m.on("error", c), r.pipe(m), r.on("end", () => {
				setTimeout(() => {
					h.abort(), c(/* @__PURE__ */ Error("Response ends without calling any handlers"));
				}, 1e4);
			});
		});
		e.httpExecutor.addErrorAndTimeoutHandlers(h, c), h.end();
	}
	function o(e, n) {
		if (e.statusCode >= 400) return n((0, t.createHttpError)(e)), !1;
		if (e.statusCode !== 206) {
			let r = (0, t.safeGetHeader)(e, "accept-ranges");
			if (r == null || r === "none") return n(/* @__PURE__ */ Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
		}
		return !0;
	}
})), Lt = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.ProgressDifferentialDownloadCallbackTransform = void 0;
	var n = e("stream"), r;
	(function(e) {
		e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
	})(r ||= {}), t.ProgressDifferentialDownloadCallbackTransform = class extends n.Transform {
		constructor(e, t, n) {
			super(), this.progressDifferentialDownloadInfo = e, this.cancellationToken = t, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = r.COPY, this.nextUpdate = this.start + 1e3;
		}
		_transform(e, t, n) {
			if (this.cancellationToken.cancelled) {
				n(/* @__PURE__ */ Error("cancelled"), null);
				return;
			}
			if (this.operationType == r.COPY) {
				n(null, e);
				return;
			}
			this.transferred += e.length, this.delta += e.length;
			let i = Date.now();
			i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
				total: this.progressDifferentialDownloadInfo.grandTotal,
				delta: this.delta,
				transferred: this.transferred,
				percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
				bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
			}), this.delta = 0), n(null, e);
		}
		beginFileCopy() {
			this.operationType = r.COPY;
		}
		beginRangeDownload() {
			this.operationType = r.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
		}
		endRangeDownload() {
			this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
				total: this.progressDifferentialDownloadInfo.grandTotal,
				delta: this.delta,
				transferred: this.transferred,
				percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
				bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
			});
		}
		_flush(e) {
			if (this.cancellationToken.cancelled) {
				e(/* @__PURE__ */ Error("cancelled"));
				return;
			}
			this.onProgress({
				total: this.progressDifferentialDownloadInfo.grandTotal,
				delta: this.delta,
				transferred: this.transferred,
				percent: 100,
				bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
			}), this.delta = 0, this.transferred = 0, e(null);
		}
	};
})), Rt = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.DifferentialDownloader = void 0;
	var n = H(), r = P(), i = e("fs"), a = Ft(), o = e("url"), s = Pt(), c = It(), l = Lt();
	t.DifferentialDownloader = class {
		constructor(e, t, n) {
			this.blockAwareFileInfo = e, this.httpExecutor = t, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
		}
		createRequestOptions() {
			let e = { headers: {
				...this.options.requestHeaders,
				accept: "*/*"
			} };
			return (0, n.configureRequestUrl)(this.options.newUrl, e), (0, n.configureRequestOptions)(e), e;
		}
		doDownload(e, t) {
			if (e.version !== t.version) throw Error(`version is different (${e.version} - ${t.version}), full download is required`);
			let n = this.logger, r = (0, s.computeOperations)(e, t, n);
			n.debug != null && n.debug(JSON.stringify(r, null, 2));
			let i = 0, a = 0;
			for (let e of r) {
				let t = e.end - e.start;
				e.kind === s.OperationKind.DOWNLOAD ? i += t : a += t;
			}
			let o = this.blockAwareFileInfo.size;
			if (i + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== o) throw Error(`Internal error, size mismatch: downloadSize: ${i}, copySize: ${a}, newSize: ${o}`);
			return n.info(`Full: ${u(o)}, To download: ${u(i)} (${Math.round(i / (o / 100))}%)`), this.downloadFile(r);
		}
		downloadFile(e) {
			let t = [], n = () => Promise.all(t.map((e) => (0, r.close)(e.descriptor).catch((t) => {
				this.logger.error(`cannot close file "${e.path}": ${t}`);
			})));
			return this.doDownloadFile(e, t).then(n).catch((e) => n().catch((t) => {
				try {
					this.logger.error(`cannot close files: ${t}`);
				} catch (e) {
					try {
						console.error(e);
					} catch {}
				}
				throw e;
			}).then(() => {
				throw e;
			}));
		}
		async doDownloadFile(e, t) {
			let u = await (0, r.open)(this.options.oldFile, "r");
			t.push({
				descriptor: u,
				path: this.options.oldFile
			});
			let f = await (0, r.open)(this.options.newFile, "w");
			t.push({
				descriptor: f,
				path: this.options.newFile
			});
			let p = (0, i.createWriteStream)(this.options.newFile, { fd: f });
			await new Promise((r, i) => {
				let f = [], m;
				if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
					let t = [], n = 0;
					for (let r of e) r.kind === s.OperationKind.DOWNLOAD && (t.push(r.end - r.start), n += r.end - r.start);
					let r = {
						expectedByteCounts: t,
						grandTotal: n
					};
					m = new l.ProgressDifferentialDownloadCallbackTransform(r, this.options.cancellationToken, this.options.onProgress), f.push(m);
				}
				let h = new n.DigestTransform(this.blockAwareFileInfo.sha512);
				h.isValidateOnEnd = !1, f.push(h), p.on("finish", () => {
					p.close(() => {
						t.splice(1, 1);
						try {
							h.validate();
						} catch (e) {
							i(e);
							return;
						}
						r(void 0);
					});
				}), f.push(p);
				let g = null;
				for (let e of f) e.on("error", i), g = g == null ? e : g.pipe(e);
				let _ = f[0], v;
				if (this.options.isUseMultipleRangeRequest) {
					v = (0, c.executeTasksUsingMultipleRangeRequests)(this, e, _, u, i), v(0);
					return;
				}
				let y = 0, b = null;
				this.logger.info(`Differential download: ${this.options.newUrl}`);
				let x = this.createRequestOptions();
				x.redirect = "manual", v = (t) => {
					var r, c;
					if (t >= e.length) {
						this.fileMetadataBuffer != null && _.write(this.fileMetadataBuffer), _.end();
						return;
					}
					let l = e[t++];
					if (l.kind === s.OperationKind.COPY) {
						m && m.beginFileCopy(), (0, a.copyData)(l, _, u, i, () => v(t));
						return;
					}
					let f = `bytes=${l.start}-${l.end - 1}`;
					x.headers.range = f, (c = (r = this.logger)?.debug) == null || c.call(r, `download range: ${f}`), m && m.beginRangeDownload();
					let p = this.httpExecutor.createRequest(x, (e) => {
						e.on("error", i), e.on("aborted", () => {
							i(/* @__PURE__ */ Error("response has been aborted by the server"));
						}), e.statusCode >= 400 && i((0, n.createHttpError)(e)), e.pipe(_, { end: !1 }), e.once("end", () => {
							m && m.endRangeDownload(), ++y === 100 ? (y = 0, setTimeout(() => v(t), 1e3)) : v(t);
						});
					});
					p.on("redirect", (e, t, r) => {
						this.logger.info(`Redirect to ${d(r)}`), b = r, (0, n.configureRequestUrl)(new o.URL(b), x), p.followRedirect();
					}), this.httpExecutor.addErrorAndTimeoutHandlers(p, i), p.end();
				}, v(0);
			});
		}
		async readRemoteBytes(e, t) {
			let n = Buffer.allocUnsafe(t + 1 - e), r = this.createRequestOptions();
			r.headers.range = `bytes=${e}-${t}`;
			let i = 0;
			if (await this.request(r, (e) => {
				e.copy(n, i), i += e.length;
			}), i !== n.length) throw Error(`Received data length ${i} is not equal to expected ${n.length}`);
			return n;
		}
		request(e, t) {
			return new Promise((n, r) => {
				let i = this.httpExecutor.createRequest(e, (e) => {
					(0, c.checkIsRangesSupported)(e, r) && (e.on("error", r), e.on("aborted", () => {
						r(/* @__PURE__ */ Error("response has been aborted by the server"));
					}), e.on("data", t), e.on("end", () => n()));
				});
				this.httpExecutor.addErrorAndTimeoutHandlers(i, r), i.end();
			});
		}
	};
	function u(e, t = " KB") {
		return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
	}
	function d(e) {
		let t = e.indexOf("?");
		return t < 0 ? e : e.substring(0, t);
	}
})), zt = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.GenericDifferentialDownloader = void 0;
	var t = Rt();
	e.GenericDifferentialDownloader = class extends t.DifferentialDownloader {
		download(e, t) {
			return this.doDownload(e, t);
		}
	};
})), Bt = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
	var t = H();
	Object.defineProperty(e, "CancellationToken", {
		enumerable: !0,
		get: function() {
			return t.CancellationToken;
		}
	}), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded", e.UpdaterSignal = class {
		constructor(e) {
			this.emitter = e;
		}
		login(e) {
			n(this.emitter, "login", e);
		}
		progress(t) {
			n(this.emitter, e.DOWNLOAD_PROGRESS, t);
		}
		updateDownloaded(t) {
			n(this.emitter, e.UPDATE_DOWNLOADED, t);
		}
		updateCancelled(e) {
			n(this.emitter, "update-cancelled", e);
		}
	};
	function n(e, t, n) {
		e.on(t, n);
	}
})), Vt = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.NoOpLogger = t.AppUpdater = void 0;
	var n = H(), r = e("crypto"), i = e("os"), a = e("events"), o = P(), s = Pe(), c = Fe(), l = e("path"), u = yt(), d = xt(), f = Ct(), p = wt(), m = Dt(), h = Nt(), g = e("zlib"), _ = zt(), v = Bt();
	t.AppUpdater = class t extends a.EventEmitter {
		get channel() {
			return this._channel;
		}
		set channel(e) {
			if (this._channel != null) {
				if (typeof e != "string") throw (0, n.newError)(`Channel must be a string, but got: ${e}`, "ERR_UPDATER_INVALID_CHANNEL");
				if (e.length === 0) throw (0, n.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
			}
			this._channel = e, this.allowDowngrade = !0;
		}
		addAuthHeader(e) {
			this.requestHeaders = Object.assign({}, this.requestHeaders, { authorization: e });
		}
		get netSession() {
			return (0, p.getNetSession)();
		}
		get logger() {
			return this._logger;
		}
		set logger(e) {
			this._logger = e ?? new b();
		}
		set updateConfigPath(e) {
			this.clientPromise = null, this._appUpdateConfigPath = e, this.configOnDisk = new c.Lazy(() => this.loadUpdateConfig());
		}
		get isUpdateSupported() {
			return this._isUpdateSupported;
		}
		set isUpdateSupported(e) {
			e && (this._isUpdateSupported = e);
		}
		get isUserWithinRollout() {
			return this._isUserWithinRollout;
		}
		set isUserWithinRollout(e) {
			e && (this._isUserWithinRollout = e);
		}
		constructor(e, t) {
			super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new v.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (e) => this.checkIfUpdateSupported(e), this._isUserWithinRollout = (e) => this.isStagingMatch(e), this.clientPromise = null, this.stagingUserIdPromise = new c.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new c.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (e) => {
				this._logger.error(`Error: ${e.stack || e.message}`);
			}), t == null ? (this.app = new f.ElectronAppAdapter(), this.httpExecutor = new p.ElectronHttpExecutor((e, t) => this.emit("login", e, t))) : (this.app = t, this.httpExecutor = null);
			let r = this.app.version, i = (0, u.parse)(r);
			if (i == null) throw (0, n.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
			this.currentVersion = i, this.allowPrerelease = y(i), e != null && (this.setFeedURL(e), typeof e != "string" && e.requestHeaders && (this.requestHeaders = e.requestHeaders));
		}
		getFeedURL() {
			return "Deprecated. Do not use it.";
		}
		setFeedURL(e) {
			let t = this.createProviderRuntimeOptions(), n;
			n = typeof e == "string" ? new m.GenericProvider({
				provider: "generic",
				url: e
			}, this, {
				...t,
				isUseMultipleRangeRequest: (0, h.isUrlProbablySupportMultiRangeRequests)(e)
			}) : (0, h.createClient)(e, this, t), this.clientPromise = Promise.resolve(n);
		}
		checkForUpdates() {
			if (!this.isUpdaterActive()) return Promise.resolve(null);
			let e = this.checkForUpdatesPromise;
			if (e != null) return this._logger.info("Checking for update (already in progress)"), e;
			let t = () => this.checkForUpdatesPromise = null;
			return this._logger.info("Checking for update"), e = this.doCheckForUpdates().then((e) => (t(), e)).catch((e) => {
				throw t(), this.emit("error", e, `Cannot check for updates: ${(e.stack || e).toString()}`), e;
			}), this.checkForUpdatesPromise = e, e;
		}
		isUpdaterActive() {
			return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
		}
		checkForUpdatesAndNotify(n) {
			return this.checkForUpdates().then((r) => r?.downloadPromise ? (r.downloadPromise.then(() => {
				let i = t.formatDownloadNotification(r.updateInfo.version, this.app.name, n);
				new (e("electron")).Notification(i).show();
			}), r) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), r));
		}
		static formatDownloadNotification(e, t, n) {
			return n ??= {
				title: "A new update is ready to install",
				body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
			}, n = {
				title: n.title.replace("{appName}", t).replace("{version}", e),
				body: n.body.replace("{appName}", t).replace("{version}", e)
			}, n;
		}
		async isStagingMatch(e) {
			let t = e.stagingPercentage, r = t;
			if (r == null) return !0;
			if (r = parseInt(r, 10), isNaN(r)) return this._logger.warn(`Staging percentage is NaN: ${t}`), !0;
			r /= 100;
			let i = await this.stagingUserIdPromise.value, a = n.UUID.parse(i).readUInt32BE(12) / 4294967295;
			return this._logger.info(`Staging percentage: ${r}, percentage: ${a}, user id: ${i}`), a < r;
		}
		computeFinalHeaders(e) {
			return this.requestHeaders != null && Object.assign(e, this.requestHeaders), e;
		}
		async isUpdateAvailable(e) {
			let t = (0, u.parse)(e.version);
			if (t == null) throw (0, n.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${e.version}"`, "ERR_UPDATER_INVALID_VERSION");
			let r = this.currentVersion;
			if ((0, u.eq)(t, r) || !await Promise.resolve(this.isUpdateSupported(e)) || !await Promise.resolve(this.isUserWithinRollout(e))) return !1;
			let i = (0, u.gt)(t, r), a = (0, u.lt)(t, r);
			return i ? !0 : this.allowDowngrade && a;
		}
		checkIfUpdateSupported(e) {
			let t = e?.minimumSystemVersion, n = (0, i.release)();
			if (t) try {
				if ((0, u.lt)(n, t)) return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${t} for version ${n}`), !1;
			} catch (e) {
				this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${t}): ${(e.message || e).toString()}`);
			}
			return !0;
		}
		async getUpdateInfoAndProvider() {
			await this.app.whenReady(), this.clientPromise ??= this.configOnDisk.value.then((e) => (0, h.createClient)(e, this, this.createProviderRuntimeOptions()));
			let e = await this.clientPromise, t = await this.stagingUserIdPromise.value;
			return e.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": t })), {
				info: await e.getLatestVersion(),
				provider: e
			};
		}
		createProviderRuntimeOptions() {
			return {
				isUseMultipleRangeRequest: !0,
				platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
				executor: this.httpExecutor
			};
		}
		async doCheckForUpdates() {
			this.emit("checking-for-update");
			let e = await this.getUpdateInfoAndProvider(), t = e.info;
			if (!await this.isUpdateAvailable(t)) return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${t.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", t), {
				isUpdateAvailable: !1,
				versionInfo: t,
				updateInfo: t
			};
			this.updateInfoAndProvider = e, this.onUpdateAvailable(t);
			let r = new n.CancellationToken();
			return {
				isUpdateAvailable: !0,
				versionInfo: t,
				updateInfo: t,
				cancellationToken: r,
				downloadPromise: this.autoDownload ? this.downloadUpdate(r) : null
			};
		}
		onUpdateAvailable(e) {
			this._logger.info(`Found version ${e.version} (url: ${(0, n.asArray)(e.files).map((e) => e.url).join(", ")})`), this.emit("update-available", e);
		}
		downloadUpdate(e = new n.CancellationToken()) {
			let t = this.updateInfoAndProvider;
			if (t == null) {
				let e = /* @__PURE__ */ Error("Please check update first");
				return this.dispatchError(e), Promise.reject(e);
			}
			if (this.downloadPromise != null) return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
			this._logger.info(`Downloading update from ${(0, n.asArray)(t.info.files).map((e) => e.url).join(", ")}`);
			let r = (e) => {
				if (!(e instanceof n.CancellationError)) try {
					this.dispatchError(e);
				} catch (e) {
					this._logger.warn(`Cannot dispatch error event: ${e.stack || e}`);
				}
				return e;
			};
			return this.downloadPromise = this.doDownloadUpdate({
				updateInfoAndProvider: t,
				requestHeaders: this.computeRequestHeaders(t.provider),
				cancellationToken: e,
				disableWebInstaller: this.disableWebInstaller,
				disableDifferentialDownload: this.disableDifferentialDownload
			}).catch((e) => {
				throw r(e);
			}).finally(() => {
				this.downloadPromise = null;
			}), this.downloadPromise;
		}
		dispatchError(e) {
			this.emit("error", e, (e.stack || e).toString());
		}
		dispatchUpdateDownloaded(e) {
			this.emit(v.UPDATE_DOWNLOADED, e);
		}
		async loadUpdateConfig() {
			return this._appUpdateConfigPath ??= this.app.appUpdateConfigPath, (0, s.load)(await (0, o.readFile)(this._appUpdateConfigPath, "utf-8"));
		}
		computeRequestHeaders(e) {
			let t = e.fileExtraDownloadHeaders;
			if (t != null) {
				let e = this.requestHeaders;
				return e == null ? t : {
					...t,
					...e
				};
			}
			return this.computeFinalHeaders({ accept: "*/*" });
		}
		async getOrCreateStagingUserId() {
			let e = l.join(this.app.userDataPath, ".updaterId");
			try {
				let t = await (0, o.readFile)(e, "utf-8");
				if (n.UUID.check(t)) return t;
				this._logger.warn(`Staging user id file exists, but content was invalid: ${t}`);
			} catch (e) {
				e.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${e}`);
			}
			let t = n.UUID.v5((0, r.randomBytes)(4096), n.UUID.OID);
			this._logger.info(`Generated new staging user ID: ${t}`);
			try {
				await (0, o.outputFile)(e, t);
			} catch (e) {
				this._logger.warn(`Couldn't write out staging user ID: ${e}`);
			}
			return t;
		}
		get isAddNoCacheQuery() {
			let e = this.requestHeaders;
			if (e == null) return !0;
			for (let t of Object.keys(e)) {
				let e = t.toLowerCase();
				if (e === "authorization" || e === "private-token") return !1;
			}
			return !0;
		}
		async getOrCreateDownloadHelper() {
			let e = this.downloadedUpdateHelper;
			if (e == null) {
				let t = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
				t ?? n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
				let r = l.join(this.app.baseCachePath, t || this.app.name);
				n.debug != null && n.debug(`updater cache dir: ${r}`), e = new d.DownloadedUpdateHelper(r), this.downloadedUpdateHelper = e;
			}
			return e;
		}
		async executeDownload(e) {
			let t = e.fileInfo, r = {
				headers: e.downloadUpdateOptions.requestHeaders,
				cancellationToken: e.downloadUpdateOptions.cancellationToken,
				sha2: t.info.sha2,
				sha512: t.info.sha512
			};
			this.listenerCount(v.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (e) => this.emit(v.DOWNLOAD_PROGRESS, e));
			let i = e.downloadUpdateOptions.updateInfoAndProvider.info, a = i.version, s = t.packageInfo;
			function c() {
				let t = decodeURIComponent(e.fileInfo.url.pathname);
				return t.toLowerCase().endsWith(`.${e.fileExtension.toLowerCase()}`) ? l.basename(t) : e.fileInfo.info.url;
			}
			let u = await this.getOrCreateDownloadHelper(), f = u.cacheDirForPendingUpdate;
			await (0, o.mkdir)(f, { recursive: !0 });
			let p = c(), m = l.join(f, p), h = s == null ? null : l.join(f, `package-${a}${l.extname(s.path) || ".7z"}`), g = async (n) => {
				await u.setDownloadedFile(m, h, i, t, p, n), await e.done({
					...i,
					downloadedFile: m
				});
				let r = l.join(f, "current.blockmap");
				return await (0, o.pathExists)(r) && await (0, o.copyFile)(r, l.join(u.cacheDir, "current.blockmap")), h == null ? [m] : [m, h];
			}, _ = this._logger, y = await u.validateDownloadedPath(m, i, t, _);
			if (y != null) return m = y, await g(!1);
			let b = async () => (await u.clear().catch(() => {}), await (0, o.unlink)(m).catch(() => {})), x = await (0, d.createTempUpdateFile)(`temp-${p}`, f, _);
			try {
				await e.task(x, r, h, b), await (0, n.retry)(() => (0, o.rename)(x, m), {
					retries: 60,
					interval: 500,
					shouldRetry: (e) => e instanceof Error && /^EBUSY:/.test(e.message) ? !0 : (_.warn(`Cannot rename temp file to final file: ${e.message || e.stack}`), !1)
				});
			} catch (e) {
				throw await b(), e instanceof n.CancellationError && (_.info("cancelled"), this.emit("update-cancelled", i)), e;
			}
			return _.info(`New version ${a} has been downloaded to ${m}`), await g(!0);
		}
		async differentialDownloadInstaller(e, t, n, r, i) {
			try {
				if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload) return !0;
				let r = t.updateInfoAndProvider.provider, a = await r.getBlockMapFiles(e.url, this.app.version, t.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
				this._logger.info(`Download block maps (old: "${a[0]}", new: ${a[1]})`);
				let s = async (e) => {
					let n = await this.httpExecutor.downloadToBuffer(e, {
						headers: t.requestHeaders,
						cancellationToken: t.cancellationToken
					});
					if (n == null || n.length === 0) throw Error(`Blockmap "${e.href}" is empty`);
					try {
						return JSON.parse((0, g.gunzipSync)(n).toString());
					} catch (t) {
						throw Error(`Cannot parse blockmap "${e.href}", error: ${t}`);
					}
				}, c = {
					newUrl: e.url,
					oldFile: l.join(this.downloadedUpdateHelper.cacheDir, i),
					logger: this._logger,
					newFile: n,
					isUseMultipleRangeRequest: r.isUseMultipleRangeRequest,
					requestHeaders: t.requestHeaders,
					cancellationToken: t.cancellationToken
				};
				this.listenerCount(v.DOWNLOAD_PROGRESS) > 0 && (c.onProgress = (e) => this.emit(v.DOWNLOAD_PROGRESS, e));
				let u = async (e, t) => {
					let n = l.join(t, "current.blockmap");
					await (0, o.outputFile)(n, (0, g.gzipSync)(JSON.stringify(e)));
				}, d = async (e) => {
					let t = l.join(e, "current.blockmap");
					try {
						if (await (0, o.pathExists)(t)) return JSON.parse((0, g.gunzipSync)(await (0, o.readFile)(t)).toString());
					} catch (e) {
						this._logger.warn(`Cannot parse blockmap "${t}", error: ${e}`);
					}
					return null;
				}, f = await s(a[1]);
				await u(f, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
				let p = await d(this.downloadedUpdateHelper.cacheDir);
				return p ??= await s(a[0]), await new _.GenericDifferentialDownloader(e.info, this.httpExecutor, c).download(p, f), !1;
			} catch (e) {
				if (this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`), this._testOnlyOptions != null) throw e;
				return !0;
			}
		}
	};
	function y(e) {
		let t = (0, u.prerelease)(e);
		return t != null && t.length > 0;
	}
	var b = class {
		info(e) {}
		warn(e) {}
		error(e) {}
	};
	t.NoOpLogger = b;
})), Ht = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.BaseUpdater = void 0;
	var n = e("child_process"), r = Vt();
	t.BaseUpdater = class extends r.AppUpdater {
		constructor(e, t) {
			super(e, t), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
		}
		quitAndInstall(t = !1, n = !1) {
			this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? n : this.autoRunAppAfterInstall) ? setImmediate(() => {
				e("electron").autoUpdater.emit("before-quit-for-update"), this.app.quit();
			}) : this.quitAndInstallCalled = !1;
		}
		executeDownload(e) {
			return super.executeDownload({
				...e,
				done: (e) => (this.dispatchUpdateDownloaded(e), this.addQuitHandler(), Promise.resolve())
			});
		}
		get installerPath() {
			return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
		}
		install(e = !1, t = !1) {
			if (this.quitAndInstallCalled) return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
			let n = this.downloadedUpdateHelper, r = this.installerPath, i = n == null ? null : n.downloadedFileInfo;
			if (r == null || i == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			this.quitAndInstallCalled = !0;
			try {
				return this._logger.info(`Install: isSilent: ${e}, isForceRunAfter: ${t}`), this.doInstall({
					isSilent: e,
					isForceRunAfter: t,
					isAdminRightsRequired: i.isAdminRightsRequired
				});
			} catch (e) {
				return this.dispatchError(e), !1;
			}
		}
		addQuitHandler() {
			this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((e) => {
				if (this.quitAndInstallCalled) {
					this._logger.info("Update installer has already been triggered. Quitting application.");
					return;
				}
				if (!this.autoInstallOnAppQuit) {
					this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
					return;
				}
				if (e !== 0) {
					this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${e}`);
					return;
				}
				this._logger.info("Auto install update on quit"), this.install(!0, !1);
			}));
		}
		spawnSyncLog(e, t = [], r = {}) {
			this._logger.info(`Executing: ${e} with args: ${t}`);
			let { error: i, status: a, stdout: o, stderr: s } = (0, n.spawnSync)(e, t, {
				env: {
					...process.env,
					...r
				},
				encoding: "utf-8",
				shell: !0
			});
			if (i != null) throw this._logger.error(s), i;
			if (a != null && a !== 0) throw this._logger.error(s), Error(`Command ${e} exited with code ${a}`);
			return o.trim();
		}
		async spawnLog(e, t = [], r = void 0, i = "ignore") {
			return this._logger.info(`Executing: ${e} with args: ${t}`), new Promise((a, o) => {
				try {
					let s = {
						stdio: i,
						env: r,
						detached: !0
					}, c = (0, n.spawn)(e, t, s);
					c.on("error", (e) => {
						o(e);
					}), c.unref(), c.pid !== void 0 && a(!0);
				} catch (e) {
					o(e);
				}
			});
		}
	};
})), Ut = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
	var n = P(), r = Rt(), i = e("zlib");
	t.FileWithEmbeddedBlockMapDifferentialDownloader = class extends r.DifferentialDownloader {
		async download() {
			let e = this.blockAwareFileInfo, t = e.size, n = t - (e.blockMapSize + 4);
			this.fileMetadataBuffer = await this.readRemoteBytes(n, t - 1);
			let r = a(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
			await this.doDownload(await o(this.options.oldFile), r);
		}
	};
	function a(e) {
		return JSON.parse((0, i.inflateRawSync)(e).toString());
	}
	async function o(e) {
		let t = await (0, n.open)(e, "r");
		try {
			let e = (await (0, n.fstat)(t)).size, r = Buffer.allocUnsafe(4);
			await (0, n.read)(t, r, 0, r.length, e - r.length);
			let i = Buffer.allocUnsafe(r.readUInt32BE(0));
			return await (0, n.read)(t, i, 0, i.length, e - r.length - i.length), await (0, n.close)(t), a(i);
		} catch (e) {
			throw await (0, n.close)(t), e;
		}
	}
})), Wt = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.AppImageUpdater = void 0;
	var n = H(), r = e("child_process"), i = P(), a = e("fs"), o = e("path"), s = Ht(), c = Ut(), l = $(), u = Bt();
	t.AppImageUpdater = class extends s.BaseUpdater {
		constructor(e, t) {
			super(e, t);
		}
		isUpdaterActive() {
			return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
		}
		doDownloadUpdate(e) {
			let t = e.updateInfoAndProvider.provider, r = (0, l.findFile)(t.resolveFiles(e.updateInfoAndProvider.info), "AppImage", [
				"rpm",
				"deb",
				"pacman"
			]);
			return this.executeDownload({
				fileExtension: "AppImage",
				fileInfo: r,
				downloadUpdateOptions: e,
				task: async (a, o) => {
					let s = process.env.APPIMAGE;
					if (s == null) throw (0, n.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
					(e.disableDifferentialDownload || await this.downloadDifferential(r, s, a, t, e)) && await this.httpExecutor.download(r.url, a, o), await (0, i.chmod)(a, 493);
				}
			});
		}
		async downloadDifferential(e, t, n, r, i) {
			try {
				let a = {
					newUrl: e.url,
					oldFile: t,
					logger: this._logger,
					newFile: n,
					isUseMultipleRangeRequest: r.isUseMultipleRangeRequest,
					requestHeaders: i.requestHeaders,
					cancellationToken: i.cancellationToken
				};
				return this.listenerCount(u.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (e) => this.emit(u.DOWNLOAD_PROGRESS, e)), await new c.FileWithEmbeddedBlockMapDifferentialDownloader(e.info, this.httpExecutor, a).download(), !1;
			} catch (e) {
				return this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`), process.platform === "linux";
			}
		}
		doInstall(e) {
			let t = process.env.APPIMAGE;
			if (t == null) throw (0, n.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
			(0, a.unlinkSync)(t);
			let i, s = o.basename(t), c = this.installerPath;
			if (c == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			i = o.basename(c) === s || !/\d+\.\d+\.\d+/.test(s) ? t : o.join(o.dirname(t), o.basename(c)), (0, r.execFileSync)("mv", [
				"-f",
				c,
				i
			]), i !== t && this.emit("appimage-filename-updated", i);
			let l = {
				...process.env,
				APPIMAGE_SILENT_INSTALL: "true"
			};
			return e.isForceRunAfter ? this.spawnLog(i, [], l) : (l.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, r.execFileSync)(i, [], { env: l })), !0;
		}
	};
})), Gt = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.LinuxUpdater = void 0;
	var t = Ht();
	e.LinuxUpdater = class extends t.BaseUpdater {
		constructor(e, t) {
			super(e, t);
		}
		isRunningAsRoot() {
			return process.getuid?.call(process) === 0;
		}
		get installerPath() {
			return super.installerPath?.replace(/\\/g, "\\\\").replace(/ /g, "\\ ") ?? null;
		}
		runCommandWithSudoIfNeeded(e) {
			if (this.isRunningAsRoot()) return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(e[0], e.slice(1));
			let { name: t } = this.app, n = `"${t} would like to update"`, r = this.sudoWithArgs(n);
			this._logger.info(`Running as non-root user, using sudo to install: ${r}`);
			let i = "\"";
			return (/pkexec/i.test(r[0]) || r[0] === "sudo") && (i = ""), this.spawnSyncLog(r[0], [
				...r.length > 1 ? r.slice(1) : [],
				`${i}/bin/bash`,
				"-c",
				`'${e.join(" ")}'${i}`
			]);
		}
		sudoWithArgs(e) {
			let t = this.determineSudoCommand(), n = [t];
			return /kdesudo/i.test(t) ? (n.push("--comment", e), n.push("-c")) : /gksudo/i.test(t) ? n.push("--message", e) : /pkexec/i.test(t) && n.push("--disable-internal-agent"), n;
		}
		hasCommand(e) {
			try {
				return this.spawnSyncLog("command", ["-v", e]), !0;
			} catch {
				return !1;
			}
		}
		determineSudoCommand() {
			for (let e of [
				"gksudo",
				"kdesudo",
				"pkexec",
				"beesu"
			]) if (this.hasCommand(e)) return e;
			return "sudo";
		}
		detectPackageManager(e) {
			let t = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER?.trim();
			if (t) return t;
			for (let t of e) if (this.hasCommand(t)) return t;
			return this._logger.warn(`No package manager found in the list: ${e.join(", ")}. Defaulting to the first one: ${e[0]}`), e[0];
		}
	};
})), Kt = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.DebUpdater = void 0;
	var t = $(), n = Bt(), r = Gt();
	e.DebUpdater = class e extends r.LinuxUpdater {
		constructor(e, t) {
			super(e, t);
		}
		doDownloadUpdate(e) {
			let r = e.updateInfoAndProvider.provider, i = (0, t.findFile)(r.resolveFiles(e.updateInfoAndProvider.info), "deb", [
				"AppImage",
				"rpm",
				"pacman"
			]);
			return this.executeDownload({
				fileExtension: "deb",
				fileInfo: i,
				downloadUpdateOptions: e,
				task: async (e, t) => {
					this.listenerCount(n.DOWNLOAD_PROGRESS) > 0 && (t.onProgress = (e) => this.emit(n.DOWNLOAD_PROGRESS, e)), await this.httpExecutor.download(i.url, e, t);
				}
			});
		}
		doInstall(t) {
			let n = this.installerPath;
			if (n == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			if (!this.hasCommand("dpkg") && !this.hasCommand("apt")) return this.dispatchError(/* @__PURE__ */ Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
			let r = this.detectPackageManager(["dpkg", "apt"]);
			try {
				e.installWithCommandRunner(r, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
			} catch (e) {
				return this.dispatchError(e), !1;
			}
			return t.isForceRunAfter && this.app.relaunch(), !0;
		}
		static installWithCommandRunner(e, t, n, r) {
			if (e === "dpkg") try {
				n([
					"dpkg",
					"-i",
					t
				]);
			} catch (e) {
				r.warn(e.message ?? e), r.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), n([
					"apt-get",
					"install",
					"-f",
					"-y"
				]);
			}
			else if (e === "apt") r.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), n([
				"apt",
				"install",
				"-y",
				"--allow-unauthenticated",
				"--allow-downgrades",
				"--allow-change-held-packages",
				t
			]);
			else throw Error(`Package manager ${e} not supported`);
		}
	};
})), qt = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.PacmanUpdater = void 0;
	var t = Bt(), n = $(), r = Gt();
	e.PacmanUpdater = class e extends r.LinuxUpdater {
		constructor(e, t) {
			super(e, t);
		}
		doDownloadUpdate(e) {
			let r = e.updateInfoAndProvider.provider, i = (0, n.findFile)(r.resolveFiles(e.updateInfoAndProvider.info), "pacman", [
				"AppImage",
				"deb",
				"rpm"
			]);
			return this.executeDownload({
				fileExtension: "pacman",
				fileInfo: i,
				downloadUpdateOptions: e,
				task: async (e, n) => {
					this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (e) => this.emit(t.DOWNLOAD_PROGRESS, e)), await this.httpExecutor.download(i.url, e, n);
				}
			});
		}
		doInstall(t) {
			let n = this.installerPath;
			if (n == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			try {
				e.installWithCommandRunner(n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
			} catch (e) {
				return this.dispatchError(e), !1;
			}
			return t.isForceRunAfter && this.app.relaunch(), !0;
		}
		static installWithCommandRunner(e, t, n) {
			try {
				t([
					"pacman",
					"-U",
					"--noconfirm",
					e
				]);
			} catch (r) {
				n.warn(r.message ?? r), n.warn("pacman installation failed, attempting to update package database and retry");
				try {
					t([
						"pacman",
						"-Sy",
						"--noconfirm"
					]), t([
						"pacman",
						"-U",
						"--noconfirm",
						e
					]);
				} catch (e) {
					throw n.error("Retry after pacman -Sy failed"), e;
				}
			}
		}
	};
})), Jt = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.RpmUpdater = void 0;
	var t = Bt(), n = $(), r = Gt();
	e.RpmUpdater = class e extends r.LinuxUpdater {
		constructor(e, t) {
			super(e, t);
		}
		doDownloadUpdate(e) {
			let r = e.updateInfoAndProvider.provider, i = (0, n.findFile)(r.resolveFiles(e.updateInfoAndProvider.info), "rpm", [
				"AppImage",
				"deb",
				"pacman"
			]);
			return this.executeDownload({
				fileExtension: "rpm",
				fileInfo: i,
				downloadUpdateOptions: e,
				task: async (e, n) => {
					this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (e) => this.emit(t.DOWNLOAD_PROGRESS, e)), await this.httpExecutor.download(i.url, e, n);
				}
			});
		}
		doInstall(t) {
			let n = this.installerPath;
			if (n == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			let r = this.detectPackageManager([
				"zypper",
				"dnf",
				"yum",
				"rpm"
			]);
			try {
				e.installWithCommandRunner(r, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
			} catch (e) {
				return this.dispatchError(e), !1;
			}
			return t.isForceRunAfter && this.app.relaunch(), !0;
		}
		static installWithCommandRunner(e, t, n, r) {
			if (e === "zypper") return n([
				"zypper",
				"--non-interactive",
				"--no-refresh",
				"install",
				"--allow-unsigned-rpm",
				"-f",
				t
			]);
			if (e === "dnf") return n([
				"dnf",
				"install",
				"--nogpgcheck",
				"-y",
				t
			]);
			if (e === "yum") return n([
				"yum",
				"install",
				"--nogpgcheck",
				"-y",
				t
			]);
			if (e === "rpm") return r.warn("Installing with rpm only (no dependency resolution)."), n([
				"rpm",
				"-Uvh",
				"--replacepkgs",
				"--replacefiles",
				"--nodeps",
				t
			]);
			throw Error(`Package manager ${e} not supported`);
		}
	};
})), Yt = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.MacUpdater = void 0;
	var n = H(), r = P(), i = e("fs"), a = e("path"), o = e("http"), s = Vt(), c = $(), l = e("child_process"), u = e("crypto");
	t.MacUpdater = class extends s.AppUpdater {
		constructor(t, n) {
			super(t, n), this.nativeUpdater = e("electron").autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (e) => {
				this._logger.warn(e), this.emit("error", e);
			}), this.nativeUpdater.on("update-downloaded", () => {
				this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
			});
		}
		debug(e) {
			this._logger.debug != null && this._logger.debug(e);
		}
		closeServerIfExists() {
			this.server && (this.debug("Closing proxy server"), this.server.close((e) => {
				e && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
			}));
		}
		async doDownloadUpdate(e) {
			let t = e.updateInfoAndProvider.provider.resolveFiles(e.updateInfoAndProvider.info), i = this._logger, o = "sysctl.proc_translated", s = !1;
			try {
				this.debug("Checking for macOS Rosetta environment"), s = (0, l.execFileSync)("sysctl", [o], { encoding: "utf8" }).includes(`${o}: 1`), i.info(`Checked for macOS Rosetta environment (isRosetta=${s})`);
			} catch (e) {
				i.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${e}`);
			}
			let u = !1;
			try {
				this.debug("Checking for arm64 in uname");
				let e = (0, l.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
				i.info(`Checked 'uname -a': arm64=${e}`), u ||= e;
			} catch (e) {
				i.warn(`uname shell command to check for arm64 failed: ${e}`);
			}
			u = u || process.arch === "arm64" || s;
			let d = (e) => e.url.pathname.includes("arm64") || e.info.url?.includes("arm64");
			t = u && t.some(d) ? t.filter((e) => u === d(e)) : t.filter((e) => !d(e));
			let f = (0, c.findFile)(t, "zip", ["pkg", "dmg"]);
			if (f == null) throw (0, n.newError)(`ZIP file not provided: ${(0, n.safeStringifyJson)(t)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
			let p = e.updateInfoAndProvider.provider, m = "update.zip";
			return this.executeDownload({
				fileExtension: "zip",
				fileInfo: f,
				downloadUpdateOptions: e,
				task: async (t, n) => {
					let o = a.join(this.downloadedUpdateHelper.cacheDir, m), s = () => (0, r.pathExistsSync)(o) ? !e.disableDifferentialDownload : (i.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1), c = !0;
					s() && (c = await this.differentialDownloadInstaller(f, e, t, p, m)), c && await this.httpExecutor.download(f.url, t, n);
				},
				done: async (t) => {
					if (!e.disableDifferentialDownload) try {
						let e = a.join(this.downloadedUpdateHelper.cacheDir, m);
						await (0, r.copyFile)(t.downloadedFile, e);
					} catch (e) {
						this._logger.warn(`Unable to copy file for caching for future differential downloads: ${e.message}`);
					}
					return this.updateDownloaded(f, t);
				}
			});
		}
		async updateDownloaded(e, t) {
			let n = t.downloadedFile, a = e.info.size ?? (await (0, r.stat)(n)).size, s = this._logger, c = `fileToProxy=${e.url.href}`;
			this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${c})`), this.server = (0, o.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${c})`), this.server.on("close", () => {
				s.info(`Proxy server for native Squirrel.Mac is closed (${c})`);
			});
			let l = (e) => {
				let t = e.address();
				return typeof t == "string" ? t : `http://127.0.0.1:${t?.port}`;
			};
			return await new Promise((e, r) => {
				let o = (0, u.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), d = Buffer.from(`autoupdater:${o}`, "ascii"), f = `/${(0, u.randomBytes)(64).toString("hex")}.zip`;
				this.server.on("request", (t, c) => {
					let u = t.url;
					if (s.info(`${u} requested`), u === "/") {
						if (!t.headers.authorization || t.headers.authorization.indexOf("Basic ") === -1) {
							c.statusCode = 401, c.statusMessage = "Invalid Authentication Credentials", c.end(), s.warn("No authenthication info");
							return;
						}
						let e = t.headers.authorization.split(" ")[1], [n, r] = Buffer.from(e, "base64").toString("ascii").split(":");
						if (n !== "autoupdater" || r !== o) {
							c.statusCode = 401, c.statusMessage = "Invalid Authentication Credentials", c.end(), s.warn("Invalid authenthication credentials");
							return;
						}
						let i = Buffer.from(`{ "url": "${l(this.server)}${f}" }`);
						c.writeHead(200, {
							"Content-Type": "application/json",
							"Content-Length": i.length
						}), c.end(i);
						return;
					}
					if (!u.startsWith(f)) {
						s.warn(`${u} requested, but not supported`), c.writeHead(404), c.end();
						return;
					}
					s.info(`${f} requested by Squirrel.Mac, pipe ${n}`);
					let d = !1;
					c.on("finish", () => {
						d || (this.nativeUpdater.removeListener("error", r), e([]));
					});
					let p = (0, i.createReadStream)(n);
					p.on("error", (e) => {
						try {
							c.end();
						} catch (e) {
							s.warn(`cannot end response: ${e}`);
						}
						d = !0, this.nativeUpdater.removeListener("error", r), r(/* @__PURE__ */ Error(`Cannot pipe "${n}": ${e}`));
					}), c.writeHead(200, {
						"Content-Type": "application/zip",
						"Content-Length": a
					}), p.pipe(c);
				}), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${c})`), this.server.listen(0, "127.0.0.1", () => {
					this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${c})`), this.nativeUpdater.setFeedURL({
						url: l(this.server),
						headers: {
							"Cache-Control": "no-cache",
							Authorization: `Basic ${d.toString("base64")}`
						}
					}), this.dispatchUpdateDownloaded(t), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", r), this.nativeUpdater.checkForUpdates()) : e([]);
				});
			});
		}
		handleUpdateDownloaded() {
			this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
		}
		quitAndInstall() {
			this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
		}
	};
})), Xt = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.verifySignature = s;
	var n = H(), r = e("child_process"), i = e("os"), a = e("path");
	function o(e, t) {
		return [
			"set \"PSModulePath=\" & chcp 65001 >NUL & powershell.exe",
			[
				"-NoProfile",
				"-NonInteractive",
				"-InputFormat",
				"None",
				"-Command",
				e
			],
			{
				shell: !0,
				timeout: t
			}
		];
	}
	function s(e, t, i) {
		return new Promise((s, u) => {
			let d = t.replace(/'/g, "''");
			i.info(`Verifying signature ${d}`), (0, r.execFile)(...o(`"Get-AuthenticodeSignature -LiteralPath '${d}' | ConvertTo-Json -Compress"`, 20 * 1e3), (r, o, d) => {
				try {
					if (r != null || d) {
						l(i, r, d, u), s(null);
						return;
					}
					let f = c(o);
					if (f.Status === 0) {
						try {
							let e = a.normalize(f.Path), n = a.normalize(t);
							if (i.info(`LiteralPath: ${e}. Update Path: ${n}`), e !== n) {
								l(i, /* @__PURE__ */ Error(`LiteralPath of ${e} is different than ${n}`), d, u), s(null);
								return;
							}
						} catch (e) {
							i.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${e.message ?? e.stack}`);
						}
						let r = (0, n.parseDn)(f.SignerCertificate.Subject), o = !1;
						for (let t of e) {
							let e = (0, n.parseDn)(t);
							if (e.size ? o = Array.from(e.keys()).every((t) => e.get(t) === r.get(t)) : t === r.get("CN") && (i.warn(`Signature validated using only CN ${t}. Please add your full Distinguished Name (DN) to publisherNames configuration`), o = !0), o) {
								s(null);
								return;
							}
						}
					}
					let p = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(f, (e, t) => e === "RawData" ? void 0 : t, 2);
					i.warn(`Sign verification failed, installer signed with incorrect certificate: ${p}`), s(p);
				} catch (e) {
					l(i, e, null, u), s(null);
					return;
				}
			});
		});
	}
	function c(e) {
		let t = JSON.parse(e);
		delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
		let n = t.SignerCertificate;
		return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
	}
	function l(e, t, n, i) {
		if (u()) {
			e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
			return;
		}
		try {
			(0, r.execFileSync)(...o("ConvertTo-Json test", 10 * 1e3));
		} catch (t) {
			e.warn(`Cannot execute ConvertTo-Json: ${t.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
			return;
		}
		t != null && i(t), n && i(/* @__PURE__ */ Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
	}
	function u() {
		let e = i.release();
		return e.startsWith("6.") && !e.startsWith("6.3");
	}
})), Zt = /* @__PURE__ */ t(((t) => {
	Object.defineProperty(t, "__esModule", { value: !0 }), t.NsisUpdater = void 0;
	var n = H(), r = e("path"), i = Ht(), a = Ut(), o = Bt(), s = $(), c = P(), l = Xt(), u = e("url");
	t.NsisUpdater = class extends i.BaseUpdater {
		constructor(e, t) {
			super(e, t), this._verifyUpdateCodeSignature = (e, t) => (0, l.verifySignature)(e, t, this._logger);
		}
		get verifyUpdateCodeSignature() {
			return this._verifyUpdateCodeSignature;
		}
		set verifyUpdateCodeSignature(e) {
			e && (this._verifyUpdateCodeSignature = e);
		}
		doDownloadUpdate(e) {
			let t = e.updateInfoAndProvider.provider, r = (0, s.findFile)(t.resolveFiles(e.updateInfoAndProvider.info), "exe");
			return this.executeDownload({
				fileExtension: "exe",
				downloadUpdateOptions: e,
				fileInfo: r,
				task: async (i, a, o, s) => {
					let l = r.packageInfo, d = l != null && o != null;
					if (d && e.disableWebInstaller) throw (0, n.newError)(`Unable to download new version ${e.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
					!d && !e.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (d || e.disableDifferentialDownload || await this.differentialDownloadInstaller(r, e, i, t, n.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, a);
					let f = await this.verifySignature(i);
					if (f != null) throw await s(), (0, n.newError)(`New version ${e.updateInfoAndProvider.info.version} is not signed by the application owner: ${f}`, "ERR_UPDATER_INVALID_SIGNATURE");
					if (d && await this.differentialDownloadWebPackage(e, l, o, t)) try {
						await this.httpExecutor.download(new u.URL(l.path), o, {
							headers: e.requestHeaders,
							cancellationToken: e.cancellationToken,
							sha512: l.sha512
						});
					} catch (e) {
						try {
							await (0, c.unlink)(o);
						} catch {}
						throw e;
					}
				}
			});
		}
		async verifySignature(e) {
			let t;
			try {
				if (t = (await this.configOnDisk.value).publisherName, t == null) return null;
			} catch (e) {
				if (e.code === "ENOENT") return null;
				throw e;
			}
			return await this._verifyUpdateCodeSignature(Array.isArray(t) ? t : [t], e);
		}
		doInstall(t) {
			let n = this.installerPath;
			if (n == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			let i = ["--updated"];
			t.isSilent && i.push("/S"), t.isForceRunAfter && i.push("--force-run"), this.installDirectory && i.push(`/D=${this.installDirectory}`);
			let a = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
			a != null && i.push(`--package-file=${a}`);
			let o = () => {
				this.spawnLog(r.join(process.resourcesPath, "elevate.exe"), [n].concat(i)).catch((e) => this.dispatchError(e));
			};
			return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(n, i).catch((t) => {
				let r = t.code;
				this._logger.info(`Cannot run installer: error code: ${r}, error message: "${t.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), r === "UNKNOWN" || r === "EACCES" ? o() : r === "ENOENT" ? e("electron").shell.openPath(n).catch((e) => this.dispatchError(e)) : this.dispatchError(t);
			}), !0);
		}
		async differentialDownloadWebPackage(e, t, i, s) {
			if (t.blockMapSize == null) return !0;
			try {
				let c = {
					newUrl: new u.URL(t.path),
					oldFile: r.join(this.downloadedUpdateHelper.cacheDir, n.CURRENT_APP_PACKAGE_FILE_NAME),
					logger: this._logger,
					newFile: i,
					requestHeaders: this.requestHeaders,
					isUseMultipleRangeRequest: s.isUseMultipleRangeRequest,
					cancellationToken: e.cancellationToken
				};
				this.listenerCount(o.DOWNLOAD_PROGRESS) > 0 && (c.onProgress = (e) => this.emit(o.DOWNLOAD_PROGRESS, e)), await new a.FileWithEmbeddedBlockMapDifferentialDownloader(t, this.httpExecutor, c).download();
			} catch (e) {
				return this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`), process.platform === "win32";
			}
			return !1;
		}
	};
})), Qt = /* @__PURE__ */ t(((t) => {
	var n = t && t.__createBinding || (Object.create ? (function(e, t, n, r) {
		r === void 0 && (r = n);
		var i = Object.getOwnPropertyDescriptor(t, n);
		(!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) && (i = {
			enumerable: !0,
			get: function() {
				return t[n];
			}
		}), Object.defineProperty(e, r, i);
	}) : (function(e, t, n, r) {
		r === void 0 && (r = n), e[r] = t[n];
	})), r = t && t.__exportStar || function(e, t) {
		for (var r in e) r !== "default" && !Object.prototype.hasOwnProperty.call(t, r) && n(t, e, r);
	};
	Object.defineProperty(t, "__esModule", { value: !0 }), t.NsisUpdater = t.MacUpdater = t.RpmUpdater = t.PacmanUpdater = t.DebUpdater = t.AppImageUpdater = t.Provider = t.NoOpLogger = t.AppUpdater = t.BaseUpdater = void 0;
	var i = P(), a = e("path"), o = Ht();
	Object.defineProperty(t, "BaseUpdater", {
		enumerable: !0,
		get: function() {
			return o.BaseUpdater;
		}
	});
	var s = Vt();
	Object.defineProperty(t, "AppUpdater", {
		enumerable: !0,
		get: function() {
			return s.AppUpdater;
		}
	}), Object.defineProperty(t, "NoOpLogger", {
		enumerable: !0,
		get: function() {
			return s.NoOpLogger;
		}
	});
	var c = $();
	Object.defineProperty(t, "Provider", {
		enumerable: !0,
		get: function() {
			return c.Provider;
		}
	});
	var l = Wt();
	Object.defineProperty(t, "AppImageUpdater", {
		enumerable: !0,
		get: function() {
			return l.AppImageUpdater;
		}
	});
	var u = Kt();
	Object.defineProperty(t, "DebUpdater", {
		enumerable: !0,
		get: function() {
			return u.DebUpdater;
		}
	});
	var d = qt();
	Object.defineProperty(t, "PacmanUpdater", {
		enumerable: !0,
		get: function() {
			return d.PacmanUpdater;
		}
	});
	var f = Jt();
	Object.defineProperty(t, "RpmUpdater", {
		enumerable: !0,
		get: function() {
			return f.RpmUpdater;
		}
	});
	var p = Yt();
	Object.defineProperty(t, "MacUpdater", {
		enumerable: !0,
		get: function() {
			return p.MacUpdater;
		}
	});
	var m = Zt();
	Object.defineProperty(t, "NsisUpdater", {
		enumerable: !0,
		get: function() {
			return m.NsisUpdater;
		}
	}), r(Bt(), t);
	var h;
	function g() {
		if (process.platform === "win32") h = new (Zt()).NsisUpdater();
		else if (process.platform === "darwin") h = new (Yt()).MacUpdater();
		else {
			h = new (Wt()).AppImageUpdater();
			try {
				let e = a.join(process.resourcesPath, "package-type");
				if (!(0, i.existsSync)(e)) return h;
				switch ((0, i.readFileSync)(e).toString().trim()) {
					case "deb":
						h = new (Kt()).DebUpdater();
						break;
					case "rpm":
						h = new (Jt()).RpmUpdater();
						break;
					case "pacman":
						h = new (qt()).PacmanUpdater();
						break;
					default: break;
				}
			} catch (e) {
				console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", e.message);
			}
		}
		return h;
	}
	Object.defineProperty(t, "autoUpdater", {
		enumerable: !0,
		get: () => h || g()
	});
}));
//#endregion
export default Qt();
