'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
const fs = __vxDef(require("node:fs"));
const path = __vxDef(require("node:path"));

// Legacy quote data is optional. Missing or invalid files return null so the
// command handler can use its existing online fallback instead of crashing.
function readRandomQuote(filename, mapper) {
  try {
    const filePath = path.join(process.cwd(), 'database', filename);
    const raw = fs.readFileSync(filePath, 'utf8');
    const items = JSON.parse(raw);
    if (!Array.isArray(items) || items.length === 0) return null;
    const item = items[Math.floor(Math.random() * items.length)];
    return item && typeof item === 'object' ? mapper(item) : null;
  } catch {
    return null;
  }
}

async function quotesnime() {
  return readRandomQuote('quotesnime.json', item => ({
    quote: item.quote || item.message || '',
    character: item.character || '',
    anime: item.anime || '',
    episode: item.episode || '',
  }));
}

async function quotes() {
  return readRandomQuote('quote.json', item => ({
    quote: item.quote || item.message || '',
    by: item.by || item.author || '',
  }));
}

const __vxDefault = { quotesnime, quotes };

Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
