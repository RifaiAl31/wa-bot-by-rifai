// group/antilinkkick — satu file: metadata + kode fitur (gabungan dari engine7/plugins/group/antilinkkick.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "antilinkkick",
  "command": [
    "antilinkkick",
    "alkick",
    "antilinkwarn",
    "linkkick"
  ],
  "category": "group",
  "desc": "Hapus link, beri peringatan, lalu kick saat batas tercapai",
  "usage": ".antilinkkick <on/off/status/reset>",
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
module.exports = __vx.plugin("group/antilinkkick", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/antilinkkick.js'
  const __vxExports = {};
  /*
  ╔══════════════════════════════════════════════╗
  ║       👑  WhatsApp Bot 𝑴𝑫 — GROUP SECURITY        ║
  ╚══════════════════════════════════════════════╝
  
  Fitur by: Owner Bot
  */
  
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  
  const pluginConfig = {
      name: 'antilinkkick',
      alias: ['alkick', 'antilinkwarn', 'linkkick'],
      category: 'group',
      description: 'Hapus link, beri peringatan, lalu kick saat batas tercapai',
      usage: '.antilinkkick <on/off/status/reset>',
      example: '.antilinkkick on',
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
  
  function getLimit(group) {
      const limit = Number.parseInt(group.antilinkKickLimit, 10)
      return Number.isInteger(limit) && limit >= 1 && limit <= 20 ? limit : 3
  }
  
  async function handler(m) {
      const db = getDatabase()
      const action = m.args?.[0]?.toLowerCase()
      const group = db.getGroup(m.chat) || {}
      const limit = getLimit(group)
      const warnings = group.antilinkKickWarnings || {}
  
      if (!action || !['on', 'off', 'status', 'reset'].includes(action)) {
          return m.reply(
              `🚨 *ANTI LINK KICK*\n\n` +
              `> Status: *${group.antilinkKick === 'on' ? '✅ AKTIF' : '❌ NONAKTIF'}*\n` +
              `> Batas pelanggaran: *${limit}x*\n` +
              `> Link dengan/tanpa https akan dihapus.\n` +
              `> Pelanggar mendapat peringatan sampai batas tercapai, lalu otomatis kick.\n\n` +
              `*Cara pakai:*\n` +
              `> ${m.prefix}antilinkkick on\n` +
              `> ${m.prefix}antilinkkick off\n` +
              `> ${m.prefix}setantilinkkick 5\n` +
              `> ${m.prefix}antilinkkick reset @user`
          )
      }
  
      if (action === 'status') {
          return m.reply(
              `🚨 *AntiLinkKick*\n\n` +
              `> Status: *${group.antilinkKick === 'on' ? '✅ AKTIF' : '❌ NONAKTIF'}*\n` +
              `> Batas: *${limit}x*\n` +
              `> Member tercatat: *${Object.keys(warnings).length}*`
          )
      }
  
      if (action === 'on') {
          db.setGroup(m.chat, {
              antilinkKick: 'on',
              antilink: 'off',
              antilinkKickLimit: limit
          })
          return m.reply(`✅ *AntiLinkKick aktif*\n> Batas saat ini: *${limit}x* pelanggaran.`)
      }
  
      if (action === 'off') {
          db.setGroup(m.chat, { antilinkKick: 'off' })
          return m.reply(`❌ *AntiLinkKick nonaktif*`)
      }
  
      const target = m.quoted?.sender || m.mentionedJid?.[0]
      if (!target) {
          return m.reply(`⚠️ Reply atau tag member yang ingin direset.`)
      }
  
      delete warnings[target]
      db.setGroup(m.chat, { antilinkKickWarnings: warnings })
      return m.reply(`✅ Peringatan AntiLinkKick @${target.split('@')[0]} direset.`, { mentions: [target] })
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
