// anime/otakudesu-search — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "otakudesu-search",
    "otakudesusearch",
    "otakusearch"
  ],
  "category": "anime",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur otakudesu-search",
  "usage": ".otakudesu-search <query>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/anime/otakudesu-search", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/otakudesu-search.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`⚠️ Masukkan judul anime yang dicari!\n\nContoh:\n*${usedPrefix + command} naruto*`);
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
      try {
          let apiKey = global.apikey?.vxapi || global.apiKey;
          let queryParam = text ? `&query=${encodeURIComponent(text.trim())}` : '';
          let url = `${global.web}/api/anime/otakudesu-search?apikey=${apiKey}${queryParam}`;
          
          let res = await fetch(url);
          let json = await res.json();
          
          if (json.status && json.result) {
              let resData = json.result;
              let items = resData.items || (Array.isArray(resData) ? resData : []);
              
              if (!items || items.length === 0) {
                  await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
                  return m.reply(`Anime dengan judul "*${text.trim()}*" tidak ditemukan.`);
              }
  
              const botName = (global.botname || 'BOT').toUpperCase();
              let txt = `🌸 *${botName} - OTAKUDESU SEARCH*\n\n`;
              txt += `🔍 Keyword: *${text.trim()}*\n`;
              txt += `📊 Ditemukan: *${items.length}* anime\n\n`;
  
              items.slice(0, 10).forEach((anime, idx) => {
                  let slugMatch = (anime.url || '').match(/\/(anime|episode|lengkap)\/([^\/]+)\/?$/);
                  let slug = slugMatch ? slugMatch[2] : (anime.slug || anime.url || '-');
                  let genres = Array.isArray(anime.genres) ? anime.genres.join(', ') : (anime.genres || '-');
  
                  txt += `*${idx + 1}. ${anime.title || anime.name || 'Anime'}*\n`;
                  if (anime.rating) txt += `⭐ *Rating:* ${anime.rating}\n`;
                  if (anime.status) txt += `📊 *Status:* ${anime.status}\n`;
                  if (genres && genres !== '-') txt += `🏷️ *Genre:* ${genres}\n`;
                  txt += `🔗 *Slug:* \`${slug}\`\n\n`;
              });
  
              txt += `💡 *Tips:* Ketik *${usedPrefix}otakudetail <slug>* untuk melihat detail sinopsis & episode.`;
  
              let posterUrl = items[0]?.poster || items[0]?.thumb || items[0]?.image;
              if (posterUrl && typeof posterUrl === 'string' && posterUrl.startsWith('http')) {
                  try {
                      await conn.sendMessage(m.chat, {
                          image: { url: posterUrl },
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
              m.reply(json.error || json.message || 'Gagal memproses pencarian anime.');
          }
      } catch (e) {
          console.error('[Otakudesu Search Error]', e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
          m.reply('Terjadi kesalahan: ' + (e.message || 'Server error.'));
      }
  }
  
  handler.help = ['otakudesu-search <query>']
  handler.tags = ['anime']
  handler.command = /^(otakudesu-search|otakudesusearch|otakusearch|animesearch)$/i
  handler.premium = false
  handler.limit = 1;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
