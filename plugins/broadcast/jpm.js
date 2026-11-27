// jpm/jpm — satu file: metadata + kode fitur (gabungan dari engine1/plugins/jpm/jpm.js)
const gcsel = require("../../lib/gcselect.js")
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "jpm",
  "command": [
    "jpm",
    "jasher",
    "jaser"
  ],
  "category": "broadcast",
  "desc": "Kirim pesan ke semua grup (JPM)",
  "usage": ".jpm <pesan>",
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
module.exports = __vx.plugin("jpm/jpm", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/jpm.js'
  const module = { exports: {} }; const exports = module.exports;
  const hsAsset = require("../../lib/ext/src/lib/assets.js")
  const { getDatabase } = require("../../lib/ext/src/lib/database.js")
  const { fetchGroupsSafe } = require("../../lib/ext/src/lib/jpmHelper.js")
  const config = require("../../lib/ext/config.js")
  const fs = require('fs')
  
  let cachedThumb = null
  hsAsset.tryBuffer('images/vx').then(b => { if (b) cachedThumb = b }).catch(() => {})
  
  const pluginConfig = {
      name: 'jpm',
      alias: ['jasher', 'jaser'],
      category: 'jpm',
      description: 'Kirim pesan ke semua grup (JPM)',
      usage: '.jpm <pesan>',
      example: '.jpm Halo semuanya!',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 30,
      energi: 0,
      isEnabled: true
  }
  
  function getContextInfo(title = '📢 ᴊᴘᴍ', body = 'Jasa Pesan Massal') {
      const saluranId = config.saluran?.id || ''
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
      
      
      return contextInfo
  }
  
  async function handler(m, { sock }) {
  
    gcsel.parseM(m)
      const db = getDatabase()
      
      // JPM is owner-only and is independent of per-group mode settings.
      
      // teks boleh dari argumen, atau dari pesan yang di-reply (teks / caption) kalau argumennya kosong
      const text = m.fullArgs?.trim() || m.text?.trim() || m.quoted?.text?.trim() || m.quoted?.caption?.trim()
      if (!text) {
          return m.reply(
              `📢 *JPM (JASA PESAN MASSAL)*\n\n` +
              `Sistem broadcast otomatis ke seluruh grup yang terdaftar.\n\n` +
              `*PENGGUNAAN:*\n` +
              `• *${m.prefix}jpm <pesan>* — Mengirim JPM teks biasa\n` +
              `• *${m.prefix}jpm (reply foto/video)* — Mengirim JPM dengan media\n\n` +
              `*FITUR LAIN:*\n` +
              `• *${m.prefix}jpmht* — JPM dengan mode Hidetag (tag semua member)\n` +
              `• *${m.prefix}autojpm* — Auto JPM dengan interval otomatis\n` +
              `• *${m.prefix}setdelayjpm* — Mengatur jeda pengiriman per grup\n` +
              `• *${m.prefix}stopjpm* — Menghentikan proses JPM yang sedang berjalan\n\n` +
              `*CONTOH:*\n` +
              `> \`${m.prefix}jpm Halo semuanya! Ini pesan otomatis dari owner.\``
          )
      }
      
      if (global.statusjpm) {
          return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> JPM sedang berjalan. Ketik \`${m.prefix}stopjpm\` untuk menghentikan.`)
      }
      
      m.react('📢')
      
      try {
          let mediaBuffer = null
          let mediaType = null
          const qmsg = m.quoted || m
          
          if (qmsg.isImage) {
              try {
                  mediaBuffer = await qmsg.download()
                  mediaType = 'image'
              } catch (e) {}
          } else if (qmsg.isVideo) {
              try {
                  mediaBuffer = await qmsg.download()
                  mediaType = 'video'
              } catch (e) {}
          }
          
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
          
          await sock.sendMessage(m.chat, {
              text: `📢 *ᴊᴘᴍ*\n\n` +
                  `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
                  `┃ 📝 ᴘᴇsᴀɴ: \`${text.substring(0, 50)}${text.length > 50 ? '...' : ''}\`\n` +
                  `┃ 📷 ᴍᴇᴅɪᴀ: \`${mediaBuffer ? mediaType : 'Tidak'}\`\n` +
                  `┃ 👥 ᴛᴀʀɢᴇᴛ: \`${groupIds.length}\` grup\n` +
                  `┃ ⏱️ ᴊᴇᴅᴀ: \`${jedaJpm}ms\`\n` +
                  `┃ 📊 ᴇsᴛɪᴍᴀsɪ: \`${Math.ceil((groupIds.length * jedaJpm) / 60000)} menit\`\n` +
                  `╰┈┈⬡\n\n` +
                  `> Memulai JPM ke semua grup...`,
              contextInfo: getContextInfo('📢 ᴊᴘᴍ', 'Sending...')
          }, { quoted: m })
          
          global.statusjpm = true
          delete global.stopjpm // buang sisa perintah stop lama supaya JPM baru tidak langsung berhenti
          let successCount = 0
          let failedCount = 0
          let lastError = ''
          
          const contextInfo = getContextInfo('📢 ᴊᴘᴍ', config.bot?.name || 'WhatsApp Bot')
          
          for (const groupId of groupIds) {
              if (global.stopjpm) {
                  delete global.stopjpm
                  delete global.statusjpm
                  
                  await sock.sendMessage(m.chat, {
                      text: `⏹️ *ᴊᴘᴍ ᴅɪʜᴇɴᴛɪᴋᴀɴ*\n\n` +
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
                  if (mediaBuffer) {
                      await sock.sendMedia(groupId, mediaBuffer, text, null, {
                          type: mediaType,
                          contextInfo: {
                              forwardingScore: 99,
                              isForwarded: true
                          }
                      })
                  } else {
                      await sock.sendText(groupId, text, null, {
                          contextInfo: {
                              forwardingScore: 99,
                              isForwarded: true
                          }
                      })
                  }
                  successCount++
              } catch (err) {
                  failedCount++
                  lastError = String(err?.message || err).slice(0, 120)
                  console.log(`[JPM] gagal kirim ke ${groupId}:`, lastError)
              }
              
              await new Promise(resolve => setTimeout(resolve, jedaJpm))
          }
          
          delete global.statusjpm
          
          m.react('✅')
          await sock.sendMessage(m.chat, {
              text: `✅ *ᴊᴘᴍ sᴇʟᴇsᴀɪ*\n\n` +
                  `╭┈┈⬡「 📊 *ʜᴀsɪʟ* 」\n` +
                  `┃ ✅ ʙᴇʀʜᴀsɪʟ: \`${successCount}\`\n` +
                  `┃ ❌ ɢᴀɢᴀʟ: \`${failedCount}\`\n` +
                  `┃ 📊 ᴛᴏᴛᴀʟ: \`${groupIds.length}\`\n` +
                  (failedCount && lastError ? `┃ ⚠️ ᴇʀʀᴏʀ ᴛᴇʀᴀᴋʜɪʀ: \`${lastError}\`\n` : '') +
                  `╰┈┈⬡`,
              contextInfo: getContextInfo('✅ sᴇʟᴇsᴀɪ', `${successCount}/${groupIds.length}`)
          }, { quoted: m })
          
      } catch (error) {
          delete global.statusjpm
          m.react('❌')
          m.reply(`❌ *Gomen ne~* ✦\n\n> ${error.message}\n\n_Ai udah coba yang terbaik tapi gagal juga... coba lagi nanti ya~ 🌸_`)
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
