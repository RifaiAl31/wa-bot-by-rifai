// tools/freetiktoklike — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "freetiktoklike",
    "injectlike",
    "liketiktok"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur freetiktoklike",
  "usage": ".freetiktoklike <url tiktok>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/freetiktoklike", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/freetiktoklike.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) {
          return m.reply(`❤️ *FREE TIKTOK LIKE INJECTION*\n\nSuntik like gratis ke video TikTok!\nContoh:\n${usedPrefix + command} https://vt.tiktok.com/xxxx`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let url = text.trim();
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/freetiktoklike?apikey=${apiKey}&url=${encodeURIComponent(url)}`;
  
          let res = await fetch(apiUrl, { method: 'POST' });
          let json = await res.json();
  
          if (!json.status) throw new Error(json.error || json.message || "Gagal menyuntikkan like TikTok.");
  
          let caption = `❤️ *TIKTOK LIKE INJECTION BERHASIL*\n\n`;
          caption += `🔗 *Target Video:* ${url}\n`;
          caption += `✨ *Status:* Berhasil dikirim ke queue hulu\n\n`;
          caption += `✅ *Request by:* ${m.pushName || 'User'}`;
  
          await m.reply(caption);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *TikTok Like Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['freetiktoklike <url tiktok>'];
  handler.tags = ['tools'];
  handler.command = /^(freetiktoklike|injectlike|liketiktok)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
