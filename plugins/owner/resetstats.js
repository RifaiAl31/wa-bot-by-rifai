// owner/resetstats — satu file: metadata + kode fitur (gabungan dari engine8/plugins/owner/resetstats.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "resetstats",
  "command": [
    "resetstats",
    "resetstat",
    "clearstats"
  ],
  "category": "owner",
  "desc": "Reset statistik penggunaan command bot",
  "usage": ".resetstats",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/resetstats", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/resetstats.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e8.js");
  
  const pluginConfig = {
    name: "resetstats",
    alias: ["resetstat", "clearstats"],
    category: "owner",
    description: "Reset statistik penggunaan command bot",
    usage: ".resetstats",
    example: ".resetstats",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock, db, botConfig }) {
    try {
      
      const cmdStats = db.data.cmdStats || {};
      const totalCmd = Object.keys(cmdStats).length;
      const totalUsage = Object.values(cmdStats).reduce((a, b) => a + b, 0);
  
      db.data.cmdStats = {};
      await db.write();
  
      const text = [
        `✅ *Statistik berhasil direset!*`,
        ``,
        `📊 *Data yang dihapus:*`,
        `• Command tercatat : *${totalCmd} command*`,
        `• Total penggunaan : *${totalUsage.toLocaleString()}x*`,
        ``,
        `Stats akan mulai dihitung ulang dari sekarang.`,
      ].join("\n");
  
      await m.reply(text);
    } catch (err) {
      console.error("[resetstats] Error:", err.message);
      await m.reply(`❌ Gagal mereset statistik: ${err.message}`);
    }
  }
  
  const __vxDefault = {
    config: pluginConfig,
    handler,
  };
  Object.defineProperty(__vxExports, "default", { enumerable: true, get: () => __vxDefault });
  return __vxExports
})
