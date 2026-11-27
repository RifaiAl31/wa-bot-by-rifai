// owner/delvip — satu file: metadata + kode fitur (gabungan dari engine8/plugins/owner/delvip.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "delvip",
  "command": [
    "delvip",
    "removevip",
    "hapusvip"
  ],
  "category": "owner",
  "desc": "Hapus VIP user",
  "usage": ".delvip @user",
  "owner": true,
  "group": false,
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
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/delvip", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/delvip.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e8.js");
  
  function isVipActive(user) {
    if (!user?.isVip) return false;
    if (!user.vipExpired || user.vipExpired === -1) return true;
    return Date.now() < user.vipExpired;
  }
  
  function extractTarget(m) {
    if (m.quoted?.sender) return m.quoted.sender;
    if (m.mentionedJid?.length) return m.mentionedJid[0];
    const numArg = m.args?.find(a => /^[0-9]{8,15}$/.test(a));
    if (numArg) return numArg + "@s.whatsapp.net";
    return null;
  }
  
  const pluginConfig = {
    name: "delvip",
    alias: ["removevip", "hapusvip"],
    category: "owner",
    description: "Hapus VIP user",
    usage: ".delvip @user",
    example: ".delvip @user",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const db = getDatabase();
    const targetJid = extractTarget(m);
  
    if (!targetJid) {
      return m.reply(`❌ Tag/reply user yang mau dihapus VIP-nya.\n> \`${m.prefix}delvip @user\``);
    }
  
    const user = db.getUser(targetJid);
    if (!user || !isVipActive(user)) {
      return m.reply(`❌ @${targetJid.split("@")[0]} bukan VIP aktif.`, { mentions: [targetJid] });
    }
  
    db.setUser(targetJid, {
      ...user,
      isVip: false,
      vipExpired: null,
      energi: 25,
    });
    db.save();
  
    await m.react("✅");
    return m.reply(
      `✅ *VIP DIHAPUS*\n\n` +
      `> 👤 @${targetJid.split("@")[0]} sudah bukan VIP lagi.`,
      { mentions: [targetJid] }
    );
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
