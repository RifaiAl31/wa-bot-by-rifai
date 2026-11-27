// anime/komikindo-detail — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "komikindo-detail",
    "komikindodetail",
    "komikdetail"
  ],
  "category": "anime",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur komikindo-detail",
  "usage": ".komikindo-detail <slug>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/komik/komikindo-detail", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/komikindo-detail.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`⚠️ Masukkan slug komik!\n\nContoh: *${usedPrefix}${command} solo-leveling* atau *${usedPrefix}${command} martial-peak*`);
      
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
      try {
          let apiKey = global.apikey?.vxapi || global.apiKey;
          let url = `${global.web}/api/komik/komikindo-detail?apikey=${apiKey}&slug=${encodeURIComponent(text.trim())}`;
          
          let res = await fetch(url);
          let json = await res.json();
          
          if (json.status && json.result) {
              let data = json.result;
              const botName = (global.botname || 'BOT').toUpperCase();
              let txt = `📚 *${botName} - KOMIKINDO DETAIL*\n\n`;
  
              txt += `🎬 *Judul:* ${data.title || '-'}\n`;
              if (data.altTitle || data.alternativeTitle) txt += `📌 *Judul Alternatif:* ${data.altTitle || data.alternativeTitle}\n`;
              if (data.status) txt += `📊 *Status:* ${data.status}\n`;
              if (data.author) txt += `✍️ *Penulis:* ${data.author}\n`;
              if (data.illustrator) txt += `🎨 *Ilustrator:* ${data.illustrator}\n`;
              if (data.graphic) txt += `🖌️ *Grafis:* ${data.graphic}\n`;
              if (data.theme) txt += `🎭 *Tema:* ${data.theme}\n`;
              if (data.score || data.rating) txt += `⭐ *Rating:* ${data.score || data.rating}\n`;
  
              // Genres
              if (Array.isArray(data.genres) && data.genres.length > 0) {
                  txt += `🏷️ *Genre:* ${data.genres.map(g => g.name || g).join(', ')}\n`;
              }
  
              // Synopsis
              if (data.synopsis || data.description) {
                  txt += `\n📖 *SINOPSIS:*\n${data.synopsis || data.description}\n`;
              }
  
              // Chapters
              if (Array.isArray(data.chapters) && data.chapters.length > 0) {
                  txt += `\n📺 *DAFTAR CHAPTER (${data.chapters.length}):*\n`;
                  data.chapters.slice(0, 15).forEach((ch) => {
                      txt += `• *${ch.title || 'Chapter'}*\n  Slug: \`${ch.slug || '-'}\`${ch.date ? ` | ${ch.date}` : ''}\n`;
                  });
                  if (data.chapters.length > 15) {
                      txt += `... dan ${data.chapters.length - 15} chapter lainnya.\n`;
                  }
                  txt += `\n💡 *Tip:* Ketik *${usedPrefix}komikstream <slug-chapter>* untuk membaca komik.\n`;
              }
  
              let cover = data.thumb || data.image || data.cover;
              if (cover && typeof cover === 'string' && cover.startsWith('http')) {
                  try {
                      await conn.sendMessage(m.chat, {
                          image: { url: cover },
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
              m.reply(json.error || 'Detail komik tidak ditemukan. Cek kembali slug target.');
          }
      } catch (e) {
          console.error('[Komikindo Detail Error]', e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
          m.reply('Terjadi kesalahan: ' + (e.message || 'Server error.'));
      }
  }
  
  handler.help = ['komikindo-detail <slug>']
  handler.tags = ['komik']
  handler.command = /^(komikindo-detail|komikindodetail|komikdetail)$/i
  handler.premium = false
  handler.limit = 1;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
