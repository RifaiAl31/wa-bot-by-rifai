// stalker/stalk-wach — satu file: metadata + kode fitur (gabungan dari engine2/plugins/stalker/stalk-wach.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "stalkwach",
    "wachstalk"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur stalkwach (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/stalker").split('\\').join('/')
module.exports = __vx.plugin("stalker/stalk-wach", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stalk-wach.js'
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
  
  	if (!text) return doReply(`🔍 *Format:* ${usedPrefix + command} <link_saluran>\n*Contoh:* ${usedPrefix + command} `);
  
  	try {
  		if (typeof global.react === 'function') await global.react(client, m, 'loading');
  		const url = global.API('kyzz', '/api/stalker/wa-sl-stalk', { url: text.trim() }, 'apikey');
  		const { data } = await axios.get(url, { timeout: 15000 });
  		if (!data?.status || !data?.result) return doReply(`❌ Channel WhatsApp tidak ditemukan atau link salah.`);
  
  		const r = data.result;
  		let cap = `📢 *WHATSAPP CHANNEL STALKER*\n\n`;
  		cap += `• *Nama Saluran:* ${r.name || '-'}\n`;
  		cap += `• *Deskripsi:* ${r.desc || r.description || '-'}\n`;
  		if (r.followers) cap += `• *Followers:* ${r.followers}\n`;
  		if (r.role) cap += `• *Role:* ${r.role}\n`;
  		if (r.verified !== undefined) cap += `• *Verified:* ${r.verified ? 'Ya ✔️' : 'Tidak'}\n`;
  
  		const img = r.image || r.avatar;
  		if (img) {
  			await client.sendMessage(m.chat, { image: { url: img }, caption: cap.trim() }, { quoted: m });
  		} else {
  			await doReply(cap.trim());
  		}
  		if (typeof global.react === 'function') await global.react(client, m, 'success');
  	} catch (e) {
  		console.error('[STALK-WACH]', e.response?.data || e);
  		if (typeof global.react === 'function') await global.react(client, m, 'error');
  		doReply(`❌ Gagal stalk Saluran WhatsApp: ${e.response?.data?.error || e.message}`);
  	}
  };
  
  handler.help = ['stalkwach <link_saluran>'];
  handler.tags = ['stalker'];
  handler.command = /^(stalkwach|wachstalk)$/i;
  handler.limit = true;
  handler.register = true;
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
