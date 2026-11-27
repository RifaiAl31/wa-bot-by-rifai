// tools/colongsw — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/colongsw.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "colongsw",
  "command": [
    "colongsw",
    "ambilsw"
  ],
  "category": "tools",
  "desc": "Ambil SW khusus yang mention grup",
  "usage": ".colongsw (reply sw mention)",
  "owner": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/colongsw", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/colongsw.js'
  const __vxExports = {};
  const pluginConfig = {
      name: 'colongsw',
      alias: ['ambilsw'],
      category: 'tools',
      description: 'Ambil SW khusus yang mention grup',
      usage: '.colongsw (reply sw mention)',
      example: '.colongsw',
      cooldown: 5,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
  
      if (!m.quoted) {
          return m.reply(
  `╭━━〔 💖 WhatsApp Bot SW STEALER 〕━━⬣
  ┃
  ┃ Ehh darling 😳
  ┃ reply status yang mention grup dulu yaa~
  ╰━━━━━━━━━━━━━━━━⬣`)
      }
  
      try {
  
          let q = m.quoted
  
          // 🔥 UNWRAP
          let msg = q.message || {}
  
          if (msg?.ephemeralMessage) msg = msg.ephemeralMessage.message
          if (msg?.viewOnceMessage) msg = msg.viewOnceMessage.message
          if (msg?.viewOnceMessageV2) msg = msg.viewOnceMessageV2.message
  
          // 🔥 CONTEXT FIX
          const context =
              msg?.extendedTextMessage?.contextInfo ||
              msg?.imageMessage?.contextInfo ||
              msg?.videoMessage?.contextInfo ||
              {}
  
          const mentioned = context?.mentionedJid || []
  
          const isStatus = q.key?.remoteJid === 'status@broadcast'
          const isMentionGroup = mentioned.includes(m.chat)
  
          if (!isStatus || !isMentionGroup) {
              return m.reply(
  `╭━━〔 ❌ WhatsApp Bot NOTICE 〕━━⬣
  ┃
  ┃ Ihh ini bukan SW yang mention grup 😤
  ┃ jangan asal colong yaa darling 😳
  ╰━━━━━━━━━━━━━━━━⬣`)
          }
  
          m.react('💖')
  
          const type = Object.keys(msg)[0]
  
          // ===== IMAGE =====
          if (type === 'imageMessage') {
  
              const media = await q.download()
  
              await sock.sendMessage(m.chat, {
                  image: media,
                  caption:
  `╭━━〔 💖 WhatsApp Bot RESULT 〕━━⬣
  ┃
  ┃ 🖼️ SW berhasil aku ambil 🤭
  ┃ khusus buat kamu darling 😳
  ╰━━━━━━━━━━━━━━━━⬣`
              }, { quoted: m })
  
              return
          }
  
          // ===== VIDEO =====
          if (type === 'videoMessage') {
  
              const media = await q.download()
  
              await sock.sendMessage(m.chat, {
                  video: media,
                  caption:
  `╭━━〔 💖 WhatsApp Bot RESULT 〕━━⬣
  ┃
  ┃ 🎬 Nih SW nya darling 😋
  ┃ jangan disebar yaa 🤫
  ╰━━━━━━━━━━━━━━━━⬣`
              }, { quoted: m })
  
              return
          }
  
          // ===== TEXT =====
          const text =
              q.text ||
              msg.conversation ||
              msg.extendedTextMessage?.text ||
              'Tidak ada isi'
  
          await m.reply(
  `╭━━〔 💖 WhatsApp Bot TEXT 〕━━⬣
  ┃
  ┃ 📄 Isi SW nya nih 😋
  ┃
  ┃ "${text}"
  ┃
  ┃ Jangan kepo banget yaa 🤭
  ╰━━━━━━━━━━━━━━━━⬣`)
          
      } catch (e) {
  
          console.log(e)
  
          m.reply(
  `╭━━〔 ❌ WhatsApp Bot ERROR 〕━━⬣
  ┃
  ┃ Ihh gagal ambil SW 😭
  ┃ coba lagi yaa darling 😳
  ╰━━━━━━━━━━━━━━━━⬣`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
