// info/bmkggempa — satu file: metadata + kode fitur (gabungan dari engine7/plugins/info/bmkggempa.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "bmkggempa",
  "command": [
    "bmkggempa"
  ],
  "category": "info",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/info").split('\\').join('/')
module.exports = __vx.plugin("info/bmkggempa", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/bmkggempa.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  const { load } = require("cheerio");
  
  const pluginConfig = {
    name: "bmkggempa",
    alias: [],
    category: "info",
    description: "Imported from WhatsApp Bot V4.6",
    usage: "",
    example: "",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
      const conn = sock;
    try {
      const res = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.xml')
      const xml = await res.text()
  
      const $ = load(xml, { xmlMode: true })
      const gempa = $('Infogempa gempa').first()
  
      const tanggal = gempa.find('Tanggal').text()
      const jam = gempa.find('Jam').text()
      const lintang = gempa.find('Lintang').text()
      const bujur = gempa.find('Bujur').text()
      const magnitude = gempa.find('Magnitude').text()
      const kedalaman = gempa.find('Kedalaman').text()
      const wilayah = gempa.find('Wilayah').text()
      const potensi = gempa.find('Potensi').text()
      const shakemap = gempa.find('Shakemap').text()
  
      let teks = `🌐 *Info Gempa Terkini - BMKG*\n\n`
      teks += `📅 *Tanggal:* ${tanggal}\n`
      teks += `🕒 *Jam:* ${jam} WIB\n`
      teks += `📍 *Lokasi:* ${lintang} - ${bujur} (${wilayah})\n`
      teks += `📏 *Magnitudo:* ${magnitude}\n`
      teks += `📉 *Kedalaman:* ${kedalaman}\n`
      teks += `🌊 *Potensi:* ${potensi || '—'}`
  
      const urlShakemap = `https://data.bmkg.go.id/DataMKG/TEWS/${shakemap}`
      await conn.sendFile(m.chat, urlShakemap, 'gempa.jpg', teks, m)
    } catch (e) {
      console.error(e)
      await conn.reply(m.chat, '❌ Gagal mengambil data dari BMKG langsung.', m)
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
