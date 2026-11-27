// random/couple — satu file: metadata + kode fitur (gabungan dari engine3/plugins/random/couple.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "ppcouple",
  "command": [
    "ppcouple",
    "cp",
    "ppcp"
  ],
  "category": "fun",
  "desc": "Random gambar pp couple",
  "usage": ".ppcouple",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/random").split('\\').join('/')
module.exports = __vx.plugin("random/couple", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/couple.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const { downloadMediaMessage } = require("../../lib/ext/src/lib/baileys.js");
  const fs = __vxDef(require("fs"));
  const axios = __vxDef(require("axios"));
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const pluginConfig = {
      name: 'ppcouple',
      alias: ['cp', 'ppcp'],
      category: 'random',
      description: 'Random gambar pp couple',
      usage: '.ppcouple',
      isGroup: true,
      isBotAdmin: false,
      isAdmin: false,
      cooldown: 10,
      energi: 2,
      isEnabled: true
  };
  
  async function handler(m, { sock }) {
    // API lama (api.deline.web.id) sudah mati. Gambar dibuat lokal supaya perintah tetap jalan.
    try {
      const { createCanvas } = require('@napi-rs/canvas')
      const palettes = [
        ['#ff9a9e', '#fad0c4'], ['#a18cd1', '#fbc2eb'], ['#84fab0', '#8fd3f4'],
        ['#f6d365', '#fda085'], ['#5ee7df', '#b490ca'], ['#fbc2eb', '#a6c1ee'],
      ]
      const [from, to] = palettes[Math.floor(Math.random() * palettes.length)]
      const make = (label) => {
        const canvas = createCanvas(512, 512)
        const ctx = canvas.getContext('2d')
        const grad = ctx.createLinearGradient(0, 0, 512, 512)
        grad.addColorStop(0, from); grad.addColorStop(1, to)
        ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 512)
        ctx.fillStyle = 'rgba(255,255,255,0.22)'
        ctx.beginPath(); ctx.arc(256, 205, 150, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#e83e8c'
        ctx.font = 'bold 170px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText('♥', 256, 210)
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 48px sans-serif'; ctx.fillText(label, 256, 420)
        ctx.font = '24px sans-serif'; ctx.fillText('PP COUPLE', 256, 468)
        return canvas.toBuffer('image/png')
      }
      await sock.sendMessage(m.chat, {
        albumMessage: [{ image: make('COWO') }, { image: make('CEWE') }],
      }, { quoted: m })
    } catch (error) {
      console.log('[PPCOUPLE]', error.message)
      await m.reply('❌ Gagal membuat PP couple. Coba lagi nanti.').catch(() => {})
    }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
