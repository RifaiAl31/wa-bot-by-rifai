// info/totalfitur2 — satu file: metadata + kode fitur (gabungan dari engine7/plugins/info/totalfitur2.js)
const __vx = require("../../lib/adapter/e7.js")
const __meta = {
  "name": "totalfitur2",
  "command": [
    "totalfitur2",
    "totalfeature2",
    "totalcmd2",
    "countplugin2",
    "distribusi2"
  ],
  "category": "info",
  "desc": "Lihat total fitur/command bot secara otomatis",
  "usage": ".totalfitur2",
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/info").split('\\').join('/')
module.exports = __vx.plugin("info/totalfitur2", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/totalfitur2.js'
  const __vxExports = {};
  const FEATURE_CREDIT = "Fitur by: Owner Bot";
  
  
  const { getAllPlugins, getCommandsByCategory } = require("../../lib/ext/src/lib/vanxone-plugins.e7.js");
  const { getCaseCount } = require("../../lib/ext/case/vanxone.js");
  
  const pluginConfig = {
    name: "totalfitur2",
    alias: ["totalfeature2", "totalcmd2", "countplugin2", "distribusi2"],
    category: "info",
    description: "Lihat total fitur/command bot secara otomatis",
    usage: ".totalfitur2",
    example: ".totalfitur2",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 0,
    isEnabled: true,
  }
  
  async function handler(m) {
    try {
      const plugins = getAllPlugins().filter(p => p?.config?.isEnabled !== false)
      const commandsByCategory = getCommandsByCategory()
      const totalCommand = Object.values(commandsByCategory)
        .reduce((sum, commands) => sum + commands.length, 0)
      const totalCase = getCaseCount()
      const totalFitur = totalCommand + totalCase
      const totalKategori = Object.values(commandsByCategory)
        .filter(commands => commands.length > 0).length
  
      await m.reply(
        `📊 *TOTAL FITUR BOT*\n\n` +
        `🔌 Total Plugin Aktif : *${plugins.length}*\n` +
        `⚡ Total Command      : *${totalCommand}*\n` +
        `🧩 Total Case         : *${totalCase}*\n` +
        `✨ Total Fitur        : *${totalFitur}*\n` +
        `📁 Total Kategori     : *${totalKategori}*`
      )
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error ?? "Unknown error")
      console.error("[TotalFitur]", error)
      return m.reply(`❌ Gagal menghitung total fitur.\n> ${errorMessage}`)
    }
  }
  
  
  
  Object.defineProperty(__vxExports, "FEATURE_CREDIT", { enumerable: true, get: () => FEATURE_CREDIT });
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
