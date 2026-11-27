// owner/onlygc — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/onlygc.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "onlygc",
  "command": [
    "onlygc",
    "onlygroup",
    "grouponly"
  ],
  "category": "owner",
  "desc": "Toggle mode bot hanya di grup",
  "usage": ".onlygc on/off",
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
module.exports = __vx.plugin("owner/onlygc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/onlygc.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  
  const pluginConfig = {
    name: "onlygc",
    alias: ["onlygroup", "grouponly"],
    category: "owner",
    description: "Toggle mode bot hanya di grup",
    usage: ".onlygc on/off",
    example: ".onlygc on",
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
      const current = db.setting("onlyGc") || false;
      return m.reply(
        `🏘️ *Only Group*\n\n` +
          `> Status: *${current ? "Aktif ✅" : "Nonaktif ❌"}*\n\n` +
          `*PENGGUNAAN:*\n` +
          `> *${m.prefix}onlygc on* — Bot hanya bisa diakses di grup\n` +
          `> *${m.prefix}onlygc off* — Bot bisa diakses di mana saja\n\n` +
          `_Jika aktif, mode Only Private akan otomatis nonaktif_`
      );
    }
  
    if (option === "on") {
      db.setting("onlyGc", true);
      db.setting("onlyPc", false);
      await m.react("✅");
      return m.reply(
        `🏘️ *Only Group Aktif*\n\n` +
          `> Bot hanya bisa diakses di grup\n` +
          `> Mode Only Private dinonaktifkan`
      );
    }
  
    if (option === "off") {
      db.setting("onlyGc", false);
      await m.react("❌");
      return m.reply(
        `🏘️ *Only Group Nonaktif*\n\n` +
          `> Bot bisa diakses di mana saja`
      );
    }
  
    return m.reply(
      `❌ *Opsi Tidak Valid*\n\n> Gunakan *${m.prefix}onlygc on* atau *${m.prefix}onlygc off*`
    );
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
