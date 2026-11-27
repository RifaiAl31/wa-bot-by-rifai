// group/tagmember — satu file: metadata + kode fitur (gabungan dari engine1/plugins/group/tagmember.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "tagmember",
  "command": [
    "tagmember",
    "member",
    "members"
  ],
  "category": "group",
  "desc": "Tag semua member biasa (bukan admin) kecuali bot & pengirim",
  "usage": ".tagmember <pesan>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/tagmember", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tagmember.js'
  const module = { exports: {} }; const exports = module.exports;
  const { getParticipantJid, getParticipantJids } = require("../../lib/ext/src/lib/lidHelper.js")
  
  const pluginConfig = {
      name: 'tagmember',
      alias: ['member', 'members'],
      category: 'group',
      description: 'Tag semua member biasa (bukan admin) kecuali bot & pengirim',
      usage: '.tagmember <pesan>',
      example: '.tagmember Halo para fans!',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 30,
      energi: 0,
      isEnabled: true,
      isAdmin: true,
      isBotAdmin: true
  }
  
  async function handler(m, { sock }) {
      const text = m.text || 'Halo para member!'
      const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net'
      const senderId = m.sender
  
      try {
          const groupMeta = m.groupMetadata
          const participants = groupMeta.participants || []
  
          // FILTER: Bukan Admin, Bukan Bot, Bukan Pengirim
          const members = participants.filter(p => {
              const jid = getParticipantJid(p)
              const isNotAdmin = p.admin === null || p.admin === undefined
              return isNotAdmin && jid !== botId && jid !== senderId
          })
  
          if (members.length === 0) {
              return await m.reply(`❌ *INFO*\n\n> Tidak ada member biasa (non-admin) untuk di-tag.`)
          }
  
          // Ambil JID untuk mentions
          const memberMentions = members.map(p => getParticipantJid(p))
  
          // Buat daftar list untuk tampilan
          const memberList = members
              .map(p => `> @${getParticipantJid(p).split('@')[0]}`)
              .join('\n')
  
          // Style Border ala WhatsApp Bot
          const topBorder = '╔═══════════════════╗'
          const midBorder = '╠═══════════════════╣'
          const bottomBorder = '╚═══════════════════╝'
  
          const message = `${topBorder}\n` +
                          `*_-- 🌟 Panggilan Member --_*\n` +
                          `${midBorder}\n\n` +
                          `📢 *Pesan:* ${text}\n` +
                          `👤 *Oleh:* @${senderId.split('@')[0]}\n\n` +
                          `\`\`\`━━━ ${members.length} MEMBER ━━━\`\`\`\n` +
                          `${memberList}\n\n` +
                          `${bottomBorder}\n` +
                          `> "Kalian adalah bintang di hatiku!"`
  
          // Kirim dengan mentions (member + pengirim)
          await sock.sendMessage(m.chat, { 
              text: message, 
              mentions: [...memberMentions, senderId] 
          }, { quoted: m })
  
      } catch (err) {
          console.error("ERROR TAGMEMBER:", err)
          await m.reply(`❌ *Gomen ne~* ✦\n\n> ${err.message}\n\n_Ai udah coba yang terbaik tapi gagal juga... coba lagi nanti ya~ 🌸_`)
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
