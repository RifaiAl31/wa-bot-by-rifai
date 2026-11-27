// anime/cosplay — satu file: metadata + kode fitur (gabungan dari engine5/plugins/anime/cosplay.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "cosplay",
  "command": [
    "cosplay"
  ],
  "category": "anime",
  "desc": "Perintah cosplay",
  "usage": "",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/anime").split('\\').join('/')
module.exports = __vx.plugin("anime/cosplay", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/cosplay.js'
  const __vxExports = {};
  const handler = async (m, { sock }) => {
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);
  
  	try {
  		const buffer = await global.fetchApi('kyzz', '/api/image/cosplay', {}, {
  			responseType: 'arraybuffer',
  			headers: {
  				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  			}
  		});
  
  		await sock.sendMessage(m.chat, { react: { text: '👗', key: m.key } }).catch(() => null);
  
  		const caption = `👗 *COSPLAY*\n\n© ${global.namaBot}`;
  
  		return await sock.sendMessage(m.chat, {
  			image: Buffer.from(buffer),
  			caption: caption
  		}, { quoted: m });
  
  	} catch (e) {
  		console.error('[COSPLAY ERROR]:', e.message);
  		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
  		return m.reply('❌ Gagal mengambil gambar Cosplay.');
  	}
  };
  
  handler.command = ['cosplay'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
