// owner/exec — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/exec.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "exec",
  "command": [
    "exec",
    "run",
    "execute"
  ],
  "category": "owner",
  "desc": "Jalankan kode JS dari pesan yang di-reply (Owner Only)",
  "usage": ".> (reply pesan berisi kode)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/exec", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/exec.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const fs = __vxDef(require("fs"));
  const path = __vxDef(require("path"));
  const axios = __vxDef(require("axios"));
  const os = __vxDef(require("os"));
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  const util = __vxDef(require("util"));
  const pluginConfig = {
      name: 'exec',
      alias: ['>', 'run', 'execute'],
      category: 'owner',
      description: 'Jalankan kode JS dari pesan yang di-reply (Owner Only)',
      usage: '.> (reply pesan berisi kode)',
      example: '.> (reply)',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 0,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock, store }) {
      if (!config.isOwner(m.sender)) {
          return m.reply('❌ *Owner Only!*')
      }
  
      let code = null
  
      if (m.quoted) {
          code = m.quoted.text || m.quoted.body || m.quoted.caption
      }
  
      if (!code) {
          code = m.fullArgs?.trim() || m.text?.trim()
      }
  
      if (!code) {
          return m.reply(
              `⚙️ *ᴇxᴇᴄ*\n\n` +
              `> Reply pesan berisi kode JavaScript!\n\n` +
              `*Atau:*\n` +
              `> .> <code>\n\n` +
              `*Contoh:*\n` +
              `> Reply pesan: \`return m.chat\`\n` +
              `> Lalu ketik: .>`
          )
      }
  
      code = code.trim()
  
      if (code.startsWith('```') && code.endsWith('```')) {
          code = code.slice(3, -3)
          if (code.startsWith('javascript') || code.startsWith('js')) {
              code = code.replace(/^(javascript|js)\n?/, '')
          }
      }
  
      const db = getDatabase()
  
      let result
      let isError = false
  
      try {
          result = await eval(`(async () => { ${code} })()`)
      } catch (e) {
          isError = true
          result = e
      }
  
      let output
      if (typeof result === 'undefined') {
          output = 'undefined'
      } else if (result === null) {
          output = 'null'
      } else if (typeof result === 'object') {
          try {
              output = util.inspect(result, { depth: 2, maxArrayLength: 50 })
          } catch {
              output = String(result)
          }
      } else {
          output = String(result)
      }
  
      if (output.length > 3000) {
          output = output.slice(0, 3000) + '\n\n... (truncated)'
      }
  
      const status = isError ? '❌ Error' : '✅ Success'
      const type = isError ? result?.name || 'Error' : typeof result
  
      const codePreview = code.length > 100 ? code.slice(0, 100) + '...' : code
  
      await m.reply(
          `⚙️ *ᴇxᴇᴄ ʀᴇsᴜʟᴛ*\n\n` +
          `╭┈┈⬡「 📋 *ᴄᴏᴅᴇ* 」\n` +
          `┃ \`${codePreview}\`\n` +
          `├┈┈⬡「 📊 *ʀᴇsᴜʟᴛ* 」\n` +
          `┃ ${status}\n` +
          `┃ Type: ${type}\n` +
          `╰┈┈┈┈┈┈┈┈⬡\n\n` +
          `\`\`\`${output}\`\`\``
      )
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
