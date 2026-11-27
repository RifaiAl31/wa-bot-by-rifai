// group/addcmdsticker — satu file: metadata + kode fitur (gabungan dari engine7/plugins/group/addcmdsticker.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "addcmdsticker",
  "command": [
    "addcmdsticker",
    "addstickercmd",
    "setsticker",
    "stickeradd"
  ],
  "category": "group",
  "desc": "Jadikan sticker sebagai shortcut command",
  "usage": ".addcmdsticker <command> (reply sticker)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/addcmdsticker", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/addcmdsticker.js'
  const __vxExports = {};
  const { getQuotedStickerHash, addStickerCommand, listStickerCommands } = require("../../lib/ext/src/lib/vanxone-sticker-command.js");
  const { getPlugin } = require("../../lib/ext/src/lib/vanxone-plugins.e7.js");
  const pluginConfig = {
      name: 'addcmdsticker',
      alias: ['addstickercmd', 'setsticker', 'stickeradd'],
      category: 'group',
      description: 'Jadikan sticker sebagai shortcut command',
      usage: '.addcmdsticker <command> (reply sticker)',
      example: '.addcmdsticker menu',
      isOwner: false,
      isPremium: false,
      isGroup: false,
      isPrivate: false,
      isAdmin: false,
      cooldown: 10,
      energi: 0,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const args = m.args || []
      const commandName = args[0]
      
      // Validasi command name
      if (!commandName) {
          const existingCmds = listStickerCommands()
          
          let txt = `🖼️ *sᴛɪᴄᴋᴇʀ ᴛᴏ ᴄᴏᴍᴍᴀɴᴅ*\n\n`
          txt += `> Reply sticker + ketik command yang ingin dijadikan shortcut.\n\n`
          txt += `*Contoh:*\n`
          txt += `> Reply sticker, lalu ketik:\n`
          txt += `> \`.addcmdsticker menu\`\n\n`
          
          if (existingCmds.length > 0) {
              txt += `╭┈┈⬡「 📋 *ᴀᴋᴛɪꜰ* 」\n`
              for (const cmd of existingCmds.slice(0, 10)) {
                  txt += `┃ 🖼️ → \`${cmd.command}\`\n`
              }
              if (existingCmds.length > 10) {
                  txt += `┃ ... dan ${existingCmds.length - 10} lainnya\n`
              }
              txt += `╰┈┈┈┈┈┈┈┈⬡`
          }
          
          return m.reply(txt)
      }
      
      // Validasi reply sticker
      if (!m.quoted) {
          return m.reply('⚠️ *Reply sticker* yang ingin dijadikan command!')
      }
      
      const stickerHash = getQuotedStickerHash(m)
      if (!stickerHash) {
          return m.reply('⚠️ Pesan yang di-reply bukan *sticker*!')
      }
      
      // Validasi command exists
      const cleanCmd = commandName.toLowerCase().replace(/^\./, '')
      const plugin = getPlugin(cleanCmd)
      
      if (!plugin) {
          return m.reply(
              `❌ Command \`${cleanCmd}\` tidak ditemukan!\n\n` +
              `> Pastikan command yang ingin dijadikan shortcut valid.`
          )
      }
      
      // Add sticker command
      const success = addStickerCommand(stickerHash, cleanCmd, m.sender)
      
      if (success) {
          await m.react('✅')
          await m.reply(
              `✅ *sᴛɪᴄᴋᴇʀ ᴄᴏᴍᴍᴀɴᴅ ᴅɪᴛᴀᴍʙᴀʜᴋᴀɴ*\n\n` +
              `> 🖼️ Sticker → \`.${cleanCmd}\`\n\n` +
              `_Kirim sticker tersebut untuk menjalankan command!_`
          )
      } else {
          await m.reply('❌ Gagal menyimpan sticker command!')
      }
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
