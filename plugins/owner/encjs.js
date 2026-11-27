// owner/encjs — satu file: metadata + kode fitur (gabungan dari engine2/plugins/owner/encjs.js)
const __vx = require("../../lib/adapter/e2.js")
const __meta = {
  "command": [
    "encjs"
  ],
  "category": "owner",
  "owner": false,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "desc": "Fitur encjs (dari Bot package)"
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/encjs", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/encjs.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs/promises"));
  const os = __vxDef(require("os"));
  const path = __vxDef(require("path"));
  const { exec } = require("child_process");
  const { promisify } = require("util");
  
  const pexec = promisify(exec)
  
  let handler = async (m, { conn }) => {
    let q = m.quoted
  
    if (!q) {
      return m.reply('Reply file .js yang ingin di-obfuscate')
    }
  
    let fileName = q.fileName || q.msg?.fileName || ''
  
    if (!fileName.endsWith('.js')) {
      return m.reply('Reply file .js yang valid')
    }
  
    let buffer = await q.download()
  
    let tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'obf-'))
    let input = path.join(tmpDir, fileName)
    let output = path.join(tmpDir, `enc-${fileName}`)
  
    try {
      await fs.writeFile(input, buffer)
  
      await pexec(
        `npx javascript-obfuscator "${input}" ` +
        `--output "${output}" ` +
        `--compact true ` +
        `--string-array true ` +
        `--string-array-encoding rc4 ` +
        `--string-array-threshold 1 ` +
        `--self-defending true`
      )
  
      let result = await fs.readFile(output)
  
      await conn.sendMessage(m.chat, {
        document: result,
        fileName,
        mimetype: 'application/javascript'
      }, { quoted: m })
  
    } catch (e) {
      console.error(e)
      m.reply(`Error:\n${e.message}`)
    } finally {
      await fs.rm(tmpDir, {
        recursive: true,
        force: true
      }).catch(() => {})
    }
  }
  
  handler.help = ['encjs']
  handler.tags = ['tools']
  handler.command = /^encjs$/i
  handler.limit = true
  
  const __vxDefault = handler
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
