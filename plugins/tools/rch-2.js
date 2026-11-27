// tools/rch — satu file: metadata + kode fitur (gabungan dari engine2/plugins/tools/rch.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "reactchannel"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur reactchannel (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/rch", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/rch.js'
  const __vxExports = {};
  // @description React pesan WhatsApp Channel
  // @category Tools
  // @url https://apiii-xrina.vercel.app/
  
  
  let handler = async (m, {
      conn,
      text,
      usedPrefix,
      command
  }) => {
      if (!text) {
          throw `Contoh:\n${usedPrefix + command}  👍`
      }
  
      let args = text.trim().split(/\s+/)
      let url = args[0]
      let reaction = args[1] || '👍'
  
      if (!url.includes('whatsapp.com/channel/')) {
          throw '❌ URL harus berupa link pesan WhatsApp Channel.'
      }
  
      try {
          let api = `https://apiii-xrina.vercel.app/tools/rch?url=${encodeURIComponent(url)}&reaction=${encodeURIComponent(reaction)}&apikey=${(global.apiKeys && global.apiKeys.xrina) || ''}`
  
          let res = await fetch(api)
          let json = await res.json()
  
          if (!json.status) {
              throw json.message || 'Gagal mengirim reaction.'
          }
  
          let data = json.data || {}
  
          await m.reply(
              `✅ *Reaction berhasil dikirim!*\n\n` +
              `💬 Reaction : ${data.reaction?.join(' ') || reaction}\n` +
              `📢 Channel : WhatsApp Channel\n` +
              `📝 Status : ${data.message || 'Berhasil mengirim react ke pesan channel'}`
          )
      } catch (e) {
          console.error('[RCH]', e)
          throw `❌ Gagal mengirim reaction:\n${e.message || e}`
      }
  }
  
  handler.help = ['rch <url> <reaction>']
  handler.tags = ['tools']
  handler.command = ['rch', 'reactchannel']
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
