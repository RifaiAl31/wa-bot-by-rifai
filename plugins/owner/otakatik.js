// owner/otakatik — satu file: metadata + kode fitur (gabungan dari engine1/plugins/owner/otakatik.js)
const __vx = require("../../lib/adapter/e1.js")
const __meta = {
  "name": "otakatik",
  "command": [
    "otakatik",
    "wip",
    "tinker"
  ],
  "category": "owner",
  "desc": "Tandain/lepas plugin sebagai ",
  "usage": ".otakatik <name/alias plugin>",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/otakatik", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/otakatik.js'
  const module = { exports: {} }; const exports = module.exports;
  /**
  ‎✧ Name    : otakatik
  ‎✧ Category: owner
  **/
  
  const config = require("../../lib/ext/config.js")
  const underDevStore = require("../../lib/ext/src/lib/underDevStore.js")
  const { getPlugin } = require("../../lib/ext/src/lib/plugins.js")
  
  const pluginConfig = {
      name: 'otakatik',
      alias: ['wip', 'tinker'],
      category: 'owner',
      description: 'Tandain/lepas plugin sebagai "masih otak-atik" (auto-ditolak buat user biasa)',
      usage: '.otakatik <name/alias plugin>',
      example: '.otakatik ytmp4',
      isOwner: true,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      isAdmin: false,
      isBotAdmin: false,
      cooldown: 0,
      limit: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const text = m.text?.trim()
  
      // Tanpa argumen -> tampilin daftar yang lagi ditandain + file-nya masing-masing
      if (!text) {
          const list = underDevStore.getList()
  
          if (list.length === 0) {
              return m.reply(
                  `╭┈┈⬡「 🔧 ᴅᴀғᴛᴀʀ ᴏᴛᴀᴋ-ᴀᴛɪᴋ 」\n` +
                  `┃ Kosong, gak ada plugin\n` +
                  `┃ yang lagi ditandain~\n` +
                  `╰┈┈┈┈┈┈┈┈⬡\n\n` +
                  `> ${m.prefix}otakatik <name/alias plugin>`
              )
          }
  
          const lines = list.map(name => {
              const p = getPlugin(name)
              const fileName = p?.filePath ? p.filePath.split('/').pop() : 'file tidak ditemukan'
              return `┃ • ${name}  →  ${fileName}`
          })
  
          return m.reply(
              `╭┈┈⬡「 🔧 ᴅᴀғᴛᴀʀ ᴏᴛᴀᴋ-ᴀᴛɪᴋ 」\n` +
              lines.join('\n') + `\n` +
              `╰┈┈┈┈┈┈┈┈⬡\n\n` +
              `> Ketik ulang salah satu command\n` +
              `> di atas buat ngelepas dari daftar`
          )
      }
  
      // Resolve pake getPlugin() ASLI dari lib/plugins.js, jadi alias
      // otomatis ke-mapping ke plugin & primary name yang bener
      const plugin = getPlugin(text)
  
      if (!plugin) {
          await m.react('❌')
          return m.reply(
              `❌ *ɢᴀ ᴋᴇᴛᴇᴍᴜ~*\n\n` +
              `> Gak ada plugin dengan name/alias\n` +
              `> "${text}"`
          )
      }
  
      const primaryName = plugin.config.name
      const fileName = plugin.filePath ? plugin.filePath.split('/').pop() : '(file tidak ditemukan)'
      const already = underDevStore.isMarked(primaryName)
  
      // Selalu tunjukin command asli + nama file yang ke-resolve, biar
      // owner bisa mastiin ini plugin yang dimaksud (penting kalau yang
      // diketik tadi cuma alias, bukan primary name)
      if (already) {
          underDevStore.remove(primaryName)
          await m.react('✅')
          return m.reply(
              `✅ *ʙᴇʀʜᴀsɪʟ ᴅɪʟᴇᴘᴀs~* 🎤\n\n` +
              `> Kamu ketik : ${text}\n` +
              `> Command    : ${primaryName}\n` +
              `> File       : ${fileName}\n\n` +
              `> Udah gak ditandain otak-atik\n` +
              `> lagi, bisa dipake normal`
          )
      } else {
          underDevStore.add(primaryName)
          await m.react('🚧')
          return m.reply(
              `🚧 *ʙᴇʀʜᴀsɪʟ ᴅɪᴛᴀɴᴅᴀɪ~* 🎤\n\n` +
              `> Kamu ketik : ${text}\n` +
              `> Command    : ${primaryName}\n` +
              `> File       : ${fileName}\n\n` +
              `> User biasa bakal auto-ditolak\n` +
              `> kalau nyoba pake ini`
          )
      }
  }
  
  module.exports = {
      config: pluginConfig,
      handler
  }
  return module.exports
})
