// bypass/sfl — satu file: metadata + kode fitur (gabungan dari engine5/plugins/bypass/sfl.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "sfl",
  "command": [
    "sfl",
    "bypasssfl",
    "sflbypass"
  ],
  "category": "tools",
  "desc": "Fitur sfl <url>",
  "usage": ".sfl <url>",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/bypass").split('\\').join('/')
module.exports = __vx.plugin("bypass/sfl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sfl.js'
  const __vxExports = {};
  const handler = async (m, { sock, args, text, reply, example }) => {
  	const rawUrl = args[0] || (m.quoted ? (m.quoted.text || '') : text);
  
  	if (!rawUrl) {
  		return reply(
  			`🔓 *SFL LINK BYPASS* 🎀\n\n` +
  			`Masukkan link SFL yang ingin di-bypass!\n\n` +
  			`• 📌 *ᴄᴏɴᴛᴏʜ:* ${example('https://sfl.gl/xxxx')}`
  		);
  	}
  
  	const matchUrl = rawUrl.match(/https?:\/\/[^\s]+/i);
  	const targetUrl = matchUrl ? matchUrl[0] : (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
  
  	try {
  		const data = await global.fetchApi('kyzz', '/api/bypass/sfl', {
  			url: targetUrl
  		}, { timeout: 30000 });
  
  		if (!data?.status || !data?.result) {
  			await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  			return reply('❌ Gagal melakukan bypass link SFL. Pastikan link valid.');
  		}
  
  		const { originalUrl, destinationUrl } = data.result;
  
  		let caption = `🔓 *SFL LINK BYPASS*\n\n`;
  		caption += `🔗 *Original:* ${originalUrl || targetUrl}\n`;
  		caption += `🎯 *Destination:* ${destinationUrl || '-'}\n\n`;
  		caption += `© ${global.namaBot}`;
  
  		await reply(caption.trim());
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } });
  
  	} catch (e) {
  		console.error('[SFL BYPASS ERROR]', e.response?.data || e.message);
  		await sock.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
  		return reply('❌ Terjadi kesalahan saat menghubungi server bypass.');
  	}
  };
  
  handler.help = ['sfl <url>', 'bypasssfl <url>'];
  handler.tags = ['tools'];
  handler.command = ['sfl', 'bypasssfl', 'sflbypass'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
