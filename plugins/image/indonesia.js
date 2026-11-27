// cewerandom/indonesia — satu file: metadata + kode fitur (gabungan dari engine2/plugins/cewerandom/indonesia.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "ceceindo",
    "ceweindo"
  ],
  "category": "image",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Gambar acak bertema Indonesia."
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/cewerandom").split('\\').join('/')
module.exports = __vx.plugin("cewerandom/indonesia", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/indonesia.js'
  const __vxExports = {};
  /**
   * 
   * note : don't claim this code
   */
  
  let handler = async (m, { conn, sock, reply }) => {
  	const client = conn || sock
  	const doReply = typeof reply === 'function' ? reply : typeof m.reply === 'function' ? m.reply.bind(m) : (txt) => client.sendMessage(m.chat, { text: txt }, { quoted: m })
  
  	try {
  		if (typeof global.react === 'function') {
  			await global.react(client, m, 'loading')
  		} else if (client.sendMessage) {
  			await client.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => {})
  		}
  
  		const url = global.API('kyzz', '/api/cecan/Indonesia', {}, 'apikey')
  		await client.sendMessage(m.chat, {
  			image: { url },
  			caption: `🎴 Cewe Random — Indonesia`
  		}, { quoted: m })
  
  		if (typeof global.react === 'function') {
  			await global.react(client, m, 'success')
  		} else if (client.sendMessage) {
  			await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => {})
  		}
  	} catch (e) {
  		console.error('[CEWERANDOM:Indonesia]', e.response?.data || e)
  		if (typeof global.react === 'function') {
  			await global.react(client, m, 'error')
  		} else if (client.sendMessage) {
  			await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => {})
  		}
  		doReply('❌ Gagal ambil gambar Indonesia.')
  	}
  }
  
  handler.help = ["indonesia","ceweindo"]
  handler.tags = ['cewerandom']
  handler.command = /^(indonesia|ceweindo|cecanindo|ceceindo)$/i
  handler.limit = true
  handler.register = true
  
  const __vxDefault = handler
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
