// sticker/linesticker — satu file: metadata + kode fitur (gabungan dari engine3/plugins/sticker/linesticker.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "linesticker",
  "command": [
    "linesticker",
    "linepack",
    "line"
  ],
  "category": "sticker",
  "desc": "Download sticker pack LINE",
  "usage": ".linesticker <url>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 25,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/sticker").split('\\').join('/')
module.exports = __vx.plugin("sticker/linesticker", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/linesticker.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'linesticker',
      alias: ['linepack', 'line'],
      category: 'sticker',
      description: 'Download sticker pack LINE',
      usage: '.linesticker <url>',
      example: '.linesticker https://store.line.me/stickershop/product/9801/en',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 25,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const url = m.args?.[0]?.trim()
      
      if (!url || !url.includes('store.line.me')) {
          return m.reply(
              `🎨 *ʟɪɴᴇ sᴛɪᴄᴋᴇʀ ᴘᴀᴄᴋ*\n\n` +
              `> Download LINE sticker pack\n\n` +
              `╭┈┈⬡「 📋 *ᴄᴀʀᴀ ᴘᴀᴋᴀɪ* 」\n` +
              `┃ ${m.prefix}linesticker <url>\n` +
              `╰┈┈┈┈┈┈┈┈⬡\n\n` +
              `*ᴄᴀʀᴀ ᴅᴀᴘᴀᴛ ᴜʀʟ:*\n` +
              `> 1. Buka https://store.line.me\n` +
              `> 2. Pilih sticker pack\n` +
              `> 3. Copy URL dari browser\n\n` +
              `*ᴄᴏɴᴛᴏʜ:*\n` +
              `> ${m.prefix}linesticker https://store.line.me/stickershop/product/9801/en`
          )
      }
      
      await m.react('🕕')
      
      try {
          const apikey = config.APIkey?.neoxr
          if (!apikey) {
              await m.react('❌')
              return m.reply(`❌ API Key Neoxr tidak ditemukan di config!`)
          }
          
          const apiUrl = `https://api.neoxr.eu/api/linesticker?url=${encodeURIComponent(url)}&apikey=${apikey}`
          const res = await axios.get(apiUrl, { timeout: 60000 })
          
          if (!res.data?.status || !res.data?.data) {
              await m.react('❌')
              return m.reply(`❌ Gagal mengambil sticker dari URL tersebut!`)
          }
          
          const data = res.data.data
          const title = data.title || 'LINE Sticker'
          const author = data.author || 'Unknown'
          const isAnimated = data.animated || false
          
          const stickerUrls = isAnimated && data.sticker_animation_url?.length
              ? data.sticker_animation_url
              : data.sticker_url || []
          
          if (!stickerUrls.length) {
              await m.react('❌')
              return m.reply(`❌ Tidak ada sticker ditemukan!`)
          }
          
          await m.reply(
              `🎨 *ʟɪɴᴇ sᴛɪᴄᴋᴇʀ ᴘᴀᴄᴋ*\n\n` +
              `╭┈┈⬡「 📦 *ɪɴꜰᴏ* 」\n` +
              `┃ 📝 *Title:* ${title}\n` +
              `┃ 👤 *Author:* ${author}\n` +
              `┃ 🎬 *Animated:* ${isAnimated ? 'Ya' : 'Tidak'}\n` +
              `┃ 📊 *Total:* ${stickerUrls.length}\n` +
              `╰┈┈┈┈┈┈┈┈⬡\n\n` +
              `> 🕕 Mengirim sticker...`
          )
          
          const maxStickers = Math.min(stickerUrls.length, 10)
          const packname = title
          const packAuthor = author
          
          let sent = 0
          for (let i = 0; i < maxStickers; i++) {
              try {
                  const response = await axios.get(stickerUrls[i], {
                      responseType: 'arraybuffer',
                      timeout: 30000,
                      headers: { 'User-Agent': 'Mozilla/5.0' }
                  })
                  const buffer = Buffer.from(response.data)
                  
                  if (isAnimated) {
                      await sock.sendVideoAsSticker(m.chat, buffer, m, { packname, author: packAuthor })
                  } else {
                      await sock.sendImageAsSticker(m.chat, buffer, m, { packname, author: packAuthor })
                  }
                  sent++
                  await new Promise(r => setTimeout(r, 600))
              } catch (e) { globalThis.__vanxoneCatch?.(e);
                  console.error('[LineSticker] Sticker error:', e.message)
              }
          }
          
          if (sent > 0) {
              await m.react('✅')
              await m.reply(`✅ Berhasil kirim ${sent}/${stickerUrls.length} sticker`)
          } else {
              await m.react('☢')
              await m.reply(`❌ Gagal mengirim sticker`)
          }
          
      } catch (error) { globalThis.__vanxoneCatch?.(error);
          console.error('[LineSticker] Error:', error.message)
          await m.react('☢')
          m.reply(te(m.prefix, m.command, m.pushName))
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
