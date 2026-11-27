'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const __vxDef = (m) => (m && m.__esModule ? m.default : m);
const __vxExports = {};
// Pengelola API pihak ketiga. Kunci diambil dari global.apiKeys (settings.js).
const axios = __vxDef(require("axios"));
const key = (k) => (global.apiKeys && global.apiKeys[k]) || ''

const vanxoneApi = {
  cuki: {
    // kirim pesan anonim ke satu tautan NGL
    async sendNgl({ link, text }, opts = {}) {
      const { data } = await axios.get('https://api.cuki.biz.id/api/tools/sendngl', {
        params: { apikey: key('cuki') || 'cuki-x', link, text },
        timeout: opts.timeout || 30000
      })
      return data
    }
  }
}
// Pengelola lengkap (apiFaa, covenant, neoxr, cuki, nexray, yupra, ...) ada di versi e7; versi tipis di atas hanya punya cuki.sendNgl.
// Tanpa ini, fitur yang memanggil vanxoneApi.apiFaa.get / covenant / neoxr error "undefined".
let __vxDefault = vanxoneApi
try {
  const full = __vxDef(require("./vanxone-apimanager.e7.js"))
  if (full) {
    try { if (full.cuki && !full.cuki.sendNgl) full.cuki.sendNgl = vanxoneApi.cuki.sendNgl } catch {}
    __vxDefault = full
  }
} catch {}

Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
Object.defineProperties(exports, Object.getOwnPropertyDescriptors(__vxExports));
