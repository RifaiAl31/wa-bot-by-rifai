// game/stalk — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "mlbbstalk"
  ],
  "category": "game",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur mlbbstalk",
  "usage": ".mlbbstalk <id> <zone>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/mlbb/stalk", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/stalk.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  let handler = async (m, {
    conn,
    usedPrefix,
    command,
    text,
    args
  }) => {
    const input = (text || args.join(' ')).trim();
    const parts = input.split(/[\s|/]+/).filter(Boolean);
  
    if (parts.length < 2) {
      return m.reply(`🎮 *MOBILE LEGENDS STALKER*\n\n*Format:* ${usedPrefix + command} <User ID> <Zone ID>\n*Contoh:* ${usedPrefix + command} 84437003 2163`);
    }
  
    const userId = parts[0].replace(/[^0-9]/g, '');
    const zoneId = parts[1].replace(/[^0-9]/g, '');
  
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
    try {
      const response = await fetch(`${global.web}/api/mlbb/stalk?apikey=${global.apikey?.vxapi}&id=${encodeURIComponent(userId)}&zone=${encodeURIComponent(zoneId)}`);
      const json = await response.json();
      if (!json.status || !json.result) {
        throw new Error(json.error || "Akun Mobile Legends tidak ditemukan");
      }
  
      const r = json.result;
  
      let card = `╭━━━〔 🎮 *MLBB USER PROFILE* 〕━━━\n`;
      card += `┃ 👤 *Nickname:* ${r.nickname || '-'}\n`;
      card += `┃ 🆔 *User ID:* ${r.id || userId}\n`;
      card += `┃ 🌐 *Zone / Server:* ${r.zone || zoneId}\n`;
      card += `┃ 🗺️ *Region:* ${r.region || 'Indonesia'}\n`;
      card += `┃ 💎 *Status:* ✅ ${r.account_status || 'Aktif'}\n`;
      card += `╰━━━━━━━━━━━━━━━━━━━━━━━`;
  
      await m.reply(card);
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {
      console.error('MLBB Stalk Error:', e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply(`❌ *Gagal Stalk MLBB:* ${e.message}`);
    }
  };
  
  handler.help = ["mlbbstalk <id> <zone>"];
  handler.tags = ["mlbb", "stalker"];
  handler.command = ["mlbbstalk", "stalkml", "mlstalk", "ceknickml"];
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
