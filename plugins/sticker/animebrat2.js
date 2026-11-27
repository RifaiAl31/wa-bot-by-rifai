// sticker/animebrat2 — satu file: metadata + kode fitur (gabungan dari engine1/plugins/sticker/animebrat2.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "bratanime2",
  "command": [
    "bratanime2",
    "animebrat2"
  ],
  "category": "sticker",
  "desc": "Membuat sticker brat anime versi 2",
  "usage": ".animebrat2 <text>",
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
module.exports = __vx.plugin("sticker/animebrat2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/animebrat2.js'
  const module = { exports: {} }; const exports = module.exports;
  const axios = require('axios')
  const config = require("../../lib/ext/config.js")
  const { f } = require("../../lib/ext/src/lib/undici.js")
  
  const pluginConfig = {
      name: 'bratanime2',
      alias: ['animebrat2'],
      category: 'sticker',
      description: 'Membuat sticker brat anime versi 2',
      usage: '.animebrat2 <text>',
      example: '.animebrat2 WhatsApp Bot',
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
              `🖼️ *ʙʀᴀᴛ ᴀɴɪᴍᴇ sᴛɪᴄᴋᴇʀ v2*\n\n` +
              `> Masukkan teks\n\n` +
              `\`Contoh: ${m.prefix}animebrat2 WhatsApp Bot\``
          )
      }
  
      m.react('🕕')
  
      try {
          const url = `https://api.theresav.biz.id/maker/bratanime?text=${encodeURIComponent(text)}&apikey=${(global.apiKeys && global.apiKeys.theresav) || ''}`
  
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
