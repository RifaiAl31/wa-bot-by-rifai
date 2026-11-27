// owner/owner-clearead — satu file: metadata + kode fitur (gabungan dari engine2/plugins/owner/owner-clearead.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "clearead"
  ],
  "category": "owner",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur clearead (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/owner-clearead", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/owner-clearead.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  
  let handler = async (m, { conn }) => {
    let total = 0
  
    for (let file of fs.readdirSync('./plugins')) {
      if (!file.endsWith('.js')) continue
  
      let filePath = path.join('./plugins', file)
      let text = fs.readFileSync(filePath, 'utf8')
  
      if (text.includes('externalAdReplyOffOffOffOff')) {
        text = text.replaceAll(
          'externalAdReplyOffOffOffOff',
          'externalAdReplyOffOffOffOffOff'
        )
  
        fs.writeFileSync(filePath, text)
        total++
      }
    }
  
    conn.reply(m.chat, `✅ ${total} file berhasil di nonaktifkan`, m)
  }
  
  handler.help = ['clearead']
  handler.tags = ['owner']
  handler.command = /^clearead$/i
  handler.rowner = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
