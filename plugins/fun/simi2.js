// fun/simi2 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/simi2.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "simi2",
  "command": [
    "simi2",
    "simisimi2"
  ],
  "category": "fun",
  "desc": "Simi chat variant dari WhatsApp Bot.",
  "usage": ".simi2 <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/simi2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/simi2.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  
  let handler = async (m, { sock, text, prefix, command }) => {
      if (!text) throw `Contoh: ${prefix + command} halo`
      try {
          let res = await fetch(`https://api.nexray.web.id/ai/simisimi?text=${encodeURIComponent(text)}`)
          let json = await res.json()
          if (json.status) {
              await sock.sendMessage(m.chat, { text: json.result }, { quoted: m })
          } else {
              throw 'Gagal mendapatkan respon dari Simi.'
          }
      } catch (e) {
          throw 'Terjadi kesalahan sistem.'
      }
  }
  const pluginConfig = {
    name: 'simi2',
    alias: ['simisimi2'],
    category: 'fun',
    description: 'Simi chat variant dari WhatsApp Bot.',
    usage: '.simi2 <teks>',
    example: '.simi2 <teks>',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
  };
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
