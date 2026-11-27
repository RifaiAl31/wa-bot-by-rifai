// search/searchjob — fitur tambahan (plugins.zip), disesuaikan untuk WhatsApp Bot
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "searchjob",
    "loker",
    "lowongankerja"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur searchjob",
  "usage": ".searchjob <posisi>"
}
const __vdir = __dirname.split('\\').join('/')
module.exports = __vx.plugin("vxnew/search/searchjob", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + "/searchjob.js"
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxImp = async (m) => { const r = require(m); return r && r.__esModule ? r : Object.assign({ default: r }, r) };
  const __vxExports = {};
  const fetch = __vxDef(require("../../lib/newlib/fetch.js"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ *Masukkan kata kunci posisi lowongan kerja!*\nContoh: ${usedPrefix + command} Frontend Developer`);
  
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
    try {
      const apiKey = global.apikey?.vxapi;
      const res = await fetch(`${global.web}/api/search/searchjob?apikey=${apiKey}&action=search&query=${encodeURIComponent(text)}`);
      const json = await res.json();
  
      if (!json.status || !json.result || json.result.length === 0) {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        return m.reply(`❌ Lowongan kerja tidak ditemukan untuk: "${text}"`);
      }
  
      const jobs = json.result.slice(0, 5);
      let output = `💼 *LOWONGAN PEKERJAAN (KALIBRR)*\n🔍 *Posisi:* ${text}\n\n`;
  
      jobs.forEach((job, i) => {
        output += `*${i + 1}. ${job.title || '-' }*\n`;
        output += `• 🏢 *Perusahaan:* ${job.company || '-'}\n`;
        if (job.location) output += `• 📍 *Lokasi:* ${job.location}\n`;
        if (job.workModel) output += `• 💼 *Tipe:* ${job.workModel}\n`;
        if (job.salaryMin && job.salaryMax) {
          output += `• 💰 *Gaji:* ${job.salaryCurrency || 'IDR'} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}/${job.salaryInterval || 'bulan'}\n`;
        }
        if (job.url) output += `• 🔗 *Lamar:* ${job.url}\n`;
        output += `\n`;
      });
  
      output += `✨ *Kalibrr Career Gateway*`;
  
      const firstLogo = jobs.find(j => j.companyLogo)?.companyLogo;
      if (firstLogo) {
        await conn.sendMessage(m.chat, {
          image: { url: firstLogo },
          caption: output.trim()
        }, { quoted: m }).catch(() => m.reply(output.trim()));
      } else {
        await m.reply(output.trim());
      }
  
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {
      console.error(e);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      m.reply("❌ Gagal mencari lowongan kerja: " + e.message);
    }
  };
  
  handler.help = ['searchjob <posisi>', 'loker <posisi>'];
  handler.tags = ['search'];
  handler.command = /^(searchjob|loker|lowongankerja)$/i;
  
  handler.limit = 1;
  
  
  const __vxDefault = handler

  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  for (const k of ['before', 'all']) { if (typeof __vxExports[k] === 'function' && typeof __vxDefault === 'function' && !__vxDefault[k]) __vxDefault[k] = __vxExports[k] }
  return __vxExports
})
