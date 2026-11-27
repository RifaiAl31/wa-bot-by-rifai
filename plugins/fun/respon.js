// fun/respon — satu file: metadata + kode fitur (gabungan dari engine7/plugins/fun/respon.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "autovanxone",
  "command": [
    "autovanxone"
  ],
  "category": "fun",
  "desc": "Auto respon jika ada yang menyebut WhatsApp Bot",
  "usage": ".autovanxone on/off",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/respon", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/respon.js'
  const __vxExports = {};
  const pluginConfig = {
      name: "autovanxone",
      alias: [],
      category: "fun",
      description: "Auto respon jika ada yang menyebut WhatsApp Bot",
      usage: ".autovanxone on/off",
      example: ".autovanxone on",
      cooldown: 3
  }
  
  // global agar tidak reset saat hot reload
  if (!global.autoVanXone) global.autoVanXone = false
  
  async function handler(m) {
  
      const text = (m.text || "").toLowerCase()
      const args = text.split(" ")[1]
  
      if (!args) {
          return m.reply(
  `╭─〔 ❤️ WhatsApp Bot AUTO RESPON 〕
  │
  │ 📌 Perintah:
  │ • .autovanxone on
  │ • .autovanxone off
  │
  │ WhatsApp Bot akan otomatis
  │ merespon jika namanya disebut.
  │
  ╰────────────`
          )
      }
  
      if (args === "on") {
          global.autoVanXone = true
  
          return m.reply(
  `╭─〔 ❤️ WhatsApp Bot 〕
  │
  │ Ara ara~
  │ Auto respon sekarang *AKTIF*
  │
  │ Panggil aku kapan saja
  │ Darling~
  │
  ╰────────────`
          )
      }
  
      if (args === "off") {
          global.autoVanXone = false
  
          return m.reply(
  `╭─〔 WhatsApp Bot 〕
  │
  │ Hmph!
  │ Auto respon dimatikan.
  │
  │ Sampai jumpa Darling~
  │
  ╰────────────`
          )
      }
  
  }
  
  async function before(m, { sock }) {
  
      if (!global.autoVanXone) return
  
      const text = (m.text || "").toLowerCase()
  
      const trigger = [
  
          "WhatsApp Bot",
          "WhatsApp Bot",
          "02",
          "WhatsApp Bot",
          "zero2",
          "WhatsApp Bot ai",
          "WhatsApp Bot ai",
          "bot WhatsApp Bot",
          "WhatsApp Bot bot",
          "02 ai",
          "darling WhatsApp Bot",
          "vanxoneoo",
          "vanXoneoo",
          "02 darling",
          "WhatsApp Bot chan",
          "vanxone-chan"
  
      ]
  
      if (!trigger.some(v => text.includes(v))) return
  
      const name = m.pushName || "Darling"
  
      const respon = [
  
  `╭─〔 ❤️ WhatsApp Bot 〕
  │
  │ Ara ara~
  │ ${name} memanggilku?
  │
  │ Ada yang bisa
  │ WhatsApp Bot bantu?
  │
  ╰────────────`,
  
  `╭─〔 WhatsApp Bot 〕
  │
  │ Fufu~
  │ Aku mendengar
  │ namaku disebut.
  │
  │ Halo ${name}.
  │
  ╰────────────`,
  
  `╭─〔 WhatsApp Bot 〕
  │
  │ Eh?
  │ ${name} kangen aku ya?
  │
  │ Darling lucu~
  │
  ╰────────────`,
  
  `╭─〔 WhatsApp Bot 〕
  │
  │ Ara ara~
  │ Jangan panggil aku
  │ sembarangan.
  │
  │ ...tapi kalau kamu
  │ boleh ${name}.
  │
  ╰────────────`,
  
  `╭─〔 WhatsApp Bot 〕
  │
  │ Hmph!
  │ Siapa yang memanggil
  │ WhatsApp Bot?
  │
  │ Oh ternyata kamu~
  │
  ╰────────────`,
  
  `╭─〔 WhatsApp Bot 〕
  │
  │ Darling ${name}~
  │ Kamu memanggilku?
  │
  │ Aku datang ❤️
  │
  ╰────────────`,
  
  `╭─〔 WhatsApp Bot 〕
  │
  │ Fufu~
  │ Aku merasa
  │ seseorang menyebutku.
  │
  │ Hai ${name}.
  │
  ╰────────────`,
  
  `╭─〔 WhatsApp Bot 〕
  │
  │ Eh ${name}!
  │ Kamu memanggil
  │ WhatsApp Bot?
  │
  │ Aku disini~
  │
  ╰────────────`
  
  ]
  
      const random = respon[Math.floor(Math.random() * respon.length)]
  
      await sock.sendMessage(m.chat, { text: random }, { quoted: m })
  
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  Object.defineProperty(__vxExports, "before", { enumerable: true, get: () => before });
  return __vxExports
})
