// search/pinterest2 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/search/pinterest2.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "pins2",
  "command": [
    "pins2",
    "pinsearch2",
    "pinterestsearch2"
  ],
  "category": "search",
  "desc": "Cari gambar di Pinterest (Carousel/Swipe)",
  "usage": ".pins <query>",
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
module.exports = __vx.plugin("search/pinterest2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/pinterest2.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { pinterest } = require("btch-downloader");
  const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = require("@whiskeysockets/baileys");
  const axios = __vxDef(require("axios"));
  const sharp = __vxDef(require("sharp"));
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  const pluginConfig = {
      name: 'pins2',
      alias: ['pinsearch2', 'pinterestsearch2'],
      category: 'search',
      description: 'Cari gambar di Pinterest (Carousel/Swipe)',
      usage: '.pins <query>',
      example: '.pins Zhao Lusi',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 10,
      energi: 1,
      isEnabled: true
  }
  
  async function handler(m, { sock, config: botConfig }) {
      const query = m.text?.trim()
      if (!query) {
          return m.reply(
              `╭━━━〔 🔍 PINTEREST CAROUSEL 〕━━━⬣
  ┃
  ┃ ✨ *Cari gambar dengan swipe!*
  ┃
  ┃ 📝 *Contoh:*
  ┃ \`${m.prefix}pins Zhao Lusi\`
  ┃
  ┃ 💕 *Geser kiri/kanan* untuk lihat semua
  ╰━━━━━━━━━━━━━━━━⬣`
          )
      }
  
      m.react('🔍')
  
      try {
          const data = await pinterest(query)
  
          const results = data?.result?.result?.result || data?.result || []
          if (!results || results.length === 0) {
              m.react('❌')
              return m.reply(`❌ Tidak ditemukan hasil untuk: *${query}*`)
          }
  
          // Prepare carousel cards (semua hasil, tanpa batas)
          const carouselCards = []
          
          for (let i = 0; i < results.length; i++) {
              const item = results[i]
              const imageUrl = item.image_url ||
                  item.images?.orig?.url ||
                  item.images?.['736x']?.url ||
                  item.url ||
                  item.thumbnail
  
              if (!imageUrl) continue
  
              try {
                  // Download & resize image untuk carousel
                  const imgResponse = await axios.get(imageUrl, {
                      responseType: 'arraybuffer',
                      timeout: 15000
                  })
                  
                  let imageBuffer = Buffer.from(imgResponse.data)
                  
                  // Resize ke 300x300 biar rapi
                  imageBuffer = await sharp(imageBuffer)
                      .resize(300, 300, { fit: 'cover' })
                      .jpeg({ quality: 80 })
                      .toBuffer()
                  
                  const cardMedia = await prepareWAMessageMedia({
                      image: imageBuffer
                  }, { upload: sock.waUploadToServer })
                  
                  const title = item.title || 'Pinterest Image'
                  const author = item.uploader?.full_name || item.author || 'Unknown'
                  const followers = item.uploader?.follower_count || item.followers || '-'
                  
                  const cardBody = 
  `╭─〔 📌 PINTEREST ] 
  │ 📝 *Title:* ${title.substring(0, 40)}${title.length > 40 ? '...' : ''}
  │ 👤 *Author:* ${author}
  │ 📊 *Followers:* ${followers}
  │ 🖼️ *Gambar ${i+1}/${results.length}*
  ╰──────────────
  
  💕 *Geser untuk gambar selanjutnya, Darling~*`
  
                  const cardMessage = {
                      header: proto.Message.InteractiveMessage.Header.fromObject({
                          title: `📌 ${query.toUpperCase()} - ${i+1}/${results.length}`,
                          hasMediaAttachment: true,
                          ...cardMedia
                      }),
                      body: proto.Message.InteractiveMessage.Body.fromObject({
                          text: cardBody
                      }),
                      footer: proto.Message.InteractiveMessage.Footer.create({
                          text: `✨ WhatsApp Bot Pinterest • Swipe kiri/kanan untuk lihat semua ✨`
                      }),
                      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                          buttons: [{
                              name: 'quick_reply',
                              buttonParamsJson: JSON.stringify({
                                  display_text: `💾 Simpan Gambar ${i+1}`,
                                  id: `${m.prefix}saveimg ${imageUrl}`
                              })
                          }]
                      })
                  }
                  
                  carouselCards.push(cardMessage)
                  
              } catch (err) {
                  console.log(`[Pins] Gambar ${i+1} error:`, err.message)
                  continue
              }
          }
          
          if (carouselCards.length === 0) {
              m.react('❌')
              return m.reply(`❌ Gagal memuat gambar untuk: *${query}*`)
          }
          
          const headerText = 
  `╭━━━〔 💗 WhatsApp Bot PINTEREST CAROUSEL 💗 〕━━━⬣
  ┃
  ┃ 🔎 *Query:* ${query}
  ┃ 🖼️ *Total:* ${carouselCards.length} gambar
  ┃
  ┃ ✨ *Geser ke samping (swipe left/right)* ✨
  ┃ 💕 Untuk melihat semua gambar, Darling~
  ┃
  ┃ 📌 *Tap tombol* untuk menyimpan gambar
  ╰━━━━━━━━━━━━━━━━⬣`
  
          const msg = await generateWAMessageFromContent(m.chat, {
              viewOnceMessage: {
                  message: {
                      messageContextInfo: {
                          deviceListMetadata: {},
                          deviceListMetadataVersion: 2
                      },
                      interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                          body: proto.Message.InteractiveMessage.Body.fromObject({
                              text: headerText
                          }),
                          footer: proto.Message.InteractiveMessage.Footer.fromObject({
                              text: `✨ WhatsApp Bot Pinterest | “Nikmati gambarnya, Darling~” ✨`
                          }),
                          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                              cards: carouselCards
                          })
                      })
                  }
              }
          }, {
              userJid: m.sender
          })
          
          await sock.relayMessage(m.chat, msg.message, {
              messageId: msg.key.id
          })
          
          m.react('💗')
  
      } catch (err) {
          console.error('[Pins] Error:', err.message)
          m.react('❌')
          m.reply(
  `╭━━━〔 ❌ WhatsApp Bot ERROR ❌ 〕━━━⬣
  ┃
  ┃ *Error:* ${err.message}
  ┃
  ┃ Coba lagi nanti ya, Darling~
  ╰━━━━━━━━━━━━━━━━⬣`
          )
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
