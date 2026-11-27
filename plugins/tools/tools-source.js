// tools/tools-source — satu file: metadata + kode fitur (gabungan dari engine2/plugins/tools/tools-source.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "source"
  ],
  "category": "tools",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur source (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/tools-source", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tools-source.js'
  const __vxExports = {};
  const { ElainaTLS } = require("@elainaa/tls");
  
  let handler = async (m, { text }) => {
    if (!text) {
      return m.reply("Contoh:\n.source https://xxxx")
    }
  
    try {
      const client = new ElainaTLS()
      const url = text.trim()
  
      m.reply("wait...")
  
      const res = await client.fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
          "Accept": "text/html",
          "Referer": "https://google.com"
        }
      })
  
      if (res.status !== 200) {
        return m.reply("❌ Gagal fetch, status: " + res.status)
      }
  
      let html = res.body || ""
  
      if (html.length > 4000) {
        html = html.slice(0, 4000) + "\n\n...[HTML dipotong]"
      }
  
      await m.reply(
        `✅ *SCRAPE SOURCE SUCCESS*\n` +
        `🌐 URL: ${url}\n` +
        `📡 Status: ${res.status}\n` +
        `🍪 Cookies: ${client.getCookieString() || "-"}\n\n` +
        html
      )
  
    } catch (e) {
      m.reply("❌ Error:\n" + e.message)
    }
  }
  
  handler.help = ['source <url>']
  handler.tags = ['tools']
  handler.command = /^source$/i
  handler.owner = true
  handler.limit = false
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
