// stalker/stalk-ttrepost — satu file: metadata + kode fitur (gabungan dari engine2/plugins/stalker/stalk-ttrepost.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "stalkttrepost",
    "ttrepost"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur stalkttrepost (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/stalker").split('\\').join('/')
module.exports = __vx.plugin("stalker/stalk-ttrepost", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stalk-ttrepost.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /**
   * Creator : Owner Bot
   * 
   * note : don't claim this code
   */
  
  const axios = __vxDef(require("axios"));
  
  let handler = async (m, { conn, sock, text, usedPrefix, command, reply }) => {
  	const client = conn || sock;
  	const doReply = typeof reply === 'function' ? reply : typeof m.reply === 'function' ? m.reply.bind(m) : (txt) => client.sendMessage(m.chat, { text: txt }, { quoted: m });
  
  	if (!text) return doReply(`🔍 *Format:* ${usedPrefix + command} <username>\n*Contoh:* ${usedPrefix + command} dimeh493`);
  
  	try {
  		if (typeof global.react === 'function') await global.react(client, m, 'loading');
  		const url = global.API('kyzz', '/api/stalker/tiktok-repost', { username: text.replace(/^@/, '').trim() }, 'apikey');
  		const { data } = await axios.get(url, { timeout: 15000 });
  		if (!data?.status || !data?.result) return doReply(`❌ Data repost TikTok "${text}" tidak ditemukan.`);
  
  		const r = data.result;
  		let cap = `🔁 *TIKTOK REPOST VIEWER*\n\n`;
  		cap += `• *Username:* ${data.username || text}\n`;
  		if (Array.isArray(r)) {
  			cap += `• *Total Repost:* ${r.length}\n\n`;
  			for (const [i, item] of r.slice(0, 5).entries()) {
  				cap += `*${i + 1}.* ${item.title || item.desc || 'Video'}\n> ${item.url || item.videoUrl || '-'}\n\n`;
  			}
  		} else {
  			cap += `• *Hasil:* ${JSON.stringify(r).slice(0, 300)}\n`;
  		}
  
  		await doReply(cap.trim());
  		if (typeof global.react === 'function') await global.react(client, m, 'success');
  	} catch (e) {
  		console.error('[STALK-TTREPOST]', e.response?.data || e);
  		if (typeof global.react === 'function') await global.react(client, m, 'error');
  		doReply(`❌ Gagal ambil repost TikTok: ${e.response?.data?.error || e.message}`);
  	}
  };
  
  handler.help = ['stalkttrepost <username>'];
  handler.tags = ['stalker'];
  handler.command = /^(stalkttrepost|ttrepost)$/i;
  handler.limit = true;
  handler.register = true;
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
