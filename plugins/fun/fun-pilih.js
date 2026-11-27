// fun/fun-pilih — satu file: metadata + kode fitur (gabungan dari engine2/plugins/fun/fun-pilih.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "fakepilih"
  ],
  "category": "fun",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur fakepilih (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/fun-pilih", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fun-pilih.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  let handler = async (m, { conn, text }) => {
      if (!text) {
          return m.reply(
              "Contoh:\n.fakepilih Messi,Ronaldo"
          )
      }
  
      let [teks1, teks2] = text.split(",")
  
      if (!teks1 || !teks2) {
          return m.reply(
              "Format salah!\nContoh:\n.fakepilih Messi,Ronaldo"
          )
      }
  
      try {
          await m.reply("⏳ Membuat gambar...")
  
          const url = `https://api.synoxcloud.biz.id/canvas/drakehotline?teks1=${encodeURIComponent(teks1.trim())}&teks2=${encodeURIComponent(teks2.trim())}`
  
          await conn.sendMessage(m.chat, {
              image: { url },
              caption: "✅ Fake Pilih Berhasil"
          }, { quoted: m })
  
      } catch (e) {
          console.error(e)
          m.reply(`❌ Error: ${e.message}`)
      }
  }
  
  handler.help = ["fakepilih <teks1,teks2>"]
  handler.tags = ["fun"]
  handler.command = /^fakepilih$/i
  
  handler.register = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
