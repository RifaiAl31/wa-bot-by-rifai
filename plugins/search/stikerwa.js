// search/stikerwa — satu file: metadata + kode fitur (gabungan dari engine7/plugins/search/stikerwa.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "stikerwa",
  "command": [
    "stikerwa",
    "stickerwa",
    "wasearch",
    "wassticker",
    "stkrwa"
  ],
  "category": "search",
  "desc": "Cari sticker WhatsApp",
  "usage": ".stikerwa <query>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/search").split('\\').join('/')
module.exports = __vx.plugin("search/stikerwa", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stikerwa.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: 'stikerwa',
      alias: ['stickerwa', 'wasearch', 'wassticker', 'stkrwa'],
      category: 'search',
      description: 'Cari sticker WhatsApp',
      usage: '.stikerwa <query>',
      example: '.stikerwa anime',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const query = m.text?.trim()
      
      if (!query) {
          return m.reply(
              `🖼️ *sᴛɪᴋᴇʀ ᴡᴀ sᴇᴀʀᴄʜ*\n\n` +
              `> Masukkan kata kunci pencarian\n\n` +
              `> Contoh: \`${m.prefix}stikerwa anime\``
          )
      }
      
      m.react('🔍')
      
      try {
          const apiKey = config.APIkey?.lolhuman
          
          if (!apiKey) {
              throw new Error('API Key tidak ditemukan di config')
          }
          
          const res = await axios.get(`https://api.lolhuman.xyz/api/stickerwa?apikey=${apiKey}&query=${encodeURIComponent(query)}`, {
              timeout: 30000
          })
          
          if (res.data?.status !== 200 || !res.data?.result?.length) {
              throw new Error('Stiker tidak ditemukan')
          }
          
          const packs = res.data.result.slice(0, 3)
          
          let txt = `🖼️ *sᴛɪᴋᴇʀ ᴡᴀ sᴇᴀʀᴄʜ*\n\n`
          txt += `> Query: *${query}*\n`
          txt += `> Ditemukan: *${res.data.result.length}* pack\n`
          txt += `━━━━━━━━━━━━━━━\n\n`
          
          for (const pack of packs) {
              txt += `╭─「 📦 *${pack.title}* 」\n`
              txt += `┃ 👤 Author: *${pack.author || '-'}*\n`
              txt += `┃ 🔗 ${pack.url}\n`
              txt += `╰━━━━━━━━━━━━━━\n\n`
          }
          
          await m.reply(txt.trim())
          
          const selectedPack = packs[0]
          if (selectedPack.stickers && selectedPack.stickers.length > 0) {
              await m.reply(`⏳ Mengirim ${Math.min(5, selectedPack.stickers.length)} sticker dari pack pertama...`)
              
              const stickersToSend = selectedPack.stickers.slice(0, 2)
              
              for (const stickerUrl of stickersToSend) {
                  try {
                      const stickerRes = await axios.get(stickerUrl, {
                          responseType: 'arraybuffer',
                          timeout: 30000
                      })
                      
                      await sock.sendImageAsSticker(m.chat, Buffer.from(stickerRes.data), m, {
                          packname: selectedPack.title || global.namebot || 'WhatsApp Bot',
                          author: selectedPack.author || 'Bot'
                      })
                      
                      await new Promise(r => setTimeout(r, 500))
                  } catch {
                      continue
                  }
              }
          }
          
          m.react('✅')
          
      } catch (error) {
          m.react('❌')
          m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> ${error.message}`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
