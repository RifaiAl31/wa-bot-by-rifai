// maker/jarvismeme — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "jarvismeme",
    "meme_jarvis"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur jarvismeme",
  "usage": ".jarvismeme <teks>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/maker/jarvismeme", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/jarvismeme.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, usedPrefix, command, args }) => {
      try {
          let text = args.join(' ');
          if (!text) return m.reply(`⚠️ Masukkan teks untuk meme Jarvis!\nContoh: ${usedPrefix + command} Jarvis, hapus sejarah internet saya`);
  
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          const apiUrl = `${global.web}/api/maker/jarvismeme?apikey=${global.apikey?.vxapi}&text=${encodeURIComponent(text)}`;
  
          let res = await fetch(apiUrl);
          if (!res.ok) {
              let errJson = await res.json().catch(() => ({}));
              throw new Error(errJson.message || errJson.error || `HTTP ${res.status}`);
          }
  
          let buffer = await res.arrayBuffer();
          if (res.headers.get('content-type')?.includes('application/json')) {
              let errJson = JSON.parse(Buffer.from(buffer).toString());
              throw new Error(errJson.message || errJson.error || 'Gagal memproses meme');
          }
  
          await conn.sendFile(m.chat, Buffer.from(buffer), 'jarvismeme.png', `Jarvis, laksanakan! 🤖`, m);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
      } catch (e) {
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          console.error(e);
          m.reply("❌ Error: " + (e.message || e));
      }
  };
  
  handler.help = ["jarvismeme <teks>"];
  handler.command = ["jarvismeme", "meme_jarvis"];
  handler.tags = ["maker"];
  handler.limit = true;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
