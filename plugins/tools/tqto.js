// misc/tqto — satu file: metadata + kode fitur (gabungan dari engine2/plugins/misc/tqto.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "credits",
    "thanks",
    "tqto"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur tqto (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/misc").split('\\').join('/')
module.exports = __vx.plugin("misc/tqto", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tqto.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const sharp = __vxDef(require("sharp"));
  const { prepareWAMessageMedia } = require("@whiskeysockets/baileys");
  
  const THUMB_URL = (/^https?:\/\//.test(String(global.thumbnail || '')) && global.thumbnail) || 'https://img3.pixhost.to/images/6927/798844258_media_1793795404996.jpg'
  const URL = 'https://github.com/'
  
  let handler = async (m, { conn }) => {
    const caption = `
  ╭━━━〔 ✦ PROJECT CREDITS ✦ 〕━━━⬣
  
  > "Open Source is built by people,
  > not by code."
  
  ◈ Founder
  • WhatsApp Bot
  
  ◈ Base
  • WhatsApp Bot
  
  ◈ Library
  • Baileys
  
  ◈ Infrastructure
  • API Providers
  • VPS Providers
  • Testers
  
  ◈ Special Thanks
  • All Supporters
  • All Users
  • My Family
  • Everyone who helped this project grow.
  
  ━━━━━━━━━━━━━━━━━━━━━━
  
  *"Every line of code has a story.
  Thanks for being part of it."* ❤️
  `
  
    const thumb = await getThumbUrl(THUMB_URL)
    const highQualityThumbnail = await createHighQualityThumbnail(conn, thumb)
    const invisible = '\u200B'.repeat(400)
  
    await conn.sendMessage(
      m.chat,
      {
        text: `${URL}${invisible}
  
  ${caption}`,
        linkPreview: {
          'matched-text': URL,
          matchedText: URL,
          canonicalUrl: URL,
          title: '「 WhatsApp Bot 𝐌𝐃 • 𝐂𝐫𝐞𝐝𝐢𝐭𝐬 」',
          description: 'Special Thanks & Contributors',
          previewType: 0,
          jpegThumbnail: thumb,
          highQualityThumbnail,
          thumbnailUrl: THUMB_URL,
          linkPreviewMetadata: {
            linkMediaDuration: 0,
            socialMediaPostType: 4
          }
        },
        favicon: {
          url: THUMB_URL
        }
      },
      {
        quoted: global.fmeta || m
      }
    )
  }
  
  handler.help = ['tqto']
  handler.tags = ['info']
  handler.command = ['tqto', 'thanks', 'credits']
  
  const __vxDefault = handler
  
  async function getThumbUrl(url) {
    try {
      const res = await fetch(url)
      const raw = Buffer.from(await res.arrayBuffer())
  
      return await sharp(raw)
        .resize(1280, 720, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 90 })
        .toBuffer()
    } catch {
      return Buffer.alloc(0)
    }
  }
  
  async function createHighQualityThumbnail(conn, thumb) {
    try {
      if (!thumb.length) return null
  
      const { imageMessage } = await prepareWAMessageMedia(
        { image: thumb },
        {
          upload: conn.waUploadToServer,
          mediaTypeOverride: 'thumbnail-link'
        }
      )
  
      imageMessage.width = 1280
      imageMessage.height = 720
  
      return imageMessage
    } catch {
      return null
    }
  }
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
