// owner/onlypc — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/onlypc.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "onlypc",
  "command": [
    "onlypc",
    "onlyprivate",
    "privateonly"
  ],
  "category": "owner",
  "desc": "Toggle mode bot hanya di private chat",
  "usage": ".onlypc on/off",
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
module.exports = __vx.plugin("owner/onlypc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/onlypc.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  
  const pluginConfig = {
    name: "onlypc",
    alias: ["onlyprivate", "privateonly"],
    category: "owner",
    description: "Toggle mode bot hanya di private chat",
    usage: ".onlypc on/off",
    example: ".onlypc on",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const db = getDatabase();
    const option = m.text?.toLowerCase()?.trim();
  
    if (!option) {
      const current = db.setting("onlyPc") || false;
      return m.reply(
        `💬 *Only Private*\n\n` +
          `> Status: *${current ? "Aktif ✅" : "Nonaktif ❌"}*\n\n` +
          `*PENGGUNAAN:*\n` +
          `> *${m.prefix}onlypc on* — Bot hanya bisa diakses di private chat\n` +
          `> *${m.prefix}onlypc off* — Bot bisa diakses di mana saja\n\n` +
          `_Jika aktif, mode Only Group akan otomatis nonaktif_`
      );
    }
  
    if (option === "on") {
      db.setting("onlyPc", true);
      db.setting("onlyGc", false);
      await m.react("✅");
      return m.reply(
        `💬 *Only Private Aktif*\n\n` +
          `> Bot hanya bisa diakses di private chat\n` +
          `> Mode Only Group dinonaktifkan`
      );
    }
  
    if (option === "off") {
      db.setting("onlyPc", false);
      await m.react("❌");
      return m.reply(
        `💬 *Only Private Nonaktif*\n\n` +
          `> Bot bisa diakses di mana saja`
      );
    }
  
    return m.reply(
      `❌ *Opsi Tidak Valid*\n\n> Gunakan *${m.prefix}onlypc on* atau *${m.prefix}onlypc off*`
    );
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
