// group/antitagsw — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/antitagsw.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "antitagsw",
  "command": [
    "antitag",
    "antistatustag"
  ],
  "category": "group",
  "desc": "Mengaktifkan/menonaktifkan anti tag status di grup",
  "usage": ".antitagsw <on/off>",
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
module.exports = __vx.plugin("group/antitagsw", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/antitagsw.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'antitagsw',
      alias: ['antitag', 'antistatustag'],
      category: 'group',
      description: 'Mengaktifkan/menonaktifkan anti tag status di grup',
      usage: '.antitagsw <on/off>',
      example: '.antitagsw on',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 3,
      energi: 0,
      isEnabled: true,
      isAdmin: true,
      isBotAdmin: true
  }
  
  async function handler(m, { sock, db }) {
      const args = m.args || []
      const action = args[0]?.toLowerCase()
      const groupId = m.chat
      const group = db.getGroup(groupId) || {}
  
      if (!action) {
          const status = group.antitagsw || 'off'
  
          await m.reply(
              `📢 *ᴀɴᴛɪᴛᴀɢsᴡ sᴇᴛᴛɪɴɢs*\n\n` +
              `> Status: *${status === 'on' ? '✅ Aktif' : '❌ Nonaktif'}*\n\n` +
              `> Fitur ini menghapus pesan tag status\n` +
              `> (groupStatusMentionMessage)\n\n` +
              `\`\`\`━━━ ᴘɪʟɪʜᴀɴ ━━━\`\`\`\n` +
              `> \`${m.prefix}antitagsw on\` → Aktifkan\n` +
              `> \`${m.prefix}antitagsw off\` → Nonaktifkan`
          )
          return
      }
  
      if (action === 'on') {
          db.setGroup(groupId, { ...group, antitagsw: 'on' })
          await m.reply(
              `✅ *ᴀɴᴛɪᴛᴀɢsᴡ ᴀᴋᴛɪꜰ*\n\n` +
              `> Anti tag status berhasil diaktifkan!\n` +
              `> Pesan tag status akan dihapus otomatis.`
          )
          return
      }
  
      if (action === 'off') {
          db.setGroup(groupId, { ...group, antitagsw: 'off' })
          await m.reply(
              `❌ *ᴀɴᴛɪᴛᴀɢsᴡ ɴᴏɴᴀᴋᴛɪꜰ*\n\n` +
              `> Anti tag status berhasil dinonaktifkan.`
          )
          return
      }
  
      await m.reply(
          `❌ *ᴘɪʟɪʜᴀɴ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ*\n\n` +
          `> Gunakan: on atau off`
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
