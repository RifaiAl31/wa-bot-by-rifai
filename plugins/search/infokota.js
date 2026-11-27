// search/infokota — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "infokota",
    "daerah",
    "infodaerah"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur infokota",
  "usage": ".infokota <nama_kota>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/search/infokota", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/infokota.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ *Masukkan nama kota/daerah/provinsi!*\nContoh: ${usedPrefix + command} Bandung`);
  
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
    try {
      const apiKey = global.apikey?.vxapi;
      const res = await fetch(`${global.web}/api/search/infokota?apikey=${apiKey}&kota=${encodeURIComponent(text)}`);
      const json = await res.json();
  
      if (!json.status || !json.result) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        return m.reply(`❌ Informasi tidak ditemukan untuk kota/daerah: "${text}"`);
      }
  
      const r = json.result;
      let output = `🏛️ *INFORMASI WILAYAH & DAERAH*\n\n`;
      output += `📌 *Nama:* ${r.nama || text}\n`;
      if (r.provinsi) output += `• 🗺️ *Provinsi:* ${r.provinsi}\n`;
      if (r.negara) output += `• 🇮🇩 *Negara:* ${r.negara}\n`;
      if (r.wali_kota) output += `• 👤 *Wali Kota:* ${r.wali_kota}\n`;
      if (r.bupati) output += `• 👤 *Bupati:* ${r.bupati}\n`;
      if (r.gubernur) output += `• 👤 *Gubernur:* ${r.gubernur}\n`;
      if (r.luas) output += `• 📐 *Luas Wilayah:* ${r.luas}\n`;
      if (r.populasi) output += `• 👥 *Jumlah Penduduk:* ${r.populasi}\n`;
      if (r.kepadatan) output += `• 🏢 *Kepadatan:* ${r.kepadatan}\n`;
      if (r.semboyan) output += `• 📜 *Semboyan:* ${r.semboyan}\n`;
      if (r.julukan) output += `• 🏷️ *Julukan:* ${r.julukan}\n`;
      if (r.jumlah_kecamatan) output += `• 🏘️ *Kecamatan:* ${r.jumlah_kecamatan}\n`;
      if (r.zona_waktu) output += `• ⏰ *Zona Waktu:* ${r.zona_waktu}\n`;
      if (r.kode_pos) output += `• 📮 *Kode Pos:* ${r.kode_pos}\n`;
      
      if (r.deskripsi) {
        output += `\n📖 *Deskripsi:*\n${r.deskripsi}\n`;
      }
      if (r.url) {
        output += `\n🔗 *Sumber:* ${r.url}\n`;
      }
  
      output += `\n✨ *WhatsApp Bot API Info Daerah Indonesia*`;
  
      await m.reply(output.trim());
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply("❌ Gagal memuat info kota: " + e.message);
    }
  };
  
  handler.help = ['infokota <nama_kota>', 'daerah <nama_kota>'];
  handler.tags = ['search'];
  handler.command = /^(infokota|daerah|infodaerah)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
