// stalker/stalk-tgch — satu file: metadata + kode fitur (gabungan dari engine2/plugins/stalker/stalk-tgch.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "stalktgch",
    "tgchstalk"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur stalktgch (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/stalker").split('\\').join('/')
module.exports = __vx.plugin("stalker/stalk-tgch", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stalk-tgch.js'
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
  
  	if (!text) return doReply(`🔍 *Format:* ${usedPrefix + command} <username_channel>\n*Contoh:* ${usedPrefix + command} durov`);
  
  	try {
  		if (typeof global.react === 'function') await global.react(client, m, 'loading');
  		const url = global.API('kyzz', '/api/stalker/telegram-channel', { username: text.replace(/^@/, '').trim() }, 'apikey');
  		const { data } = await axios.get(url, { timeout: 15000 });
  		if (!data?.status && data?.status !== undefined && !data?.title) return doReply(`❌ Channel Telegram "${text}" tidak ditemukan.`);
  
  		let cap = `📢 *TELEGRAM CHANNEL STALKER*\n\n`;
  		cap += `• *Judul:* ${data.title || '-'}\n`;
  		cap += `• *Username:* @${data.username || text}\n`;
  		cap += `• *Deskripsi:* ${data.description || '-'}\n`;
  		cap += `• *Subscribers:* ${data.subscribers ?? '-'}\n`;
  		cap += `• *Tipe:* ${data.type || 'channel'}\n`;
  		cap += `• *Verified:* ${data.verified ? 'Ya ✔️' : 'Tidak'}\n`;
  		if (data.link) cap += `• *Link:* ${data.link}\n`;
  
  		if (data.photoUrl) {
  			await client.sendMessage(m.chat, { image: { url: data.photoUrl }, caption: cap.trim() }, { quoted: m });
  		} else {
  			await doReply(cap.trim());
  		}
  		if (typeof global.react === 'function') await global.react(client, m, 'success');
  	} catch (e) {
  		console.error('[STALK-TGCH]', e.response?.data || e);
  		if (typeof global.react === 'function') await global.react(client, m, 'error');
  		doReply(`❌ Gagal stalk Channel Telegram: ${e.response?.data?.error || e.message}`);
  	}
  };
  
  handler.help = ['stalktgch <username>'];
  handler.tags = ['stalker'];
  handler.command = /^(stalktgch|tgchstalk)$/i;
  handler.limit = true;
  handler.register = true;
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
