// tools/jam — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/jam.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "timeis",
  "command": [
    "timeis",
    "waktujakarta"
  ],
  "category": "tools",
  "desc": "Cek waktu Jakarta dari time.is",
  "usage": ".timeis",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/jam", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/jam.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxNs = (m) => (m && m.__esModule ? m : (m !== null && (typeof m === 'object' || typeof m === 'function') ? Object.assign(Object.create(null), m, { default: m }) : { default: m }));
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  const cheerio = __vxNs(require("cheerio"));
  
  const pluginConfig = {
    name: 'timeis',
    alias: ['waktujakarta'],
    category: 'tools',
    description: 'Cek waktu Jakarta dari time.is',
    usage: '.timeis',
    example: '.timeis',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m) {
    await m.react('⏳');
    try {
      const { data } = await axios.get('https://time.is/id/Jakarta', {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 15000,
      });
      const $ = cheerio.load(data);
      const lokasi = $('#msgdiv b').text().trim() || 'Jakarta';
      const tanggal = $('#dd').text().trim() || 'Tidak ditemukan';
      const jam = $('#clock0_bg').text().trim() || new Date().toLocaleTimeString('id-ID', {
        hour12: false,
        timeZone: 'Asia/Jakarta',
      });
  
      await m.reply(`*Waktu di Jakarta Sekarang*\n\n*Lokasi:* ${lokasi}\n*Tanggal:* ${tanggal}\n*Jam:* ${jam}`);
      await m.react('✅');
    } catch (error) {
      console.error('[JAM]', error?.message || error);
      await m.react('❌');
      await m.reply('❌ Gagal mengambil data waktu dari time.is.');
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
