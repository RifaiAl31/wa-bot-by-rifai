// ai/powerbrain — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai/powerbrain.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "powerbrain",
  "command": [
    "powerbrain",
    "powerbrainai"
  ],
  "category": "ai",
  "desc": "Fitur powerbrain <pertanyaan>",
  "usage": ".powerbrain <pertanyaan>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/powerbrain", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/powerbrain.js'
  const __vxExports = {};
  const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
  	const botName = global.namaBot
  	const query = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : '');
  
  	if (!query) {
  		return reply(
  			`🧠 *POWERBRAIN AI ASSISTANT*\n\n` +
  			`Format:\n` +
  			`• \`${usedPrefix + command} <pertanyaan / prompt>\`\n` +
  			`• Atau balas pesan dengan \`${usedPrefix + command}\`\n\n` +
  			`*Contoh:*\n` +
  			`• \`${usedPrefix + command} Siapa WhatsApp Bot\``
  		);
  	}
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);
  
  	try {
  		const json = await global.fetchApi('faa', 'faa/powerbrain-ai', {
  			text: query.trim()
  		});
  
  		if (!json?.status || !json?.result) {
  			throw new Error(json?.message || 'Server PowerBrain AI tidak memberikan respon valid.');
  		}
  
  		const resultText = (json.result || '').toString().trim();
  		if (!resultText) {
  			throw new Error('Jawaban dari PowerBrain AI kosong.');
  		}
  
  		await reply(`${resultText}\n\n© ${botName}`);
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
  
  	} catch (e) {
  		console.error('[POWERBRAIN ERROR]:', e.response?.data || e.message || e);
  		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
  		return reply(`❌ Gagal mengambil jawaban dari PowerBrain AI: ${e.response?.data?.message || e.message || e}`);
  	}
  };
  
  handler.help = ['powerbrain <pertanyaan>', 'powerbrainai <pertanyaan>'];
  handler.tags = ['ai'];
  handler.command = ['powerbrain', 'powerbrainai'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
