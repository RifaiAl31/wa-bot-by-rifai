// sticker/bratcewek2 — satu file: metadata + kode fitur (gabungan dari engine1/plugins/sticker/bratcewek2.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "bratcewek2",
  "command": [
    "bratcewek2",
    "cewekbrat2",
    "bratperempuan2",
    "bratgirl2"
  ],
  "category": "sticker",
  "desc": "Membuat sticker brat cewek versi 2",
  "usage": ".bratcewek2 <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/bratcewek2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/bratcewek2.js'
  const module = { exports: {} }; const exports = module.exports;
  const axios = require('axios')
  const config = require("../../lib/ext/config.js")
  
  const pluginConfig = {
      name: 'bratcewek2',
      alias: ['cewekbrat2', 'bratperempuan2', 'bratgirl2'],
      category: 'sticker',
      description: 'Membuat sticker brat cewek versi 2',
      usage: '.bratcewek2 <text>',
      example: '.bratcewek2 Hai semua',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const text = m.args.join(' ')
  
      if (!text) {
          return m.reply(
              `🖼️ *ʙʀᴀᴛ cᴇᴡᴇᴋ sᴛɪᴄᴋᴇʀ v2*\n\n` +
              `> Masukkan teks\n\n` +
              `\`Contoh: ${m.prefix}bratcewek2 Hai semua\``
          )
      }
  
      m.react('🕕')
  
      try {
          const url = `https://api.theresav.biz.id/maker/bratcewe?text=${encodeURIComponent(text)}&apikey=${(global.apiKeys && global.apiKeys.theresav) || ''}`
  
          await sock.sendImageAsSticker(
              m.chat,
              url,
              m,
              {
                  packname: config.sticker.packname,
                  author: config.sticker.author
              }
          )
  
          m.react('✅')
      } catch (error) {
          console.error(error)
  
          m.react('❌')
          m.reply(
              `❌ *ᴇʀʀᴏʀ*\n\n` +
              `> ${error.message}`
          )
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
