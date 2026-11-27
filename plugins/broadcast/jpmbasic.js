// jpm/jpmbasic — satu file: metadata + kode fitur (gabungan dari engine7/plugins/jpm/jpmbasic.js)
const gcsel = require("../../lib/gcselect.js")
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "jpmbasic",
  "command": [
    "jpmbasic",
    "jpmb",
    "jaser2"
  ],
  "category": "broadcast",
  "desc": "JPM basic tanpa externalAdReply, support reply pesan",
  "usage": ".jpmbasic <pesan> atau reply pesan",
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
module.exports = __vx.plugin("jpm/jpmbasic", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/jpmbasic.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e4.js");
  
  const pluginConfig = {
      name: 'jpmbasic',
      alias: ['jpmb', 'jaser2'],
      category: 'jpm',
      description: 'JPM basic tanpa externalAdReply, support reply pesan',
      usage: '.jpmbasic <pesan> atau reply pesan',
      example: '.jpmbasic Halo semuanya! atau reply gambar lalu .jpmbasic',
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
      
      const quoted = m.quoted
      let text = m.fullArgs?.trim() || m.text?.trim() || ''
      let mediaBuffer = null
      let mediaType = null
      let caption = ''
      
      if (quoted) {
          const quotedType = Object.keys(quoted.message || {})[0]
          const isImage = quoted.isImage || quotedType === 'imageMessage'
          const isVideo = quoted.isVideo || quotedType === 'videoMessage'
          
          if (isImage) {
              try {
                  mediaBuffer = await quoted.download()
                  mediaType = 'image'
                  caption = quoted.message?.imageMessage?.caption || text || ''
              } catch (e) {}
          } else if (isVideo) {
              try {
                  mediaBuffer = await quoted.download()
                  mediaType = 'video'
                  caption = quoted.message?.videoMessage?.caption || text || ''
              } catch (e) {}
          } else {
              const quotedText = quoted.text || quoted.message?.conversation || 
                                 quoted.message?.extendedTextMessage?.text || ''
              text = text || quotedText
          }
      }
      
      if (!text && !mediaBuffer) {
          return m.reply(
              `📢 *ᴊᴘᴍ ʙᴀsɪᴄ*\n\n` +
              `> Cara pakai:\n` +
              `> 1. \`${m.prefix}jpmbasic <pesan>\`\n` +
              `> 2. Reply gambar/video lalu \`${m.prefix}jpmbasic\`\n` +
              `> 3. Reply gambar/video dengan caption\n\n` +
              `> Tanpa externalAdReply, simple dan clean`
          )
      }
      
      if (global.statusjpmbasic) {
          return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> JPM Basic sedang berjalan. Ketik \`${m.prefix}stopjpmbasic\` untuk menghentikan.`)
      }
      
      m.react('📢')
      
      try {
          global.isFetchingGroups = true
          let allGroups = await sock.groupFetchAllParticipating()
          allGroups = await gcsel.pickM(m, allGroups)
          if (!allGroups) return
          global.isFetchingGroups = false
          let groupIds = Object.keys(allGroups)
          
          const blacklist = db.setting('jpmBlacklist') || []
          const blacklistedCount = groupIds.filter(id => blacklist.includes(id)).length
          groupIds = groupIds.filter(id => !blacklist.includes(id))
          
          if (groupIds.length === 0) {
              m.react('❌')
              return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Tidak ada grup yang ditemukan${blacklistedCount > 0 ? ` (${blacklistedCount} grup di-blacklist)` : ''}`)
          }
          
          const jedaJpm = db.setting('jedaJpmBasic') || 5000
          const displayText = text || caption
          
          await m.reply(
              `📢 *ᴊᴘᴍ ʙᴀsɪᴄ*\n\n` +
              `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
              `┃ 📝 ᴘᴇsᴀɴ: \`${displayText.substring(0, 50)}${displayText.length > 50 ? '...' : ''}\`\n` +
              `┃ 📷 ᴍᴇᴅɪᴀ: \`${mediaBuffer ? mediaType : 'Tidak'}\`\n` +
              `┃ 👥 ᴛᴀʀɢᴇᴛ: \`${groupIds.length}\` grup\n` +
              `┃ ⏱️ ᴊᴇᴅᴀ: \`${jedaJpm}ms\`\n` +
              `┃ 📊 ᴇsᴛɪᴍᴀsɪ: \`${Math.ceil((groupIds.length * jedaJpm) / 60000)} menit\`\n` +
              `╰┈┈⬡\n\n` +
              `> Memulai JPM Basic ke semua grup...`
          )
          
          global.statusjpmbasic = true
          let successCount = 0
          let failedCount = 0
          
          for (const groupId of groupIds) {
              if (global.stopjpmbasic) {
                  delete global.stopjpmbasic
                  delete global.statusjpmbasic
                  
                  await m.reply(
                      `⏹️ *ᴊᴘᴍ ʙᴀsɪᴄ ᴅɪʜᴇɴᴛɪᴋᴀɴ*\n\n` +
                      `> ✅ Berhasil: \`${successCount}\`\n` +
                      `> ❌ Gagal: \`${failedCount}\`\n` +
                      `> ⏸️ Sisa: \`${groupIds.length - successCount - failedCount}\``
                  )
                  return
              }
              
              try {
                  if (mediaBuffer && mediaType === 'image') {
                      await sock.sendMessage(groupId, {
                          image: mediaBuffer,
                          caption: caption || text
                      })
                  } else if (mediaBuffer && mediaType === 'video') {
                      await sock.sendMessage(groupId, {
                          video: mediaBuffer,
                          caption: caption || text
                      })
                  } else {
                      await sock.sendMessage(groupId, { text: text })
                  }
                  successCount++
              } catch (err) {
                  failedCount++
              }
              
              await new Promise(resolve => setTimeout(resolve, jedaJpm))
          }
          
          delete global.statusjpmbasic
          
          m.react('✅')
          await m.reply(
              `✅ *ᴊᴘᴍ ʙᴀsɪᴄ sᴇʟᴇsᴀɪ*\n\n` +
              `╭┈┈⬡「 📊 *ʜᴀsɪʟ* 」\n` +
              `┃ ✅ ʙᴇʀʜᴀsɪʟ: \`${successCount}\`\n` +
              `┃ ❌ ɢᴀɢᴀʟ: \`${failedCount}\`\n` +
              `┃ 📊 ᴛᴏᴛᴀʟ: \`${groupIds.length}\`\n` +
              `╰┈┈⬡`
          )
          
      } catch (error) {
          delete global.statusjpmbasic
          m.react('❌')
          m.reply(`❌ *ᴇʀʀᴏʀ*\n\n> ${error.message}`)
      }
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
