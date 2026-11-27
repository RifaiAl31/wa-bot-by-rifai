// internet/internet-jadwalpuasa — satu file: metadata + kode fitur (gabungan dari engine2/plugins/internet/internet-jadwalpuasa.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "jadwalpuasa"
  ],
  "category": "search",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur jadwalpuasa (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/internet").split('\\').join('/')
module.exports = __vx.plugin("internet/internet-jadwalpuasa", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/internet-jadwalpuasa.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /**
   *  jadwal puasa 
   * -----------------------------
   * Type   : Plugins ESM
   * creator : WhatsApp Bot
   Api : https://api.myquran.com
   */
  const axios = __vxDef(require("axios"));
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
  
    if (!text) {
      return conn.reply(
        m.chat,
        `Masukkan nama kota
  
  Contoh:
  ${usedPrefix + command} tasikmalaya`,
        m
      )
    }
  
    try {
      const { data: search } = await axios.get(
        `https://api.myquran.com/v3/sholat/kabkota/cari/${encodeURIComponent(text)}`,
        { timeout: 10000 }
      )
  
      if (!search.data.length) throw 'Kota tidak ditemukan'
  
      const kota = search.data[0]
  
      const { data: jadwalRes } = await axios.get(
        `https://api.myquran.com/v3/sholat/jadwal/${kota.id}/today?tz=Asia/Jakarta`,
        { timeout: 10000 }
      )
  
      const info = jadwalRes.data
      const j = Object.values(info.jadwal)[0]
  
      const caption = `🌙 *JADWAL PUASA RAMADHAN*
  
  📍 ${info.kabko}
  📅 ${j.tanggal}
  
  Imsak : ${j.imsak}
  Subuh : ${j.subuh}
  
  Maghrib (Buka Puasa) : ${j.maghrib}`
  
      conn.reply(m.chat, caption, m)
  
    } catch (err) {
      console.log(err.message)
      conn.reply(m.chat, 'Kota tidak ditemukan.', m)
    }
  }
  
  handler.help = ['jadwalpuasa <kota>']
  handler.tags = ['internet']
  handler.command = /^jadwalpuasa$/i
  handler.limit = false
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
