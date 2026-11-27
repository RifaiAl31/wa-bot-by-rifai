// owner/resetlevel — satu file: metadata + kode fitur (gabungan dari engine8/plugins/owner/resetlevel.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "resetlevel",
  "command": [
    "resetlevel",
    "resetlvl",
    "rstlevel",
    "rstlvl"
  ],
  "category": "owner",
  "desc": "Reset level user ke 1",
  "usage": ".resetlevel [@user]",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/resetlevel", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/resetlevel.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e8.js");
  const { calculateLevel, getRole } = require("../../lib/ext/src/lib/vanxone-level.e8.js");
  
  const pluginConfig = {
      name: 'resetlevel',
      alias: ['resetlvl', 'rstlevel', 'rstlvl'],
      category: 'owner',
      description: 'Reset level user ke 1',
      usage: '.resetlevel [@user]',
      example: '.resetlevel @user',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
  
      const targetJid = m.quoted?.sender || m.mentionedJid?.[0] || m.sender
      const targetTag = targetJid.split('@')[0]
  
      const user = db.getUser(targetJid) || db.setUser(targetJid)
      if (!user.rpg) user.rpg = {}
  
      const oldLevel = calculateLevel(user.exp || 0)
  
      db.setUser(targetJid, {
          exp: 0,
          rpg: {
              ...user.rpg,
              level: 1,
              maxHealth: 100,
              maxMana: 100,
              maxStamina: 100,
              health: 100,
              mana: 100,
              stamina: 100,
          }
      })
  
      await db.save()
      await m.react('✅')
      await m.reply(
          `✅ Berhasil mereset level @${targetTag}\n\n` +
          `> Level sebelumnya: *${oldLevel}*\n` +
          `> Level sekarang: *1*\n` +
          `> Role: *${getRole(1)}*`,
          { mentions: [targetJid] }
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
