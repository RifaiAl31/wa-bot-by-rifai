// group/upsw — satu file: metadata + kode fitur (gabungan dari engine7/plugins/group/upsw.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "upsw",
  "command": [
    "upsw",
    "upstory",
    "storygc"
  ],
  "category": "group",
  "desc": "Upload story untuk grup (border hijau)",
  "usage": ".upsw <teks> / reply media",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/upsw", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/upsw.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { generateWAMessageContent, generateWAMessageFromContent } = require("@whiskeysockets/baileys");
  const crypto = __vxDef(require("crypto"));
  const pluginConfig = {
      name: 'upsw',
      alias: ['upstory','storygc'],
      category: 'group',
      description: 'Upload story untuk grup (border hijau)',
      usage: '.upsw <teks> / reply media',
      example: '.upsw Halo semua',
      isOwner: false,
      isPremium: false,
      isGroup: true,
      isPrivate: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function sendGroupStatus(sock, jid, content) {
  
      const inside = await generateWAMessageContent(content, {
          upload: sock.waUploadToServer
      })
  
      const messageSecret = crypto.randomBytes(32)
  
      const msg = generateWAMessageFromContent(jid, {
          messageContextInfo: {
              messageSecret
          },
          groupStatusMessageV2: {
              message: {
                  ...inside,
                  messageContextInfo: {
                      messageSecret
                  }
              }
          }
      }, {})
  
      await sock.relayMessage(jid, msg.message, {
          messageId: msg.key.id
      })
  }
  
  async function handler(m, { sock }) {
  
      if (!m.isGroup) {
          return m.reply("❌ Fitur ini hanya bisa dipakai di grup.")
      }
  
      const text = m.text || ''
      let content = {}
  
      try {
  
          if (m.quoted && (m.quoted.isImage || m.quoted.isVideo)) {
  
              const buffer = await m.quoted.download()
  
              if (m.quoted.isImage) {
                  content = {
                      image: buffer,
                      caption: text || ''
                  }
              }
  
              if (m.quoted.isVideo) {
                  content = {
                      video: buffer,
                      caption: text || ''
                  }
              }
  
          }
  
          else if (m.isImage || m.isVideo) {
  
              const buffer = await m.download()
  
              if (m.isImage) {
                  content = {
                      image: buffer,
                      caption: text || ''
                  }
              }
  
              if (m.isVideo) {
                  content = {
                      video: buffer,
                      caption: text || ''
                  }
              }
  
          }
  
          else if (text) {
  
              content = {
                  text: text,
                  font: 0,
                  backgroundColor: "#FF2E63"
              }
  
          }
  
          else {
  
              return m.reply(
  `╭━━━〔 💗 WhatsApp Bot GROUP STORY 💗 〕━━⬣
  ┃
  ┃ Darling kirim sesuatu dong~
  ┃
  ┃ Cara pakai :
  ┃
  ┃ .upsw teks
  ┃ reply gambar .upsw
  ┃ reply video .upsw
  ┃
  ╰━━━━━━━━━━━━━━━━⬣`)
          }
  
          await sendGroupStatus(sock, m.chat, content)
  
          await m.reply(
  `╭━━━〔 💗 WhatsApp Bot STORY 💗 〕━━⬣
  ┃
  ┃ 📡 Story grup berhasil dipost~
  ┃
  ┃ Sekarang icon grup
  ┃ punya border hijau 😳
  ┃
  ╰━━━━━━━━━━━━━━━━⬣`)
  
      } catch (err) {
  
          console.log(err)
  
          m.reply(
  `╭━━━〔 ❌ ERROR 〕━━⬣
  ┃
  ┃ Gagal upload story
  ┃ coba lagi ya darling
  ┃
  ╰━━━━━━━━━━━━━━━━⬣`)
      }
  
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
