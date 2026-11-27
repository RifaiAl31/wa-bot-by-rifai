// bypass/bypass2 — satu file: metadata + kode fitur (gabungan dari engine5/plugins/bypass/bypass2.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "bypass2",
  "command": [
    "bypass2"
  ],
  "category": "tools",
  "desc": "Fitur bypass2 <url>",
  "usage": ".bypass2 <url>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/bypass").split('\\').join('/')
module.exports = __vx.plugin("bypass/bypass2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/bypass2.js'
  const __vxExports = {};
  const handler = async (m, { sock, args, text, reply, example }) => {
  	const rawUrl = args[0] || (m.quoted ? (m.quoted.text || '') : text);
  
  	if (!rawUrl) {
  		return reply(
  			`🔓 *BYPASS 2 SHORTLINK* 🎀\n\n` +
  			`Masukkan link yang ingin di-bypass!\n\n` +
  			`• 📌 *ᴄᴏɴᴛᴏʜ:* ${example('https://example.link/xxxx')}`
  		);
  	}
  
  	const match = rawUrl.match(/https?:\/\/[^\s]+/i);
  	const targetUrl = match ? match[0] : (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
  
  	try {
  		const res = await global.fetchApi('kyzz', '/api/bypass/bypass2', {
  			url: targetUrl
  		}, { timeout: 30000 });
  
  		if (!res || !res.status) {
  			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  			return reply(`❌ Gagal bypass link: ${res?.message || 'Link tidak dapat diproses.'}`);
  		}
  
  		const result = res.result || res.data || res;
  		const resultUrl = typeof result === 'string' ? result : (result.url || result.destinationUrl || result.destination || result.link || result.result || '-');
  
  		let caption = `🔓 *BYPASS 2 RESULT*\n\n`;
  		caption += `🔗 *Original:* ${targetUrl}\n`;
  		caption += `🎯 *Result:* ${resultUrl}\n\n`;
  		caption += `© ${global.namaBot}`;
  
  		await reply(caption.trim());
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
  	} catch (e) {
  		console.error('[BYPASS2 ERROR]', e.response?.data || e.message);
  		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
  		return reply(`❌ Terjadi kesalahan: ${e.response?.data?.message || e.message}`);
  	}
  };
  
  handler.help = ['bypass2 <url>'];
  handler.tags = ['bypass'];
  handler.command = ['bypass2'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
