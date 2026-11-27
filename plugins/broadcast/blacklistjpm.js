// jpm/blacklistjpm — satu file: metadata + kode fitur (gabungan dari engine1/plugins/jpm/blacklistjpm.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "blacklistjpm",
  "command": [
    "blacklistjpm",
    "bljpm",
    "jpmbl",
    "jpmblacklist",
    "listblacklistjpm"
  ],
  "category": "broadcast",
  "desc": "Blacklist grup dari JPM dengan interactive buttons",
  "usage": ".blacklistjpm",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/jpm").split('\\').join('/')
module.exports = __vx.plugin("jpm/blacklistjpm", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/blacklistjpm.js'
  const module = { exports: {} }; const exports = module.exports;
  const { getDatabase } = require("../../lib/ext/src/lib/database.js")
  const config = require("../../lib/ext/config.js")
  const fs = require("fs")
  const path = require('path')
  const pluginConfig = {
      name: 'blacklistjpm',
      alias: ['bljpm', 'jpmbl', 'jpmblacklist', 'listblacklistjpm'],
      category: 'jpm',
      description: 'Blacklist grup dari JPM dengan interactive buttons',
      usage: '.blacklistjpm',
      example: '.blacklistjpm',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const db = getDatabase()
      const args = m.text.split(' ') || []
      const action = args[0]
      let blacklist = db.setting('jpmBlacklist') || []
      
      if (action === 'add' && args.length > 1) {
          const jids = args.slice(1).join('').split(',').filter(j => j.includes('@g.us'))
          if (jids.length === 0) return m.reply(`❌ *Ehh~* Format JID grup tidak valid! (Harus mengandung @g.us)~ 🥺`)
          
          let added = 0
          let duplicate = 0
          
          for (const targetGroup of jids) {
              if (!blacklist.includes(targetGroup)) {
                  blacklist.push(targetGroup)
                  added++
              } else {
                  duplicate++
              }
          }
          
          db.setting('jpmBlacklist', blacklist)
          m.react('🚫')
          
          return m.reply(
              `🚫 *ᴅɪᴛᴀᴍʙᴀʜᴋᴀɴ ᴋᴇ ʙʟᴀᴄᴋʟɪsᴛ*\n\n` +
              `> Berhasil ditambah: \`${added}\` grup\n` +
              `> Sudah ada: \`${duplicate}\` grup\n` +
              `> Total blacklist: \`${blacklist.length}\` grup\n\n` +
              `_Grup-grup ini tidak akan menerima JPM lagi._`
          )
      }
      
      if (action === 'del' || action === 'remove' || action === 'hapus') {
          if (args.length > 1) {
              const jids = args.slice(1).join('').split(',').filter(j => j.includes('@g.us'))
              if (jids.length === 0) return m.reply(`❌ *Ehh~* Format JID grup tidak valid! (Harus mengandung @g.us)~ 🥺`)
              
              let removed = 0
              
              for (const targetGroup of jids) {
                  const index = blacklist.indexOf(targetGroup)
                  if (index !== -1) {
                      blacklist.splice(index, 1)
                      removed++
                  }
              }
              
              db.setting('jpmBlacklist', blacklist)
              m.react('✅')
              
              return m.reply(
                  `✅ *ᴅɪʜᴀᴘᴜs ᴅᴀʀɪ ʙʟᴀᴄᴋʟɪsᴛ*\n\n` +
                  `> Berhasil dihapus: \`${removed}\` grup\n` +
                  `> Sisa blacklist: \`${blacklist.length}\` grup`
              )
          }
      }
      
      if (action === 'list') {
          if (blacklist.length === 0) {
              return m.reply(`📋 *ᴊᴘᴍ ʙʟᴀᴄᴋʟɪsᴛ*\n\n> Tidak ada grup yang di-blacklist`)
          }
          
          let listText = `📋 *ᴊᴘᴍ ʙʟᴀᴄᴋʟɪsᴛ*\n\n> Total: \`${blacklist.length}\` grup\n\n`
          
          for (let i = 0; i < blacklist.length; i++) {
              const groupId = blacklist[i]
              try {
                  const meta = await sock.groupMetadata(groupId)
                  listText += `${i + 1}. ${meta.subject}\n`
              } catch (e) {
                  listText += `${i + 1}. Unknown Group\n`
              }
          }
          
          return m.reply(listText)
      }
      
      return m.reply(
          `📢 *JPM BLACKLIST (DAFTAR HITAM)*\n\n` +
          `Fitur ini digunakan untuk mengecualikan grup-grup tertentu agar tidak dikirimi pesan Broadcast JPM oleh owner.\n\n` +
          `*PENGGUNAAN COMMAND:*\n` +
          `• \`${m.prefix}blacklistjpm list\` — Lihat semua daftar grup yg diblacklist\n` +
          `• \`${m.prefix}blacklistjpm add <jid1>,<jid2>\` — Tambahkan grup ke blacklist\n` +
          `• \`${m.prefix}blacklistjpm del <jid1>,<jid2>\` — Hapus grup dari blacklist\n\n` +
          `*CONTOH PENGGUNAAN:*\n` +
          `> \`${m.prefix}blacklistjpm add 1203631@g.us, 1203632@g.us\`\n\n` +
          `*STATISTIK SAAT INI:*\n` +
          `> Grup diblacklist: \`${blacklist.length}\` grup`
      )
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  
  return module.exports
})
