// canvas/fakeidcard — satu file: metadata + kode fitur (gabungan dari engine7/plugins/canvas/fakeidcard.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "fakeidcard",
  "command": [
    "fakeidcard",
    "idcardfake",
    "faketanda",
    "faketandapengenal"
  ],
  "category": "image",
  "desc": "Bikin fake ID Card (buat konten/gaguan doang)",
  "usage": ".fakeidcard <nama> | <jabatan>",
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
module.exports = __vx.plugin("canvas/fakeidcard", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/fakeidcard.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  
  const pluginConfig = {
      name: 'fakeidcard',
      alias: ['idcardfake', 'faketanda', 'faketanda pengenal'],
      category: 'canvas',
      description: 'Bikin fake ID Card (buat konten/gaguan doang)',
      usage: '.fakeidcard <nama> | <jabatan>',
      example: '.fakeidcard WhatsApp Bot | CEO',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  }
  
  const TEMPLATE_URL = 'https://i.imgur.com/idcard-template.png'
  
  async function downloadImage(url) {
      const response = await axios.get(url, { responseType: 'arraybuffer' })
      return Buffer.from(response.data)
  }
  
  async function generateFakeIDCard(nama, jabatan) {
      const templateBuffer = await downloadImage(TEMPLATE_URL)
      const template = await loadImage(templateBuffer)
      
      const canvas = createCanvas(template.width, template.height)
      const ctx = canvas.getContext('2d')
      
      ctx.drawImage(template, 0, 0)
      
      ctx.font = 'bold 14px "Arial"'
      ctx.fillStyle = '#000000'
      ctx.textAlign = 'center'
      
      ctx.fillText(nama.toUpperCase(), canvas.width / 2, 180)
      ctx.fillText(jabatan.toUpperCase(), canvas.width / 2, 220)
      
      const idNo = 'ID-' + Math.random().toString(36).substring(2, 10).toUpperCase()
      ctx.font = '10px "Arial"'
      ctx.fillText(idNo, canvas.width / 2, 270)
      
      return canvas.toBuffer('image/png')
  }
  
  async function handler(m, { sock }) {
      const text = m.args.join(' ') || m.text?.trim() || ''
      if (!text) return m.reply(`*Cara pakai:*\n${m.prefix}fakeidcard <nama> | <jabatan>\nContoh: .fakeidcard WhatsApp Bot | CEO`)
      
      const parts = text.split('|').map(p => p.trim())
      const nama = parts[0] || 'Darling'
      const jabatan = parts[1] || 'CEO'
      
      m.react('💕')
      await m.reply(`⏳ *Processing...*`)
      
      try {
          const imageBuffer = await generateFakeIDCard(nama, jabatan)
          await sock.sendMessage(m.chat, { image: imageBuffer, caption: `💕 *FAKE ID CARD* 💕\n\n✅ Nama: ${nama}\n📌 Jabatan: ${jabatan}\n\n💗 *WhatsApp Bot:* Ini ID card nya darling~` }, { quoted: m })
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
