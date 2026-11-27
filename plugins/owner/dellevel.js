// owner/dellevel — satu file: metadata + kode fitur (gabungan dari engine3/plugins/owner/dellevel.js)
const __vx = require("../../lib/adapter/e3.js")
const __meta = {
  "name": "dellevel",
  "command": [
    "dellevel",
    "kuranglevel",
    "removelevel",
    "dellvl"
  ],
  "category": "owner",
  "desc": "Kurangi level user (via exp)",
  "usage": ".dellevel <jumlah> @user",
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
module.exports = __vx.plugin("owner/dellevel", __meta, async function () {
  const __dirname = __vdir, __filename = __vdir + '/dellevel.js'
  const __vxExports = {};
  const { getDatabase } = require("../../lib/ext/src/lib/vanxone-database.js");
  const { calculateLevel, getRole } = require("../../lib/ext/plugins/e3/user/level.js");
  
  const EXP_PER_LEVEL = 10000;
  
  const pluginConfig = {
    name: "dellevel",
    alias: ["kuranglevel", "removelevel", "dellvl"],
    category: "owner",
    description: "Kurangi level user (via exp)",
    usage: ".dellevel <jumlah> @user",
    example: ".dellevel 5 @user",
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true,
  };
  
  function extractTarget(m) {
    if (m.quoted) return m.quoted.sender;
    if (m.mentionedJid?.length) return m.mentionedJid[0];
    return null;
  }
  
  async function handler(m, { sock }) {
    const db = getDatabase();
    const args = m.args;
  
    const numArg = args.find((a) => !isNaN(a) && !a.startsWith("@"));
    let levels = parseInt(numArg) || 0;
  
    let targetJid = await extractTarget(m);
  
    if (!targetJid && levels > 0) {
      targetJid = m.sender;
    }
  
    if (!targetJid || levels <= 0) {
      return m.reply(
        `📊 *ᴅᴇʟ ʟᴇᴠᴇʟ*\n\n` +
          `╭┈┈⬡「 📋 *ᴜsᴀɢᴇ* 」\n` +
          `┃ > \`.dellevel <jumlah>\` - ke diri sendiri\n` +
          `┃ > \`.dellevel <jumlah> @user\` - ke orang lain\n` +
          `╰┈┈┈┈┈┈┈┈⬡\n\n` +
          `> Contoh: \`${m.prefix}dellevel 5\``,
      );
    }
  
    const user = db.getUser(targetJid) || db.setUser(targetJid);
  
    const oldLevel = calculateLevel(user.exp || 0);
    const expToRemove = levels * EXP_PER_LEVEL;
    user.exp = Math.max(0, (user.exp || 0) - expToRemove);
    const newLevel = calculateLevel(user.exp);
  
    db.save();
    await m.react("✅");
  
    await m.reply(
      `✅ *ʟᴇᴠᴇʟ ᴅɪᴋᴜʀᴀɴɢɪ*\n\n` +
        `╭┈┈⬡「 📋 *ᴅᴇᴛᴀɪʟ* 」\n` +
        `┃ 👤 User: @${targetJid.split("@")[0]}\n` +
        `┃ ➖ Kurang: *-${levels} Level*\n` +
        `┃ 🚄 Exp Removed: *-${expToRemove.toLocaleString("id-ID")}*\n` +
        `┃ 📊 Level: *${oldLevel} → ${newLevel}*\n` +
        `┃ ${getRole(newLevel)}\n` +
        `╰┈┈┈┈┈┈┈┈⬡`,
      { mentions: [targetJid] },
    );
  }
  
  
  
  Object.defineProperty(__vxExports, "config", { enumerable: true, get: () => pluginConfig });
  Object.defineProperty(__vxExports, "handler", { enumerable: true, get: () => handler });
  return __vxExports
})
