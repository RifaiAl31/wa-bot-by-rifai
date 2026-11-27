// anime/donghub-genre — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "donghub-genre",
    "donghubgenre",
    "donghuagenre"
  ],
  "category": "anime",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur donghub-genre",
  "usage": ".donghub-genre <genre>|<page>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/donghua/donghub-genre", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/donghub-genre.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`⚠️ Format salah!\n\nContoh: *${usedPrefix}${command} action* atau *${usedPrefix}${command} fantasy|2*`);
      
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
      try {
          let apiKey = global.apikey?.vxapi || global.apiKey;
          let [query, page] = (text || '').split('|');
          let pageParam = page ? `&page=${encodeURIComponent(page.trim())}` : '';
          let url = `${global.web}/api/donghua/donghub-genre?apikey=${apiKey}&query=${encodeURIComponent(query ? query.trim() : '')}${pageParam}`;
          
          let res = await fetch(url);
          let json = await res.json();
          
          if (json.status && json.result) {
              let resData = json.result;
              let list = resData.results || (Array.isArray(resData) ? resData : []);
              let pagination = resData.pagination || {};
  
              if (!list || list.length === 0) {
                  await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
                  return m.reply(`Donghua dengan genre *${query.trim()}* tidak ditemukan.`);
              }
  
              const botName = (global.botname || 'BOT').toUpperCase();
              let txt = `🐉 *${botName} - DONGHUA BY GENRE*\n\n`;
              txt += `🏷️ Genre: *${query.trim()}*`;
              if (pagination.currentPage) txt += ` (Hal ${pagination.currentPage}/${pagination.totalPages || 1})`;
              txt += `\n📊 Total Ditemukan: *${list.length}*\n\n`;
  
              for (let i = 0; i < Math.min(list.length, 10); i++) {
                  let it = list[i];
                  if (!it || typeof it === 'function') continue;
                  txt += `*${i + 1}. ${it.title || 'Donghua'}*\n`;
                  if (it.type) txt += `🏷️ *Tipe:* ${it.type}\n`;
                  if (it.status) txt += `📊 *Status:* ${it.status}\n`;
                  if (it.episode || it.subStatus) txt += `🎬 *Episode:* ${it.episode || '-'} (${it.subStatus || '-' })\n`;
                  if (it.slug) txt += `🔗 *Slug:* \`${it.slug}\`\n`;
                  txt += `\n`;
              }
  
              txt += `💡 *Tips:* Ketik *${usedPrefix}donghub-detail <slug>* untuk melihat detail donghua.`;
  
              let coverUrl = list[0]?.cover || list[0]?.image;
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
              m.reply(json.error || json.message || 'Gagal memproses donghua by genre.');
          }
      } catch (e) {
          console.error('[Donghub Genre Error]', e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
          m.reply('Terjadi kesalahan: ' + (e.message || 'Server error.'));
      }
  }
  
  handler.help = ['donghub-genre <genre>|<page>']
  handler.tags = ['donghua']
  handler.command = /^(donghub-genre|donghubgenre|donghuagenre)$/i
  handler.premium = false
  handler.limit = 1;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
