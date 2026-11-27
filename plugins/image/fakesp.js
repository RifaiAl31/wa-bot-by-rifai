// canvas/fakesp — satu file: metadata + kode fitur (gabungan dari engine7/plugins/canvas/fakesp.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "fakesp",
  "command": [
    "fakesp",
    "spfake",
    "suratpanggilan",
    "fakesuratpanggil"
  ],
  "category": "image",
  "desc": "Bikin fake surat panggilan (buat konten/gaguan doang)",
  "usage": ".fakesp <nama> | <instansi>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/fakesp", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fakesp.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  
  const pluginConfig = {
      name: 'fakesp',
      alias: ['spfake', 'suratpanggilan', 'fakesuratpanggil'],
      category: 'canvas',
      description: 'Bikin fake surat panggilan (buat konten/gaguan doang)',
      usage: '.fakesp <nama> | <instansi>',
      example: '.fakesp WhatsApp Bot | OSIS',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  }
  
  const TEMPLATE_URL = 'https://i.imgur.com/sp-template.png'
  
  async function downloadImage(url) {
      const response = await axios.get(url, { responseType: 'arraybuffer' })
      return Buffer.from(response.data)
  }
  
  async function generateFakeSP(nama, instansi) {
      const templateBuffer = await downloadImage(TEMPLATE_URL)
      const template = await loadImage(templateBuffer)
      
      const canvas = createCanvas(template.width, template.height)
      const ctx = canvas.getContext('2d')
      
      ctx.drawImage(template, 0, 0)
      
      ctx.font = 'bold 18px "Times New Roman"'
      ctx.fillStyle = '#000000'
      ctx.textAlign = 'center'
      
      ctx.fillText(nama.toUpperCase(), canvas.width / 2, 250)
      ctx.fillText(instansi.toUpperCase(), canvas.width / 2, 320)
      
      const now = new Date()
      ctx.font = '14px "Times New Roman"'
      ctx.fillText(now.toLocaleDateString('id-ID'), canvas.width / 2, 400)
      ctx.fillText('Pukul: 08.00 WIB', canvas.width / 2, 440)
      ctx.fillText('Tempat: Ruang Rapat Utama', canvas.width / 2, 480)
      
      return canvas.toBuffer('image/png')
  }
  
  async function handler(m, { sock }) {
      const text = m.args.join(' ') || m.text?.trim() || ''
      if (!text) return m.reply(`*Cara pakai:*\n${m.prefix}fakesp <nama> | <instansi>\nContoh: .fakesp WhatsApp Bot | OSIS`)
      
      const parts = text.split('|').map(p => p.trim())
      const nama = parts[0] || 'Darling'
      const instansi = parts[1] || 'OSIS'
      
      m.react('💕')
      await m.reply(`⏳ *Processing...*`)
      
      try {
          const imageBuffer = await generateFakeSP(nama, instansi)
          await sock.sendMessage(m.chat, { image: imageBuffer, caption: `💕 *FAKE SURAT PANGGILAN* 💕\n\n✅ Nama: ${nama}\n📌 Instansi: ${instansi}\n\n💗 *WhatsApp Bot:* Kamu dipanggil nih darling~` }, { quoted: m })
          m.react('✅')
      } catch (err) {
          m.react('💔')
          m.reply(`Error: ${err.message}`)
      }
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
