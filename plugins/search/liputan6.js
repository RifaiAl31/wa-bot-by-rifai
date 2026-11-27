// search/liputan6 — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "liputan6",
    "liputan6news"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur liputan6",
  "usage": ".liputan6"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/news/liputan6", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/liputan6.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, usedPrefix, command }) => {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
    try {
      const apiKey = global.apikey?.vxapi;
      const res = await fetch(`${global.web}/api/news/liputan6?apikey=${apiKey}`);
      const json = await res.json();
  
      if (!json.status || !json.data || json.data.length === 0) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        return m.reply("❌ Tidak ada berita Liputan6 yang ditemukan saat ini.");
      }
  
      const newsList = json.data.slice(0, 7);
      let text = `📰 *BERITA TERBARU LIPUTAN6*\n\n`;
      
      newsList.forEach((item, i) => {
        text += `*${i + 1}. ${item.title || '-' }*\n`;
        if (item.category) text += `• 🏷️ *Kategori:* ${item.category}\n`;
        if (item.date || item.time) text += `• 📅 *Waktu:* ${item.date || item.time}\n`;
        if (item.link) text += `• 🔗 *Baca:* ${item.link}\n`;
        text += `\n`;
      });
  
      text += `✨ *WhatsApp Bot API News Gateway*`;
  
      const firstImage = newsList.find(n => n.image)?.image;
      if (firstImage) {
        await conn.sendMessage(m.chat, {
          image: { url: firstImage },
          caption: text.trim()
        }, { quoted: m }).catch(() => m.reply(text.trim()));
      } else {
        await m.reply(text.trim());
      }
  
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply("❌ Gagal memuat berita Liputan6: " + e.message);
    }
  };
  
  handler.help = ['liputan6', 'liputan6news'];
  handler.tags = ['news'];
  handler.command = /^(liputan6|liputan6news)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
