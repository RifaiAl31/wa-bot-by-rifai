// tools/pushch — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "pushch",
    "pushsaluran",
    "pushchannel"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur pushch",
  "usage": ".pushch <teks / reply media>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/tools/pushch", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/pushch.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  let handler = async (m, { conn, args, text }) => {
      let q = m.quoted ? m.quoted : m;
      let mime = (q.msg || q).mimetype || '';
      let targetChannel = global.saluran || args[0];
  
      if (!targetChannel) return m.reply("⚠️ Target saluran / channel WhatsApp belum dikonfigurasi di config.js");
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
  
          if (mime) {
              let media = await q.download();
              if (/image/.test(mime)) {
                  await conn.sendMessage(targetChannel, { image: media, caption: text || '' });
              } else if (/video/.test(mime)) {
                  await conn.sendMessage(targetChannel, { video: media, caption: text || '' });
              } else if (/audio/.test(mime)) {
                  await conn.sendMessage(targetChannel, { audio: media, mimetype: 'audio/mp4' });
              } else {
                  await conn.sendMessage(targetChannel, { document: media, mimetype: mime, fileName: 'file' });
              }
          } else if (text) {
              await conn.sendMessage(targetChannel, { text: text });
          } else {
              return m.reply("⚠️ Kirim / reply pesan atau media yang ingin dipush ke saluran!");
          }
  
          m.reply("✅ Pesan berhasil dipush ke saluran WhatsApp!");
          await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
      } catch (e) {
          m.reply(`❌ Gagal push ke saluran: ${e.message}`);
      }
  };
  
  handler.help = ['pushch <teks / reply media>'];
  handler.tags = ['tools'];
  handler.command = /^(pushch|pushsaluran|pushchannel)$/i;
  handler.owner = true;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
