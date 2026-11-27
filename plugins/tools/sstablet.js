// tools/sstablet — satu file: metadata + kode fitur (gabungan dari engine7/plugins/tools/sstablet.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "sstablet",
  "command": [
    "sstablet",
    "sstab",
    "sweb"
  ],
  "category": "tools",
  "desc": "Mengambil screenshot website tampilan tablet",
  "usage": ".sstablet <url>",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/sstablet", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/sstablet.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  const pluginConfig = {
      name: 'sstablet',
      alias: ['sstablet', 'sstab', 'sweb'],
      category: 'tools',
      description: 'Mengambil screenshot website tampilan tablet',
      usage: '.sstablet <url>',
      example: '.sstablet https://google.com',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  }
  
  const NEXADEV_APIKEY = 'bebas_isi_apikey_kamu'
  
  async function handler(m, { sock }) {
      let text = m.text?.trim()
      const prefix = m.prefix || '.'
      const command = m.command || 'sstablet'
  
      if (!text) {
          return m.reply(
              `⚠️ *FORMAT SALAH*\n\n` +
              `> Masukkan URL website yang ingin di-screenshot!\n` +
              `> Contoh: \`${prefix}${command} https://google.com\``
          )
      }
  
      if (!text.startsWith('http://') && !text.startsWith('https://')) {
          text = 'https://' + text
      }
  
      if (m.react) await m.react('🕐')
  
      try {
          const apiUrl = `https://api.nexadev.my.id/api/ss`
          
          // Panggil API NexaDev untuk ambil data/link screenshot
          const { data } = await axios.get(apiUrl, {
              params: {
                  url: text,
                  device: 'tablet',
                  apikey: NEXADEV_APIKEY
              },
              timeout: 20000
          })
  
          // Ambil link/URL gambar dari respon JSON API
          let imgUrl = data.result || data.url || data.image || data.data || data
  
          if (typeof imgUrl === 'object') {
              imgUrl = imgUrl.url || imgUrl.result || imgUrl.image
          }
  
          if (!imgUrl || typeof imgUrl !== 'string' || !imgUrl.startsWith('http')) {
              throw new Error(data?.message || 'Gagal mendapatkan link gambar dari API.')
          }
  
          // Unduh gambar dari URL tersebut menjadi Buffer yang valid
          const imageResponse = await axios.get(imgUrl, {
              responseType: 'arraybuffer',
              timeout: 15000
          })
  
          const imageBuffer = Buffer.from(imageResponse.data)
  
          await sock.sendMessage(m.chat, {
              image: imageBuffer,
              caption: `🌐 *SCREENSHOT TABLET*\n\n🔗 *URL:* ${text}`
          }, { quoted: m })
  
          if (m.react) await m.react('✅')
  
      } catch (err) {
          console.error('[SS Tablet Error]', err)
          if (m.react) await m.react('❌')
          m.reply(`❌ Gagal mengambil screenshot website.\n\n*Pesan Error:* ${err.message}`)
      }
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
