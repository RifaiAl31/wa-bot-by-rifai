// download/ttimg — satu file: metadata + kode fitur (gabungan dari engine7/plugins/download/ttimg.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "ttimg",
  "command": [
    "ttimg",
    "tiktokimg"
  ],
  "category": "downloader",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/download").split('\\').join('/')
module.exports = __vx.plugin("download/ttimg", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ttimg.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  /**
   * Fitur   : TikTok Slide Downloader
   * Base    : tikwm.com
   * Type    : Plugin ESM
   * Creator : Owner Bot
   */
  
  const { proto, generateWAMessageFromContent, generateWAMessageContent } = require("@whiskeysockets/baileys");
  
  async function getSlide(url) {
    const res = await fetch(`https://www.tikwm.com/api/?url=${url}&hd=1`)
    const json = await res.json()
    return json?.data
  }
  
  async function createImage(url, conn) {
    const { imageMessage } = await generateWAMessageContent(
      { image: { url } },
      { upload: conn.waUploadToServer }
    )
    return imageMessage
  }
  
  const pluginConfig = {
    name: "ttimg",
    alias: ["tiktokimg"],
    category: "download",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { text, prefix, command, sock }) {
      const conn = sock;
      const usedPrefix = prefix || m.prefix || ".";
    if (!text) {
      return m.reply(`Contoh:\n${usedPrefix + command} https://vt.tiktok.com/xxxx`)
    }
  
    await m.react('✨')
  
    try {
      const regex = /(https:\/\/(vt|vm)\.tiktok\.com\/[^\s]+|https:\/\/www\.tiktok\.com\/@[\w.-]+\/video\/\d+)/
      const url = text.match(regex)?.[0]
  
      if (!url) return m.reply('❌ Link TikTok tidak valid.')
  
      const data = await getSlide(url)
      if (!data) return m.reply('❌ Gagal mengambil data.')
  
      const images = data.images || []
      if (!images.length) return m.reply('❌ Post ini bukan slideshow foto.')
  
      const cards = []
  
      for (let img of images.slice(0, 6)) {
        cards.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({
            text: data.title || 'TikTok Slide'
          }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: 'ʀyᴏ yᴀᴍᴀᴅᴀ - ᴍᴅ'
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: data.author.nickname,
            hasMediaAttachment: true,
            imageMessage: await createImage(img, conn)
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
              {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text: 'Buka TikTok',
                  url: `https://www.tiktok.com/@${data.author.unique_id || 'user'}/video/${data.video_id}`
                })
              }
            ]
          })
        })
      }
  
      const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({
                text:
  `✨ *TIKTOK PHOTO*
  
  Judul: ${data.title || '-'}
  Uploader: ${data.author.nickname}
  Total: ${images.length}`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: 'Slide Viewer'
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: false
              }),
              carouselMessage:
                proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                  cards
                })
            })
          }
        }
      }, { quoted: m })
  
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  
    } catch (e) {
      console.error(e)
      m.reply('❌ Gagal mengambil slide.')
    }
  }
  
  handler.register = true
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
