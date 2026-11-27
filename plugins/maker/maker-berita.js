// maker/maker-berita — satu file: metadata + kode fitur (gabungan dari engine2/plugins/maker/maker-berita.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "berita",
    "beritamaker"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur berita (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/maker-berita", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/maker-berita.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const axios = __vxDef(require("axios"));
  
  async function uploadUguu(buffer) {
    const form = new FormData()
    form.append('files[]', new Blob([buffer]), 'image.jpg')
  
    const res = await fetch('https://uguu.se/upload.php', {
      method: 'POST',
      body: form
    })
  
    const json = await res.json()
    if (!json.success) throw new Error('Upload gagal')
  
    return json.files[0].url
  }
  
  const handler = async (m, { conn, text, usedPrefix, command }) => {
    let judul = ''
    let urlGambar = ''
  
    try {
      if (
        m.quoted?.mimetype?.startsWith('image/') ||
        m.mimetype?.startsWith('image/')
      ) {
        judul = text.trim()
  
        if (!judul) {
          return conn.reply(
            m.chat,
            `Gunakan:\n${usedPrefix}${command} <judul>\n\nReply atau kirim gambar dengan caption command.`,
            m
          )
        }
  
        m.react('📤')
  
        const q = m.quoted || m
        const media = await q.download()
  
        if (!media) throw new Error('Gagal mengunduh gambar')
  
        urlGambar = await uploadUguu(media)
      } else {
        if (!text) {
          return conn.reply(
            m.chat,
            `Gunakan:\n${usedPrefix}${command} <judul>|<url gambar>\n\nAtau reply gambar dengan:\n${usedPrefix}${command} <judul>`,
            m
          )
        }
  
        const parts = text.split('|')
  
        if (parts.length < 2) {
          return conn.reply(
            m.chat,
            `Format:\n${usedPrefix}${command} <judul>|<url gambar>`,
            m
          )
        }
  
        judul = parts[0].trim()
        urlGambar = parts[1].trim()
      }
  
      m.react('🔄')
  
      const apiUrl =
        `https://api-nanzz.my.id/docs/api/maker/berita.php?text=${encodeURIComponent(judul)}&url=${encodeURIComponent(urlGambar)}`
  
      const response = await axios.get(apiUrl, {
        responseType: 'arraybuffer',
        timeout: 30000
      })
  
      await conn.sendMessage(
        m.chat,
        {
          image: Buffer.from(response.data),
          caption: `— berita maker —
  
  ❀ judul: ${judul}`
        },
        { quoted: m }
      )
  
      m.react('✅')
    } catch (e) {
      console.error(e)
      m.react('❌')
      conn.reply(m.chat, `Error: ${e.message || e}`, m)
    }
  }
  
  handler.help = ['berita']
  handler.tags = ['maker']
  handler.command = /^(berita|beritamaker)$/i
  handler.limit = true
  handler.register = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
