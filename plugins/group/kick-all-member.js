// group/kick-all-member — satu file: metadata + kode fitur (gabungan dari engine7/plugins/group/kick-all-member.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "kickall",
  "command": [
    "kickall",
    "kicksemua",
    "cleargrup"
  ],
  "category": "group",
  "desc": "Kick semua member (non-admin)",
  "usage": ".kickall member",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/kick-all-member", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/kick-all-member.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'kickall',
      alias: ['kicksemua','cleargrup'],
      category: 'group',
      description: 'Kick semua member (non-admin)',
      usage: '.kickall member',
      example: '.kickall member',
      isGroup: true,
      isAdmin: true,
      isBotAdmin: true,
      cooldown: 10,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
  
      const args = m.args?.[0]
  
      if (!args || args !== 'member') {
          return m.reply(
  `╭━━〔 ❤️ WhatsApp Bot MASS KICK 〕━━⬣
  ┃
  ┃ ⚔️ *MODE PEMBERSIHAN*
  ┃
  ┃ Gunakan:
  ┃ • .kickall member
  ┃
  ┃ ⚠️ Akan menghapus semua
  ┃ member non-admin
  ┃
  ╰━━━━━━━━━━━━━━━━⬣`
          )
      }
  
      m.react("⏳")
  
      try {
  
          const group = await sock.groupMetadata(m.chat)
  
          const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net'
  
          const members = group.participants.filter(p => 
              !p.admin && p.id !== botNumber
          )
  
          if (members.length === 0) {
              return m.reply("❌ Tidak ada member untuk di kick")
          }
  
          for (let user of members) {
              await sock.groupParticipantsUpdate(m.chat, [user.id], 'remove')
          }
  
          m.react("✅")
  
          return m.reply(
  `╭━━〔 ❤️ WhatsApp Bot SYSTEM 〕━━⬣
  ┃
  ┃ 💀 *MASS CLEAN SUCCESS*
  ┃
  ┃ 👥 Member dihapus:
  ┃ ${members.length} orang
  ┃
  ┃ ⚡ Grup sekarang lebih bersih
  ┃
  ╰━━━━━━━━━━━━━━━━⬣`
          )
  
      } catch (e) {
          m.react("❌")
          return m.reply(
  `╭━━〔 ❌ ERROR SYSTEM 〕━━⬣
  ┃
  ┃ ${e.message}
  ┃
  ╰━━━━━━━━━━━━━━━━⬣`
          )
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
