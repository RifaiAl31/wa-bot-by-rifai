// canvas/balogo — satu file: metadata + kode fitur (gabungan dari engine3/plugins/canvas/balogo.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "balogo",
  "command": [
    "balogo",
    "bluearchivelogo",
    "ba"
  ],
  "category": "image",
  "desc": "Membuat logo Blue Archive style",
  "usage": ".balogo <textL> & <textR>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/balogo", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/balogo.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const { f } = require("../../lib/ext/src/lib/vanxone-http.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'balogo',
      alias: ['bluearchivelogo', 'ba'],
      category: 'canvas',
      description: 'Membuat logo Blue Archive style',
      usage: '.balogo <textL> & <textR>',
      example: '.balogo Blue & Archive',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const input = m.text?.trim() || ''
      const parts = input.split(/[&,]/).map(s => s.trim()).filter(s => s)
  
      if (parts.length < 2) {
          return m.reply(`🎮 *ʙʟᴜᴇ ᴀʀᴄʜɪᴠᴇ ʟᴏɢᴏ*\n\n> Masukkan 2 teks untuk logo\n\n> Contoh: ${m.prefix}balogo Blue & Archive`)
      }
  
      const textL = parts[0]
      const textR = parts[1]
  
      m.react('🕕')
  
      try {
  
          await sock.sendMedia(m.chat, `https://api.nexray.web.id/maker/balogo?text=${encodeURIComponent(textL)} ${encodeURIComponent(textR)}`, null, m, {
              type: 'image',
          })
  
          m.react('✅')
  
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
