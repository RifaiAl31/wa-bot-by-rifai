// fun/putus — satu file: metadata + kode fitur (gabungan dari engine3/plugins/fun/putus.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "putus",
  "command": [
    "breakup",
    "cerai"
  ],
  "category": "fun",
  "desc": "Memutuskan hubungan dengan pasangan",
  "usage": ".putus",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/putus", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/putus.js'
  const __vxExports = {};
  /**
   * Putus - End relationship
   */
  
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
      name: 'putus',
      alias: ['breakup', 'cerai'],
      category: 'fun',
      description: 'Memutuskan hubungan dengan pasangan',
      usage: '.putus',
      example: '.putus',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 60,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      let senderData = db.getUser(m.sender) || {}
      if (!senderData.fun) senderData.fun = {}
      if (!senderData.fun.pasangan) {
          await m.react('❌')
          return m.reply(
              `❌ *Kamu gak ada pacar wehh*\n\n` +
              `Cari dulu dengan \`${m.prefix}tembak @tag\``
          )
      }
      const exPartner = senderData.fun.pasangan
      let exData = db.getUser(exPartner) || {}
      delete senderData.fun.pasangan
      if (exData.fun?.pasangan === m.sender) {
          delete exData.fun.pasangan
          db.setUser(exPartner, exData)
      }
      db.setUser(m.sender, senderData)
      await m.react('💔')
      await m.reply(
          `💔 *PUTUS!*\n\n` +
          `@${m.sender.split('@')[0]} dan @${exPartner.split('@')[0]} resmi putus !!\n\n` +
          `Semoga mendapat yang lebih baik! 🙏`,
          { mentions: [m.sender, exPartner] }
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
