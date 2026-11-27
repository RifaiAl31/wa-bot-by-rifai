// anime/donghub-schedule — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "donghub-schedule",
    "donghubschedule",
    "donghuaschedule",
    "jadwaldonghua"
  ],
  "category": "anime",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur donghub-schedule",
  "usage": ".donghub-schedule"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/donghua/donghub-schedule", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/donghub-schedule.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, usedPrefix, command }) => {
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
      try {
          let apiKey = global.apikey?.vxapi || global.apiKey;
          let url = `${global.web}/api/donghua/donghub-schedule?apikey=${apiKey}`;
          
          let res = await fetch(url);
          let json = await res.json();
          
          if (json.status && json.result) {
              let schedule = json.result;
              const botName = (global.botname || 'BOT').toUpperCase();
              let txt = `📅 *${botName} - JADWAL RILIS DONGHUA*\n\n`;
  
              for (let day in schedule) {
                  if (Array.isArray(schedule[day]) && schedule[day].length > 0) {
                      txt += `🗓️ *[ ${day.toUpperCase()} ]*\n`;
                      schedule[day].slice(0, 6).forEach((item) => {
                          txt += `• *${item.title}*\n  ⏰ ${item.releaseTime || '-'} | ${item.episode || '-'} | Slug: \`${item.slug}\`\n`;
                      });
                      txt += `\n`;
                  }
              }
  
              txt += `💡 *Tips:* Ketik *${usedPrefix}donghub-detail <slug>* untuk melihat detail donghua.`;
  
              await m.reply(txt.trim());
              await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
          } else {
              await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
              m.reply(json.error || 'Gagal memuat jadwal rilis donghua.');
          }
      } catch (e) {
          console.error('[Donghub Schedule Error]', e);
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } }).catch(() => {});
          m.reply('Terjadi kesalahan: ' + (e.message || 'Server error.'));
      }
  }
  
  handler.help = ['donghub-schedule']
  handler.tags = ['donghua']
  handler.command = /^(donghub-schedule|donghubschedule|donghuaschedule|jadwaldonghua)$/i
  handler.premium = false
  handler.limit = 1;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
