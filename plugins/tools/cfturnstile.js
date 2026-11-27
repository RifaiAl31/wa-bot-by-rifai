// tools/cfturnstile — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "cfturnstile",
    "turnstilebypass",
    "bypassturnstile"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur cfturnstile",
  "usage": ".cfturnstile <url>|<sitekey>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/cfturnstile", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/cfturnstile.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) {
          return m.reply(`🛡️ *CLOUDFLARE TURNSTILE BYPASS*\n\nBypass Cloudflare Turnstile CAPTCHA untuk mendapatkan token valid!\n\n*Format:*\n${usedPrefix + command} <url>|<sitekey>\n\n*Contoh:*\n${usedPrefix + command} https://target.com|0x4AAAAAA...`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
          m.reply("⏳ Menyelesaikan challenge Cloudflare Turnstile... Mohon tunggu.");
  
          let [url, sitekey] = text.split('|').map(s => s.trim());
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/cfturnstile?apikey=${apiKey}`;
  
          let res = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url, sitekey, mode: 'max' })
          });
  
          let json = await res.json();
          if (!json.status) throw new Error(json.error || json.message || "Gagal membypass Turnstile.");
  
          let token = json.result || json.token || json.data?.token || JSON.stringify(json.result);
  
          let caption = `🛡️ *CLOUDFLARE TURNSTILE BYPASS BERHASIL*\n\n`;
          caption += `🔗 *Target:* ${url}\n`;
          caption += "🔑 *Turnstile Token:*\n\`\`\`" + token + "\`\`\`\n\n";
          caption += `✅ *Request by:* ${m.pushName || 'User'}`;
  
          await m.reply(caption);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *Turnstile Bypass Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['cfturnstile <url>|<sitekey>', 'turnstilebypass <url>|<sitekey>'];
  handler.tags = ['tools'];
  handler.command = /^(cfturnstile|turnstilebypass|bypassturnstile)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
