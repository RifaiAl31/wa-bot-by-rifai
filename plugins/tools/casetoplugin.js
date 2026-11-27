// tools/casetoplugin — satu file: metadata + kode fitur (gabungan dari engine1/plugins/tools/casetoplugin.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "casetoplugin",
  "command": [
    "casetoplugin",
    "case2plugin",
    "caseconvert"
  ],
  "category": "tools",
  "desc": "Convert format switch-case ke format plugin Baileys",
  "usage": ".casetoplugin <reply kode case>",
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
module.exports = __vx.plugin("tools/casetoplugin", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/casetoplugin.js'
  const module = { exports: {} }; const exports = module.exports;
  const config = require("../../lib/ext/config.js")
  
  const pluginConfig = {
      name: 'casetoplugin',
      alias: ['case2plugin', 'caseconvert'],
      category: 'tools',
      description: 'Convert format switch-case ke format plugin Baileys',
      usage: '.casetoplugin <reply kode case>',
      example: '.casetoplugin',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      cooldown: 5,
      energi: 1,
      isEnabled: true
  }
  
  function convertCaseToPlugin(code) {
      // Ambil semua nama case
      const caseNames = []
      const caseNameRegex = /case\s+["']([^"']+)["']\s*:/g
      let match
      while ((match = caseNameRegex.exec(code)) !== null) {
          caseNames.push(match[1])
      }
  
      if (caseNames.length === 0) throw new Error('Tidak ditemukan format case yang valid')
  
      const commandName = caseNames[0]
      const aliases = caseNames.slice(1)
  
      // Ambil tags dari komentar jika ada
      const tagsMatch = code.match(/\/\/\s*tags?\s*:\s*([^\n]+)/)
      const tags = tagsMatch ? tagsMatch[1].trim() : 'general'
  
      // Ambil isi body case
      // Coba dengan kurung kurawal dulu
      const bodyMatch = code.match(/case\s+["'][^"']+["']\s*:\s*\{([\s\S]*?)\}\s*\n?\s*break/)
          || code.match(/case\s+["'][^"']+["']\s*:\s*\{([\s\S]*)\}/)
  
      let body = ''
      if (bodyMatch) {
          body = bodyMatch[1].trim()
      } else {
          // Tanpa kurung kurawal
          const plainMatch = code.match(/case\s+["'][^"']+["']\s*:([\s\S]*?)break/)
          if (plainMatch) body = plainMatch[1].trim()
      }
  
      if (!body) throw new Error('Isi body case tidak ditemukan')
  
      // Konversi string concatenation ke template literal
      body = body.replace(/"([^"]*?)"\s*\+\s*([^+\n;]+?)\s*\+\s*"([^"]*?)"/g, (match, before, expr, after) => {
          return '`' + before + '${' + expr.trim() + '}' + after + '`'
      })
  
      // Ganti prefix + command ke usedPrefix + command
      body = body.replace(/\bprefix\b(?!\s*:)/g, 'usedPrefix')
  
      // Normalisasi indent
      const indented = body.split('\n').map(l => '    ' + l).join('\n')
  
      // Buat aliases string untuk handler.help
      const allHelp = [commandName, ...aliases]
      const helpStr = allHelp.map(h => `'${h}'`).join(', ')
  
      // Buat command regex
      const cmdRegex = aliases.length > 0
          ? `/^(${[commandName, ...aliases].join('|')})$/i`
          : `/^${commandName}$/i`
  
      const result = `let handler = async (m, { conn, text, usedPrefix, command }) => {
  ${indented}
  }
  
  handler.help = [${helpStr}]
  handler.tags = ['${tags}']
  handler.command = ${cmdRegex}
  handler.limit = false
  handler.register = false
  
  export default handler`
  
      return result
  }
  
  async function handler(m, { sock }) {
      let code = m.quotedBody || m.text?.trim()
  
      if (!code) {
          return m.reply(
              `🔄 *ᴄᴀsᴇ ᴛᴏ ᴘʟᴜɢɪɴ ᴄᴏɴᴠᴇʀᴛᴇʀ*\n\n` +
              `> Convert format switch-case ke plugin Baileys\n\n` +
              `> *Cara pakai:*\n` +
              `> Reply kode case dengan ${m.prefix}casetoplugin\n\n` +
              `> *Contoh input:*\n` +
              `> \`case "nama": { ... } break\``
          )
      }
  
      try {
          const converted = convertCaseToPlugin(code)
  
          const saluranId = config.saluran?.id || ''
          const saluranName = config.saluran?.name || config.bot?.name || 'WhatsApp Bot'
  
          await sock.sendMessage(m.chat, {
              text: `✅ *ᴄᴏɴᴠᴇʀᴛᴇᴅ ᴛᴏ ᴘʟᴜɢɪɴ*\n\n\`\`\`${converted}\n\`\`\``,
              contextInfo: {
                  forwardingScore: 9999,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                      newsletterJid: saluranId,
                      newsletterName: saluranName,
                      serverMessageId: 127
                  }
              }
          }, { quoted: m })
  
      } catch (error) {
          await m.reply(`❌ *Gomen ne~* ✦\n\n> ${error.message}\n\n_Ai udah coba yang terbaik tapi gagal juga... coba lagi nanti ya~ 🌸_`)
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
