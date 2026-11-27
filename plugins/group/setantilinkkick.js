// group/setantilinkkick — satu file: metadata + kode fitur (gabungan dari engine7/plugins/group/setantilinkkick.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "setantilinkkick",
  "command": [
    "setantilinkkick",
    "setalkick",
    "setlinkkick",
    "setantlinkkick"
  ],
  "category": "group",
  "desc": "Mengubah batas peringatan AntiLinkKick",
  "usage": ".setantilinkkick <1-20>",
  "owner": false,
  "group": true,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/setantilinkkick", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/setantilinkkick.js'
  const __vxExports = {};
  /*
  ╔══════════════════════════════════════════════╗
  ║       👑  WhatsApp Bot 𝑴𝑫 — GROUP SECURITY        ║
  ╚══════════════════════════════════════════════╝
  
  Fitur by: Owner Bot
  */
  
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  
  const pluginConfig = {
      name: 'setantilinkkick',
      alias: ['setalkick', 'setlinkkick', 'setantlinkkick'],
      category: 'group',
      description: 'Mengubah batas peringatan AntiLinkKick',
      usage: '.setantilinkkick <1-20>',
      example: '.setantilinkkick 5',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: true,
      isBotAdmin: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m) {
      const value = Number.parseInt(m.args?.[0], 10)
      if (!Number.isInteger(value) || value < 1 || value > 20) {
          const db = getDatabase()
          const group = db.getGroup(m.chat) || {}
          const current = Number.parseInt(group.antilinkKickLimit, 10) || 3
          return m.reply(`⚠️ Batas harus angka *1-20*.\n> Batas saat ini: *${current}x*\n> Contoh: *${m.prefix}setantilinkkick 5*`)
      }
  
      const db = getDatabase()
      db.setGroup(m.chat, { antilinkKickLimit: value })
      return m.reply(`✅ *Batas AntiLinkKick diubah*\n> Sekarang member akan di-kick saat mencapai *${value}x* pelanggaran.`)
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
