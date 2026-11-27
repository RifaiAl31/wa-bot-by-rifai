// group/antiswgc — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/antiswgc.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "antiswgc",
  "command": [
    "antiswgc",
    "antiswgroup",
    "antiswmentiongc",
    "antiswtaggc"
  ],
  "category": "group",
  "desc": "Deteksi tipe SW group mention atau status mention yang masuk ke grup",
  "usage": ".antiswgc <on/off>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/antiswgc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/antiswgc.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  
  const pluginConfig = {
      name: 'antiswgc',
      alias: ['antiswgroup', 'antiswmentiongc', 'antiswtaggc'],
      category: 'group',
      description: 'Deteksi tipe SW group mention atau status mention yang masuk ke grup',
      usage: '.antiswgc <on/off>',
      example: '.antiswgc on',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      isAdmin: true,
      isBotAdmin: true,
      cooldown: 3,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { db }) {
      const action = (m.args || [])[0]?.toLowerCase()
      const group = db.getGroup(m.chat) || {}
  
      if (!action) {
          const status = group.antiswgc || 'off'
          await m.reply(
              `📡 *ᴀɴᴛɪsᴡɢᴄ*\n\n` +
              `> Status: *${status === 'on' ? '✅ Aktif' : '❌ Nonaktif'}*\n\n` +
              `> Fitur ini mendeteksi tipe SW group mention seperti:\n` +
              `> • groupStatusMentionMessage\n` +
              `> • groupMentionedMessage\n` +
              `> • statusMentionMessage\n` +
              `> • contextInfo.groupMentions\n\n` +
              `> \`${m.prefix}antiswgc on\`\n` +
              `> \`${m.prefix}antiswgc off\``
          )
          return
      }
  
      if (action === 'on') {
          db.setGroup(m.chat, { ...group, antiswgc: 'on' })
          await m.reply('✅ *AntiSWGC aktif*\n\n> Tipe SW group mention akan dihapus otomatis.')
          return
      }
  
      if (action === 'off') {
          db.setGroup(m.chat, { ...group, antiswgc: 'off' })
          await m.reply('❌ *AntiSWGC nonaktif*')
          return
      }
  
      await m.reply('❌ Gunakan: on atau off')
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
