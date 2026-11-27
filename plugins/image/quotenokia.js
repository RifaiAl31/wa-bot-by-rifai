// maker/quotenokia — satu file: metadata + kode fitur (gabungan dari engine5/plugins/maker/quotenokia.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "quotenokia",
  "command": [
    "quotenokia",
    "qnokia"
  ],
  "category": "image",
  "desc": "Fitur quotenokia",
  "usage": ".quotenokia",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/quotenokia", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/quotenokia.js'
  const __vxExports = {};
  const handler = async (m, { text, prefix, command, sock, reply }) => {
  	const pfx = prefix || '.';
  
  	if (!text) {
  		return reply(
  			`*Contoh:*\n\`${pfx + command} Halo dunia|WhatsApp Bot\``
  		);
  	}
  
  	const [message, sender = global.namaOwner || m.pushName] = text.split('|');
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);
  
  	try {
  		const buffer = await global.fetchApi('kyzz', '/api/canvas/quote-nokia', {
  			message: message.trim(),
  			sender: sender.trim()
  		}, {
  			responseType: 'arraybuffer'
  		});
  
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
  
  		return await sock.sendMessage(m.chat, {
  			image: Buffer.from(buffer),
  			mimetype: 'image/png',
  			caption: `📱 *QUOTE NOKIA*\n\n💬 "${message.trim()}"\n👤 — *${sender.trim()}*`
  		}, { quoted: m });
  
  	} catch (e) {
  		console.error('[QUOTE NOKIA ERROR]:', e);
  		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
  		return reply('❌ Gagal membuat Quote Nokia.');
  	}
  };
  
  handler.help = ['quotenokia'];
  handler.tags = ['maker'];
  handler.command = ['quotenokia', 'qnokia'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
