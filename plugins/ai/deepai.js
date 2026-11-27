// ai/deepai — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai/deepai.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "deepai",
  "command": [
    "deepai",
    "deep-ai"
  ],
  "category": "ai",
  "desc": "Fitur deepai <teks>",
  "usage": ".deepai <teks>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/deepai", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/deepai.js'
  const __vxExports = {};
  const AVAILABLE_MODELS = [
  	'standard',
  	'deepseek-v3.2',
  	'gemini-2.5-flash-lite',
  	'gemma-4',
  	'llama-3.3-70b-instruct',
  	'gpt-oss-120b',
  	'gpt-5-nano'
  ];
  
  const DEFAULT_PROFESSIONAL_PROMPT = 
  	`Anda adalah AI Assistant profesional bernama ${global.namaBot}. ` +
  	'Gunakan bahasa Indonesia yang baik, santun, dan terstruktur.';
  
  const handler = async (m, { sock, text, usedPrefix, command, reply }) => {
  	if (!text) {
  		return reply(
  			`*Contoh Penggunaan:*\n` +
  			`• \`${usedPrefix + command} jelaskan arsitektur microservices\`\n` +
  			`• \`${usedPrefix + command} --model=deepseek-v3.2 buatkan api nodejs\`\n\n` +
  			`*Model Tersedia:*\n` +
  			AVAILABLE_MODELS.map(mod => `• ${mod}`).join('\n')
  		);
  	}
  
  	let query = text;
  	let model = 'standard';
  	let prompt = DEFAULT_PROFESSIONAL_PROMPT;
  
  	const modelMatch = query.match(/--model=([a-zA-Z0-9_.-]+)/i);
  	if (modelMatch) {
  		const reqModel = modelMatch[1].toLowerCase();
  		if (AVAILABLE_MODELS.includes(reqModel)) {
  			model = reqModel;
  		}
  		query = query.replace(modelMatch[0], '').trim();
  	}
  
  	const promptMatch = query.match(/--prompt=(.+?)(?=\s+--|$)/i);
  	if (promptMatch) {
  		prompt = promptMatch[1].trim();
  		query = query.replace(promptMatch[0], '').trim();
  	} else if (query.includes('|')) {
  		const parts = query.split('|');
  		query = parts[0].trim();
  		if (parts[1]?.trim()) {
  			prompt = parts.slice(1).join('|').trim();
  		}
  	}
  
  	if (!query) return reply('⚠️ Masukkan pertanyaan!');
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
  
  	try {
  		const res = await global.fetchApi('kyzz', '/api/ai/deepai', {
  			text: query,
  			prompt: prompt,
  			model: model
  		}, { timeout: 60000 });
  
  		if (!res || !res.status) {
  			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  			return reply(`❌ Gagal: ${res?.message || 'Server tidak merespon'}`);
  		}
  
  		const answer = typeof res.result === 'string' ? res.result : (res.result?.text || JSON.stringify(res.result));
  
  		await reply(answer.trim());
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
  	} catch (e) {
  		console.error('[DEEPAI ERROR]', e.response?.data || e.message);
  		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
  		return reply(`❌ Error: ${e.response?.data?.message || e.message}`);
  	}
  };
  
  handler.help = ['deepai <teks>'];
  handler.tags = ['ai'];
  handler.command = ['deepai', 'deep-ai'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
