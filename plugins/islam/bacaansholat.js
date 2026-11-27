// islamic/bacaansholat — satu file: metadata + kode fitur (gabungan dari engine2/plugins/islamic/bacaansholat.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "bacaansholat",
    "bacaansolat"
  ],
  "category": "islam",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur bacaansholat (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/islamic").split('\\').join('/')
module.exports = __vx.plugin("islamic/bacaansholat", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/bacaansholat.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /**
   * Creator : Owner Bot
   * 
   * note : don't claim this code
   */
  
  const axios = __vxDef(require("axios"));
  
  const handler = async (m, { sock, conn, reply }) => {
  	const client = sock || conn;
  
  	try {
  		await global.react?.(client, m, '🕒').catch(() => {});
  
  		const apiUrl = global.API('kyzz', '/api/islamic/bacaan-sholat', {}, 'apikey');
  		const { data } = await axios.get(apiUrl, { timeout: 15000 });
  
  		if (!data?.status || !Array.isArray(data?.result)) {
  			await global.react?.(client, m, '❌').catch(() => {});
  			return reply('❌ Gagal mengambil data Bacaan Sholat.');
  		}
  
  		let txt = `🕌 *BACAAN SHOLAT LENGKAP*\n\n`;
  		data.result.forEach((item, i) => {
  			txt += `*${i + 1}. ${item.nama}*\n`;
  			if (item.arabic) txt += `📖 ${item.arabic}\n`;
  			if (item.latin) txt += `🔤 _${item.latin}_\n`;
  			if (item.terjemahan) txt += `🇮🇩 ${item.terjemahan}\n`;
  			txt += `\n───────────────────\n\n`;
  		});
  
  		await reply(txt.trim());
  		await global.react?.(client, m, '✅').catch(() => {});
  
  	} catch (err) {
  		console.error('[BACAAN SHOLAT ERROR]', err);
  		await global.react?.(client, m, '❌').catch(() => {});
  		return reply('❌ Terjadi kesalahan saat mengambil Bacaan Sholat!');
  	}
  };
  
  handler.help = ['bacaansholat'];
  handler.tags = ['islamic'];
  handler.command = ['bacaansholat', 'bacaansolat'];
  handler.limit = true;
  
  handler.register = true;
  
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
