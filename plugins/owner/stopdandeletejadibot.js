// owner/stopdandeletejadibot — satu file: metadata + kode fitur (gabungan dari engine7/plugins/owner/stopdandeletejadibot.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "stopdandeletejadibot",
  "command": [
    "stopdandeletejadibot",
    "deletejadibot",
    "removejadibot",
    "hapusjadibot"
  ],
  "category": "owner",
  "desc": "Stop dan hapus session jadibot user secara permanen",
  "usage": ".stopdandeletejadibot @user",
  "owner": true,
  "group": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/stopdandeletejadibot", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stopdandeletejadibot.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { stopJadibot, getAllJadibotSessions } = require("../../lib/ext/src/lib/vanxone-jadibot-manager.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.e7.js"));
  const pluginConfig = {
      name: 'stopdandeletejadibot',
      alias: ['deletejadibot', 'removejadibot', 'hapusjadibot'],
      category: 'owner',
      description: 'Stop dan hapus session jadibot user secara permanen',
      usage: '.stopdandeletejadibot @user',
      example: '.stopdandeletejadibot @628xxx',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      let target = null
  
      if (m.quoted) {
          target = m.quoted.sender
      } else if (m.mentionedJid?.[0]) {
          target = m.mentionedJid[0]
      } else if (m.text?.trim()) {
          const num = m.text.trim().replace(/[^0-9]/g, '')
          if (num) target = num + '@s.whatsapp.net'
      }
  
      if (!target) {
          const sessions = getAllJadibotSessions()
  
          if (sessions.length === 0) {
              return m.reply(`❌ Tidak ada session jadibot tersimpan`)
          }
  
          let txt = `🗑️ *sᴛᴏᴘ & ᴅᴇʟᴇᴛᴇ ᴊᴀᴅɪʙᴏᴛ*\n\n`
          txt += `Pilih target dengan mention atau reply:\n\n`
  
          sessions.forEach((s, i) => {
              const status = s.isActive ? '🟢' : '⚫'
              txt += `${status} *${i + 1}.* @${s.id}\n`
          })
  
          txt += `\n> Contoh: \`${m.prefix}stopdandeletejadibot @628xxx\``
  
          return sock.sendMessage(m.chat, {
              text: txt,
              mentions: sessions.map(s => s.jid)
          }, { quoted: m })
      }
  
      const id = target.replace(/@.+/g, '')
      const sessions = getAllJadibotSessions()
      const session = sessions.find(s => s.id === id)
  
      if (!session) {
          return m.reply(`❌ Session jadibot untuk *@${id}* tidak ditemukan`, { mentions: [target] })
      }
  
      await m.react('🕕')
  
      try {
          await stopJadibot(target, true)
  
          await m.react('✅')
  
          await sock.sendMessage(m.chat, {
              text: `🗑️ *ᴊᴀᴅɪʙᴏᴛ ᴅɪʜᴀᴘᴜs*\n\n` +
                  `> 📱 Nomor: *@${id}*\n` +
                  `> 🗑️ Status: *Deleted*\n\n` +
                  `Session telah dihapus secara permanen.\n` +
                  `User perlu \`.jadibot\` ulang untuk membuat session baru.`,
              mentions: [target]
          }, { quoted: m })
      } catch (error) {
          await m.react('☢')
          await m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
