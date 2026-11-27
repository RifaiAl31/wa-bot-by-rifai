// maker/reminder — satu file: metadata + kode fitur (gabungan dari engine5/plugins/maker/reminder.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "reminder",
  "command": [
    "reminder"
  ],
  "category": "image",
  "desc": "Fitur reminder",
  "usage": ".reminder",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/reminder", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/reminder.js'
  const __vxExports = {};
  const handler = async (m, { text, prefix, command, sock, reply }) => {
  	const pfx = prefix || '.';
  
  	if (!text) {
  		return reply(
  			`*Contoh:*\n\`${pfx + command} test|WhatsApp Bot\``
  		);
  	}
  
  	const [msg, author = global.namaOwner || m.pushName] = text.split('|');
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);
  
  	try {
  		const buffer = await global.fetchApi('kyzz', '/api/canvas/reminder', {
  			text: msg.trim(),
  			author: author.trim()
  		}, {
  			responseType: 'arraybuffer'
  		});
  
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
  
  		return await sock.sendMessage(m.chat, {
  			image: Buffer.from(buffer),
  			caption: `📌 *REMINDER*\n\n📝 "${msg.trim()}"\n👤 — *${author.trim()}*`
  		}, { quoted: m });
  
  	} catch (e) {
  		console.error('[REMINDER ERROR]:', e);
  		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
  		return reply('❌ Gagal membuat reminder.');
  	}
  };
  
  handler.help = ['reminder'];
  handler.tags = ['maker'];
  handler.command = ['reminder'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
