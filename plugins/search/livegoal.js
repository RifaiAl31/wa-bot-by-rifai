// search/livegoal — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "livegoal"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur livegoal",
  "usage": ".livegoal"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/search/livegoal", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/livegoal.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, usedPrefix, command }) => {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
    try {
      const apiKey = global.apikey?.vxapi;
      const res = await fetch(`${global.web}/api/search/livegoal?apikey=${apiKey}&edition=id`);
      const json = await res.json();
  
      if (!json.status || !json.result || json.result.length === 0) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        return m.reply("❌ Tidak ada data live score sepak bola saat ini.");
      }
  
      let output = `⚽ *LIVE SCORE SEPAK BOLA HARI INI*\n\n`;
      const comps = json.result.slice(0, 5);
  
      comps.forEach(comp => {
        output += `🏆 *Kompetisi:* ${comp.kompetisi} (${comp.area})\n`;
        (comp.pertandingan || []).slice(0, 5).forEach(match => {
          const scoreA = match.skorTuanRumah !== null ? match.skorTuanRumah : '-';
          const scoreB = match.skorTandang !== null ? match.skorTandang : '-';
          output += `• ${match.tuanRumah} [ ${scoreA} : ${scoreB} ] ${match.tandang}\n`;
          output += `  Status: *${match.status}*\n`;
        });
        output += `\n`;
      });
  
      output += `✨ *Goal.com Real-Time Score Engine*`;
  
      await m.reply(output.trim());
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply("❌ Gagal memuat live score: " + e.message);
    }
  };
  
  handler.help = ['livegoal', 'livescore', 'skorbola'];
  handler.tags = ['search'];
  handler.command = /^(livegoal|livescore|skorbola)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
