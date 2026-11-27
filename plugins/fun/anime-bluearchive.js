// anime/anime-bluearchive — satu file: metadata + kode fitur (gabungan dari engine2/plugins/anime/anime-bluearchive.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "baimg"
  ],
  "category": "fun",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur baimg (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/anime").split('\\').join('/')
module.exports = __vx.plugin("anime/anime-bluearchive", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/anime-bluearchive.js'
  const __vxExports = {};
  
  let handler = async (m, { conn }) => {
    await conn.reply(m.chat, global.wait, m)
  
    try {
      let res = await fetch('https://raw.githubusercontent.com/rynxzyy/blue-archive-r-img/refs/heads/main/links.json')
      if (!res.ok) throw await res.text()
  
      let data = await res.json()
      if (!Array.isArray(data) || data.length === 0) throw 'Gambar tidak ditemukan'
  
      let img = data[Math.floor(Math.random() * data.length)]
  
      await conn.sendFile(m.chat, img, 'blue-archive.jpg', '✨ _Random Blue Archive_', m)
    } catch (e) {
      console.error(e)
      m.reply('❌ Terjadi kesalahan: ' + e)
    }
  }
  
  handler.help = ['bluearchive']
  handler.tags = ['anime']
  handler.command = /^bluearchive|baimg|blue-archive$/i
  handler.limit = false
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
