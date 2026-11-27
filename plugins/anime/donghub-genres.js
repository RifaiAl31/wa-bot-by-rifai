// anime/donghub-genres — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "donghub-genres",
    "donghubgenres",
    "donghuagenres",
    "listgenredonghua"
  ],
  "category": "anime",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur donghub-genres",
  "usage": ".donghub-genres"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/donghua/donghub-genres", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/donghub-genres.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, usedPrefix, command }) => {
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
      try {
          let apiKey = global.apikey?.vxapi || global.apiKey;
          let url = `${global.web}/api/donghua/donghub-genres?apikey=${apiKey}`;
          
          let res = await fetch(url);
          let json = await res.json();
          
          if (json.status && json.result) {
              let list = json.result;
              const botName = (global.botname || 'BOT').toUpperCase();
              let txt = `🐉 *${botName} - DAFTAR GENRE DONGHUA*\n\n`;
              txt += `Berikut seluruh genre donghua yang tersedia:\n\n`;
  
              list.forEach((g, idx) => {
                  txt += `• *${g.name || g.slug}* (Slug: \`${g.slug}\`)\n`;
              });
  
              txt += `\n💡 *Tips:* Ketik *${usedPrefix}donghub-genre <slug>* untuk melihat donghua pada genre tersebut.`;
  
              await m.reply(txt.trim());
              await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
          } else {
              await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
              m.reply(json.error || 'Gagal memuat daftar genre donghua.');
          }
      } catch (e) {
          console.error('[Donghub Genres Error]', e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
          m.reply('Terjadi kesalahan: ' + (e.message || 'Server error.'));
      }
  }
  
  handler.help = ['donghub-genres']
  handler.tags = ['donghua']
  handler.command = /^(donghub-genres|donghubgenres|donghuagenres|listgenredonghua)$/i
  handler.premium = false
  handler.limit = 1;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
