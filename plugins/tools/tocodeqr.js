// tools/tocodeqr — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/tocodeqr.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "tocodeqr",
  "command": [
    "tocodeqr",
    "qrurl",
    "linktoqr"
  ],
  "category": "tools",
  "desc": "Convert link menjadi QR Code",
  "usage": ".tocodeqr <link>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/tocodeqr", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tocodeqr.js'
  const __vxExports = {};
  const pluginConfig = {
    name: "tocodeqr",
    alias: ["qrurl", "linktoqr"],
    category: "tools",
    description: "Convert link menjadi QR Code",
    usage: ".tocodeqr <link>",
    example: ".tocodeqr https://youtube.com",
    cooldown: 3,
    energi: 0,
    isOwner: false,
    isGroup: false,
    isPrivate: false,
    isPremium: false,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
  
    const text = m.args[0]
  
    if (!text) {
      return m.reply(
  `🌸 *WhatsApp Bot QR GENERATOR*
  
  Konichiwa darling ${m.pushName || ""} ✨
  
  Gunakan seperti ini yaa :
  
  .tocodeqr https://example.com
  
  WhatsApp Bot akan mengubah link itu
  menjadi QR Code yang bisa discan 😋`
      )
    }
  
    try {
  
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}`
  
      await sock.sendMessage(m.chat, {
        image: { url: qrUrl },
        caption:
  `💗 *WhatsApp Bot QR CODE*
  
  🔗 Link :
  ${text}
  
  ✨ Scan QR ini untuk membuka link nya yaa darling`
      }, { quoted: m })
  
    } catch (err) {
  
      m.reply(
  `❌ *ERROR*
  
  WhatsApp Bot gagal membuat QR Code 😢
  
  ${err.message}`
      )
  
    }
  
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
