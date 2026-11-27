// main/benefitowner — satu file: metadata + kode fitur (gabungan dari engine7/plugins/main/benefitowner.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "benefitowner",
  "command": [
    "benefitowner",
    "ownerbenefits",
    "ownerfitur"
  ],
  "category": "info",
  "desc": "Lihat penjelasan dan daftar fitur khusus Owner",
  "usage": ".benefitowner",
  "owner": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/main").split('\\').join('/')
module.exports = __vx.plugin("main/benefitowner", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/benefitowner.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getAllPlugins } = require("../../lib/ext/src/lib/vanxone-plugins.e7.js");
  const config = __vxDef(require("../../lib/ext/config.e7.js"));
  const pluginConfig = {
      name: 'benefitowner',
      alias: ['ownerbenefits', 'ownerfitur'],
      category: 'main',
      description: 'Lihat penjelasan dan daftar fitur khusus Owner',
      usage: '.benefitowner',
      isOwner: false,
      isGroup: false,
      isEnabled: true
  }
  
  async function handler(m, { sock }) {
      const plugins = getAllPlugins()
      const ownerCommands = plugins.filter(p => p.config.isOwner && p.config.isEnabled)
      
      const seen = new Set()
      const commandList = []
      for (const p of ownerCommands) {
          const names = Array.isArray(p.config.name) ? p.config.name : [p.config.name]
          for (const name of names) {
              if (!name || seen.has(name)) continue
              seen.add(name)
              commandList.push(`• *${config.command?.prefix || '.'}${name}*`)
          }
      }
      commandList.sort()
      
      const totalCommands = commandList.length
      
      const message = 
          `👑 *ᴀᴘᴀ ɪᴛᴜ ᴏᴡɴᴇʀ?*\n\n` +
          `Owner adalah *pemilik bot* yang memiliki akses penuh ke semua fitur dan kontrol sistem.\n\n` +
          `╭┈┈⬡「 🔐 *ᴋᴇɪꜱᴛɪᴍᴇᴡᴀᴀɴ ᴏᴡɴᴇʀ* 」\n` +
          `┃ ✦ \`\`\`Akses semua command tanpa batasan\`\`\`\n` +
          `┃ ✦ \`\`\`Limit tidak terbatas (-1)\`\`\`\n` +
          `┃ ✦ \`\`\`Bypass semua cooldown\`\`\`\n` +
          `┃ ✦ \`\`\`Kontrol penuh sistem bot\`\`\`\n` +
          `┃ ✦ \`\`\`Manajemen user & group\`\`\`\n` +
          `╰┈┈┈┈┈┈┈┈⬡\n\n` +
          `╭┈┈⬡「 ⚙️ *ᴄᴀʀᴀ ᴋᴇʀᴊᴀ* 」\n` +
          `┃ \`Owner ditambahkan melalui:\`\n` +
          `┃ • \`\`\`${config.command?.prefix || '.'}addowner <nomor>\`\`\`\n` +
          `┃ • Atau langsung di config.js\n` +
          `╰┈┈┈┈┈┈┈┈⬡\n\n` +
          `╭┈┈⬡「 📋 *ᴅᴀꜰᴛᴀʀ ᴄᴏᴍᴍᴀɴᴅ ᴏᴡɴᴇʀ* 」\n` +
          `┃ \`Total: ${totalCommands} command\`\n` +
          `┃\n` +
          commandList.map(cmd => `┃ ${cmd}`).join('\n') +
          `\n╰┈┈┈┈┈┈┈┈⬡\n\n` +
          `> Hubungi owner untuk mendapatkan akses!`
      
      await m.reply(message)
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
