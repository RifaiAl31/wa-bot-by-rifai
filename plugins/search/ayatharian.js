// search/ayatharian — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "ayatharian",
    "alkitabharian"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur ayatharian",
  "usage": ".ayatharian"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/search/ayatharian", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/ayatharian.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, usedPrefix, command }) => {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
    try {
      const apiKey = global.apikey?.vxapi;
      const res = await fetch(`${global.web}/api/search/ayatharian?apikey=${apiKey}`);
      const json = await res.json();
  
      if (!json.status || !json.result) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        return m.reply("❌ Gagal mengambil ayat alkitab harian.");
      }
  
      const r = json.result;
      let text = `📖 *AYAT ALKITAB HARIAN*\n\n`;
      text += `📌 *Ayat:* ${r.ayat || '-'}\n`;
      text += `📜 *Kitab:* ${r.buku || '-'} (Pasal ${r.pasal || '-'})\n`;
      text += `🕊️ *Perjanjian:* ${r.perjanjian || '-'}\n\n`;
      text += `📝 *Firman:*\n"${r.isi || '-'}"\n\n`;
      if (r.audio?.mp3_chapter) {
        text += `🔊 *Audio Pasal MP3:*\n${r.audio.mp3_chapter}\n\n`;
      }
      text += `✨ *WhatsApp Bot API Bible Gateway*`;
  
      await m.reply(text.trim());
  
      if (r.audio?.mp3_chapter) {
        try {
          await conn.sendMessage(m.chat, {
            audio: { url: r.audio.mp3_chapter },
            mimetype: 'audio/mp4',
            ptt: false
          }, { quoted: m });
        } catch (errAudio) {
          console.log("Gagal kirim audio Alkitab:", errAudio.message);
        }
      }
  
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply("❌ Gagal memuat ayat harian: " + e.message);
    }
  };
  
  handler.help = ['ayatharian', 'alkitabharian'];
  handler.tags = ['search'];
  handler.command = /^(ayatharian|alkitabharian)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
