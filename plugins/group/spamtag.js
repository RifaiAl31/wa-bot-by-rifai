// group/spamtag — satu file: metadata + kode fitur (gabungan dari engine1/plugins/group/spamtag.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "spamtag",
  "command": [
    "spamtag",
    "spammention"
  ],
  "category": "group",
  "desc": "Spam tag ke user tertentu (gunakan | untuk jumlah khusus)",
  "usage": ".spamtag @user (atau .spamtag @user | jumlah) (atau .spamtag @user teks)",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/spamtag", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/spamtag.js'
  const module = { exports: {} }; const exports = module.exports;
  // Plugin Spamtag WhatsApp Bot Idol (Bot tidak membalas dirinya sendiri)
  
  const { getConfig, isSelf } = require("../../lib/ext/config.js") // ambil config
  
  const config = getConfig()
  
  const pluginConfig = {
      name: 'spamtag',
      alias: ['spammention'],
      category: 'group',
      description: 'Spam tag ke user tertentu (gunakan | untuk jumlah khusus)',
      usage: '.spamtag @user (atau .spamtag @user | jumlah) (atau .spamtag @user teks)',
      example: '.spamtag @user | 5 hai',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 15,
      energi: 3,
      isEnabled: true,
      isAdmin: true,
      isBotAdmin: false
  }
  
  async function handler(m, { sock }) {
      try {
          // Jangan proses jika bot sendiri yang di-mention
          if (m.mentionedJid?.some(jid => isSelf(jid))) {
              return m.reply(
  `╭━━━🌸〔 WhatsApp Bot 𝐀𝐈 〕━━━⬣
  ┃ 💖 Senpai...
  ┃ ❌ Aku tidak bisa di-spam 😳
  ┃ ⚠️ Jangan spam aku ya~
  ╰━━━━━━━━━━━━━━━━━⬣`
              )
          }
  
          let target = null
          let jumlah = 3 // default jumlah spam
          let teks = '' // teks tambahan
  
          if (!m.mentionedJid || m.mentionedJid.length === 0) {
              return m.reply(
  `╭━━━🌸〔 WhatsApp Bot 𝐀𝐈 〕━━━⬣
  ┃ ❌ Target tidak ditemukan!
  ┃ 📌 Wajib mention user
  ┃ ✨ Contoh: .spamtag @user atau .spamtag @user | 5
  ╰━━━━━━━━━━━━━━━━━⬣`
              )
          }
  
          target = m.mentionedJid[0]
  
          if (!target.includes('@')) target = `${target}@s.whatsapp.net`
  
          const nomor = target.replace(/@.*$/, '')
  
          // Ambil body tanpa prefix+command
          // Format bisa: .spamtag @user | 5 teks
          //              .spamtag @user teks
          //              .spamtag @user | 5
  
          // Hapus semua mention dari body agar lebih mudah diparse
          let bodyTanpaMention = m.body
              .replace(/\.spamtag\s*/i, '')
              .replace(/\.spammention\s*/i, '')
              .replace(/@\S+/g, '')
              .trim()
  
          if (bodyTanpaMention.includes('|')) {
              const parts = bodyTanpaMention.split('|')
              const afterPipe = parts[1]?.trim()
  
              if (!afterPipe) {
                  // tidak ada apa-apa setelah |
              } else {
                  // Cek apakah bagian pertama setelah | adalah angka
                  const firstToken = afterPipe.split(' ')[0]
                  if (!isNaN(firstToken) && firstToken !== '') {
                      jumlah = parseInt(firstToken)
                      jumlah = jumlah < 1 ? 1 : (jumlah > 10 ? 10 : jumlah)
                      // Sisa setelah angka adalah teks
                      teks = afterPipe.slice(firstToken.length).trim()
                  } else {
                      return m.reply(
  `╭━━━🌸〔 WhatsApp Bot 𝐀𝐈 〕━━━⬣
  ┃ ❌ Jumlah tidak valid!
  ┃ 📌 Masukkan angka setelah | (maksimal 10)
  ┃ ✨ Contoh: .spamtag @user | 5
  ╰━━━━━━━━━━━━━━━━━⬣`
                      )
                  }
              }
          } else {
              // Tidak ada |, semua sisa adalah teks
              teks = bodyTanpaMention.trim()
          }
  
          const delay = 1000
  
          await new Promise(resolve => setTimeout(resolve, 500))
  
          for (let i = 0; i < jumlah; i++) {
              const pesanText = teks
                  ? `💌 @${nomor} 💌\n\n${teks}`
                  : `💌 @${nomor} 💌`
  
              await sock.sendMessage(m.chat, {
                  text: pesanText,
                  mentions: [target]
              })
              if (i < jumlah - 1) await new Promise(resolve => setTimeout(resolve, delay))
          }
  
      } catch (err) {
          console.error('[SPAMTAG ERROR]', err)
          m.reply(
  `╭━━━🌸〔 WhatsApp Bot 𝐀𝐈 〕━━━⬣
  ┃ ❌ Terjadi kesalahan saat memproses command!
  ┃ ⚠️ ${err.message || 'Alasan tidak diketahui'}
  ╰━━━━━━━━━━━━━━━━━⬣`
          )
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
