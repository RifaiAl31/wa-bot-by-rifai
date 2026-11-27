// stalker/stalk-jkt — satu file: metadata + kode fitur (gabungan dari engine2/plugins/stalker/stalk-jkt.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "jkt48stalk",
    "jktstalk",
    "stalkjkt"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur stalkjkt (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/stalker").split('\\').join('/')
module.exports = __vx.plugin("stalker/stalk-jkt", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stalk-jkt.js'
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
  
  	if (!text) return doReply(`🔍 *Format:* ${usedPrefix + command} <nama_member>\n*Contoh:* ${usedPrefix + command} freya`);
  
  	try {
  		if (typeof global.react === 'function') await global.react(client, m, 'loading');
  		const url = global.API('kyzz', '/api/stalker/jkt', { username: text.trim() }, 'apikey');
  		const { data } = await axios.get(url, { timeout: 15000 });
  		if (!data?.status || !data?.result) return doReply(`❌ Member JKT48 "${text}" tidak ditemukan.`);
  
  		const r = data.result;
  		let cap = `🌸 *JKT48 MEMBER STALKER*\n\n`;
  		cap += `• *Nama:* ${r.name || r.fullname || '-'}\n`;
  		cap += `• *Panggilan:* ${r.nickname || '-'}\n`;
  		cap += `• *Team:* ${r.team || '-'}\n`;
  		cap += `• *Generasi:* ${r.generation || '-'}\n`;
  		cap += `• *Tanggal Lahir:* ${r.birthdate ? r.birthdate.split('T')[0] : '-'}\n`;
  		cap += `• *Golongan Darah:* ${r.bloodType || '-'}\n`;
  		cap += `• *Horoskop:* ${r.horoscope || '-'}\n`;
  		cap += `• *Tinggi Badan:* ${r.height || '-'}\n`;
  
  		const img = r.picture || r.avatar || r.image;
  		if (img) {
  			await client.sendMessage(m.chat, { image: { url: img }, caption: cap.trim() }, { quoted: m });
  		} else {
  			await doReply(cap.trim());
  		}
  		if (typeof global.react === 'function') await global.react(client, m, 'success');
  	} catch (e) {
  		console.error('[STALK-JKT]', e.response?.data || e);
  		if (typeof global.react === 'function') await global.react(client, m, 'error');
  		doReply(`❌ Gagal stalk JKT48: ${e.response?.data?.error || e.message}`);
  	}
  };
  
  handler.help = ['stalkjkt <nama>'];
  handler.tags = ['stalker'];
  handler.command = /^(stalkjkt|jktstalk|jkt48stalk)$/i;
  handler.limit = true;
  handler.register = true;
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
