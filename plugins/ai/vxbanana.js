// ai/vxbanana — satu file: metadata + kode fitur (gabungan dari engine1/plugins/ai/vxbanana.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "vxbanana",
  "command": [
    "vxbanana"
  ],
  "category": "ai",
  "desc": "Edit gambar dengan AI menggunakan prompt (nano-banana)",
  "usage": ".vxbanana <prompt>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/vxbanana", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/vxbanana.js'
  const module = { exports: {} }; const exports = module.exports;
  const { live3d } = require("../../lib/ext/src/scraper/seaart.js")
  
  const pluginConfig = {
      name: 'vxbanana',
      alias: [],
      category: 'ai',
      description: 'Edit gambar dengan AI menggunakan prompt (nano-banana)',
      usage: '.vxbanana <prompt>',
      example: '.vxbanana make it anime style',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 30,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const prompt = m.args.join(' ').trim()
  
      if (!prompt) {
          return m.reply(
              `🍌 *WhatsApp Bot ʙᴀɴᴀɴᴀ sᴜᴘᴇʀ*\n\n` +
              `Haii~ Ai bisa bantu edit gambarmu pakai AI lho! Kasih tahu Ai mau diapain gambarnya~ 🌸\n\n` +
              `\`Contoh: ${m.prefix}vxbanana make it anime style\`\n\n` +
              `> Reply atau kirim gambar dengan caption ya~ Ai tunggu! ✨`
          )
      }
  
      const isImage = m.isImage || (m.quoted && m.quoted.isImage)
      if (!isImage) {
          return m.reply(`🍌 *ɴᴀɴᴏ ʙᴀɴᴀɴᴀ*\n\nEhh~ Ai belum lihat gambarnya nih!\n> Reply atau kirim gambar dengan caption ya~ 🌸`)
      }
  
      m.react('🕕')
  
      try {
          let mediaBuffer
          if (m.isImage && m.download) {
              mediaBuffer = await m.download()
          } else if (m.quoted && m.quoted.isImage && m.quoted.download) {
              mediaBuffer = await m.quoted.download()
          }
  
          if (!mediaBuffer || !Buffer.isBuffer(mediaBuffer)) {
              m.react('❌')
              return m.reply(`❌ *Ara ara~*\n\n> Ai gagal ngunduh gambarnya nih... coba kirim ulang ya~ 🥺`)
          }
  
          const { image: resultBuffer } = await live3d(mediaBuffer, prompt)
  
          await sock.sendMessage(
              m.chat,
              { image: resultBuffer, caption: `✨ *DONE!* ✨\n\n🍌 Gambarnya udah di-edit sama Banana AI~ Keren kan? ⭐` },
              { quoted: m }
          )
  
          m.react('✅')
  
      } catch (error) {
          m.react('❌')
          console.error('[vxbanana] ERROR:', error)
          m.reply(
              `🍀 *Waduuhh~ Ada yang tidak beres nih!*\n\n` +
              `> ${error?.message || String(error)}\n\n` +
              `💕 Coba lagi nanti ya~ tapi jangan spam dulu, Ai capek nih! ✨`
          )
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
