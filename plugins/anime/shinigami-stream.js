// anime/shinigami-stream — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "shinigami-stream",
    "shinigamistream",
    "shinigamichapter"
  ],
  "category": "anime",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur shinigami-stream",
  "usage": ".shinigami-stream <chapter_id>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/komik/shinigami-stream", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/shinigami-stream.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`⚠️ Masukkan chapter_id komik!\n\nContoh: *${usedPrefix}${command} <chapter_id>*`);
      
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
      try {
          let apiKey = global.apikey?.vxapi || global.apiKey;
          let url = `${global.web}/api/komik/shinigami-stream?apikey=${apiKey}&chapter_id=${encodeURIComponent(text.trim())}`;
          
          let res = await fetch(url);
          let json = await res.json();
          
          if (json.status && json.result) {
              let data = json.result;
              const botName = (global.botname || 'BOT').toUpperCase();
              let txt = `📖 *${botName} - SHINIGAMI BACA CHAPTER*\n\n`;
  
              txt += `🎬 *Chapter:* ${data.title || text.trim()}\n`;
              txt += `📑 *Total Gambar Panel:* ${data.totalPages || data.pages?.length || 0}\n`;
  
              if (Array.isArray(data.pages) && data.pages.length > 0) {
                  txt += `\n🖼️ *Link Panel Halaman:*
  `;
                  data.pages.slice(0, 10).forEach((urlStr, idx) => {
                      txt += `• Hal ${idx + 1}: ${urlStr}\n`;
                  });
                  if (data.pages.length > 10) {
                      txt += `... dan ${data.pages.length - 10} halaman lainnya.\n`;
                  }
              }
  
              let firstPage = data.pages?.[0];
              if (firstPage && typeof firstPage === 'string' && firstPage.startsWith('http')) {
                  try {
                      await conn.sendMessage(m.chat, {
                          image: { url: firstPage },
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
          console.error('[Shinigami Stream Error]', e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
          m.reply('Terjadi kesalahan: ' + (e.message || 'Server error.'));
      }
  }
  
  handler.help = ['shinigami-stream <chapter_id>']
  handler.tags = ['komik']
  handler.command = /^(shinigami-stream|shinigamistream|shinigamichapter)$/i
  handler.premium = false
  handler.limit = 1;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
