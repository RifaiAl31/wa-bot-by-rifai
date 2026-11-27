// rpg/leveluprpg — satu file: metadata + kode fitur (gabungan dari engine3/plugins/rpg/leveluprpg.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "leveluprpg",
  "command": [
    "leveluprpg",
    "lvluprpg",
    "rpglevelup"
  ],
  "category": "rpg",
  "desc": "Toggle notifikasi level up RPG",
  "usage": ".leveluprpg <on/off>",
  "owner": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/rpg").split('\\').join('/')
module.exports = __vx.plugin("rpg/leveluprpg", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/leveluprpg.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const pluginConfig = {
    name: "leveluprpg",
    alias: ["lvluprpg", "rpglevelup"],
    category: "rpg",
    description: "Toggle notifikasi level up RPG",
    usage: ".leveluprpg <on/off>",
    example: ".leveluprpg on",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
  };
  
  function handler(m, { sock }) {
    const db = getDatabase();
    const user = db.getUser(m.sender);
    const args = m.args || [];
    const sub = args[0]?.toLowerCase();
  
    if (!user.settings) user.settings = {};
  
    if (sub === "on") {
      user.settings.rpgLevelupNotif = true;
      db.save();
      return m.reply(`✅ *ʀᴘɢ ʟᴇᴠᴇʟ ᴜᴘ ɴᴏᴛɪꜰ*\n\n` + `> Status: *ON* ✅\n` + `> Kamu akan menerima notifikasi RPG saat naik level!`);
    }
  
    if (sub === "off") {
      user.settings.rpgLevelupNotif = false;
      db.save();
      return m.reply(`❌ *ʀᴘɢ ʟᴇᴠᴇʟ ᴜᴘ ɴᴏᴛɪꜰ*\n\n` + `> Status: *OFF* ❌\n` + `> Notifikasi RPG level up dinonaktifkan.`);
    }
  
    const status = user.settings.rpgLevelupNotif !== false ? "ON ✅" : "OFF ❌";
    return m.reply(
      `🔔 *ʀᴘɢ ʟᴇᴠᴇʟ ᴜᴘ ɴᴏᴛɪꜰ*\n\n` +
        `> Status saat ini: *${status}*\n\n` +
        `*📋 *ᴜsᴀɢᴇ:*
  \n` +
        `> > \`.leveluprpg on\` - Aktifkan\n` +
        `> > \`.leveluprpg off\` - Nonaktifkan\n` +
        ``,
    );
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
