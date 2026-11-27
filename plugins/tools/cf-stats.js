// tools/cf-stats — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "cf-stats",
    "cfstats",
    "bycfstats"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur cf-stats",
  "usage": ".cf-stats"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/cf-stats", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/cf-stats.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn }) => {
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
          let apiKey = global.apikey?.vxapi;
          let res = await fetch(`${global.web}/api/tools/cf-stats?apikey=${apiKey}`);
          let json = await res.json();
  
          let txt = `📊 *CLOUDFLARE BYPASS ENGINE STATS*\n\n`;
          txt += "\`\`\`" + JSON.stringify(json.data || json.result || json, null, 2, null, 2) + "\`\`\`\n\n";
          txt += `✅ *Request by:* ${m.pushName || 'User'}`;
  
          await m.reply(txt);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
      } catch (e) {
          m.reply(`❌ Error: ${e.message}`);
      }
  };
  
  handler.help = ['cf-stats', 'cfstats'];
  handler.tags = ['tools'];
  handler.command = /^(cf-stats|cfstats|bycfstats)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
