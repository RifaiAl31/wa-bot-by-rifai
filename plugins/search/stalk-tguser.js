// stalker/stalk-tguser — satu file: metadata + kode fitur (gabungan dari engine2/plugins/stalker/stalk-tguser.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "stalktg",
    "tgstalk"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur stalktg (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/stalker").split('\\').join('/')
module.exports = __vx.plugin("stalker/stalk-tguser", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stalk-tguser.js'
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
  
  	if (!text) return doReply(`🔍 *Format:* ${usedPrefix + command} <username_user>\n*Contoh:* ${usedPrefix + command} alex`);
  
  	try {
  		if (typeof global.react === 'function') await global.react(client, m, 'loading');
  		const url = global.API('kyzz', '/api/stalker/telegram-user', { username: text.replace(/^@/, '').trim() }, 'apikey');
  		const { data } = await axios.get(url, { timeout: 15000 });
  		if (!data?.status && !data?.username && !data?.name) return doReply(`❌ User Telegram "${text}" tidak ditemukan.`);
  
  		const r = data.result || data;
  		let cap = `👤 *TELEGRAM USER STALKER*\n\n`;
  		cap += `• *Nama:* ${r.name || r.title || '-'}\n`;
  		cap += `• *Username:* @${r.username || text}\n`;
  		cap += `• *Bio:* ${r.bio || r.description || '-'}\n`;
  		if (r.id) cap += `• *ID:* ${r.id}\n`;
  
  		const img = r.photoUrl || r.avatar;
  		if (img) {
  			await client.sendMessage(m.chat, { image: { url: img }, caption: cap.trim() }, { quoted: m });
  		} else {
  			await doReply(cap.trim());
  		}
  		if (typeof global.react === 'function') await global.react(client, m, 'success');
  	} catch (e) {
  		console.error('[STALK-TGUSER]', e.response?.data || e);
  		if (typeof global.react === 'function') await global.react(client, m, 'error');
  		doReply(`❌ Gagal stalk User Telegram: ${e.response?.data?.error || e.message}`);
  	}
  };
  
  handler.help = ['stalktg <username>'];
  handler.tags = ['stalker'];
  handler.command = /^(stalktg|tgstalk)$/i;
  handler.limit = true;
  handler.register = true;
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
