// ai/ai-copilotthink — satu file: metadata + kode fitur (gabungan dari engine2/plugins/ai/ai-copilotthink.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "copilotthink"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur copilotthink (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/ai-copilotthink", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ai-copilotthink.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    await m.react('✨')
  
    if (!text) {
      return m.reply(`Contoh penggunaan:
  ${usedPrefix + command} Siapa presiden indonesia sekarang?`)
    }
  
    try {
      const url = `${global.APIs.deline}/ai/copilot-think?text=${encodeURIComponent(text)}`
      const { data } = await axios.get(url)
  
      if (!data.status) throw 'AI error'
  
      m.reply(data.result.text.trim())
  
    } catch (e) {
      console.error(e)
      m.reply('Gagal mengambil jawaban dari AI.')
    }
  }
  
  handler.help = ['copilotthink <pertanyaan>']
  handler.tags = ['ai']
  handler.command = /^copilotthink$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
