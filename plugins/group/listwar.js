// group/listwar — satu file: metadata + kode fitur (gabungan dari engine1/plugins/group/listwar.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "listwar",
  "command": [
    "listwar",
    "triggerlist",
    "autolist"
  ],
  "category": "group",
  "desc": "Aktif/nonaktifkan trigger list grup (ketik ",
  "usage": ".listwar <on/off>",
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
module.exports = __vx.plugin("group/listwar", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/listwar.js'
  const module = { exports: {} }; const exports = module.exports;
  const GL = require("../../lib/ext/src/lib/listWar.js")
  
  const pluginConfig = {
      name: 'listwar',
      alias: ['triggerlist', 'autolist'],
      category: 'group',
      description: 'Aktif/nonaktifkan trigger list grup (ketik "war" / "list" tanpa prefix)',
      usage: '.listwar <on/off>',
      example: '.listwar on',
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
          const on = GL.isEnabled(m.chat)
          return m.reply(
              `📋 *ʟɪsᴛ ᴛʀɪɢɢᴇʀ*\n\n` +
              `> Status: *${on ? '✅ Aktif' : '❌ Nonaktif'}*\n` +
              `> Jumlah list: *${Object.keys(GL.getLists(m.chat)).length}*\n\n` +
              `> \`${m.prefix}listwar on\` / \`${m.prefix}listwar off\`\n` +
              `> Kalau aktif, ketik nama list (contoh: *war*) atau *list* tanpa prefix, bot langsung membalas.`
          )
      }
  
      if (action === 'on') {
          db.setGroup(m.chat, { ...group, listWar: 'on' })
          try { await db.save() } catch {}
          m.react('✅')
          return m.reply(`✅ *List trigger diaktifkan*\n\n> Ketik *list* untuk melihat daftar list grup ini.`)
      }
  
      if (action === 'off') {
          db.setGroup(m.chat, { ...group, listWar: 'off' })
          try { await db.save() } catch {}
          m.react('❌')
          return m.reply(`❌ *List trigger dinonaktifkan*\n\n> List tetap tersimpan, dan command \`${m.prefix}list\` masih bisa dipakai.`)
      }
  
      return m.reply(`❌ *Ehh~* Gunakan \`${m.prefix}listwar on\` atau \`${m.prefix}listwar off\``)
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  
  return module.exports
})
