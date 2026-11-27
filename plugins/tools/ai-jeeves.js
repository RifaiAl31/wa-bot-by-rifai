// ai/ai-jeeves — satu file: metadata + kode fitur (gabungan dari engine2/plugins/ai/ai-jeeves.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "jeeves"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur jeeves (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/ai-jeeves", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ai-jeeves.js'
  const __vxExports = {};
  
  let handler = async (m, { conn, text }) => {
    await m.react('✨')
  
    if (!text) {
      return conn.reply(m.chat, '*Example :* .jeeves Halo', m)
    }
  
    let url = `${global.APIs.faa}/faa/jeeves-ai?prompt=${encodeURIComponent(text)}`
    let res = await fetch(url)
    let json = await res.json()
  
    if (!json.status) return
  
    conn.reply(m.chat, json.result.trim(), m)
  }
  
  handler.help = ['jeeves']
  handler.tags = ['ai']
  handler.command = /^jeeves$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
