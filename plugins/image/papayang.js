// image/papayang — satu file: metadata + kode fitur (gabungan dari engine6/plugins/image/papayang.js)
const __vx = require("../../lib/adapter/e6.js")
const __meta = {
  "name": "imagepapayang",
  "command": [
    "imagepapayang",
    "papayang2"
  ],
  "category": "image",
  "desc": "Perintah imagepapayang",
  "usage": "imagepapayang",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/image").split('\\').join('/')
module.exports = __vx.plugin("image/papayang", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/papayang.js'
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
  
  		const url = global.API('kyzz', '/api/image/papayang', {}, 'apikey')
  		await client.sendMessage(m.chat, {
  			image: { url },
  			caption: `✨ Random Image — Papayang`
  		}, { quoted: m })
  
  		if (typeof global.react === 'function') {
  			await global.react(client, m, 'success')
  		} else if (client.sendMessage) {
  			await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } }).catch(() => {})
  		}
  	} catch (e) {
  		console.error('[IMAGE:Papayang]', e.response?.data || e)
  		if (typeof global.react === 'function') {
  			await global.react(client, m, 'error')
  		} else if (client.sendMessage) {
  			await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => {})
  		}
  		doReply('❌ Gagal mengambil gambar Papayang.')
  	}
  }
  
  handler.help = ["imagepapayang","papayang2"]
  handler.tags = ['image']
  handler.command = /^(imagepapayang|papayang2)$/i
  handler.limit = true
  handler.register = true
  
  const __vanxone_default = handler;
  
  ;return { default: __vanxone_default };
  }
  
  return module.exports
})
