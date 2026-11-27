// jpm/jpmht — satu file: metadata + kode fitur (gabungan dari engine1/plugins/jpm/jpmht.js)
const gcsel = require("../../lib/gcselect.js")
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "jpmht",
  "command": [
    "jpmht",
    "jpmhidetag"
  ],
  "category": "broadcast",
  "desc": "Kirim pesan ke semua grup dengan hidetag",
  "usage": ".jpmht <pesan>",
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
module.exports = __vx.plugin("jpm/jpmht", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/jpmht.js'
  const module = { exports: {} }; const exports = module.exports;
  const hsAsset = require("../../lib/ext/src/lib/assets.js")
  const { getDatabase } = require("../../lib/ext/src/lib/database.js")
  const { fetchGroupsSafe } = require("../../lib/ext/src/lib/jpmHelper.js")
  const fs = require('fs')
  const { config } = require("../../lib/ext/config.js")
  
  let cachedThumb = null
  hsAsset.tryBuffer('images/vx').then(b => { if (b) cachedThumb = b }).catch(() => {})
  
  const pluginConfig = {
      name: 'jpmht',
      alias: ['jpmhidetag'],
      category: 'jpm',
      description: 'Kirim pesan ke semua grup dengan hidetag',
      usage: '.jpmht <pesan>',
      example: '.jpmht Halo semuanya!',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 30,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
  
    gcsel.parseM(m)
      const db = getDatabase()
      
      // JPM is owner-only and is independent of per-group mode settings.
      
      const text = m.fullArgs?.trim() || m.text?.trim()
      if (!text) {
          return m.reply(
              `📢 *JPM HIDETAG (JASA PESAN MASSAL)*\n\n` +
              `Sistem broadcast otomatis ke seluruh grup yang terdaftar dengan tag semua member (hidetag).\n\n` +
              `*PENGGUNAAN:*\n` +
              `• *${m.prefix}jpmht <pesan>* — Mengirim JPM hidetag teks biasa\n` +
              `• *${m.prefix}jpmht (reply foto/video)* — Mengirim JPM hidetag dengan media\n\n` +
              `*CONTOH:*\n` +
              `> \`${m.prefix}jpmht Halo semuanya! Jangan lupa cek channel kita ya.\``
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
          
          await m.reply(
              `📢 *ᴊᴘᴍ ʜɪᴅᴇᴛᴀɢ*\n\n` +
              `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
              `┃ 📝 ᴘᴇsᴀɴ: \`${text.substring(0, 50)}${text.length > 50 ? '...' : ''}\`\n` +
              `┃ 📷 ᴍᴇᴅɪᴀ: \`${mediaBuffer ? mediaType : 'Tidak'}\`\n` +
              `┃ 👥 ᴛᴀʀɢᴇᴛ: \`${groupIds.length}\` grup\n` +
              `┃ ⏱️ ᴊᴇᴅᴀ: \`${jedaJpm}ms\`\n` +
              `╰┈┈⬡\n\n` +
              `> Memulai JPM hidetag...`
          )
          
          global.statusjpm = true
          let successCount = 0
          let failedCount = 0
          
          for (const groupId of groupIds) {
              if (global.stopjpm) {
                  delete global.stopjpm
                  delete global.statusjpm
                  
                  await m.reply(
                      `⏹️ *ᴊᴘᴍ ᴅɪʜᴇɴᴛɪᴋᴀɴ*\n\n` +
                      `> ✅ Berhasil: \`${successCount}\`\n` +
                      `> ❌ Gagal: \`${failedCount}\``
                  )
                  return
              }
              
              try {
                  const groupData = allGroups[groupId]
                  const mentions = groupData.participants.map(p => p.id || p.jid).filter(Boolean)
                  const contextInfo = {
                      mentionedJid: mentions,
                      forwardingScore: 9999,
                      isForwarded: true,
                      forwardedNewsletterMessageInfo: {
                          newsletterJid: config.saluran?.id,
                          newsletterName: config.saluran?.name,
                          serverMessageId: 127
                      },
  }
                  if (mediaBuffer) {
                      await sock.sendMessage(groupId, {
                          [mediaType]: mediaBuffer,
                          caption: text,
                          mentions: mentions,
                          contextInfo: contextInfo
                      })
                  } else {
                      await sock.sendMessage(groupId, { 
                          text: text,
                          mentions: mentions,
                          contextInfo: contextInfo
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
          await m.reply(
              `✅ *ᴊᴘᴍ ʜɪᴅᴇᴛᴀɢ sᴇʟᴇsᴀɪ*\n\n` +
              `╭┈┈⬡「 📊 *ʜᴀsɪʟ* 」\n` +
              `┃ ✅ ʙᴇʀʜᴀsɪʟ: \`${successCount}\`\n` +
              `┃ ❌ ɢᴀɢᴀʟ: \`${failedCount}\`\n` +
              `┃ 📊 ᴛᴏᴛᴀʟ: \`${groupIds.length}\`\n` +
              `╰┈┈⬡`
          )
          
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
