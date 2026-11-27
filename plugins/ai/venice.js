// ai/venice — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai/venice.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "venice",
  "command": [
    "venice",
    "veniceai"
  ],
  "category": "ai",
  "desc": "Fitur venice <pesan>",
  "usage": ".venice <pesan>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/venice", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/venice.js'
  const __vxExports = {};
  const handler = async (m, { sock, text, reply, example }) => {
  	if (!text) {
  		return reply(
  			`*Contoh Penggunaan:*\n` +
  			`• ${example('Halo, apa kabar?')}\n` +
  			`• ${example('Ceritakan lelucon lucu hari ini')}`
  		);
  	}
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
  
  	try {
  		const res = await global.fetchApi('kyzz', '/api/ai/venice', {
  			message: text.trim()
  		}, { timeout: 45000 });
  
  		if (!res || !res.status || !res.result) {
  			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  			return reply('❌ Gagal mendapatkan respon dari Venice AI.');
  		}
  
  		let answer = typeof res.result === 'string' ? res.result : (res.result?.text || JSON.stringify(res.result));
  
  		await reply(answer.trim());
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
  	} catch (e) {
  		console.error('[VENICE AI ERROR]', e.response?.data || e.message);
  		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
  		return reply(`❌ Terjadi kesalahan pada Venice AI: ${e.response?.data?.message || e.message}`);
  	}
  };
  
  handler.help = ['venice <pesan>'];
  handler.tags = ['ai'];
  handler.command = ['venice', 'veniceai'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
