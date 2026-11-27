// islamic/ayatkursi — satu file: metadata + kode fitur (gabungan dari engine2/plugins/islamic/ayatkursi.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "akursi",
    "ayatkursi"
  ],
  "category": "islam",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur ayatkursi (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/islamic").split('\\').join('/')
module.exports = __vx.plugin("islamic/ayatkursi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ayatkursi.js'
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
  
  		const apiUrl = global.API('kyzz', '/api/islamic/ayat-kursi', {}, 'apikey');
  		const { data } = await axios.get(apiUrl, { timeout: 15000 });
  
  		if (!data?.status || !data?.result) {
  			await global.react?.(client, m, '❌').catch(() => {});
  			return reply('❌ Gagal mengambil data Ayat Kursi.');
  		}
  
  		const res = data.result;
  		const caption = `🕋 *AYAT KURSI*\n` +
  			`📜 *Surah:* ${res.surah} (Ayat ${res.ayat})\n\n` +
  			`📖 *Arab:*\n${res.arabic}\n\n` +
  			`🔤 *Latin:*\n${res.latin}\n\n` +
  			`🇮🇩 *Terjemahan:*\n${res.translation_id}`;
  
  		await reply(caption);
  		await global.react?.(client, m, '✅').catch(() => {});
  
  	} catch (err) {
  		console.error('[AYAT KURSI ERROR]', err);
  		await global.react?.(client, m, '❌').catch(() => {});
  		return reply('❌ Terjadi kesalahan saat mengambil Ayat Kursi!');
  	}
  };
  
  handler.help = ['ayatkursi'];
  handler.tags = ['islamic'];
  handler.command = ['ayatkursi', 'akursi'];
  handler.limit = true;
  
  handler.register = true;
  
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
