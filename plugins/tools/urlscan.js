// tools/urlscan — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": ["urlscan", "scanlink", "safelink"],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur urlscan",
  "usage": ".urlscan <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/urlscan", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/urlscan.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) {
          return m.reply(`🛡️ *URL SCAN & SECURITY ANALYZER*\n\nPeriksa keamanan tautan dari phising, malware, dan virus!\nContoh:\n${usedPrefix + command} https://example.com`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let url = text.trim();
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/urlscan?apikey=${apiKey}`;
  
          let res = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url })
          });
  
          let json = await res.json();
          if (!json.status) throw new Error(json.error || json.detail || "Gagal menganalisis URL.");
  
          let data = json.result || {};
          let caption = `🛡️ *HASIL SCAN KEAMANAN URL*\n\n`;
          caption += `🔗 *Target:* ${url}\n`;
          caption += `📊 *Status:* ${data.status || 'Aman / Terverifikasi'}\n`;
          if (data.ip) caption += `🌐 *IP Server:* ${data.ip}\n`;
          if (data.country) caption += `📍 *Negara:* ${data.country}\n`;
          if (data.verdict) caption += `⚠️ *Verdict:* ${data.verdict}\n`;
          caption += `\n✅ *Request by:* ${m.pushName || 'User'}`;
  
          await m.reply(caption);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *Scan URL Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['urlscan <url>', 'ceklink <url>'];
  handler.tags = ['tools'];
  handler.command = /^(urlscan|ceklink|scanlink|safelink)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
