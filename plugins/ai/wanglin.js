// ai/wanglin — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai/wanglin.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "wanglin",
  "command": [
    "wanglin",
    "renegade"
  ],
  "category": "ai",
  "desc": "Fitur wanglin <pertanyaan>",
  "usage": ".wanglin <pertanyaan>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/wanglin", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/wanglin.js'
  const __vxExports = {};
  const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
  	const botName = global.namaBot
  	const query = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : '');
  
  	if (!query) {
  		return reply(
  			`🔮 *WANG LIN (RENEGADE IMMORTAL)*\n\n` +
  			`Format:\n` +
  			`• \`${usedPrefix + command} <pesan / pertanyaan>\`\n` +
  			`• Atau balas pesan dengan \`${usedPrefix + command}\`\n\n` +
  			`*Contoh:*\n` +
  			`• \`${usedPrefix + command} Siapa dirimu sebenarnya?\``
  		);
  	}
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);
  
  	try {
  		const session = m.sender ? m.sender.split('@')[0] : 'session';
  		const json = await global.fetchApi('kyzz', 'api/ai/wanglin', {
  			message: query.trim(),
  			session
  		});
  
  		const replyText = json?.result?.reply || json?.result?.message || (typeof json?.result === 'string' ? json.result : null);
  
  		if (!json?.status || !replyText) {
  			throw new Error(json?.message || 'Gagal memproses respon dari server Wang Lin AI.');
  		}
  
  		const caption = [
  			'🔮 *Wang Lin:*',
  			'',
  			replyText.trim(),
  			'',
  			`© ${botName}`
  		].join('\n');
  
  		await reply(caption);
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
  
  	} catch (e) {
  		console.error('[WANGLIN AI ERROR]:', e.response?.data || e.message || e);
  		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
  		return reply(`❌ Gagal berkomunikasi dengan Wang Lin: ${e.response?.data?.message || e.message || e}`);
  	}
  };
  
  handler.help = ['wanglin <pertanyaan>', 'renegade <pertanyaan>'];
  handler.tags = ['ai'];
  handler.command = ['wanglin', 'renegade'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
