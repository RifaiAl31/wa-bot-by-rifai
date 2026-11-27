// cewerandom/justinaxie — satu file: metadata + kode fitur (gabungan dari engine2/plugins/cewerandom/justinaxie.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "justina"
  ],
  "category": "image",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur justina (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/cewerandom").split('\\').join('/')
module.exports = __vx.plugin("cewerandom/justinaxie", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/justinaxie.js'
  const __vxExports = {};
  /**
   * Creator : Owner Bot
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
  
  		const url = global.API('kyzz', '/api/cecan/Justinaxie', {}, 'apikey')
  		await client.sendMessage(m.chat, {
  			image: { url },
  			caption: `🎴 Cewe Random — Justinaxie`
  		}, { quoted: m })
  
  		if (typeof global.react === 'function') {
  			await global.react(client, m, 'success')
  		} else if (client.sendMessage) {
  			await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => {})
  		}
  	} catch (e) {
  		console.error('[CEWERANDOM:Justinaxie]', e.response?.data || e)
  		if (typeof global.react === 'function') {
  			await global.react(client, m, 'error')
  		} else if (client.sendMessage) {
  			await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => {})
  		}
  		doReply('❌ Gagal ambil gambar Justinaxie.')
  	}
  }
  
  handler.help = ["justinaxie","justina"]
  handler.tags = ['cewerandom']
  handler.command = /^(justinaxie|justina)$/i
  handler.limit = true
  handler.register = true
  
  const __vxDefault = handler
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
