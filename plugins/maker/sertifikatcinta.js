// maker/sertifikatcinta — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/sertifikatcinta.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "sertifikatcinta",
  "command": [
    "sertifikatcinta"
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
module.exports = __vx.plugin("maker/sertifikatcinta", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sertifikatcinta.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  
  const pluginConfig = {
    name: "sertifikatcinta",
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
    const nama = text || m.pushName || 'Kamu'
    const alasan = pick([
      'karena terlalu tampan hingga memicu pemanasan global',
      'karena senyumnya bikin resah warga +62',
      'karena cinta palsunya berhasil menyakiti banyak hati',
      'karena telah membuat 7 dari 10 orang gagal move on',
      'karena berhasil ghosting dengan cara elegan'
    ])
  
    try {
      const width = 800, height = 600
      const canvas = createCanvas(width, height)
      const ctx = canvas.getContext('2d')
  
      // Background
      ctx.fillStyle = '#fff0f5'
      ctx.fillRect(0, 0, width, height)
  
      // Judul
      ctx.fillStyle = '#e91e63'
      ctx.font = 'bold 36px Sans'
      ctx.textAlign = 'center'
      ctx.fillText('💘 SERTIFIKAT CINTA PALSU 💘', width / 2, 100)
  
      // Nama
      ctx.fillStyle = '#000'
      ctx.font = '28px Sans'
      ctx.fillText(`Diberikan kepada: ${nama}`, width / 2, 200)
  
      // Alasan
      ctx.font = '22px Sans'
      ctx.fillText(`Sebagai penghargaan`, width / 2, 260)
      ctx.fillText(`karena ${alasan}`, width / 2, 300)
  
      // Footer
      ctx.font = '18px Sans'
      ctx.fillText(`Dikeluarkan oleh: Dinas Cinta Palsu Internasional`, width / 2, 450)
      ctx.fillText(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, width / 2, 490)
  
      // TTD
      ctx.fillText(`____________________`, width / 2, 550)
      ctx.fillText(`Direktur Patah Hati Nasional`, width / 2, 575)
  
      const buffer = canvas.toBuffer()
      await conn.sendFile(m.chat, buffer, 'sertifikat-cinta.jpg', `📜 Sertifikat untuk *${nama}* berhasil dibuat.`, m)
    } catch (e) {
      console.error(e)
      m.reply('❌ Gagal membuat sertifikat cinta palsu.')
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
