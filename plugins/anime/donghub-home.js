// anime/donghub-home — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "donghub-home",
    "donghubhome",
    "donghuahome"
  ],
  "category": "anime",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur donghub-home",
  "usage": ".donghub-home"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/donghua/donghub-home", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/donghub-home.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, usedPrefix, command }) => {
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
      try {
          let apiKey = global.apikey?.vxapi || global.apiKey;
          let url = `${global.web}/api/donghua/donghub-home?apikey=${apiKey}`;
          
          let res = await fetch(url);
          let json = await res.json();
          
          if (json.status && json.result) {
              let data = json.result;
              const botName = (global.botname || 'BOT').toUpperCase();
              let txt = `🐉 *${botName} - DONGHUB BERANDA*\n\n`;
  
              // Recommendations
              if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
                  txt += `🔥 *REKOMENDASI TERBAIK:*
  `;
                  data.recommendations.slice(0, 5).forEach((item, idx) => {
                      txt += `*${idx + 1}. ${item.title}* (⭐ ${item.rating || '-' })\n`;
                      txt += `  🎬 ${item.episode || '-'} | 🔗 Slug: \`${item.slug}\`\n`;
                  });
                  txt += `\n`;
              }
  
              // Popular Today
              if (Array.isArray(data.popularToday) && data.popularToday.length > 0) {
                  txt += `🌟 *POPULER HARI INI:*
  `;
                  data.popularToday.slice(0, 5).forEach((item, idx) => {
                      txt += `*${idx + 1}. ${item.title}*\n`;
                      txt += `  🎬 ${item.episode || '-'} | 🔗 Slug: \`${item.slug}\`\n`;
                  });
                  txt += `\n`;
              }
  
              // Latest Releases
              if (Array.isArray(data.latestRelease) && data.latestRelease.length > 0) {
                  txt += `🆕 *RILIS TERBARU:*
  `;
                  data.latestRelease.slice(0, 6).forEach((item, idx) => {
                      txt += `*${idx + 1}. ${item.title || item.seriesTitle}*\n`;
                      txt += `  🎬 ${item.episode || '-'} (${item.subStatus || '-'}) | 🔗 \`${item.slug}\`\n`;
                  });
                  txt += `\n`;
              }
  
              // Top All Time
              if (data.donghuaPopular?.allTime && Array.isArray(data.donghuaPopular.allTime)) {
                  txt += `🏆 *TOP POPULAR (ALL TIME):*
  `;
                  data.donghuaPopular.allTime.slice(0, 5).forEach((item, idx) => {
                      txt += `*${idx + 1}. ${item.title}* (⭐ ${item.rating || '-' })\n`;
                      txt += `  🔗 Slug: \`${item.slug}\`\n`;
                  });
                  txt += `\n`;
              }
  
              txt += `💡 *Tips:*\n- Gunakan *${usedPrefix}donghub-detail <slug>* untuk melihat detail donghua.\n- Gunakan *${usedPrefix}donghub-episode <slug>* untuk nonton/streaming.`;
  
              let cover = data.recommendations?.[0]?.cover || data.popularToday?.[0]?.cover;
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
              m.reply(json.error || 'Gagal memuat beranda Donghub.');
          }
      } catch (e) {
          console.error('[Donghub Home Error]', e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
          m.reply('Terjadi kesalahan: ' + (e.message || 'Server error.'));
      }
  }
  
  handler.help = ['donghub-home']
  handler.tags = ['donghua']
  handler.command = /^(donghub-home|donghubhome|donghuahome)$/i
  handler.premium = false
  handler.limit = 1;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
