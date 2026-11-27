// tools/sitekey — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "sitekey",
    "getsitekey",
    "extractsitekey"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur sitekey",
  "usage": ".sitekey <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/sitekey", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/sitekey.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) {
          return m.reply(`🔑 *SITEKEY EXTRACTOR*\n\nEkstrak SiteKey Cloudflare Turnstile / reCaptcha dari website!\nContoh:\n${usedPrefix + command} https://example.com`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let url = text.trim();
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/sitekey?apikey=${apiKey}&url=${encodeURIComponent(url)}`;
  
          let res = await fetch(apiUrl);
          let json = await res.json();
  
          if (!json.status) throw new Error(json.error || json.detail || "Sitekey tidak ditemukan.");
  
          let data = json.result || json.data || {};
          let caption = `🔑 *SITEKEY BERHASIL DITEMUKAN*\n\n`;
          caption += `🔗 *Target:* ${url}\n`;
          caption += `🛡️ *Tipe:* ${data.type || 'Cloudflare / Captcha'}\n`;
          caption += "🔐 *Sitekey:*\n\`\`\`" + (data.sitekey || data.key || json.sitekey || '-') + "\`\`\`\n\n";
          if (data.source) caption += `📜 *Sumber:* ${data.source}\n\n`;
          caption += `✅ *Request by:* ${m.pushName || 'User'}`;
  
          await m.reply(caption);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *Ekstrak Sitekey Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['sitekey <url>', 'getsitekey <url>'];
  handler.tags = ['tools'];
  handler.command = /^(sitekey|getsitekey|extractsitekey)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
