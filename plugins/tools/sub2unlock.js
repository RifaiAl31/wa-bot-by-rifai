// bypass/sub2unlock — satu file: metadata + kode fitur (gabungan dari engine5/plugins/bypass/sub2unlock.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "sub2unlock",
  "command": [
    "sub2unlock"
  ],
  "category": "tools",
  "desc": "Fitur sub2unlock <url>",
  "usage": ".sub2unlock <url>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/bypass").split('\\').join('/')
module.exports = __vx.plugin("bypass/sub2unlock", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sub2unlock.js'
  const __vxExports = {};
  const handler = async (m, { sock, args, text, reply, example }) => {
  	const rawUrl = args[0] || (m.quoted ? (m.quoted.text || '') : text);
  
  	if (!rawUrl) {
  		return reply(
  			`🔓 *BYPASS SUB2UNLOCK* 🎀\n\n` +
  			`Masukkan link Sub2Unlock yang ingin di-bypass!\n\n` +
  			`• 📌 *ᴄᴏɴᴛᴏʜ:* ${example('https://sub2unlock.com/xxxx')}`
  		);
  	}
  
  	const match = rawUrl.match(/https?:\/\/[^\s]+/i);
  	const targetUrl = match ? match[0] : (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
  
  	try {
  		const res = await global.fetchApi('kyzz', '/api/bypass/sub2unlock', {
  			url: targetUrl
  		}, { timeout: 30000 });
  
  		if (!res || !res.status) {
  			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  			return reply(`❌ Gagal bypass Sub2Unlock: ${res?.message || 'Link tidak valid atau expired.'}`);
  		}
  
  		const result = res.result || res.data || res;
  		const resultUrl = typeof result === 'string' ? result : (result.url || result.destinationUrl || result.destination || result.link || result.result || '-');
  
  		let caption = `🔓 *SUB2UNLOCK BYPASS RESULT*\n\n`;
  		caption += `🔗 *Original:* ${targetUrl}\n`;
  		caption += `🎯 *Result:* ${resultUrl}\n\n`;
  		caption += `© ${global.namaBot}`;
  
  		await reply(caption.trim());
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
  	} catch (e) {
  		console.error('[SUB2UNLOCK ERROR]', e.response?.data || e.message);
  		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
  		return reply(`❌ Terjadi kesalahan: ${e.response?.data?.message || e.message}`);
  	}
  };
  
  handler.help = ['sub2unlock <url>'];
  handler.tags = ['tools'];
  handler.command = ['sub2unlock'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
