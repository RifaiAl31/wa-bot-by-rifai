// ai/shizuku — satu file: metadata + kode fitur (gabungan dari engine5/plugins/ai/shizuku.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "shizuku",
  "command": [
    "shizuku"
  ],
  "category": "ai",
  "desc": "Fitur shizuku <pesan>",
  "usage": ".shizuku <pesan>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/shizuku", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/shizuku.js'
  const __vxExports = {};
  const sessionCounters = new Map();
  
  const handler = async (m, { sock, text, reply, example }) => {
  	if (!text) {
  		return reply(`*Shizuku AI*\n\nContoh:\n${example('hai shizuku')}`);
  	}
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
  
  	try {
  		const currentCount = (sessionCounters.get(m.sender) || 0) + 1;
  		sessionCounters.set(m.sender, currentCount);
  
  		const sessionCycle = Math.floor((currentCount - 1) / 20);
  		const sessionId = `${m.sender}_${sessionCycle}`;
  
  		const data = await global.fetchApi('kyzz', '/api/ai/shizuku', {
  			message: text.trim(),
  			session: sessionId
  		});
  
  		if (!data.status) {
  			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  			return reply(data.message || 'Terjadi kesalahan.');
  		}
  
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
  		return reply(data.reply);
  	} catch (e) {
  		console.error('[SHIZUKU ERROR]', e.response?.data || e.message);
  		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
  		return reply('❌ Gagal menghubungi Shizuku.');
  	}
  };
  
  handler.help = ['shizuku <pesan>'];
  handler.tags = ['ai'];
  handler.command = ['shizuku'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
