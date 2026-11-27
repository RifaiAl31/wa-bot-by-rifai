// primbon/rejeki_hoki_weton — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "rejekihokiweton",
    "rejeki_hoki_weton",
    "rejekiweton",
    "hokiweton"
  ],
  "category": "primbon",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur rejekihokiweton",
  "usage": ".rejekiweton <tgl>|<bln>|<thn>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/primbon/rejeki_hoki_weton", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/rejeki_hoki_weton.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      const cleanText = (text || '').trim();
      if (!cleanText) return m.reply(`⚠️ Masukkan tanggal lahir Anda!\n\nContoh: *${usedPrefix}${command} 1|1|2000*\nContoh: *${usedPrefix}${command} 15 8 1998*`);
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
          let apiKey = global.apikey?.vxapi || global.apiKey;
  
          let parts = cleanText.split(/[|\s\/-]+/).filter(Boolean);
          if (parts.length < 3) {
              throw new Error(`Format tanggal tidak lengkap!\nGunakan format: *${usedPrefix}${command} <tgl>|<bln>|<thn>*\nContoh: *${usedPrefix}${command} 1|1|2000*`);
          }
  
          let [tgl, bln, thn] = parts;
          let url = `${global.web}/api/primbon/rejeki_hoki_weton?apikey=${apiKey}&tgl=${encodeURIComponent(tgl)}&bln=${encodeURIComponent(bln)}&thn=${encodeURIComponent(thn)}`;
          
          let res = await fetch(url);
          let json = await res.json();
          
          if (json.status && (json.result || json.data)) {
              let resData = json.result || json.data;
  
              let card = `╭─「 🔮 *PRIMBON - REJEKI & HOKI WETON* 」\n`;
              card += `├ 📅 *Hari Lahir & Weton:* ${resData.hari_lahir || `${tgl}-${bln}-${thn}`}\n`;
              card += `╰────────────────────\n\n`;
  
              if (typeof resData === 'object' && resData !== null) {
                  if (resData.rejeki) card += `💰 *Gambaran Rejeki:*\n${resData.rejeki}\n\n`;
                  if (resData.penjelasan || resData.catatan) card += `📌 *Penjelasan & Nasehat:*\n${resData.penjelasan || resData.catatan}\n\n`;
              } else {
                  card += `${resData}\n\n`;
              }
  
              card += `_Rejeki sudah diatur oleh Yang Maha Kuasa, iringi dengan doa & ikhtiar maksimal._`;
  
              await m.reply(card.trim());
              await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
          } else {
              throw new Error(json.error || json.message || "Gagal memproses ramalan rejeki hoki weton.");
          }
      } catch (e) {
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          console.error(e);
          m.reply("❌ Error: " + e.message);
      }
  };
  
  handler.help = ['rejekiweton <tgl>|<bln>|<thn>'];
  handler.tags = ['primbon'];
  handler.command = /^(rejekihokiweton|rejeki_hoki_weton|rejekiweton|hokiweton)$/i;
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
