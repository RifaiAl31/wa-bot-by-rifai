// ai/ai-nanobana — satu file: metadata + kode fitur (gabungan dari engine2/plugins/ai/ai-nanobana.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "editimage"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur editimage (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/ai-nanobana", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ai-nanobana.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const axios = __vxDef(require("axios"));
  const FormData = __vxDef(require("form-data"));
  
  async function uguu(filePath) {
    const form = new FormData()
    form.append('files[]', fs.createReadStream(filePath))
    const { data } = await axios.post('https://uguu.se/upload', form, {
      headers: { ...form.getHeaders() }
    })
    return data.files[0].url
  }
  
  let handler = async (m, { conn, text, usedPrefix, command }) => {
    await m.react('✨')
  
    let q = m.quoted ? m.quoted : m
  
    if (q.mtype !== 'imageMessage') {
      return conn.reply(
        m.chat,
        `*Example :* reply gambar + ${usedPrefix + command} Ubah jadi tersenyum`,
        m
      )
    }
  
    if (!text) {
      return conn.reply(
        m.chat,
        `*Example :* reply gambar + ${usedPrefix + command} Ubah jadi tersenyum`,
        m
      )
    }
  
    let media = await q.download()
    let tmp = './tmp_' + Date.now() + '.jpg'
    fs.writeFileSync(tmp, media)
  
    let urlGambar = await uguu(tmp)
    fs.unlinkSync(tmp)
  
    let url = `${global.APIs.faa}/faa/nano-banana?url=${encodeURIComponent(urlGambar)}&prompt=${encodeURIComponent(text)}`
    let res = await fetch(url)
  
    if (!res.ok) return
  
    let buffer = Buffer.from(await res.arrayBuffer())
    await conn.sendFile(m.chat, buffer, 'edit.png', '', m)
  }
  
  handler.help = ['editimage', 'nanobanana']
  handler.tags = ['ai']
  handler.command = /^(editimage|nanobanana)$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
