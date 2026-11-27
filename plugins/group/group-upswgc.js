// group/group-upswgc — satu file: metadata + kode fitur (gabungan dari engine2/plugins/group/group-upswgc.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "up"
  ],
  "category": "group",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur up (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/group-upswgc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/group-upswgc.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { "randomBytes": rb } = require("crypto");
  const { PassThrough } = require("stream");
  const ffmpeg = __vxDef(require("fluent-ffmpeg"));
  const { generateWAMessageContent } = require("@whiskeysockets/baileys");
  
  const musicAnnotation = [{
      shouldSkipConfirmation: true,
      embeddedContent: {
          embeddedMusic: {
              musicContentMediaId: '1522282592959121',
              songId: '4515912238639736',
              author: 'WhatsApp Bot 𝐚𝐢',
              title: '— WhatsApp Bot',
              artworkDirectPath: '',
              artworkSha256: '',
              artworkEncSha256: '',
              artistAttribution: '',
              countryBlocklist: 'UlU=',
              isExplicit: false,
              artworkMediaKey: '',
              musicSongStartTimeInMs: '0',
              derivedContentStartTimeInMs: '0',
              overlapDurationInMs: '30000'
          }
      },
      embeddedAction: true
  }]
  
  const warnaMap = {
      biru: 0x1E88E5,
      hijau: 0x25D366,
      kuning: 0xFFD600,
      jingga: 0xFF9800,
      merah: 0xE53935,
      ungu: 0x8E24AA,
      abu: 0x9E9E9E,
      hitam: 0x000000,
      putih: 0xFFFFFF,
      cyan: 0x00BCD4
  }
  const toArgb = c => (0xFF000000 | c) >>> 0
  const emojiRe = /^\p{Extended_Pictographic}/u
  
  async function buildMedia(conn, payload) {
      return generateWAMessageContent(payload, { upload: conn.waUploadToServer })
  }
  
  async function toVN(buffer) {
      return new Promise((resolve, reject) => {
          const input = new PassThrough()
          const output = new PassThrough()
          const chunks = []
  
          input.end(buffer)
  
          ffmpeg(input)
              .noVideo()
              .audioCodec('libopus')
              .format('ogg')
              .on('error', reject)
              .on('end', () => resolve(Buffer.concat(chunks)))
              .pipe(output)
  
          output.on('data', c => chunks.push(c))
      })
  }
  
  const statusContext = (listName, listEmoji) => ({
      expiration: 86400,
      disappearingMode: { initiator: 0 },
      featureEligibilities: {
          cannotBeRanked: false,
          canBeReshared: true,
          canReceiveMultiReact: true
      },
      statusSourceType: 4,
      statusAttributions: [{ type: 10 }],
      isGroupStatus: true,
      statusAudienceMetadata: {
          audienceType: 2,
          listName,
          listEmoji
      }
  })
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      const quoted = m.quoted || m
      const mime = quoted.mimetype || ''
      const hasMedia = /image|video|audio|sticker/i.test(mime)
      let args = (text || '').split(m.quoted ? /[|\s]+/ : '|').map(v => v.trim()).filter(v => v)
  
      let teks = ''
      let warna = ''
      let emoji = ''
      let nama = ''
      let target = ''
  
      for (let v of args) {
          if (/chat\.whatsapp\.com\//i.test(v) || /@g\.us$/.test(v) || /^\d{10,}$/.test(v)) {
              target = v
          } else if (!warna && warnaMap[v.toLowerCase()] !== undefined) {
              warna = v.toLowerCase()
          } else if (!emoji && emojiRe.test(v)) {
              emoji = v
          } else if (!teks && !hasMedia) {
              teks = v
          } else if (!nama) {
              nama = v
          }
      }
  
      let jid = m.chat
  
      if (target) {
          if (/chat\.whatsapp\.com\//i.test(target)) {
              const code = target.split('chat.whatsapp.com/')[1]
              try {
                  const info = await conn.groupGetInviteInfo(code)
                  jid = info.id
              } catch {
                  return m.reply('Link grup tidak valid / bot belum join')
              }
          } else {
              jid = /^\d+$/.test(target) ? target + '@g.us' : target
          }
      }
  
      const quotedText = m.quoted ? (quoted.text || quoted.msg?.text || '') : ''
      const caption = quoted.caption || teks || quotedText || ''
  
      const bgKeys = Object.keys(warnaMap)
      const pilih = warna || bgKeys[Math.floor(Math.random() * bgKeys.length)]
      const bgColor = toArgb(warnaMap[pilih])
      const textColor = pilih === 'putih' ? 0xFF000000 : 0xFFFFFFFF
  
      const finalEmoji = emoji || '✨'
      const finalNama = nama || 'RennZSync — 𝐋𝐘𝐍𝐍𝐀 𝐀𝐈'
  
      if (!caption && !m.quoted) {
          return m.reply(`
  Example:
  
  ${usedPrefix}${command} halo
  ${usedPrefix}${command} halo|merah
  ${usedPrefix}${command} halo|merah|😂|MyStatus
  ${usedPrefix}${command} halo|linkgrup atau groupid
  
  Reply foto/video/audio/sticker:
  ${usedPrefix}${command}
  ${usedPrefix}${command} merah|😂|MyStatus
  ${usedPrefix}${command} linkgrup atau groupid
          `.trim())
      }
  
      const contextInfo = statusContext(finalNama, finalEmoji)
      const id = rb(16).toString('hex').toUpperCase()
      const opts = { messageId: id, additionalNodes: [{ tag: 'meta', attrs: { is_group_status: 'true' } }] }
      const messageContextInfo = { messageSecret: rb(32) }
  
      if (hasMedia) {
          let payload, key
          const buffer = await quoted.download()
  
          if (/image/i.test(mime)) {
              payload = { image: buffer, caption }
              key = 'imageMessage'
          } else if (/video/i.test(mime)) {
              payload = { video: buffer, caption }
              key = 'videoMessage'
          } else if (/audio/i.test(mime)) {
              const vn = await toVN(buffer)
              payload = { audio: vn, ptt: true, mimetype: 'audio/ogg; codecs=opus' }
              key = 'audioMessage'
          } else {
              payload = { sticker: buffer }
              key = 'stickerMessage'
          }
  
          try {
              const content = await buildMedia(conn, payload)
              const media = content[key]
              media.contextInfo = { ...(media.contextInfo || {}), ...contextInfo }
              await conn.relayMessage(jid, { [key]: media, messageContextInfo }, opts)
          } catch (e) {
              console.error(e)
              return m.reply('Gagal upload status: ' + e.message)
          }
          return m.reply(`Succes upload status!\nGroupID: ${jid}`)
      }
  
      await conn.relayMessage(jid, {
          extendedTextMessage: {
              text: caption,
              textArgb: textColor,
              backgroundArgb: bgColor,
              font: 7,
              contextInfo
          },
          messageContextInfo
      }, opts)
  
      return m.reply(`Succes upload status!\nGroupID: ${jid}`)
  }
  
  handler.help = ['swgc', 'up']
  handler.tags = ['status']
  handler.command = /^(swgc|up)$/i
  handler.owner = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
