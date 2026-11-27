// maker/toblonde — satu file: metadata + kode fitur (gabungan dari engine7/plugins/maker/toblonde.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "toblonde",
  "command": [
    "toblonde"
  ],
  "category": "maker",
  "desc": "Imported from WhatsApp Bot V4.6",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/toblonde", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/toblonde.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const fetch = __vxDef(require("node-fetch"));
  const axios = __vxDef(require("axios"));
  const FormData = __vxDef(require("form-data"));
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  
  async function uguu(filePath) {
    const form = new FormData()
    form.append('files[]', fs.createReadStream(filePath))
    const { data } = await axios.post('https://uguu.se/upload', form, {
      headers: { ...form.getHeaders() }
    })
    return data.files[0].url
  }
  
  const pluginConfig = {
    name: "toblonde",
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
    energi: 1,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
      const conn = sock;
    await m.react('✨')
  
    let q = m.quoted
    if (!q) {
      return conn.sendMessage(
        m.chat,
        { text: 'ℹ️ Cara pakai:\nReply gambar lalu ketik *.toblonde*' },
        { quoted: global.fkontak }
      )
    }
  
    let mime = (q.msg || q).mimetype || ''
    if (!mime.startsWith('image/')) {
      return conn.sendMessage(
        m.chat,
        { text: 'ℹ️ Cara pakai:\nReply gambar lalu ketik *.toblonde*' },
        { quoted: global.fkontak }
      )
    }
  
    let buffer = await q.download().catch(() => null)
    if (!buffer) return
  
    // buat temp file
    let ext = mime.split('/')[1] || 'png'
    let tempFile = path.join(process.cwd(), `toblonde_${Date.now()}.${ext}`)
    fs.writeFileSync(tempFile, buffer)
  
    try {
      // upload ke uguu
      let srcUrl = await uguu(tempFile)
  
      let apiUrl = `https://api-faa.my.id/faa/toblonde?url=${encodeURIComponent(srcUrl)}`
      let res = await fetch(apiUrl)
      if (!res.ok) throw 'API error'
  
      let resultBuffer = await res.buffer()
  
      await conn.sendMessage(
        m.chat,
        {
          image: resultBuffer,
          caption: '✨ To Blonde'
        },
        { quoted: global.fkontak }
      )
    } catch (e) {
      console.error(e)
      await conn.sendMessage(
        m.chat,
        { text: '❌ Gagal memproses gambar' },
        { quoted: global.fkontak }
      )
    } finally {
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile)
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
