// tools/bypas-sfl — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "bypas-sfl"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur bypas-sfl",
  "usage": ".bypas-sfl <url>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/bypas-sfl", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/bypas-sfl.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) {
          return m.reply(`🔓 *SFL.GL BYPASS*\n\nLewati tautan Safelink sfl.gl / sfile!\nContoh:\n${usedPrefix + command} https://sfl.gl/xxxx`);
      }
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let url = text.trim();
          let apiKey = global.apikey?.vxapi;
          let apiUrl = `${global.web}/api/tools/bypas-sfl?apikey=${apiKey}`;
  
          let res = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url })
          });
  
          let json = await res.json();
          if (!json.status) throw new Error(json.error || json.detail || "Gagal membypass link sfl.");
  
          let data = json.result || {};
          let caption = `🔓 *SFL BYPASS BERHASIL*\n\n`;
          caption += `🔗 *Link Asal:*\n${data.original_url || url}\n\n`;
          caption += `🎯 *Link Tujuan:*\n${data.bypassed_url || '-'}\n\n`;
          caption += `⏱️ *Waktu Proses:* ${json.time_taken || data.time_taken || '-'}s\n\n`;
          caption += `✅ *Request by:* ${m.pushName || 'User'}`;
  
          await m.reply(caption);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
  
      } catch (e) {
          console.error(e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ *Bypass SFL Gagal*\nError: ${e.message}`);
      }
  };
  
  handler.help = ['bypas-sfl <url>', 'bypasssfl <url>'];
  handler.tags = ['tools'];
  handler.command = /^(bypas-sfl|bypasssfl|sflbypass)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
