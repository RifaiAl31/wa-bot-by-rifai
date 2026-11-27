// info/main-sosmed — satu file: metadata + kode fitur (gabungan dari engine2/plugins/info/main-sosmed.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "socialmedia",
    "socmed"
  ],
  "category": "info",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur socialmedia (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/info").split('\\').join('/')
module.exports = __vx.plugin("info/main-sosmed", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/main-sosmed.js'
  const __vxExports = {};
  const { sendSocialMedia } = require("../../lib/ext/lib/sosial.js");
  
  const handler = async (m, { conn }) => {
      const sent = await sendSocialMedia(conn, m.chat, m)
      if (!sent) return m.reply('Tautan sosial belum dikonfigurasi.')
  }
  
  handler.help = ['sosmed']
  handler.tags = ['main']
  handler.command = /^(sosmed|socialmedia|socmed)$/i
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
