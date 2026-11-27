// group/publicthisgc — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/publicthisgc.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "publicthisgc",
  "command": [
    "publicthisgc",
    "publicgc",
    "publicgroup",
    "publicthisgroup"
  ],
  "category": "group",
  "desc": "Aktifkan mode public hanya di grup ini",
  "usage": ".publicthisgc",
  "owner": true,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/group").split('\\').join('/')
module.exports = __vx.plugin("group/publicthisgc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/publicthisgc.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  
  const pluginConfig = {
    name: "publicthisgc",
    alias: ["publicgc", "publicgroup", "publicthisgroup"],
    category: "group",
    description: "Aktifkan mode public hanya di grup ini",
    usage: ".publicthisgc",
    example: ".publicthisgc",
    isOwner: true,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const db = getDatabase();
    const selfGroups = db.setting("selfGroups") || [];
    const publicGroups = db.setting("publicGroups") || [];
  
    const isSelfGroup = selfGroups.includes(m.chat);
    const isPublicGroup = publicGroups.includes(m.chat);
  
    if (isPublicGroup && !isSelfGroup) {
      return m.reply(
        `ℹ️ *ɢʀᴜᴘ ɪɴɪ sᴜᴅᴀʜ ᴍᴏᴅᴇ ᴘᴜʙʟɪᴄ*\n\n` +
          `> Bot merespon semua member di grup ini\n\n` +
          `_Gunakan ${m.prefix}selfthisgc untuk menutup akses_`,
      );
    }
  
    const updatedSelf = selfGroups.filter((id) => id !== m.chat);
    db.setting("selfGroups", updatedSelf);
  
    if (!publicGroups.includes(m.chat)) {
      db.setting("publicGroups", [...publicGroups, m.chat]);
    }
  
    m.react("🌐");
    return m.reply(
      `🌐 *ᴍᴏᴅᴇ ᴘᴜʙʟɪᴄ ᴅɪᴀᴋᴛɪꜰᴋᴀsɪ*\n\n` +
        `> Bot sekarang merespon semua member di grup ini\n` +
        `> Override mode global aktif untuk grup ini\n\n` +
        `📋 *Grup lain tidak terpengaruh*\n\n` +
        `_Gunakan ${m.prefix}selfthisgc untuk menutup akses lagi_`,
    );
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
