'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxUrl = require('url').pathToFileURL(__filename).href;
const __vxExports = {};
// getAssetBuffer(nama) -> Buffer | null. Aset dibaca dari WhatsApp Bot/assets/<nama>[.png|.jpg|.webp|.ttf|.otf].
// "pp-kosong" (foto profil kosong) dibuat otomatis kalau filenya tidak ada.
const fs = __vxDef(require("fs"));
const path = __vxDef(require("path"));
const { fileURLToPath } = require("url");
const { createRequire } = require("module");

const dir = path.join(path.dirname(fileURLToPath(__vxUrl)), '..', '..', 'assets')
// indeks aset: nama (tanpa ekstensi / dengan ekstensi) -> path, dari WhatsApp Bot/assets dan assets/ (rekursif)
const ROOTS = [dir, path.join(dir, '..', '..', 'assets')]
let index = null
function buildIndex() {
  index = new Map()
  const walk = (d, depth = 0) => {
    let list = []
    try { list = fs.readdirSync(d, { withFileTypes: true }) } catch { return }
    for (const e of list) {
      const p = path.join(d, e.name)
      if (e.isDirectory()) { if (depth < 4) walk(p, depth + 1) } else {
        const base = e.name.replace(/\.[^.]+$/, '')
        if (!index.has(e.name)) index.set(e.name, p)
        if (!index.has(base)) index.set(base, p)
      }
    }
  }
  for (const r of ROOTS) walk(r)
}
function assetPath(name) { if (!index) buildIndex(); return index.get(name) || null }
const EXT = ['', '.png', '.jpg', '.jpeg', '.webp', '.ttf', '.otf', '.bin']
const cache = new Map()

function defaultAvatar() {
  try {
    const { createCanvas } = require('@napi-rs/canvas')
    const c = createCanvas(512, 512)
    const g = c.getContext('2d')
    g.fillStyle = '#dfe5e7'; g.fillRect(0, 0, 512, 512)
    g.fillStyle = '#ffffff'
    g.beginPath(); g.arc(256, 200, 92, 0, Math.PI * 2); g.fill()
    g.beginPath(); g.ellipse(256, 470, 170, 150, 0, 0, Math.PI * 2); g.fill()
    return c.toBuffer('image/png')
  } catch { return null }
}

function hasAsset(name) {
  return !!assetPath(name) || EXT.some((e) => fs.existsSync(path.join(dir, name + e)) && fs.statSync(path.join(dir, name + e)).isFile())
}

function getAssetBuffer(name) {
  if (cache.has(name)) return cache.get(name)
  let out = null
  const ap = assetPath(name)
  if (ap) { try { out = fs.readFileSync(ap) } catch {} }
  if (!out) for (const e of EXT) {
    const p = path.join(dir, name + e)
    try { if (fs.statSync(p).isFile()) { out = fs.readFileSync(p); break } } catch {}
  }
  if (!out && name === 'pp-kosong') out = defaultAvatar()
  if (out) cache.set(name, out)
  return out
}
const __vxDefault = getAssetBuffer

// dipakai vanxone-uploader asli
function updateAssetAndSave(key, buffer, filepath) {
  cache.set(key, buffer)
  try { if (filepath && !/^https?:/.test(filepath)) fs.writeFileSync(path.resolve(process.cwd(), filepath), buffer) } catch {}
}
function preloadAssets() {}

Object.defineProperty(__vxExports, "assetPath", { enumerable: true, get: () => assetPath });
Object.defineProperty(__vxExports, "hasAsset", { enumerable: true, get: () => hasAsset });
Object.defineProperty(__vxExports, "getAssetBuffer", { enumerable: true, get: () => getAssetBuffer });
Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
Object.defineProperty(__vxExports, "updateAssetAndSave", { enumerable: true, get: () => updateAssetAndSave });
Object.defineProperty(__vxExports, "preloadAssets", { enumerable: true, get: () => preloadAssets });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
