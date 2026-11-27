// owner/onlyowner — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/onlyowner.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "onlyowner",
  "command": [
    "onlyowner",
    "onlyownerbot",
    "modeowner",
    "owneronly"
  ],
  "category": "owner",
  "desc": "Atur mode hanya owner yang bisa pakai bot (owner utama + owner tambahan + creator)",
  "usage": ".onlyowner on/off",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/onlyowner", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/onlyowner.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: 'onlyowner',
      alias: ['onlyownerbot', 'modeowner', 'owneronly'],
      category: 'owner',
      description: 'Atur mode hanya owner yang bisa pakai bot (owner utama + owner tambahan + creator)',
      usage: '.onlyowner on/off',
      example: '.onlyowner on',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock, db }) {
      const args = m.args || []
      const mode = args[0]?.toLowerCase()
      
      if (!mode || (mode !== 'on' && mode !== 'off')) {
          return m.reply(
  `╭───〔 WhatsApp Bot 𝗢𝗡𝗟𝗬𝗢𝗪𝗡𝗘𝗥 〕───⬣
  │
  │ ✦ *Cara Pakai*
  │
  │  𖦹 .onlyowner on  = Aktifkan mode owner only
  │  𖦹 .onlyowner off = Matikan mode owner only
  │
  │ ✦ *Fungsi*
  │
  │  𖦹 Saat aktif, HANYA owner utama,
  │  𖦹 owner tambahan, dan creator
  │  𖦹 yang bisa menggunakan bot
  │
  │ ✦ *Contoh*
  │
  │  𖦹 .onlyowner on
  │
  ╰──────────────────⬣`
          )
      }
      
      const isEnabled = mode === 'on'
      
      // Simpan ke database (global setting)
      db.setting('onlyOwnerMode', isEnabled)
      await db.save()
      
      const status = isEnabled ? '🟢 *AKTIF*' : '🔴 *NONAKTIF*'
      const pesan = isEnabled 
          ? `> Hanya *OWNER UTAMA, OWNER TAMBAHAN & CREATOR* yang bisa menggunakan bot sekarang!`
          : `> Semua *USER* bisa menggunakan bot sekarang!`
      
      m.reply(
  `╭───〔 WhatsApp Bot 𝗢𝗡𝗟𝗬𝗢𝗪𝗡𝗘𝗥 〕───⬣
  │
  │ ✦ *Status Mode*
  │
  │  ${status}
  │
  │ ${pesan}
  │
  │ ✦ *Diubah oleh*
  │  @${m.sender.split('@')[0]}
  │
  ╰──────────────────⬣`,
          { mentions: [m.sender] }
      )
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
