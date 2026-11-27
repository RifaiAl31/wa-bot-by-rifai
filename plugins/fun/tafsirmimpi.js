// fun/tafsirmimpi — satu file: metadata + kode fitur (gabungan dari engine2/plugins/fun/tafsirmimpi.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "mimpi2"
  ],
  "category": "fun",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur mimpi2 (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/fun").split('\\').join('/')
module.exports = __vx.plugin("fun/tafsirmimpi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tafsirmimpi.js'
  const __vxExports = {};
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    await m.react('✨')
  
    if (!text) {
      return conn.reply(
        m.chat,
        `Example : ${usedPrefix + command} Senang`,
        m
      )
    }
  
    try {
      let api = `${global.APIs.faa}/faa/tafsir-mimpi?mimpi=${encodeURIComponent(text)}`
      let res = await fetch(api)
      let json = await res.json()
  
      if (!json.status) throw 'API error'
  
      let hasil = `Tafsir mimpi: *${json.mimpi}*\n\n${json.result}`
  
      conn.reply(m.chat, hasil, m)
    } catch (e) {
      console.error(e)
      conn.reply(m.chat, '⚠️ Gagal mengambil tafsir mimpi.', m)
    }
  }
  
  handler.help = ['mimpi2 <kata>']
  handler.tags = ['fun']
  handler.command = /^mimpi2$/i
  handler.limit = true
  
  handler.register = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
