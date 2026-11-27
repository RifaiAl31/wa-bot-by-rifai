// tools/cfwaf — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "cfwaf",
    "bypasswaf",
    "cloudflaresolver"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur cfwaf",
  "usage": ".cfwaf <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/cfwaf", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/cfwaf.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) {
          return m.reply(`🛡️ *CLOUDFLARE WAF BYPASS*\n\nContoh:\n${usedPrefix + command} https://target-waf.com`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let url = text.trim();
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/cfwaf?apikey=${apiKey}`;
  
          let res = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url, mode: 'waf' })
          });
  
          let json = await res.json();
          if (!json.status) throw new Error(json.error || json.message || "Gagal membypass Cloudflare WAF.");
  
          let caption = `🛡️ *CLOUDFLARE WAF BYPASS BERHASIL*\n\n`;
          caption += `🔗 *Target:* ${url}\n`;
          caption += `📊 *Respon:* ${JSON.stringify(json.result || json.data, null, 2)}\n\n`;
          caption += `✅ *Request by:* ${m.pushName || 'User'}`;
  
          await m.reply(caption);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *CF WAF Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['cfwaf <url>', 'bypasswaf <url>'];
  handler.tags = ['tools'];
  handler.command = /^(cfwaf|bypasswaf|cloudflaresolver)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
