import { createRequire } from 'module';
// Polyfill 'require' globally so that bundled CommonJS modules (like sax/ytdl-core)
// can successfully require Node built-ins in this ESM environment.
globalThis.require = createRequire(import.meta.url);
