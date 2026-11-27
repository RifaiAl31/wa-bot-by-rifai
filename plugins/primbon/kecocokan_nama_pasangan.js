// primbon/kecocokan_nama_pasangan — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "kecocokannama",
    "kecocokan_nama_pasangan",
    "jodohnama"
  ],
  "category": "primbon",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur kecocokannama",
  "usage": ".kecocokannama <nama1> | <nama2>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/primbon/kecocokan_nama_pasangan", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/kecocokan_nama_pasangan.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
      const cleanText = (text || '').trim();
      if (!cleanText) return m.reply(`⚠️ Masukkan nama Anda dan Pasangan!\n\nContoh: *${usedPrefix}${command} Romeo | Juliet*\nContoh: *${usedPrefix}${command} Budi, Ani*`);
  
      try {
          await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
          let apiKey = global.apikey?.vxapi || global.apiKey;
  
          let parts = cleanText.split(/[|,]/).map(v => v.trim()).filter(Boolean);
          if (parts.length < 2) {
              throw new Error(`Gunakan pemisah (|) atau (,)\nContoh: *${usedPrefix}${command} Romeo | Juliet*`);
          }
  
          let [nama1, nama2] = parts;
          let url = `${global.web}/api/primbon/kecocokan_nama_pasangan?apikey=${apiKey}&nama1=${encodeURIComponent(nama1)}&nama2=${encodeURIComponent(nama2)}`;
          
          let res = await fetch(url);
          let json = await res.json();
          
          if (json.status && (json.result || json.data)) {
              let resData = json.result || json.data;
  
              let card = `╭─「 🔮 *PRIMBON - KECOCOKAN NAMA PASANGAN* 」\n`;
              card += `├ 🤵 *Pasangan 1:* ${resData.nama_anda || nama1}\n`;
              card += `├ 👰 *Pasangan 2:* ${resData.nama_pasangan || nama2}\n`;
              if (resData.persentase || resData.skor) card += `├ 💖 *Persentase Kecocokan:* ${resData.persentase || resData.skor}%\n`;
              card += `╰────────────────────\n\n`;
  
              if (typeof resData === 'object' && resData !== null) {
                  if (resData.sisi_positif) card += `✨ *Sisi Positif Hubungan:*\n${resData.sisi_positif}\n\n`;
                  if (resData.sisi_negatif) card += `⚠️ *Sisi Negatif / Tantangan:*\n${resData.sisi_negatif}\n\n`;
                  if (resData.catatan || resData.deskripsi) card += `📝 *Ulasan:*\n${resData.catatan || resData.deskripsi}\n\n`;
              } else {
                  card += `${resData}\n\n`;
              }
  
              card += `_Kunci hubungan harmonis adalah komunikasi, komitmen, dan saling percaya._`;
  
              await m.reply(card.trim());
              await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
          } else {
              throw new Error(json.error || json.message || "Gagal memproses analisa kecocokan nama pasangan.");
          }
      } catch (e) {
          await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
          console.error(e);
          m.reply("❌ Error: " + e.message);
      }
  };
  
  handler.help = ['kecocokannama <nama1> | <nama2>'];
  handler.tags = ['primbon'];
  handler.command = /^(kecocokannama|kecocokan_nama_pasangan|cocoknama|jodohnama)$/i;
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
