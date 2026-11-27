// tools/cf-source — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "cf-source",
    "cfsource",
    "scrapesource"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur cf-source",
  "usage": ".cf-source <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/cf-source", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/cf-source.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) {
          return m.reply(`📜 *CLOUDFLARE SOURCE CODE SCRAPER*\n\nContoh:\n${usedPrefix + command} https://target.com`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let url = text.trim();
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/cf-source?apikey=${apiKey}&url=${encodeURIComponent(url)}`;
  
          let res = await fetch(apiUrl);
          let json = await res.json();
  
          if (!json.status) throw new Error(json.error || "Gagal scraping source code.");
  
          let html = json.data?.html || json.result || json.source || '';
          let host = new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
  
          if (html.length > 4000) {
              await conn.sendMessage(m.chat, {
                  document: Buffer.from(html),
                  fileName: `source_${host}.html`,
                  mimetype: 'text/html',
                  caption: `📜 *SOURCE CODE DARI ${host}*\n\n✅ *Request by:* ${m.pushName || 'User'}`
              }, { quoted: m });
          } else {
              await m.reply("📜 *SOURCE CODE (" + host + "):*\n\n\`\`\`html\n" + html + "\n\`\`\`");
          }
  
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *CF Source Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['cf-source <url>', 'cfsource <url>'];
  handler.tags = ['tools'];
  handler.command = /^(cf-source|cfsource|scrapesource)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
