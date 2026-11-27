// image/loli — satu file: metadata + kode fitur (gabungan dari engine6/plugins/image/loli.js)
const __vx = require("../../lib/adapter/e6.js")
const __meta = {
  "name": "imageloli",
  "command": [
    "imageloli",
    "loli2"
  ],
  "category": "image",
  "desc": "Perintah imageloli",
  "usage": "imageloli",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/image").split('\\').join('/')
module.exports = __vx.plugin("image/loli", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/loli.js'
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
  
  		const url = global.API('kyzz', '/api/image/loli', {}, 'apikey')
  		await client.sendMessage(m.chat, {
  			image: { url },
  			caption: `✨ Random Image — Loli`
  		}, { quoted: m })
  
  		if (typeof global.react === 'function') {
  			await global.react(client, m, 'success')
  		} else if (client.sendMessage) {
  			await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => {})
  		}
  	} catch (e) {
  		console.error('[IMAGE:Loli]', e.response?.data || e)
  		if (typeof global.react === 'function') {
  			await global.react(client, m, 'error')
  		} else if (client.sendMessage) {
  			await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => {})
  		}
  		doReply('❌ Gagal mengambil gambar Loli.')
  	}
  }
  
  handler.help = ["imageloli","loli2"]
  handler.tags = ['image']
  handler.command = /^(imageloli|loli2)$/i
  handler.limit = true
  handler.register = true
  
  const __vanxone_default = handler;
  
  ;return { default: __vanxone_default };
  }
  
  return module.exports
})
