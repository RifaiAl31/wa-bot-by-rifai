// ai/ai-nsfwcheck — satu file: metadata + kode fitur (gabungan dari engine2/plugins/ai/ai-nsfwcheck.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "nsfwcheck"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur nsfwcheck (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/ai").split('\\').join('/')
module.exports = __vx.plugin("ai/ai-nsfwcheck", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/ai-nsfwcheck.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
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
  
  let handler = async (m, { conn }) => {
    await m.react('✨')
  
    let q = m.quoted ? await m.getQuotedObj() : m
  
    if (q.mtype !== 'imageMessage') {
      return m.reply('Kirim atau reply gambar lalu ketik *.nsfwcheck*')
    }
  
    let buffer = await q.download()
    if (!buffer) return
  
    let tempFile = path.join(process.cwd(), `nsfw_${Date.now()}.jpg`)
    fs.writeFileSync(tempFile, buffer)
  
    try {
      let srcUrl = await uguu(tempFile)
  
      const { data } = await axios.get(
        `${global.APIs.deline}/ai/nsfwcheck?url=${encodeURIComponent(srcUrl)}`
      )
  
      let caption = `✨ *NSFW Check Result*\n\n`
      caption += `✨ Label : *${data.result.labelName}*\n`
      caption += `✨ Confidence : *${(data.result.confidence * 100).toFixed(2)}%*`
  
      m.reply(caption)
    } finally {
      fs.unlinkSync(tempFile)
    }
  }
  
  handler.help = ['nsfwcheck']
  handler.tags = ['ai']
  handler.command = /^nsfwcheck$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
