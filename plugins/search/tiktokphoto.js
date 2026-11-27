// search/tiktokphoto — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "tiktokphoto",
    "ttphoto"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur tiktokphoto",
  "usage": ".tiktokphoto <query>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/search/tiktokphoto", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/tiktokphoto.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ *Masukkan kata kunci pencarian TikTok Photo/Slide!*\nContoh: ${usedPrefix + command} wallpaper anime`);
  
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
    try {
      const apiKey = global.apikey?.vxapi;
      const res = await fetch(`${global.web}/api/search/tiktokphoto?apikey=${apiKey}&query=${encodeURIComponent(text)}`);
      const json = await res.json();
  
      if (!json.status || !json.result || json.result.length === 0) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        return m.reply(`❌ Foto/Slide TikTok tidak ditemukan untuk: "${text}"`);
      }
  
      const photo = json.result[0];
      const images = photo.images || [];
  
      if (!images.length) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        return m.reply("❌ Tidak ada gambar dalam slide TikTok ini.");
      }
  
      let caption = `🖼️ *TIKTOK PHOTO / SLIDE SEARCH*\n\n`;
      caption += `📌 *Judul:* ${photo.title || text}\n`;
      caption += `👤 *Author:* ${photo.author?.nickname || photo.author?.username || '-'}\n`;
      caption += `📸 *Total Gambar:* ${photo.image_count || images.length}\n`;
      if (photo.stats) {
        caption += `📊 *Stats:* ❤️ ${photo.stats.likes || 0} | 💬 ${photo.stats.comments || 0}\n`;
      }
      caption += `\n✨ *WhatsApp Bot API TikTok Slide Engine*`;
  
      for (let i = 0; i < Math.min(images.length, 5); i++) {
        const imgUrl = images[i];
        const imgCaption = i === 0 ? caption : `📸 Slide ${i + 1}/${images.length}`;
        await conn.sendMessage(m.chat, {
          image: { url: imgUrl },
          caption: imgCaption.trim()
        }, { quoted: m }).catch(() => {});
        if (i < Math.min(images.length, 5) - 1) {
          await new Promise(r => setTimeout(r, 600));
        }
      }
  
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply("❌ Gagal mencari photo TikTok: " + e.message);
    }
  };
  
  handler.help = ['tiktokphoto <query>', 'ttphoto <query>'];
  handler.tags = ['search'];
  handler.command = /^(tiktokphoto|ttphoto)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
