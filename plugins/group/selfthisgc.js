// group/selfthisgc — satu file: metadata + kode fitur (gabungan dari engine3/plugins/group/selfthisgc.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "selfthisgc",
  "command": [
    "selfthisgc",
    "selfgc",
    "selfgroup",
    "selfthisgroup"
  ],
  "category": "group",
  "desc": "Aktifkan mode self hanya di grup ini",
  "usage": ".selfthisgc",
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
module.exports = __vx.plugin("group/selfthisgc", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/selfthisgc.js'
  const __vxDef = (m) => (m && m.__esModule ? m.default : m);
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const te = __vxDef(require("../../lib/ext/src/lib/vanxone-error.js"));
  const config = __vxDef(require("../../lib/ext/config.e3.js"));
  
  const pluginConfig = {
    name: "selfthisgc",
    alias: ["selfgc", "selfgroup", "selfthisgroup"],
    category: "group",
    description: "Aktifkan mode self hanya di grup ini",
    usage: ".selfthisgc",
    example: ".selfthisgc",
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
  
    if (isSelfGroup) {
      return m.reply(
        `ℹ️ *ɢʀᴜᴘ ɪɴɪ sᴜᴅᴀʜ ᴍᴏᴅᴇ sᴇʟꜰ*\n\n` +
          `> Bot hanya merespon owner & bot sendiri\n\n` +
          `_Gunakan ${m.prefix}publicthisgc untuk membuka akses_`,
      );
    }
  
    if (!selfGroups.includes(m.chat)) {
      db.setting("selfGroups", [...selfGroups, m.chat]);
    }
  
    const updatedPublic = publicGroups.filter((id) => id !== m.chat);
    db.setting("publicGroups", updatedPublic);
  
    m.react("🔒");
    return m.reply(
      `🔒 *ᴍᴏᴅᴇ sᴇʟꜰ ᴀᴋᴛɪꜰ*\n\n` +
        `> Bot di grup ini sekarang hanya merespon:\n` +
        `> • Owner bot\n` +
        `> • Bot sendiri (fromMe)\n\n` +
        `📋 *Grup lain tidak terpengaruh*\n\n` +
        `_Gunakan ${m.prefix}publicthisgc untuk membuka akses_`,
    );
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
