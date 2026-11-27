// maker/maker-ytcomment — satu file: metadata + kode fitur (gabungan dari engine2/plugins/maker/maker-ytcomment.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "ytcomment"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur ytcomment (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/maker-ytcomment", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/maker-ytcomment.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) {
          return m.reply(`Contoh penggunaan:
  ${usedPrefix + command} username|komentar
  
  Contoh:
  ${usedPrefix + command} WhatsApp Bot|Halo hilman`)
      }
  
      let [username, komentar] = text.split('|')
  
      if (!username || !komentar) {
          return m.reply(`Format salah!
  ${usedPrefix + command} username|komentar`)
      }
  
      const avatar = await conn.profilePictureUrl(m.sender, 'image')
          .catch(() => `${global.APIs.deline}/Eu3BVf3K4x.jpg`)
  
      const url = `${global.APIs.deline}/maker/ytcomment?text=${encodeURIComponent(komentar.trim())}&username=${encodeURIComponent(username.trim())}&avatar=${encodeURIComponent(avatar)}`
  
      try {
          const { data } = await axios.get(url, { responseType: 'arraybuffer' })
          await conn.sendFile(m.chat, data, 'ytcomment.jpg', '', m)
      } catch (e) {
          console.error(e)
          m.reply('Gagal membuat YouTube comment.')
      }
  }
  
  handler.help = ['ytcomment <username>|<komentar>']
  handler.tags = ['maker']
  handler.command = /^ytcomment$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
