// canvas/fakekarcis — satu file: metadata + kode fitur (gabungan dari engine7/plugins/canvas/fakekarcis.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "fakekarcis",
  "command": [
    "fakekarcis",
    "karcisfake",
    "tiketbioskop",
    "faketiketfilm"
  ],
  "category": "image",
  "desc": "Bikin fake karcis bioskop (buat konten/gaguan doang)",
  "usage": ".fakekarcis <nama> | <film> | <jam>",
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
module.exports = __vx.plugin("canvas/fakekarcis", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fakekarcis.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  
  const pluginConfig = {
      name: 'fakekarcis',
      alias: ['karcisfake', 'tiketbioskop', 'faketiketfilm'],
      category: 'canvas',
      description: 'Bikin fake karcis bioskop (buat konten/gaguan doang)',
      usage: '.fakekarcis <nama> | <film> | <jam>',
      example: '.fakekarcis WhatsApp Bot | DITF The Movie | 21:00',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  }
  
  const TEMPLATE_URL = 'https://i.imgur.com/karcis-template.png'
  
  async function downloadImage(url) {
      const response = await axios.get(url, { responseType: 'arraybuffer' })
      return Buffer.from(response.data)
  }
  
  async function generateFakeKarcis(nama, film, jam) {
      const templateBuffer = await downloadImage(TEMPLATE_URL)
      const template = await loadImage(templateBuffer)
      
      const canvas = createCanvas(template.width, template.height)
      const ctx = canvas.getContext('2d')
      
      ctx.drawImage(template, 0, 0)
      
      ctx.font = 'bold 14px "Arial"'
      ctx.fillStyle = '#000000'
      ctx.textAlign = 'center'
      
      ctx.fillText(nama.toUpperCase(), canvas.width / 2, 150)
      ctx.fillText(film.toUpperCase(), canvas.width / 2, 200)
      ctx.fillText(jam, canvas.width / 2, 250)
      
      const now = new Date()
      ctx.font = '12px "Arial"'
      ctx.fillText(now.toLocaleDateString('id-ID'), canvas.width / 2, 300)
      
      const seat = String.fromCharCode(65 + Math.floor(Math.random() * 10)) + Math.floor(Math.random() * 20 + 1)
      ctx.fillText(`Seat: ${seat}`, canvas.width / 2, 350)
      
      return canvas.toBuffer('image/png')
  }
  
  async function handler(m, { sock }) {
      const text = m.args.join(' ') || m.text?.trim() || ''
      if (!text) return m.reply(`*Cara pakai:*\n${m.prefix}fakekarcis <nama> | <film> | <jam>\nContoh: .fakekarcis WhatsApp Bot | DITF | 21:00`)
      
      const parts = text.split('|').map(p => p.trim())
      const nama = parts[0] || 'Darling'
      const film = parts[1] || 'DARLING in the FRANXX'
      const jam = parts[2] || '21:00'
      
      m.react('💕')
      await m.reply(`⏳ *Processing...*`)
      
      try {
          const imageBuffer = await generateFakeKarcis(nama, film, jam)
          await sock.sendMessage(m.chat, { image: imageBuffer, caption: `💕 *FAKE KARCIS BIOSKOP* 💕\n\n✅ Nama: ${nama}\n🎬 Film: ${film}\n⏰ Jam: ${jam}\n\n💗 *WhatsApp Bot:* Selamat menonton darling~` }, { quoted: m })
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
