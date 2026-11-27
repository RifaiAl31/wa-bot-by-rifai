// ai/vanxone — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai/vanxone.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "pulseai",
  "command": [
    "pulseai"
  ],
  "category": "ai",
  "desc": "AI chat assistant",
  "usage": ".pulseai <pesan>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/vanxone", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/vanxone.js'
  const __vxExports = {};
  const handler = async (m, { sock, text, reply, example }) => {
  	if (!text) return reply(example('hai'));
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
  
  	try {
  		const data = await global.fetchApi('kyzz', '/api/ai/alya', {
  			message: text,
  			session: m.sender
  		});
  
  		if (!data.status) {
  			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  			return reply(data.message || 'Terjadi kesalahan dari API.');
  		}
  
  		const responseText = data.reply || data.result?.reply || data.result || 'Tidak ada balasan.';
  
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
  		return reply(responseText);
  
  	} catch (e) {
  		console.error('[WhatsApp Bot ERROR]', e.response?.data || e.message);
  		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
  		return reply('❌ Gagal menghubungi WhatsApp Bot.');
  	}
  };
  
  handler.help = ['pulseai <pesan>'];
  handler.tags = ['ai'];
  handler.command = ['pulseai'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
