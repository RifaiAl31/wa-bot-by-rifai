// anime/komikindo-stream — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "komikindo-stream",
    "komikindostream",
    "komikstream"
  ],
  "category": "anime",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur komikindo-stream",
  "usage": ".komikindo-stream <slug>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/komik/komikindo-stream", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/komikindo-stream.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`⚠️ Masukkan slug chapter komik!\n\nContoh: *${usedPrefix}${command} solo-leveling-chapter-01*`);
      
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
      try {
          let apiKey = global.apikey?.vxapi || global.apiKey;
          let url = `${global.web}/api/komik/komikindo-stream?apikey=${apiKey}&slug=${encodeURIComponent(text.trim())}`;
          
          let res = await fetch(url);
          let json = await res.json();
          
          if (json.status && json.result) {
              let data = json.result;
              const botName = (global.botname || 'BOT').toUpperCase();
              let txt = `📖 *${botName} - KOMIKINDO BACA CHAPTER*\n\n`;
  
              txt += `🎬 *Chapter:* ${data.title || text.trim()}\n`;
              if (data.comicTitle) txt += `📚 *Komik:* ${data.comicTitle}\n`;
              if (data.prev) txt += `⏮️ *Prev Chapter:* \`${data.prev}\`\n`;
              if (data.next) txt += `⏭️ *Next Chapter:* \`${data.next}\`\n`;
              txt += `📑 *Total Panel Halaman:* ${data.totalPages || data.images?.length || 0}\n`;
  
              if (Array.isArray(data.images) && data.images.length > 0) {
                  txt += `\n🖼️ *Daftar Panel Gambar:*
  `;
                  data.images.slice(0, 10).forEach((urlStr, idx) => {
                      txt += `• Hal ${idx + 1}: ${urlStr}\n`;
                  });
                  if (data.images.length > 10) {
                      txt += `... dan ${data.images.length - 10} halaman lainnya.\n`;
                  }
              }
  
              let firstImg = data.images?.[0];
              if (firstImg && typeof firstImg === 'string' && firstImg.startsWith('http')) {
                  try {
                      await conn.sendMessage(m.chat, {
                          image: { url: firstImg },
                          caption: txt.trim()
                      }, { quoted: m });
                  } catch (e) {
                      await m.reply(txt.trim());
                  }
              } else {
                  await m.reply(txt.trim());
              }
  
              await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
          } else {
              await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
              m.reply(json.error || 'Gagal memuat panel gambar streaming chapter.');
          }
      } catch (e) {
          console.error('[Komikindo Stream Error]', e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
          m.reply('Terjadi kesalahan: ' + (e.message || 'Server error.'));
      }
  }
  
  handler.help = ['komikindo-stream <slug>']
  handler.tags = ['komik']
  handler.command = /^(komikindo-stream|komikindostream|komikstream|bacakomik)$/i
  handler.premium = false
  handler.limit = 1;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
