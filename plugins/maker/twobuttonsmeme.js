// maker/twobuttonsmeme — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "twobuttonsmeme",
    "meme2tombol"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur twobuttonsmeme",
  "usage": ".twobuttonsmeme <teks1>|<teks2>|<teks3>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/maker/twobuttonsmeme", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/twobuttonsmeme.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, usedPrefix, command, args }) => {
      try {
          let text = args.join(' ');
          if (!text) return m.reply(`⚠️ Format salah!\nContoh: ${usedPrefix + command} Makan Nasi | Makan Mie`);
          
          let [kiri, kanan, ketiga] = text.split('|').map(v => v.trim());
          if (!kiri || !kanan) return m.reply(`⚠️ Harus ada dua pilihan dipisah tanda '|'\nContoh: ${usedPrefix + command} Tidur | Begadang`);
  
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          let apiUrl = `${global.web}/api/maker/twobuttonsmeme?apikey=${global.apikey?.vxapi}&teks1=${encodeURIComponent(kiri)}&teks2=${encodeURIComponent(kanan)}`;
          if (ketiga) apiUrl += `&teks3=${encodeURIComponent(ketiga)}`;
  
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
  
          await conn.sendFile(m.chat, Buffer.from(buffer), 'twobuttonsmeme.png', `🔘 Pilihan yang sulit...`, m);
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
      } catch (e) {
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          console.error(e);
          m.reply("❌ Error: " + (e.message || e));
      }
  };
  
  handler.help = ["twobuttonsmeme <teks1>|<teks2>|<teks3>"];
  handler.command = ["twobuttonsmeme", "meme2tombol", "meme2"];
  handler.tags = ["maker"];
  handler.limit = true;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
