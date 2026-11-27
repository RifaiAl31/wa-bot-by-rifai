// ai/kimi — satu file: metadata + kode fitur (gabungan dari engine7/plugins/ai/kimi.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "kimi",
  "command": [
    "kimi"
  ],
  "category": "ai",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/kimi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/kimi.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const pluginConfig = {
    name: "kimi",
    alias: [],
    category: "ai",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock, text }) {
      const conn = sock;
    if (!text) return m.reply('Masukkan pertanyaan!\nContoh: .kimi apa itu bot wa')
  
    try {
      let res = await fetch(`https://api.zenzxz.my.id/api/ai/kimi?query=${encodeURIComponent(text)}`)
      let json = await res.json()
      let hasil = json?.data?.response || json?.response || 'Tidak ada respons dari AI.'
      m.reply(hasil)
    } catch (e) {
      m.reply('yahh error.')
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
