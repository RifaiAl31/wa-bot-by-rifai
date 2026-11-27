// search/bmkg — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "bmkg",
    "cuacabmkg"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur bmkg",
  "usage": ""
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/search/bmkg", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/bmkg.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
    try {
      const apiKey = global.apikey?.vxapi;
      const res = await fetch(`${global.web}/api/search/bmkg?apikey=${apiKey}&kota=${encodeURIComponent(text || '')}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kota: text || '' })
      });
      const json = await res.json();
  
      if (!json.status || !json.data || json.data.length === 0) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        return m.reply(`❌ Data cuaca BMKG tidak ditemukan${text ? ' untuk wilayah: ' + text : ''}.`);
      }
  
      const list = json.data.slice(0, 10);
      let resText = `🌤️ *INFORMASI CUACA BMKG HARI INI*\n`;
      if (text) resText += `🔍 *Filter Wilayah:* ${text}\n`;
      resText += `📊 *Total Data:* ${json.total || json.data.length} Wilayah\n\n`;
  
      list.forEach(item => {
        resText += `*📍 ${item.kota || '-'}*\n`;
        resText += `• ☁️ *Cuaca:* ${item.cuaca || '-'}\n`;
        resText += `• 🌡️ *Suhu:* ${item.suhu !== null && item.suhu !== undefined ? item.suhu + '°C' : '-'}\n`;
        resText += `• 🕒 *Waktu:* ${item.waktu || '-'} (${item.zonaWaktu || 'WIB'})\n`;
        if (item.kualitasUdara) resText += `• 🍃 *Kualitas Udara:* ${item.kualitasUdara}\n`;
        resText += `\n`;
      });
  
      resText += `✨ *Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)*`;
  
      await conn.sendMessage(m.chat, {
        image: { url: 'https://www.bmkg.go.id/asset/img/logo/logo-bmkg.png' },
        caption: resText.trim()
      }, { quoted: m }).catch(() => m.reply(resText.trim()));
  
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply("❌ Gagal memuat data BMKG: " + e.message);
    }
  };
  
  handler.help = ['bmkg [kota]', 'cuacabmkg [kota]'];
  handler.tags = ['search'];
  handler.command = /^(bmkg|cuacabmkg)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
