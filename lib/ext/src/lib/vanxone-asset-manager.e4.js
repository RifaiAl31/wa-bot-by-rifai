'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
const fs = __vxDef(require("fs"));
const path = __vxDef(require("path"));

// Memory cache for all local assets
const assetCache = {};

/**
 * Preload all assets into memory at startup.
 * @param {Object} configAssets - botConfig.assets or config.assets object
 */
function preloadAssets(configAssets) {
  if (!configAssets) return;
  for (const [key, filepath] of Object.entries(configAssets)) {
    try {
      if (typeof filepath === 'string' && !filepath.startsWith('http')) {
        const fullPath = path.resolve(process.cwd(), filepath);
        if (fs.existsSync(fullPath)) {
          assetCache[key] = fs.readFileSync(fullPath);
          // Asset preload details are intentionally quiet to keep the panel console clean.
        } else {
          // Optional assets may be absent; skip silently instead of listing each path.
        }
      }
    } catch (e) {
      console.error(`[AssetManager] ❌ Failed to load ${key}:`, e.message);
    }
  }
}

const config = __vxDef(require("../../config.e4.js"));

/**
 * Get the cached asset buffer by key (e.g. 'WhatsApp Bot', 'vanxone2').
 * If not in cache but available in config, loads it synchronously.
 * 
 * @param {string} key - The asset key defined in config.assets
 * @param {Object} [configAssets] - Optional config.assets reference for fallback
 * @returns {Buffer | null} The asset as a Buffer, or null if missing.
 */
function getAssetBuffer(key, configAssets = null) {
  if (assetCache[key]) {
    return assetCache[key];
  }
  
  const assets = configAssets || config?.assets;
  if (assets && assets[key] && !assets[key].startsWith('http')) {
    try {
      const fullPath = path.resolve(process.cwd(), assets[key]);
      if (fs.existsSync(fullPath)) {
        const buf = fs.readFileSync(fullPath);
        assetCache[key] = buf; 
        return buf;
      }
    } catch (e) {
      console.error(`[AssetManager] Failed to read ${key} from disk:`, e.message);
    }
  }
  
  return null;
}

/**
 * Update an asset buffer in memory and save it to disk (useful for owner commands that change assets).
 * 
 * @param {string} key - Asset key
 * @param {Buffer} buffer - New asset buffer
 * @param {string} filepath - The path where it should be saved
 */
function updateAssetAndSave(key, buffer, filepath) {
  assetCache[key] = buffer;
  if (filepath && !filepath.startsWith('http')) {
    try {
      const fullPath = path.resolve(process.cwd(), filepath);
      fs.writeFileSync(fullPath, buffer);
    } catch (e) {
      console.error(`[AssetManager] Failed to write updated asset ${key} to disk:`, e.message);
    }
  }
}

Object.defineProperty(__vxExports, "preloadAssets", { enumerable: true, get: () => preloadAssets });
Object.defineProperty(__vxExports, "getAssetBuffer", { enumerable: true, get: () => getAssetBuffer });
Object.defineProperty(__vxExports, "updateAssetAndSave", { enumerable: true, get: () => updateAssetAndSave });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
