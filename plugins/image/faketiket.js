// canvas/faketiket — satu file: metadata + kode fitur (gabungan dari engine7/plugins/canvas/faketiket.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "faketiket",
  "command": [
    "faketiket",
    "tiketfake",
    "faketicket",
    "fakepesawat"
  ],
  "category": "image",
  "desc": "Bikin fake tiket pesawat (buat konten/gaguan doang)",
  "usage": ".faketiket <dari> | <tujuan> | <nama>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 8,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/canvas").split('\\').join('/')
module.exports = __vx.plugin("canvas/faketiket", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/faketiket.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { createCanvas, loadImage } = require("@napi-rs/canvas");
  const axios = __vxDef(require("axios"));
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  
  const pluginConfig = {
      name: 'faketiket',
      alias: ['tiketfake', 'faketicket', 'fakepesawat'],
      category: 'canvas',
      description: 'Bikin fake tiket pesawat (buat konten/gaguan doang)',
      usage: '.faketiket <dari> | <tujuan> | <nama>',
      example: '.faketiket Jakarta | Tokyo | WhatsApp Bot',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 8,
      energi: 1,
      isEnabled: true
  }
  
  const TEMPLATE_URL = 'https://i.imgur.com/tiket-template.png'
  
  async function generateFakeTiket(dari, tujuan, nama) {
      const templateBuffer = await axios.get(TEMPLATE_URL, { responseType: 'arraybuffer' })
      const template = await loadImage(Buffer.from(templateBuffer.data))
      
      const canvas = createCanvas(template.width, template.height)
      const ctx = canvas.getContext('2d')
      
      ctx.drawImage(template, 0, 0)
      
      ctx.font = 'bold 18px "Arial"'
      ctx.fillStyle = '#000000'
      ctx.textAlign = 'center'
      
      // Dari
      ctx.fillText(dari.toUpperCase(), canvas.width / 4, 150)
      
      // Tujuan
      ctx.fillText(tujuan.toUpperCase(), canvas.width * 3 / 4, 150)
      
      // Nama penumpang
      ctx.font = 'bold 14px "Arial"'
      ctx.fillText(nama.toUpperCase(), canvas.width / 2, 220)
      
      // Nomor penerbangan random
      const flightNo = 'ZT' + Math.floor(Math.random() * 900 + 100)
      ctx.fillText(flightNo, canvas.width / 2, 260)
      
      // Gate random
      const gate = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Math.floor(Math.random() * 30 + 1)
      ctx.fillText(gate, canvas.width / 2, 300)
      
      // Seat random
      const seat = String.fromCharCode(65 + Math.floor(Math.random() * 10)) + Math.floor(Math.random() * 30 + 1)
      ctx.fillText(seat, canvas.width / 2, 340)
      
      // Tanggal keberangkatan
      const now = new Date()
      now.setDate(now.getDate() + Math.floor(Math.random() * 30))
      ctx.fillText(now.toLocaleDateString('id-ID'), canvas.width / 2, 380)
      
      // Waktu keberangkatan
      const waktu = `${Math.floor(Math.random() * 23)}:${Math.floor(Math.random() * 60)}`
      ctx.fillText(waktu, canvas.width / 2, 420)
      
      return canvas.toBuffer('image/png')
  }
  
  async function handler(m, { sock }) {
      const text = m.args.join(' ') || m.text?.trim() || ''
      
      if (!text) {
          return m.reply(
              `💕 *ғᴀᴋᴇ ᴛɪᴋᴇᴛ ᴘᴇꜱᴀᴡᴀᴛ* 💕\n\n` +
              `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
              `┃ ✦ *Cara Pakai*\n` +
              `┃\n` +
              `┃   ${m.prefix}faketiket <dari> | <tujuan> | <nama>\n` +
              `┃\n` +
              `┃ ✦ *Contoh*\n` +
              `┃\n` +
              `┃   ${m.prefix}faketiket Jakarta | Tokyo | WhatsApp Bot\n` +
              `┃\n` +
              `┃ 💗 *WhatsApp Bot:* Mau kemana darling~?\n` +
              `╰━━━━━━━━━━━━━━━━━━━━━⬣`
          )
      }
      
      const parts = text.split('|').map(p => p.trim())
      const dari = parts[0] || 'Jakarta'
      const tujuan = parts[1] || 'Tokyo'
      const nama = parts[2] || 'Darling'
      
      m.react('💕')
      await m.reply(`⏳ *ᴘʀᴏᴄᴇꜱꜱɪɴɢ...*\n\n💗 *WhatsApp Bot:* Lagi bikin tiket pesawat darling~`)
      
      try {
          const imageBuffer = await generateFakeTiket(dari, tujuan, nama)
          
          await sock.sendMessage(m.chat, {
              image: imageBuffer,
              caption: `💕 *ғᴀᴋᴇ ᴛɪᴋᴇᴛ* 💕\n\n` +
                      `╭━━━━━━━━━━━━━━━━━━━━━⬣\n` +
                      `┃ ✅ *ʙᴇʀʜᴀꜱɪʟ*\n` +
                      `┃ ✈️ *ʀᴜᴛᴇ*: ${dari} → ${tujuan}\n` +
                      `┃ 👤 *ɴᴀᴍᴀ*: ${nama}\n` +
                      `┃\n` +
                      `┃ 💗 *WhatsApp Bot:* Ini tiketnya darling~ selamat jalan-jalan! 🗿\n` +
                      `╰━━━━━━━━━━━━━━━━━━━━━⬣`
          }, { quoted: m })
          
          m.react('✅')
          
      } catch (err) {
          console.error('[FakeTiket] Error:', err)
          m.react('💔')
          return m.reply(`💔 *ᴇʀʀᴏʀ*\n\n> ${err.message}`)
      }
  }
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
