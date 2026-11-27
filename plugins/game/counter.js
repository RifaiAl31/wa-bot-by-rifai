// game/counter — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "counter",
    "mlcounter",
    "counterhero"
  ],
  "category": "game",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur counter",
  "usage": ".counter <hero>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/mlbb/counter", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/counter.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      if (!text) return m.reply(`📌 *Format Penggunaan:*\n${usedPrefix + command} <nama_hero>\n\n*Contoh:*\n${usedPrefix + command} fanny\n${usedPrefix + command} chou,ling`);
      
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
      try {
          let apiKey = global.apikey?.vxapi || global.apiKey;
          let url = `${global.web}/api/mlbb/counter?apikey=${apiKey}&enemies=${encodeURIComponent(text || '')}`;
          
          let res = await fetch(url);
          let json = await res.json();
          
          if (json.status && (json.result || json.data)) {
              let resData = json.result || json.data;
              const botName = (global.botname || 'BOT').toUpperCase();
              
              if (Array.isArray(resData)) {
                  let txt = `🛡️ *${botName} - MLBB COUNTER PICK*\n\n*Target Musuh:* ${text}\n\n*Rekomendasi Hero Counter:*\n\n`;
                  resData.slice(0, 10).forEach((h, i) => {
                      txt += `${i + 1}. *${h.hero_name || h.name || '-'}*\n`;
                      if (h.roles) txt += `   • Role: ${Array.isArray(h.roles) ? h.roles.join(', ') : h.roles}\n`;
                      if (h.counter_score || h.score) txt += `   • Efektivitas Counter: ${h.counter_score || h.score}%\n`;
                      if (h.reason || h.alasan) txt += `   • Alasan: ${h.reason || h.alasan}\n`;
                      txt += `\n`;
                  });
                  await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });
              } else {
                  let txt = `🛡️ *${botName} - MLBB COUNTER PICK*\n\n`;
                  for (let k in resData) {
                      if (typeof resData[k] !== 'function') {
                          let val = resData[k];
                          if (typeof val === 'object' && val !== null) {
                              val = Array.isArray(val) ? val.join(', ') : JSON.stringify(val);
                          }
                          txt += `• *${k}:* ${val}\n`;
                      }
                  }
                  await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });
              }
              await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
          } else {
              await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
              m.reply('❌ Gagal memproses data counter MLBB: ' + (json.error || json.message || 'unknown error'));
          }
      } catch (e) {
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          console.error(e);
          m.reply('❌ Terjadi kesalahan pada server: ' + e.message);
      }
  }
  handler.help = ['counter <hero>']
  handler.tags = ['mlbb']
  handler.command = /^(counter|mlcounter|counterhero)$/i
  handler.limit = 1;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
