// tools/artimimpi — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "artimimpitool"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur artimimpitool",
  "usage": ".artimimpitool <mimpi>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/artimimpi", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/artimimpi.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`🌙 *TAFSIR ARTI MIMPI*\n\nContoh:\n${usedPrefix + command} melihat ular besar`);
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
          let apiKey = global.apikey?.vxapi;
          let res = await fetch(`${global.web}/api/primbon/tafsirmimpi?apikey=${apiKey}&mimpi=${encodeURIComponent(text.trim())}`);
          let json = await res.json();
          if (!json.status) throw new Error(json.error || "Tafsir mimpi tidak ditemukan.");
          let data = json.data || json.result || {};
          let caption = `🌙 *TAFSIR ARTI MIMPI*\n\n`;
          caption += `💭 *Mimpi:* ${text}\n`;
          caption += `📖 *Artinya:*\n${data.arti || data.tafsir || data.solusi || JSON.stringify(data)}\n\n`;
          caption += `✅ *Request by:* ${m.pushName || 'User'}`;
          await m.reply(caption);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
      } catch (e) {
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          m.reply(`❌ Error: ${e.message}`);
      }
  };
  
  handler.help = ['artimimpitool <mimpi>'];
  handler.tags = ['tools'];
  handler.command = /^(artimimpitool)$/i;
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
