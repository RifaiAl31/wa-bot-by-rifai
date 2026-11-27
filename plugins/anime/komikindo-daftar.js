// anime/komikindo-daftar — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "komikindo-daftar",
    "komikindodaftar",
    "daftarkomik"
  ],
  "category": "anime",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur komikindo-daftar",
  "usage": ".komikindo-daftar <halaman>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/komik/komikindo-daftar", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/komikindo-daftar.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
      try {
          let apiKey = global.apikey?.vxapi || global.apiKey;
          let page = text ? parseInt(text.trim()) || 1 : 1;
          let url = `${global.web}/api/komik/komikindo-daftar?apikey=${apiKey}&page=${page}`;
          
          let res = await fetch(url);
          let json = await res.json();
          
          if (json.status && json.result) {
              let resData = json.result;
              let list = Array.isArray(resData) ? resData : (resData.comics || []);
  
              if (!list || list.length === 0) {
                  await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
                  return m.reply(`Daftar komik halaman ${page} tidak ditemukan.`);
              }
  
              const botName = (global.botname || 'BOT').toUpperCase();
              let txt = `📚 *${botName} - DAFTAR KOMIK TERPOPULER*\n\n`;
              txt += `📄 Halaman: *${page}* | Total: *${list.length}* komik\n\n`;
  
              for (let i = 0; i < Math.min(list.length, 10); i++) {
                  let it = list[i];
                  if (!it || typeof it === 'function') continue;
                  txt += `*${i + 1}. ${it.title || 'Komik'}*\n`;
                  if (it.type) txt += `🏷️ *Tipe:* ${it.type}\n`;
                  if (it.chapter || it.latestChapter) txt += `📖 *Chapter:* ${it.chapter || it.latestChapter}\n`;
                  if (it.score || it.rating) txt += `⭐ *Rating:* ${it.score || it.rating}\n`;
                  if (it.slug) txt += `🔗 *Slug:* \`${it.slug}\`\n`;
                  txt += `\n`;
              }
  
              txt += `💡 *Tips:* Ketik *${usedPrefix}komikdetail <slug>* untuk melihat detail & chapter.`;
  
              let coverUrl = list[0]?.thumb || list[0]?.image || list[0]?.thumbnailUrl;
              if (coverUrl && typeof coverUrl === 'string' && coverUrl.startsWith('http')) {
                  try {
                      await conn.sendMessage(m.chat, {
                          image: { url: coverUrl },
                          caption: txt.trim()
                      }, { quoted: m });
                  } catch (errImg) {
                      await m.reply(txt.trim());
                  }
              } else {
                  await m.reply(txt.trim());
              }
  
              await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
          } else {
              await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
              m.reply(json.error || json.message || 'Gagal memuat daftar komik.');
          }
      } catch (e) {
          console.error('[Komikindo Daftar Error]', e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
          m.reply('Terjadi kesalahan: ' + (e.message || 'Server error.'));
      }
  }
  
  handler.help = ['komikindo-daftar <halaman>']
  handler.tags = ['komik']
  handler.command = /^(komikindo-daftar|komikindodaftar|daftarkomik)$/i
  handler.premium = false
  handler.limit = 1;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
