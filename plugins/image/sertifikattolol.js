// maker/sertifikattolol — satu file: metadata + kode fitur (gabungan dari engine5/plugins/maker/sertifikattolol.js)
const __vx = require("../../lib/adapter/e5.js")
const __meta = {
  "name": "sertifikattolol",
  "command": [
    "sertifikattolol",
    "sertitolol"
  ],
  "category": "image",
  "desc": "Fitur sertifikattolol",
  "usage": ".sertifikattolol",
  "limit": true
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/sertifikattolol", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sertifikattolol.js'
  const __vxExports = {};
  const handler = async (m, { sock, text, prefix, command, reply }) => {
  	const pfx = prefix || '.';
  	const name = text?.trim();
  
  	if (!name) {
  		return reply(`Masukkan nama!\n\n*Contoh:*\n\`${pfx}${command} Ujang\``);
  	}
  
  	await sock.sendMessage(m.chat, { react: { text: '⏳', key: m.key } }).catch(() => null);
  
  	try {
  		const buffer = await global.fetchApi('kyzz', '/api/canvas/sertifikat-tolol', { 
  			name 
  		}, { 
  			responseType: 'arraybuffer' 
  		});
  
  		await sock.sendMessage(m.chat, { react: { text: '✨', key: m.key } }).catch(() => null);
  
  		return await sock.sendMessage(m.chat, {
  			image: Buffer.from(buffer),
  			caption: `📜 *SERTIFIKAT TOLOL*\n\n👤 Diberikan kepada: *${name}*`
  		}, { quoted: m });
  
  	} catch (e) {
  		console.error('[SERTIFIKAT TOLOL ERROR]:', e);
  		await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } }).catch(() => null);
  		return reply(`❌ Error: ${e.message || e}`);
  	}
  };
  
  handler.help = ['sertifikattolol'];
  handler.tags = ['maker'];
  handler.command = ['sertifikattolol', 'sertitolol'];
  handler.limit = true;
  
  const __vxDefault = handler;
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
