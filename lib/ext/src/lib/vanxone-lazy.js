'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
/**
 * Library native/berat yang baru di-require saat pertama kali dipakai,
 * bukan saat bot start. Dipakai seperti import biasa:
 *   import { sharp, ffmpeg, archiver } from "./vanxone-lazy.js";
 *   await sharp(buf).resize(...).toBuffer();
 */
const { createRequire } = require("module");
const fs = __vxDef(require("fs"));
const path = __vxDef(require("path"));
const { sharpTuning } = require("./vanxone-sharp-tuning.js");



// ── Sharp mode ringan ───────────────────────────────────────────────────────
// Disimpan di database/sharpmode.json supaya tetap aktif setelah restart.
// Aktif   : sharp.cache(false) + sharp.concurrency(1)  (paling hemat RAM/CPU)
// Nonaktif: kembali ke tuning bawaan bot (vanxone-sharp-tuning.js:
//           cache 16 MB / 32 item, 1 thread; bisa diubah lewat env SHARP_*)
// Default (file belum ada) = aktif. Atur lewat perintah .sharpmode on/off.
const SHARP_MODE_FILE = path.join(process.cwd(), "database", "sharpmode.json");

function getSharpMode() {
  try {
    const data = JSON.parse(fs.readFileSync(SHARP_MODE_FILE, "utf8"));
    return data.light !== false;
  } catch {
    return true;
  }
}

function applySharpMode(sharpModule, light = getSharpMode()) {
  try {
    if (light) {
      sharpModule.cache(false);
      sharpModule.concurrency(1);
    } else {
      sharpModule.cache({
        memory: sharpTuning.cacheMb,
        files: 0,
        items: sharpTuning.cacheItems,
      });
      sharpModule.concurrency(sharpTuning.threads);
    }
  } catch {}
}

let _sharpModule = null;

// Simpan pilihan ke file, lalu langsung terapkan kalau sharp sudah termuat.
function setSharpMode(light) {
  fs.mkdirSync(path.dirname(SHARP_MODE_FILE), { recursive: true });
  fs.writeFileSync(
    SHARP_MODE_FILE,
    JSON.stringify({ light: !!light, updatedAt: Date.now() }, null, 2),
  );
  applySharpMode(_sharpModule || require("sharp"), !!light);
  return !!light;
}

function lazyRequire(load) {
  let mod;
  const get = () => (mod ??= load());
  return new Proxy(function () {}, {
    apply: (_t, thisArg, args) => Reflect.apply(get(), thisArg, args),
    construct: (_t, args) => Reflect.construct(get(), args),
    get: (_t, prop) => {
      const m = get();
      const v = m[prop];
      return typeof v === "function" ? v.bind(m) : v;
    },
    set: (_t, prop, value) => {
      get()[prop] = value;
      return true;
    },
    has: (_t, prop) => prop in get(),
  });
}

const sharp = lazyRequire(() => {
  _sharpModule = require("sharp");
  applySharpMode(_sharpModule);
  return _sharpModule;
});

const archiver = lazyRequire(() => require("archiver"));

// @napi-rs/canvas (Skia): baru dimuat saat createCanvas/loadImage pertama dipanggil
const canvasLib = lazyRequire(() => require("@napi-rs/canvas"));

// fluent-ffmpeg: path binary ffmpeg di-set sekali saat pertama dipakai
const ffmpeg = lazyRequire(() => {
  const f = require("fluent-ffmpeg");
  try {
    f.setFfmpegPath(require("@ffmpeg-installer/ffmpeg").path);
  } catch {}
  return f;
});

Object.defineProperty(__vxExports, "getSharpMode", { enumerable: true, get: () => getSharpMode });
Object.defineProperty(__vxExports, "setSharpMode", { enumerable: true, get: () => setSharpMode });
Object.defineProperty(__vxExports, "sharp", { enumerable: true, get: () => sharp });
Object.defineProperty(__vxExports, "archiver", { enumerable: true, get: () => archiver });
Object.defineProperty(__vxExports, "canvasLib", { enumerable: true, get: () => canvasLib });
Object.defineProperty(__vxExports, "ffmpeg", { enumerable: true, get: () => ffmpeg });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
