// maker/maker-faketweet — satu file: metadata + kode fitur (gabungan dari engine2/plugins/maker/maker-faketweet.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "faketweet"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur faketweet (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/maker-faketweet", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/maker-faketweet.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) {
          return m.reply(`Contoh penggunaan:
  ${usedPrefix + command} name|username|comment|verified
  
  Contoh:
  ${usedPrefix + command} hilman|anu|halo hilman|true`)
      }
  
      let [name, username, comment, verified] = text.split('|')
  
      if (!name || !username || !comment) {
          return m.reply(`Format salah!
  ${usedPrefix + command} name|username|comment|verified`)
      }
  
      verified = (verified || 'false').trim().toLowerCase()
  
      const avatar = await conn.profilePictureUrl(m.sender, 'image')
          .catch(() => `${global.APIs.deline}/Eu3BVf3K4x.jpg`)
  
      const url = `${global.APIs.deline}/maker/faketweet?name=${encodeURIComponent(name.trim())}&username=${encodeURIComponent(username.trim())}&comment=${encodeURIComponent(comment.trim())}&avatar=${encodeURIComponent(avatar)}&verified=${verified}`
  
      try {
          const { data } = await axios.get(url, { responseType: 'arraybuffer' })
          await conn.sendFile(m.chat, data, 'faketweet.jpg', '', m)
      } catch (e) {
          console.error(e)
          m.reply('Gagal membuat fake tweet.')
      }
  }
  
  handler.help = ['faketweet <name>|<username>|<comment>|<verified>']
  handler.tags = ['maker']
  handler.command = /^faketweet$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
