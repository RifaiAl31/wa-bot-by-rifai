'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxExports = {};
// Pengganti vanxone-logger asli (tanpa chalk/gradient): semua metode (info/success/error/warn/...) mencetak ke konsol bot.
const out = (lvl) => (tag, ...a) => {
  if (lvl === 'debug' && !process.env.VANXONE_DEBUG) return
  try { console.log(`[WhatsApp Bot:${tag}]`, ...a) } catch {}
}
const logger = new Proxy({}, { get: (_t, k) => (typeof k === 'string' ? out(k) : undefined) })
const __vxDefault = logger

Object.defineProperty(__vxExports, "logger", { enumerable: true, get: () => logger });
Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
