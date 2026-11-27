// jpm/jpmalbum — satu file: metadata + kode fitur (gabungan dari engine7/plugins/jpm/jpmalbum.js)
const gcsel = require("../../lib/gcselect.js")
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "jpmalbum",
  "command": [
    "jpmalbum",
    "jpmab",
    "jaseralbum"
  ],
  "category": "broadcast",
  "desc": "Kirim album (multi foto/video) ke semua grup",
  "usage": ".jpmalbum <caption>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/jpm").split('\\').join('/')
module.exports = __vx.plugin("jpm/jpmalbum", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/jpmalbum.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  const { fetchGroupsSafe } = require("../../lib/ext/src/lib/vanxone-jpm-helper.js");
  const { generateWAMessage, generateWAMessageFromContent, jidNormalizedUser } = require("@whiskeysockets/baileys");
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const crypto = __vxDef(require("crypto"));
  const fs = __vxDef(require("fs"));
  const { getAssetBuffer } = require("../../lib/ext/src/lib/vanxone-asset-manager.e7.js");
  
  let cachedThumb = getAssetBuffer("vanxone2");
  
  const pluginConfig = {
      name: 'jpmalbum',
      alias: ['jpmab', 'jaseralbum'],
      category: 'jpm',
      description: 'Kirim album (multi foto/video) ke semua grup',
      usage: '.jpmalbum <caption>',
      example: '.jpmalbum Promo terbaru!',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 30,
      energi: 0,
      isEnabled: true
  }
  
  const COLLECT_WINDOW = 60000
  
  function getContextInfo(title = '📢 ᴊᴘᴍ ᴀʟʙᴜᴍ', body = 'Album Broadcast') {
      const saluranId = config.saluran?.id || config.saluran?.id
      const saluranName = config.saluran?.name || config.bot?.name || 'WhatsApp Bot'
  
      const contextInfo = {
          forwardingScore: 9999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: saluranId,
              newsletterName: saluranName,
              serverMessageId: 127
          }
      }
  
      if (cachedThumb) {
          contextInfo.externalAdReply = {
              title,
              body,
              thumbnail: cachedThumb,
              sourceUrl: config.saluran?.link || '',
              mediaType: 1,
              renderLargerThumbnail: false
          }
      }
  
      return contextInfo
  }
  
  async function collectAlbumMedia(m, sock) {
      const mediaList = []
      const now = Date.now()
      const chatJid = m.chat
  
      try {
          const store = sock.store || global.store
          if (store?.messages?.[chatJid]) {
              const messages = store.messages[chatJid].array || []
              for (const msg of messages) {
                  const msgTime = (msg.messageTimestamp?.low || msg.messageTimestamp || 0) * 1000
                  if (now - msgTime > COLLECT_WINDOW) continue
                  if (msg.key?.fromMe) continue
  
                  const content = msg.message
                  if (!content) continue
  
                  const type = Object.keys(content).find(k =>
                      k === 'imageMessage' || k === 'videoMessage'
                  )
                  if (!type) continue
  
                  try {
                      const stream = await sock.downloadMediaMessage(msg)
                      const chunks = []
                      for await (const chunk of stream) chunks.push(chunk)
                      const buffer = Buffer.concat(chunks)
  
                      if (buffer.length < 1000) continue
  
                      const isVideo = type === 'videoMessage'
                      const caption = content[type]?.caption || ''
  
                      mediaList.push({
                          buffer,
                          type: isVideo ? 'video' : 'image',
                          caption,
                          mimetype: content[type]?.mimetype || (isVideo ? 'video/mp4' : 'image/jpeg')
                      })
                  } catch (e) {}
              }
          }
      } catch (e) {}
  
      if (mediaList.length === 0 && m.quoted) {
          const quoted = m.quoted
          const quotedType = Object.keys(quoted.message || {})[0]
          const isImage = quoted.isImage || quotedType === 'imageMessage'
          const isVideo = quoted.isVideo || quotedType === 'videoMessage'
  
          if (isImage || isVideo) {
              try {
                  const buffer = await quoted.download()
                  if (buffer && buffer.length > 1000) {
                      mediaList.push({
                          buffer,
                          type: isVideo ? 'video' : 'image',
                          caption: quoted.message?.[quotedType]?.caption || '',
                          mimetype: quoted.message?.[quotedType]?.mimetype || (isVideo ? 'video/mp4' : 'image/jpeg')
                      })
                  }
              } catch (e) {}
          }
      }
  
      return mediaList
  }
  
  async function sendAlbumToGroup(sock, groupId, mediaList, caption) {
      const userJid = jidNormalizedUser(sock.user.id)
      const imageCount = mediaList.filter(m => m.type === 'image').length
      const videoCount = mediaList.filter(m => m.type === 'video').length
  
      const opener = generateWAMessageFromContent(
          groupId,
          {
              messageContextInfo: { messageSecret: crypto.randomBytes(32) },
              albumMessage: {
                  expectedImageCount: imageCount,
                  expectedVideoCount: videoCount
              }
          },
          {
              userJid,
              upload: sock.waUploadToServer
          }
      )
  
      await sock.relayMessage(opener.key.remoteJid, opener.message, {
          messageId: opener.key.id
      })
  
      for (let i = 0; i < mediaList.length; i++) {
          const media = mediaList[i]
          const isFirst = i === 0
          const msgContent = {
              [media.type]: media.buffer,
              caption: isFirst ? caption : '',
              mimetype: media.mimetype
          }
  
          const msg = await generateWAMessage(groupId, msgContent, {
              upload: sock.waUploadToServer
          })
  
          msg.message.messageContextInfo = {
              messageSecret: crypto.randomBytes(32),
              messageAssociation: {
                  associationType: 1,
                  parentMessageKey: opener.key
              }
          }
  
          await sock.relayMessage(msg.key.remoteJid, msg.message, {
              messageId: msg.key.id
          })
      }
  }
  
  async function handler(m, { sock }) {
  
    gcsel.parseM(m)
      const db = getDatabase()
  
      // JPM is owner-only and is independent of per-group mode settings.
  
      const caption = m.fullArgs?.trim() || m.text?.trim() || ''
  
      if (!caption && !m.quoted) {
          return m.reply(
              `📢 *ᴊᴘᴍ ᴀʟʙᴜᴍ*\n\n` +
              `> Kirim album (multi foto/video) ke semua grup\n\n` +
              `*ᴄᴀʀᴀ ᴘᴀᴋᴀɪ:*\n` +
              `> 1. Kirim beberapa foto/video ke chat ini\n` +
              `> 2. Ketik \`${m.prefix}jpmalbum <caption>\`\n` +
              `> 3. Bot akan kumpulkan media terbaru (60 detik terakhir)\n\n` +
              `> Atau reply salah satu foto/video lalu \`${m.prefix}jpmalbum <caption>\`\n\n` +
              `*ᴄᴏɴᴛᴏʜ:*\n` +
              `\`${m.prefix}jpmalbum Promo terbaru!\``
          )
      }
  
      if (global.statusjpm) {
          return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> JPM sedang berjalan. Ketik \`${m.prefix}stopjpm\` untuk menghentikan.`)
      }
  
      m.react('📷')
      await m.reply(`⏳ *ᴍᴇɴɢᴜᴍᴘᴜʟᴋᴀɴ ᴍᴇᴅɪᴀ...*\n\n> Mengambil foto/video terbaru dari chat...`)
  
      const mediaList = await collectAlbumMedia(m, sock)
  
      if (mediaList.length === 0) {
          m.react('❌')
          return m.reply(
              `❌ *ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴍᴇᴅɪᴀ*\n\n` +
              `> Tidak ditemukan foto/video terbaru\n\n` +
              `*ᴘᴀsᴛɪᴋᴀɴ:*\n` +
              `> 1. Kirim foto/video terlebih dahulu (max 60 detik)\n` +
              `> 2. Baru ketik \`${m.prefix}jpmalbum <caption>\`\n` +
              `> 3. Atau reply foto/video lalu \`${m.prefix}jpmalbum <caption>\``
          )
      }
  
      if (mediaList.length < 2) {
          m.react('⚠️')
          await m.reply(`⚠️ *ᴘᴇʀɪɴɢᴀᴛᴀɴ*\n\n> Hanya ditemukan 1 media. Album minimal butuh 2.\n> Tetap melanjutkan sebagai pesan biasa...`)
      }
  
      m.react('📢')
  
      try {
          let allGroups = await fetchGroupsSafe(sock)
          allGroups = await gcsel.pickM(m, allGroups)
          if (!allGroups) return
          let groupIds = Object.keys(allGroups)
  
          const blacklist = db.setting('jpmBlacklist') || []
          const blacklistedCount = groupIds.filter(id => blacklist.includes(id)).length
          groupIds = groupIds.filter(id => !blacklist.includes(id))
  
          if (groupIds.length === 0) {
              m.react('❌')
              return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Tidak ada grup yang ditemukan${blacklistedCount > 0 ? ` (${blacklistedCount} grup di-blacklist)` : ''}`)
          }
  
          const jedaJpm = db.setting('jedaJpm') || 5000
          const imageCount = mediaList.filter(m => m.type === 'image').length
          const videoCount = mediaList.filter(m => m.type === 'video').length
  
          await sock.sendMessage(m.chat, {
              text: `📢 *ᴊᴘᴍ ᴀʟʙᴜᴍ*\n\n` +
                  `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
                  `┃ 📝 ᴄᴀᴘᴛɪᴏɴ: \`${(caption || '-').substring(0, 50)}${caption.length > 50 ? '...' : ''}\`\n` +
                  `┃ 🖼️ ꜰᴏᴛᴏ: \`${imageCount}\`\n` +
                  `┃ 🎬 ᴠɪᴅᴇᴏ: \`${videoCount}\`\n` +
                  `┃ 📦 ᴛᴏᴛᴀʟ ᴍᴇᴅɪᴀ: \`${mediaList.length}\`\n` +
                  `┃ 👥 ᴛᴀʀɢᴇᴛ: \`${groupIds.length}\` grup\n` +
                  `┃ ⏱️ ᴊᴇᴅᴀ: \`${jedaJpm}ms\`\n` +
                  `┃ 📊 ᴇsᴛɪᴍᴀsɪ: \`${Math.ceil((groupIds.length * jedaJpm) / 60000)} menit\`\n` +
                  `╰┈┈⬡\n\n` +
                  `> Memulai JPM Album ke semua grup...`,
              contextInfo: getContextInfo('📢 ᴊᴘᴍ ᴀʟʙᴜᴍ', 'Sending...')
          }, { quoted: m })
  
          global.statusjpm = true
          let successCount = 0
          let failedCount = 0
  
          for (const groupId of groupIds) {
              if (global.stopjpm) {
                  delete global.stopjpm
                  delete global.statusjpm
  
                  await sock.sendMessage(m.chat, {
                      text: `⏹️ *ᴊᴘᴍ ᴀʟʙᴜᴍ ᴅɪʜᴇɴᴛɪᴋᴀɴ*\n\n` +
                          `╭┈┈⬡「 📊 *sᴛᴀᴛᴜs* 」\n` +
                          `┃ ✅ ʙᴇʀʜᴀsɪʟ: \`${successCount}\`\n` +
                          `┃ ❌ ɢᴀɢᴀʟ: \`${failedCount}\`\n` +
                          `┃ ⏸️ sɪsᴀ: \`${groupIds.length - successCount - failedCount}\`\n` +
                          `╰┈┈⬡`,
                      contextInfo: getContextInfo('⏹️ ᴅɪʜᴇɴᴛɪᴋᴀɴ')
                  }, { quoted: m })
                  return
              }
  
              try {
                  if (mediaList.length >= 2) {
                      await sendAlbumToGroup(sock, groupId, mediaList, caption)
                  } else {
                      const media = mediaList[0]
                      const contextInfo = getContextInfo('📢 ᴊᴘᴍ ᴀʟʙᴜᴍ', config.bot?.name || 'WhatsApp Bot')
                      await sock.sendMessage(groupId, {
                          [media.type]: media.buffer,
                          caption: caption || media.caption,
                          mimetype: media.mimetype,
                          contextInfo
                      })
                  }
                  successCount++
              } catch (err) {
                  failedCount++
              }
  
              await new Promise(resolve => setTimeout(resolve, jedaJpm))
          }
  
          delete global.statusjpm
  
          m.react('✅')
          await sock.sendMessage(m.chat, {
              text: `✅ *ᴊᴘᴍ ᴀʟʙᴜᴍ sᴇʟᴇsᴀɪ*\n\n` +
                  `╭┈┈⬡「 📊 *ʜᴀsɪʟ* 」\n` +
                  `┃ ✅ ʙᴇʀʜᴀsɪʟ: \`${successCount}\`\n` +
                  `┃ ❌ ɢᴀɢᴀʟ: \`${failedCount}\`\n` +
                  `┃ 📊 ᴛᴏᴛᴀʟ: \`${groupIds.length}\`\n` +
                  `╰┈┈⬡`,
              contextInfo: getContextInfo('✅ sᴇʟᴇsᴀɪ', `${successCount}/${groupIds.length}`)
          }, { quoted: m })
  
      } catch (error) {
          delete global.statusjpm
          m.react('❌')
          m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> ${error.message}`)
      }
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
