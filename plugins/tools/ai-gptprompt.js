// ai/ai-gptprompt — satu file: metadata + kode fitur (gabungan dari engine2/plugins/ai/ai-gptprompt.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "gptprompt"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur gptprompt (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/ai-gptprompt", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ai-gptprompt.js'
  const __vxExports = {};
  
  let handler = async (m, { conn, text }) => {
    await m.react('✨')
  
    if (!text) {
      return conn.reply(
        m.chat,
        '*Example :* .gptprompt Seolah kamu WhatsApp Bot | Halo',
        m
      )
    }
  
    let [prompt, isi] = text.split('|').map(v => v.trim())
    if (!prompt || !isi) {
      return conn.reply(
        m.chat,
        '*Example :* .gptprompt Seolah kamu WhatsApp Bot | Halo',
        m
      )
    }
  
    let url = `${global.APIs.faa}/faa/gpt-promt?prompt=${encodeURIComponent(prompt)}&text=${encodeURIComponent(isi)}`
    let res = await fetch(url)
    let json = await res.json()
  
    if (!json.status) return
  
    conn.reply(m.chat, json.result.trim(), m)
  }
  
  handler.help = ['gptprompt']
  handler.tags = ['ai']
  handler.command = /^gptprompt$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
