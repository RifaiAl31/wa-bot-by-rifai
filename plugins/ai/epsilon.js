// ai/epsilon — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai/epsilon.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "epsilon",
  "command": [
    "epsilon",
    "epsilonai"
  ],
  "category": "ai",
  "desc": "Fitur epsilon <topik>",
  "usage": ".epsilon <topik>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/epsilon", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/epsilon.js'
  const __vxExports = {};
  const handler = async (m, { sock, text, reply, usedPrefix, command }) => {
  	const botName = global.namaBot
  	const query = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : '');
  
  	if (!query) {
  		return reply(
  			`📚 *EPSILON AI (ACADEMIC / RESEARCH)*\n\n` +
  			`Format:\n` +
  			`• \`${usedPrefix + command} <topik / judul penelitian>\`\n` +
  			`• Atau balas pesan dengan \`${usedPrefix + command}\`\n\n` +
  			`*Contoh:*\n` +
  			`• \`${usedPrefix + command} machine learning in cybersecurity\``
  		);
  	}
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);
  
  	try {
  		const json = await global.fetchApi('faa', 'faa/epsilon-ai', {
  			text: query.trim()
  		});
  
  		if (!json?.status || !Array.isArray(json?.result) || !json.result.length) {
  			throw new Error(json?.message || 'Tidak ada data jurnal/makalah yang ditemukan.');
  		}
  
  		const listHasil = json.result.slice(0, 5).map((v, i) => [
  			`📌 *${i + 1}. ${v.title || 'Untitled'}*`,
  			`✍️ *Penulis:* ${v.authors || '-'}`,
  			`📅 *Tahun:* ${v.year || '-'}`,
  			`🔗 *Link:* ${v.url || '-'}`,
  			'',
  			`📄 *Abstrak:*`,
  			`_${(v.abstract || 'Tidak ada abstrak').slice(0, 300)}..._`
  		].join('\n')).join('\n\n─────────────────────────\n\n');
  
  		const response = [
  			`📚 *HASIL PENELITIAN EPSILON AI*`,
  			`🔍 *Query:* ${query.trim()}`,
  			'─────────────────────────',
  			'',
  			listHasil,
  			'',
  			`© ${botName}`
  		].join('\n');
  
  		await reply(response);
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
  
  	} catch (e) {
  		console.error('[EPSILON AI ERROR]:', e.response?.data || e.message || e);
  		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
  		return reply(`❌ Gagal mengambil referensi ilmiah dari Epsilon AI: ${e.response?.data?.message || e.message || e}`);
  	}
  };
  
  handler.help = ['epsilon <topik>', 'epsilonai <topik>'];
  handler.tags = ['ai', 'tools'];
  handler.command = ['epsilon', 'epsilonai'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
