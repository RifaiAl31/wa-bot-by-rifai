// tools/tools-upvidey — satu file: metadata + kode fitur (gabungan dari engine2/plugins/tools/tools-upvidey.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "upvidey"
  ],
  "category": "tools",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur upvidey (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/tools").split('\\').join('/')
module.exports = __vx.plugin("tools/tools-upvidey", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/tools-upvidey.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { uploadVidey } = require("../../lib/ext/lib/scrape/videy.js");
  const fs = __vxDef(require("fs"));
  
  let handler = async (m, { conn }) => {
    if (!m.quoted) throw 'Reply video atau audio'
  
    const mime = m.quoted.mimetype || ''
    if (!/video|audio/.test(mime)) throw 'Reply file video/audio'
  
    await m.react('✨')
  
    const buffer = await m.quoted.download()
    const filePath = `./tmp_${Date.now()}.mp4`
  
    fs.writeFileSync(filePath, buffer)
  
    await m.react('🎸')
  
    const res = await uploadVidey(filePath)
  
    fs.unlinkSync(filePath)
  
    if (!res?.link) throw 'Upload gagal'
  
    await m.react('🌿')
  
    m.reply(`🎸 Upload Complete
  
  🔗 ${res.link}`)
  }
  
  handler.help = ['upvidey']
  handler.tags = ['tools']
  handler.command = /^upvidey$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
