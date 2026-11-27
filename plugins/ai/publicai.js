// ai/publicai — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai/publicai.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "publicai",
  "command": [
    "publicai"
  ],
  "category": "ai",
  "desc": "Fitur publicai <pertanyaan>",
  "usage": ".publicai <pertanyaan>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/publicai", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/publicai.js'
  const __vxExports = {};
  const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
  	const botName = global.namaBot
  	const query = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : '');
  
  	if (!query) {
  		return reply(
  			`🌐 *PUBLIC AI ASSISTANT*\n\n` +
  			`Format:\n` +
  			`• \`${usedPrefix + command} <pertanyaan / prompt>\`\n` +
  			`• Atau balas pesan dengan \`${usedPrefix + command}\`\n\n` +
  			`*Contoh:*\n` +
  			`• \`${usedPrefix + command} Jelaskan apa itu kecerdasan buatan\``
  		);
  	}
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);
  
  	try {
  		const json = await global.fetchApi('faa', 'faa/publicai', {
  			text: query.trim()
  		});
  
  		if (!json?.status || !json?.result) {
  			throw new Error(json?.message || 'Server Public AI tidak memberikan respon valid.');
  		}
  
  		const resultText = (json.result || '').toString().trim();
  		if (!resultText) {
  			throw new Error('Jawaban dari Public AI kosong.');
  		}
  
  		await reply(`${resultText}\n\n© ${botName}`);
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
  
  	} catch (e) {
  		console.error('[PUBLIC AI ERROR]:', e.response?.data || e.message || e);
  		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
  		return reply(`❌ Gagal mengambil respon dari Public AI: ${e.response?.data?.message || e.message || e}`);
  	}
  };
  
  handler.help = ['publicai <pertanyaan>'];
  handler.tags = ['ai'];
  handler.command = ['publicai'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
