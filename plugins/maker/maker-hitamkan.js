// maker/maker-hitamkan — satu file: metadata + kode fitur (gabungan dari engine2/plugins/maker/maker-hitamkan.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "tofigura",
    "tofigurav2",
    "tofigurav3",
    "tofunk",
    "tojepang",
    "tokacamata",
    "tokamboja",
    "tolego",
    "toliquor",
    "tomaid",
    "topeci",
    "topiramida",
    "toputih",
    "toreal",
    "toroblox",
    "toroh",
    "totato",
    "totua",
    "tounderground",
    "toviking",
    "tozombie"
  ],
  "category": "maker",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur tofunk (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/maker").split('\\').join('/')
module.exports = __vx.plugin("maker/maker-hitamkan", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/maker-hitamkan.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  /**
   * to hitam dan lain lain
   * -----------------------------
   * Type   : Plugins ESM
   * creator : WhatsApp Bot
   Api : https://api-faa.my.id
   */
  const axios = __vxDef(require("axios"));
  const FormData = __vxDef(require("form-data"));
  
  async function uguu(buffer) {
    try {
      const form = new FormData()
      form.append("files[]", buffer, "image.jpg")
  
      const { data } = await axios.post(
        "https://uguu.se/upload",
        form,
        { headers: form.getHeaders() }
      )
  
      return data?.files?.[0]?.url || null
    } catch {
      return null
    }
  }
  
  let handler = async (m, { conn, command }) => {
    try {
      await m.react("✨")
  
      let q = m.quoted ? m.quoted : m
      let mime = q.mimetype || q.msg?.mimetype || ""
  
      if (!mime.startsWith("image/")) {
        let list = handler.help.map(v => `.${v}`).join("\n")
        return m.reply(
  `✨ *AI IMAGE CONVERTER*
  
  Reply gambar dengan caption salah satu command berikut:
  
  ${list}`
        )
      }
  
      let buffer = await q.download()
      if (!buffer) return m.reply("❌ Gagal mengambil gambar")
  
      let imageUrl = await uguu(buffer)
      if (!imageUrl) return m.reply("❌ Upload gambar gagal")
  
      let apiUrl = `https://api-faa.my.id/faa/${command}?url=${encodeURIComponent(imageUrl)}`
      let res = await fetch(apiUrl)
  
      if (!res.ok) return m.reply("❌ API error")
  
      let result = Buffer.from(await res.arrayBuffer())
      await conn.sendFile(m.chat, result, `${command}.jpg`, "", m)
  
    } catch {
      m.reply("❌ Terjadi kesalahan!")
    }
  }
  
  handler.help = [
    'tobotak','tochibi','tofunk',
    'tofigura','tofigurav2','tofigurav3','toghibli','tohijab',
    'tojapanese','tojepang','tokacamata','tokamboja','tolego',
    'toliquor','tomaid','tomirror','tomoai','tomonyet',
    'topacar','topeci','topiramida','toputih','toreal',
    'toroblox','toroh','totato','totua','toviking',
    'tozombie','tounderground','tohitam'
  ]
  
  handler.tags = ['maker']
  
  handler.command = /^(tobotak|tochibi|tofunk|tofigura|tofigurav2|tofigurav3|toghibli|tohijab|tojapanese|tojepang|tokacamata|tokamboja|tolego|toliquor|tomaid|tomirror|tomoai|tomonyet|topacar|topeci|topiramida|toputih|toreal|toroblox|toroh|totato|totua|toviking|tozombie|tounderground|tohitam)$/i
  
  handler.limit = true
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
