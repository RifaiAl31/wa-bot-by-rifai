// owner/clearspouse — satu file: metadata + kode fitur (gabungan dari engine8/plugins/owner/clearspouse.js)
const __vx = require("../../lib/adapter/e8.js")
const __meta = {
  "name": "clearspouse",
  "command": [
    "clearspouse",
    "clearmarry",
    "resetspouse",
    "resetmarry"
  ],
  "category": "owner",
  "desc": "Clear data spouses user tertentu (owner only)",
  "usage": ".clearspouse @user",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
}
const __vdir = require('path').join(__dirname, "../../lib/ext/plugins/owner").split('\\').join('/')
module.exports = __vx.plugin("owner/clearspouse", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/clearspouse.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.e8.js");
  
  const pluginConfig = {
    name: "clearspouse",
    alias: ["clearmarry", "resetspouse", "resetmarry"],
    category: "owner",
    description: "Clear data spouses user tertentu (owner only)",
    usage: ".clearspouse @user",
    example: ".clearspouse @628xxx",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 0,
    energi: 0,
    isEnabled: true,
  };
  
  async function handler(m, { sock }) {
    const db = getDatabase();
  
    const target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
  
    const user = db.getUser(target);
    if (!user) {
      return m.reply(`❌ User @${target.split("@")[0]} tidak ditemukan di database.`, { mentions: [target] });
    }
  
    if (!user.rpg) user.rpg = {};
  
    const oldSpouses = user.rpg.spouses || (user.rpg.spouse ? [user.rpg.spouse] : []);
    const oldCount = oldSpouses.length;
  
    user.rpg.spouses = [];
    delete user.rpg.spouse;
    user.rpg.marriedAt = null;
  
    let fixedCount = 0;
    for (const spouseJid of oldSpouses) {
      const spouseUser = db.getUser(spouseJid);
      if (!spouseUser?.rpg) continue;
  
      if (!spouseUser.rpg.spouses) {
        spouseUser.rpg.spouses = spouseUser.rpg.spouse ? [spouseUser.rpg.spouse] : [];
        delete spouseUser.rpg.spouse;
      }
  
      spouseUser.rpg.spouses = spouseUser.rpg.spouses.filter(s => s !== target);
      if (spouseUser.rpg.spouses.length === 0) spouseUser.rpg.marriedAt = null;
  
      db.setUser(spouseJid, spouseUser);
      fixedCount++;
    }
  
    db.setUser(target, user);
    db.save();
  
    await m.react("✅");
  
    let txt = `✅ *CLEAR SPOUSE BERHASIL*\n\n`;
    txt += `👤 Target: @${target.split("@")[0]}\n`;
    txt += `🗑️ Spouses dihapus: *${oldCount} orang*\n`;
    txt += `🔄 Data pasangan yang ikut difix: *${fixedCount} orang*`;
  
    await m.reply(txt, { mentions: [target] });
  }
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
