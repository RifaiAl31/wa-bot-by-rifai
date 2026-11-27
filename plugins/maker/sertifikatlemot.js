// maker/sertifikatlemot — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/sertifikatlemot.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "sertifikatlemot",
  "command": [
    "sertifikatlemot"
  ],
  "category": "maker",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/sertifikatlemot", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sertifikatlemot.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const { createCanvas } = require("@napi-rs/canvas");
  
  const pluginConfig = {
    name: "sertifikatlemot",
    alias: [],
    category: "maker",
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
  
  async function handler(m, { text, sock }) {
      const conn = sock;
    const nama = text || m.pushName || 'Orang Lemot'
  
    const alasan = pick([
      'karena membalas chat 2 hari sekali',
      'karena loading mulu padahal sinyal 5G',
      'karena buka WA kayak nunggu sinetron tayang ulang',
      'karena suka bales "iya" 3 minggu kemudian',
      'karena kecepatan responnya ngalahin kura-kura pensiun'
    ])
  
    try {
      const canvas = createCanvas(800, 600)
      const ctx = canvas.getContext('2d')
  
      // Background
      ctx.fillStyle = '#f3f3f3'
      ctx.fillRect(0, 0, 800, 600)
  
      // Header
      ctx.fillStyle = '#000'
      ctx.font = 'bold 34px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('🐢 SERTIFIKAT KELEMBAMAN INTERNASIONAL 🐢', 400, 80)
  
      // Nama
      ctx.font = '28px Arial'
      ctx.fillText(`Dianugerahkan kepada: ${nama}`, 400, 170)
  
      // Alasan
      ctx.font = '22px Arial'
      ctx.fillText(`Sebagai pengakuan resmi`, 400, 230)
      ctx.fillText(`${alasan}`, 400, 270)
  
      // Footer
      ctx.font = '18px Arial'
      ctx.fillText('Dikeluarkan oleh: Komite Anti Slow Respon Dunia', 400, 450)
      ctx.fillText(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 400, 490)
  
      ctx.fillText('_______________________', 400, 540)
      ctx.fillText('TTD: Ketua Lemot Nasional', 400, 570)
  
      const buffer = canvas.toBuffer()
      await conn.sendFile(m.chat, buffer, 'sertif-lemot.jpg', `📜 Sertifikat resmi untuk *${nama}*`, m)
    } catch (e) {
      console.error(e)
      m.reply('❌ Gagal membuat sertifikat lemot.')
    }
  }
  
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
