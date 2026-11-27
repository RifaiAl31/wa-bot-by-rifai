// game/tier — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "tier",
    "herotier"
  ],
  "category": "game",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur tier",
  "usage": ""
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/mlbb/tier", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/tier.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
      try {
          let apiKey = global.apikey?.vxapi || global.apiKey;
          let url = `${global.web}/api/mlbb/tier?apikey=${apiKey}`;
          
          let res = await fetch(url);
          let json = await res.json();
          
          if (json.status && (json.result || json.data)) {
              let resData = json.result || json.data;
              const botName = (global.botname || 'BOT').toUpperCase();
              
              if (Array.isArray(resData)) {
                  let list = resData;
                  let filterText = (text || '').toLowerCase().trim();
                  if (filterText) {
                      list = list.filter(h => 
                          (h.hero_name && h.hero_name.toLowerCase().includes(filterText)) ||
                          (Array.isArray(h.roles) ? h.roles.some(r => r.toLowerCase().includes(filterText)) : String(h.roles || '').toLowerCase().includes(filterText)) ||
                          (Array.isArray(h.lanes) ? h.lanes.some(l => l.toLowerCase().includes(filterText)) : String(h.lanes || '').toLowerCase().includes(filterText))
                      );
                  }
  
                  if (list.length === 0) {
                      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                      return m.reply(`Hero atau role "${text}" tidak ditemukan dalam tier list.`);
                  }
  
                  let txt = `🏆 *${botName} - MLBB HERO TIERS (META TERKINI)*\n\n`;
                  if (filterText) txt += `🔍 Filter Pencarian: *${text}*\n\n`;
                  list.slice(0, 30).forEach((h, i) => {
                      let roles = Array.isArray(h.roles) ? h.roles.join(', ') : (h.roles || '-');
                      let lanes = Array.isArray(h.lanes) ? h.lanes.join(', ') : (h.lanes || '-');
                      txt += `${i + 1}. *${h.hero_name || '-'}*\n   • Role: ${roles} | Lane: ${lanes}\n`;
                  });
                  if (list.length > 30) {
                      txt += `\n_...dan ${list.length - 30} hero lainnya. Gunakan filter untuk hasil lebih spesifik._`;
                  }
                  await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });
              } else {
                  let txt = `🏆 *${botName} - MLBB HERO TIERS*\n\n`;
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
              m.reply('❌ Gagal memproses data tier MLBB: ' + (json.error || json.message || 'unknown error'));
          }
      } catch (e) {
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          console.error(e);
          m.reply('❌ Terjadi kesalahan pada server: ' + e.message);
      }
  }
  handler.help = ['tier [hero]']
  handler.tags = ['mlbb']
  handler.command = /^(tier|mltier|herotier)$/i
  handler.limit = 1;
  
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
