// owner/stopalljadibot — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/stopalljadibot.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "stopalljadibot",
  "command": [
    "stopalljadibot",
    "stopsemuajadibot",
    "killalljadibots"
  ],
  "category": "owner",
  "desc": "Hentikan semua jadibot yang aktif",
  "usage": ".stopalljadibot",
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
module.exports = __vx.plugin("owner/stopalljadibot", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stopalljadibot.js'
  const module = { exports: {} }; const exports = module.exports;
  const { stopAllJadibots, getActiveJadibots } = require("../../lib/ext/src/lib/jadibotManager.js")
  
  const pluginConfig = {
      name: 'stopalljadibot',
      alias: ['stopsemuajadibot', 'killalljadibots'],
      category: 'owner',
      description: 'Hentikan semua jadibot yang aktif',
      usage: '.stopalljadibot',
      example: '.stopalljadibot',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const active = getActiveJadibots()
  
      if (active.length === 0) {
          return m.reply(`❌ *Ehh~* Tidak ada jadibot yang aktif~ 🥺`)
      }
  
      m.react('🕕')
  
      try {
          const stopped = await stopAllJadibots()
  
          m.react('✅')
  
          const names = stopped.map(id => `@${id}`).join(', ')
  
          await sock.sendMessage(m.chat, {
              text: `🛑 *sᴇᴍᴜᴀ ᴊᴀᴅɪʙᴏᴛ ᴅɪʜᴇɴᴛɪᴋᴀɴ*\n\n` +
                  `> 📊 Total: *${stopped.length}* jadibot\n` +
                  `> 💾 Session: *Tersimpan*\n\n` +
                  `Dihentikan: ${names}\n\n` +
                  `> Semua session disimpan dan bisa diaktifkan ulang.`,
              mentions: stopped.map(id => id + '@s.whatsapp.net')
          }, { quoted: m })
      } catch (error) {
          m.react('❌')
          await m.reply(`❌ *Gomen ne~* ✦\n\n> ${error.message}\n\n_Ai udah coba yang terbaik tapi gagal juga... coba lagi nanti ya~ 🌸_`)
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  
  return module.exports
})
