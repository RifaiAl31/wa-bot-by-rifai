// islamic/asmaulhusna — satu file: metadata + kode fitur (gabungan dari engine2/plugins/islamic/asmaulhusna.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "asma"
  ],
  "category": "islam",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur asma (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/islamic").split('\\').join('/')
module.exports = __vx.plugin("islamic/asmaulhusna", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/asmaulhusna.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /**
   * Creator : Owner Bot
   * 
   * note : don't claim this code
   */
  
  const axios = __vxDef(require("axios"));
  
  const handler = async (m, { sock, conn, text, usedPrefix, command, reply }) => {
  	const client = sock || conn;
  
  	let num = parseInt(text?.trim());
  	if (isNaN(num) || num < 1 || num > 99) {
  		num = Math.floor(Math.random() * 99) + 1;
  	}
  
  	try {
  		await global.react?.(client, m, '🕒').catch(() => {});
  
  		const apiUrl = global.API('kyzz', '/api/islamic/asmaul-husna', { nomor: num }, 'apikey');
  		const { data } = await axios.get(apiUrl, { timeout: 15000 });
  
  		if (!data?.status || !data?.result) {
  			await global.react?.(client, m, '❌').catch(() => {});
  			return reply('❌ Gagal mengambil data Asmaul Husna.');
  		}
  
  		const res = data.result;
  		const caption = `✨ *ASMAUL HUSNA* (${res.index}/99)\n\n` +
  			`📖 *Arab:* ${res.arabic}\n` +
  			`🔤 *Latin:* ${res.latin}\n` +
  			`🇮🇩 *Arti (ID):* ${res.translation_id}\n` +
  			`🇬🇧 *Arti (EN):* ${res.translation_en}\n\n` +
  			`💡 *Tips:* Ketik \`${usedPrefix}${command} 1\` - \`${usedPrefix}${command} 99\` untuk nomor tertentu.`;
  
  		await reply(caption);
  		await global.react?.(client, m, '✅').catch(() => {});
  
  	} catch (err) {
  		console.error('[ASMAUL HUSNA ERROR]', err);
  		await global.react?.(client, m, '❌').catch(() => {});
  		return reply('❌ Terjadi kesalahan saat mengambil Asmaul Husna!');
  	}
  };
  
  handler.help = ['asmaulhusna <nomor 1-99>'];
  handler.tags = ['islamic'];
  handler.command = ['asmaulhusna', 'asma'];
  handler.limit = true;
  
  handler.register = true;
  
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
