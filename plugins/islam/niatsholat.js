// islamic/niatsholat — satu file: metadata + kode fitur (gabungan dari engine2/plugins/islamic/niatsholat.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "niatsolat"
  ],
  "category": "islam",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur niatsolat (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/islamic").split('\\').join('/')
module.exports = __vx.plugin("islamic/niatsholat", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/niatsholat.js'
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
  	let waktu = text?.trim().toLowerCase() || 'subuh';
  
  	if (waktu === 'isya' || waktu === "isya'") waktu = 'isha';
  
  	try {
  		await global.react?.(client, m, '🕒').catch(() => {});
  
  		const apiUrl = global.API('kyzz', '/api/islamic/niat-sholat', { waktu }, 'apikey');
  		const { data } = await axios.get(apiUrl, { timeout: 15000 });
  
  		if (!data?.status || !data?.result) {
  			await global.react?.(client, m, '❌').catch(() => {});
  			return reply(`❌ Niat sholat untuk waktu *${waktu}* tidak ditemukan.\nPilihan waktu: subuh, dzuhur, ashar, maghrib, isha.`);
  		}
  
  		const res = data.result;
  		const caption = `🕌 *NIAT SHOLAT ${res.waktu.toUpperCase()}*\n\n` +
  			`📖 *Arab:*\n${res.arabic}\n\n` +
  			`🔤 *Latin:*\n${res.latin}\n\n` +
  			`🇮🇩 *Terjemahan:*\n${res.translation_id}\n\n` +
  			`💡 *Pilihan Waktu:* subuh, dzuhur, ashar, maghrib, isha`;
  
  		await reply(caption);
  		await global.react?.(client, m, '✅').catch(() => {});
  
  	} catch (err) {
  		console.error('[NIAT SHOLAT ERROR]', err);
  		await global.react?.(client, m, '❌').catch(() => {});
  		return reply('❌ Terjadi kesalahan saat mengambil Niat Sholat!');
  	}
  };
  
  handler.help = ['niatsholat <waktu>'];
  handler.tags = ['islamic'];
  handler.command = ['niatsholat', 'niatsolat'];
  handler.limit = true;
  
  handler.register = true;
  
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
