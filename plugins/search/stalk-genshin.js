// stalker/stalk-genshin — satu file: metadata + kode fitur (gabungan dari engine2/plugins/stalker/stalk-genshin.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "stalkgi"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur stalkgi (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/stalker").split('\\').join('/')
module.exports = __vx.plugin("stalker/stalk-genshin", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/stalk-genshin.js'
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
  
  	if (!text) return doReply(`🔍 *Format:* ${usedPrefix + command} <UID>\n*Contoh:* ${usedPrefix + command} 800000000`);
  
  	try {
  		if (typeof global.react === 'function') await global.react(client, m, 'loading');
  		const url = global.API('kyzz', '/api/stalker/gensin', { uid: text.trim() }, 'apikey');
  		const { data } = await axios.get(url, { timeout: 15000 });
  		if (!data?.status || !data?.playerData) return doReply(`❌ Player Genshin dengan UID "${text}" tidak ditemukan.`);
  
  		const p = data.playerData;
  		let cap = `⚔️ *GENSHIN IMPACT STALKER*\n\n`;
  		cap += `• *UID:* ${data.uid || text}\n`;
  		cap += `• *Nickname:* ${p.username || '-'}\n`;
  		cap += `• *Level:* ${p.level ?? '-'}\n`;
  		cap += `• *World Level:* ${p.worldLevel ?? '-'}\n`;
  		cap += `• *Signature:* ${p.signature || '-'}\n`;
  		cap += `• *Achievements:* ${p.finishAchievementNum ?? '-'}\n`;
  		cap += `• *Abyss Floor:* ${p.towerFloorIndex ? `${p.towerFloorIndex}-${p.towerLevelIndex}` : '-'}\n`;
  
  		if (p.avatar) {
  			await client.sendMessage(m.chat, { image: { url: p.avatar }, caption: cap.trim() }, { quoted: m });
  		} else {
  			await doReply(cap.trim());
  		}
  		if (typeof global.react === 'function') await global.react(client, m, 'success');
  	} catch (e) {
  		console.error('[STALK-GENSHIN]', e.response?.data || e);
  		if (typeof global.react === 'function') await global.react(client, m, 'error');
  		doReply(`❌ Gagal stalk Genshin: ${e.response?.data?.error || e.message}`);
  	}
  };
  
  handler.help = ['stalkgenshin <uid>'];
  handler.tags = ['stalker'];
  handler.command = /^(stalkgenshin|genshinstalk|stalkgi)$/i;
  handler.limit = true;
  handler.register = true;
  const __vxDefault = handler;
  
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
