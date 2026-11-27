// image/random — satu file: metadata + kode fitur (gabungan dari engine2/plugins/image/random.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "imagerandom",
    "randomimage"
  ],
  "category": "image",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur imagerandom (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/image").split('\\').join('/')
module.exports = __vx.plugin("image/random", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/random.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /**
   * Creator : Owner Bot
   * 
   * note : don't claim this code
   */
  
  const axios = __vxDef(require("axios"));
  
  let handler = async (m, { conn, sock, args, reply }) => {
  	const client = conn || sock
  	const doReply = typeof reply === 'function' ? reply : typeof m.reply === 'function' ? m.reply.bind(m) : (txt) => client.sendMessage(m.chat, { text: txt }, { quoted: m })
  
  	try {
  		if (typeof global.react === 'function') {
  			await global.react(client, m, 'loading')
  		} else if (client.sendMessage) {
  			await client.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => {})
  		}
  
  		const category = args[0] || ''
  		const apiUrl = global.API('kyzz', '/api/image/random', category ? { category } : {}, 'apikey')
  		const { data } = await axios.get(apiUrl, { timeout: 15000 })
  
  		const imgUrl = data?.url || data?.result || data?.image || apiUrl
  		await client.sendMessage(m.chat, {
  			image: { url: typeof imgUrl === 'string' ? imgUrl : apiUrl },
  			caption: `✨ Random Image`
  		}, { quoted: m })
  
  		if (typeof global.react === 'function') {
  			await global.react(client, m, 'success')
  		} else if (client.sendMessage) {
  			await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => {})
  		}
  	} catch (e) {
  		console.error('[IMAGE:random]', e.response?.data || e)
  		if (typeof global.react === 'function') {
  			await global.react(client, m, 'error')
  		} else if (client.sendMessage) {
  			await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => {})
  		}
  		doReply('❌ Gagal mengambil random image.')
  	}
  }
  
  handler.help = ['imagerandom [kategori]']
  handler.tags = ['image']
  handler.command = /^(imagerandom|randomimage)$/i
  handler.limit = true
  handler.register = true
  
  const __vxDefault = handler
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
