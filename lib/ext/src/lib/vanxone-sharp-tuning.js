'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
const Module = __vxDef(require("module"));

/**
 * Batasi pemakaian memori native sharp/libvips TANPA memuat sharp saat start.
 *
 * File ini hanya memasang hook pada loader modul. Begitu sharp dimuat pertama
 * kali oleh siapa pun (import statis, import() dinamis, require, atau library
 * pihak ketiga seperti baileys), tuning langsung diterapkan ke instance yang
 * sama. Karena sharp adalah singleton CJS, tuning berlaku global untuk semua
 * pemanggil.
 *
 * File ini harus di-import paling awal di index.js.
 *
 * Env (opsional):
 *   SHARP_CACHE_MB     batas cache operasi libvips, default 16 (bawaan sharp: 50)
 *   SHARP_CACHE_ITEMS  batas jumlah item cache, default 32 (bawaan sharp: 100)
 *   SHARP_CONCURRENCY  jumlah thread libvips, default 1 (bawaan sharp: jumlah core)
 */
const num = (v, d) => (Number.isFinite(Number(v)) && v !== undefined && v !== "" ? Number(v) : d);

const cacheMb = num(process.env.SHARP_CACHE_MB, 16);
const cacheItems = num(process.env.SHARP_CACHE_ITEMS, 32);
const threads = num(process.env.SHARP_CONCURRENCY, 1);

// "sharp" (require/import bare) atau path hasil resolve ke .../node_modules/sharp/lib/index.js
const SHARP_RE = /^sharp$|[\\/]node_modules[\\/]sharp[\\/]lib[\\/]index\.js$/;

let applied = false;

function applySharpTuning(sharp) {
  if (applied || !sharp || typeof sharp.cache !== "function") return applied;
  sharp.cache({ memory: cacheMb, files: 0, items: cacheItems });
  sharp.concurrency(threads);
  applied = true;
  return true;
}

const originalLoad = Module._load;
if (!originalLoad.__vanxoneSharpTuned) {
  const patched = function (request, ...rest) {
    const exports = originalLoad.call(this, request, ...rest);
    if (!applied && typeof request === "string" && SHARP_RE.test(request)) {
      try {
        applySharpTuning(exports);
      } catch (err) {
        console.error("[sharp-tuning] gagal menerapkan tuning:", err?.message || err);
      }
    }
    return exports;
  };
  patched.__vanxoneSharpTuned = true;
  Module._load = patched;
}

const sharpTuning = { cacheMb, cacheItems, threads };
const __vxDefault = sharpTuning;

Object.defineProperty(__vxExports, "applySharpTuning", { enumerable: true, get: () => applySharpTuning });
Object.defineProperty(__vxExports, "sharpTuning", { enumerable: true, get: () => sharpTuning });
Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
