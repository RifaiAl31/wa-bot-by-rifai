// _system/checkerror — satu file: metadata + kode fitur (gabungan dari engine6/plugins/_system/checkerror.js)
const __vx = require("../../lib/adapter/e6.js")
const __meta = {
  "name": "checkerror",
  "command": [
    "checkerror"
  ],
  "category": "owner",
  "desc": "Perintah checkerror",
  "usage": "checkerror",
  "owner": true,
  "group": false,
  "admin": false,
  "botAdmin": false,
  "premium": false
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/_system").split('\\').join('/')
module.exports = __vx.plugin("_system/checkerror", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/checkerror.js'
  const module = { exports: {} }; const exports = module.exports;
  module.exports = async function (__vanxone_imp, __vanxone_meta) {
  
  const __ni_0 = await __vanxone_imp("fs"); const fs = __ni_0.default;
  const __ni_1 = await __vanxone_imp("path"); const path = __ni_1.default;
  
  
  
  let handler = async (m, { conn }) => {
      let pluginFolder = './plugins'
      let errorList = []
  
      if (!fs.existsSync(pluginFolder)) {
          return m.reply('❌ Folder *plugins* tidak ditemukan!')
      }
  
      let files = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'))
  
      for (let file of files) {
          try {
              let plugin = await import(`file://${path.resolve(pluginFolder, file)}?update=${Date.now()}`)
              
              // cek apakah export default function
              let hasDefaultFunc = plugin?.default && typeof plugin.default === 'function'
              // cek apakah ada export before/after/cron
              let hasHook = plugin.before || plugin.after || plugin.cron
  
              if (!hasDefaultFunc && !hasHook) {
                  throw new Error('Tidak ada export default function atau hook (before/after/cron)')
              }
          } catch (err) {
              errorList.push(`❌ *${file}* → ${err.message}`)
          }
      }
  
      if (errorList.length === 0) {
          m.reply('✅ Semua fitur aman, tidak ada error!')
      } else {
          m.reply(`🚨 Ditemukan *${errorList.length}* error pada fitur:\n\n${errorList.join('\n')}`)
      }
  }
  
  handler.help = ['checkerror']
  handler.tags = ['owner']
  handler.command = /^checkerror$/i
  handler.rowner = true
  
  const __vanxone_default = handler;
  ;return { default: __vanxone_default };
  }
  
  return module.exports
})
