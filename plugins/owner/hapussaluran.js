// owner/hapussaluran — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/hapussaluran.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "hapussaluran",
  "command": [
    "hapussaluran",
    "deletesaluran",
    "deletenewsletter"
  ],
  "category": "owner",
  "desc": "Hapus saluran/newsletter",
  "usage": ".hapussaluran <id_saluran>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/hapussaluran", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/hapussaluran.js'
  const module = { exports: {} }; const exports = module.exports;
  const pluginConfig = {
      name: 'hapussaluran',
      alias: ['deletesaluran', 'deletenewsletter'],
      category: 'owner',
      description: 'Hapus saluran/newsletter',
      usage: '.hapussaluran <id_saluran>',
      example: '.hapussaluran 120363xxx@newsletter',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const text = m.text?.trim() || ''
      let targetJid = text
  
      if (!targetJid) {
          return m.reply(
              `🗑️ *WhatsApp Bot ᴀɪ ʜᴀᴘᴜs sᴀʟᴜʀᴀɴ*\n\n` +
              `"Saluran mana yang mau dihapus, Sayang~?" 🌟\n\n` +
              `> \`${m.prefix}hapussaluran <id_saluran>\`\n\n` +
              `📝 Contoh:\n` +
              `> \`${m.prefix}hapussaluran 120363xxx@newsletter\`\n\n` +
              `⚠️ Saluran akan dihapus secara permanen!`
          )
      }
  
      if (!targetJid.endsWith('@newsletter')) {
          targetJid += '@newsletter'
      }
  
      m.react('⭐')
  
      try {
          await sock.newsletterDelete(targetJid)
          await m.react('✅')
          return m.reply(
              `🗑️ *sᴀʟᴜʀᴀɴ ᴅɪʜᴀᴘᴜs*\n\n` +
              `"Oke, salurannya udah aku hapus ya~" 💖\n\n` +
              `> ID: ${targetJid}`
          )
      } catch (err) {
          m.react('💔')
          return m.reply(
              `💔 *ᴇʀʀᴏʀ ᴘᴀɴɢɢᴜɴɢ*\n\n` +
              `"Kyaa~ gagal nih~" 🎤\n\n` +
              `> Masalah: ${err.message}`
          )
      }
  }
  
  module.exports = { config: pluginConfig, handler }
  return module.exports
})
