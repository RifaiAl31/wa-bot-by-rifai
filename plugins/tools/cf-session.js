// tools/cf-session — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "cf-session",
    "cfsession",
    "cfcookies"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur cf-session",
  "usage": ".cf-session <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/cf-session", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/cf-session.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) {
          return m.reply(`🛡️ *CLOUDFLARE SESSION EXTRACTOR*\n\nContoh:\n${usedPrefix + command} https://target.com`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let url = text.trim();
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/cf-session?apikey=${apiKey}&url=${encodeURIComponent(url)}`;
  
          let res = await fetch(apiUrl);
          let json = await res.json();
  
          if (!json.status) throw new Error(json.error || "Gagal mendapatkan session cookies.");
  
          let caption = `🛡️ *CLOUDFLARE SESSION COOKIES*\n\n`;
          caption += `🔗 *Target:* ${url}\n`;
          caption += "🍪 *Cookies:*\n\`\`\`" + JSON.stringify(json.data?.cookies || json.result?.cookies || json.data, null, 2, null, 2) + "\`\`\`\n\n";
          caption += `✅ *Request by:* ${m.pushName || 'User'}`;
  
          await m.reply(caption);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *CF Session Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['cf-session <url>', 'cfsession <url>'];
  handler.tags = ['tools'];
  handler.command = /^(cf-session|cfsession|cfcookies)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
