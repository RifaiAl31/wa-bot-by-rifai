// image/anime-hot — satu file: metadata + kode fitur (gabungan dari engine6/plugins/image/anime-hot.js)
const __vx = require("../../lib/adapter/e6.js")
const __meta = {
  "name": "animehot",
  "command": [
    "animehot",
    "hotanime"
  ],
  "category": "image",
  "desc": "Perintah animehot",
  "usage": "animehot",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/image").split('\\').join('/')
module.exports = __vx.plugin("image/anime-hot", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/anime-hot.js'
  const module = { exports: {} }; const exports = module.exports;
  module.exports = async function (__vanxone_imp, __vanxone_meta) {
  
  
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
  
  		const url = global.API('kyzz', '/api/image/anime-hot', {}, 'apikey')
  		await client.sendMessage(m.chat, {
  			image: { url },
  			caption: `✨ Random Image — Anime Hot`
  		}, { quoted: m })
  
  		if (typeof global.react === 'function') {
  			await global.react(client, m, 'success')
  		} else if (client.sendMessage) {
  			await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => {})
  		}
  	} catch (e) {
  		console.error('[IMAGE:Anime Hot]', e.response?.data || e)
  		if (typeof global.react === 'function') {
  			await global.react(client, m, 'error')
  		} else if (client.sendMessage) {
  			await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => {})
  		}
  		doReply('❌ Gagal mengambil gambar Anime Hot.')
  	}
  }
  
  handler.help = ["animehot","hotanime"]
  handler.tags = ['image']
  handler.command = /^(animehot|hotanime)$/i
  handler.limit = true
  handler.register = true
  
  const __vanxone_default = handler;
  
  ;return { default: __vanxone_default };
  }
  
  return module.exports
})
