// group/antiremove — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/antiremove.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "antiremove",
  "command": [
    "antiremove",
    "antihapus",
    "ar"
  ],
  "category": "group",
  "desc": "Mengaktifkan/menonaktifkan anti hapus pesan di grup",
  "usage": ".antiremove <on/off>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/antiremove", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/antiremove.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'antiremove',
      alias: ['antidelete', 'antihapus', 'ar'],
      category: 'group',
      description: 'Mengaktifkan/menonaktifkan anti hapus pesan di grup',
      usage: '.antiremove <on/off>',
      example: '.antiremove on',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true,
      isAdmin: true,
      isBotAdmin: false
  }
  
  async function handler(m, { sock, db }) {
      const action = (m.args || [])[0]?.toLowerCase()
      const group = db.getGroup(m.chat) || {}
  
      if (!action) {
          const status = group.antiremove || 'off'
          await m.reply(
              `🗑️ *AntiRemove*\n\n` +
              `> Status: *${status === 'on' ? '✅ Aktif' : '❌ Nonaktif'}*\n\n` +
              `> \`.antiremove on/off\``
          )
          return
      }
  
      if (action === 'on') {
          db.setGroup(m.chat, { ...group, antiremove: 'on' })
          m.react('✅')
          await m.reply(`✅ *AntiRemove diaktifkan*\n> Pesan yang dihapus akan di-forward ulang.`)
          return
      }
  
      if (action === 'off') {
          db.setGroup(m.chat, { ...group, antiremove: 'off' })
          m.react('❌')
          await m.reply(`❌ *AntiRemove dinonaktifkan*`)
          return
      }
  
      await m.reply(`❌ Gunakan \`.antiremove on\` atau \`.antiremove off\``)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
